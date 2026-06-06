import mammoth from "mammoth";

import { loadPdfJs } from "./loadPdfJs.ts";
import { transcribeDocumentImage } from "./transcribeImage.ts";

const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_GOOGLE_DOC_BYTES = 2 * 1024 * 1024;
const MAX_EXTRACTED_CHARACTERS = 12000;
const MIN_USEFUL_TEXT_LENGTH = 100;
const MAX_SCANNED_PDF_PAGES = 5;

const TEXT_EXTENSIONS = new Set(["txt", "md", "csv"]);
const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type ExtractionResult = {
  text: string;
  sourceName: string;
  method: "text" | "docx" | "pdf" | "image-ocr" | "google-doc";
  truncated: boolean;
};

export async function extractUploadedFile(file: File): Promise<ExtractionResult> {
  if (!file.name || file.size === 0) {
    throw new Error("Choose a non-empty document.");
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new Error("The file is too large. Upload a file smaller than 4 MB.");
  }

  const extension = getExtension(file.name);
  const bytes = new Uint8Array(await file.arrayBuffer());
  let text = "";
  let method: ExtractionResult["method"];

  if (TEXT_EXTENSIONS.has(extension)) {
    text = decodePlainText(bytes);
    method = "text";
  } else if (
    extension === "docx" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: Buffer.from(bytes),
    });
    text = result.value;
    method = "docx";
  } else if (extension === "pdf" || file.type === "application/pdf") {
    const result = await extractPdf(bytes);
    text = result.text;
    method = result.usedOcr ? "image-ocr" : "pdf";
  } else if (IMAGE_MIME_TYPES.has(file.type)) {
    const dataUrl = `data:${file.type};base64,${Buffer.from(bytes).toString(
      "base64"
    )}`;
    text = await transcribeDocumentImage(dataUrl);
    method = "image-ocr";
  } else {
    throw new Error(
      "Unsupported file type. Use TXT, MD, CSV, DOCX, PDF, PNG, JPG, or WEBP."
    );
  }

  return finalizeExtraction(text, file.name, method);
}

export async function extractPublicGoogleDoc(
  sharedUrl: string
): Promise<ExtractionResult> {
  const documentId = getGoogleDocumentId(sharedUrl);
  const exportUrl = `https://docs.google.com/document/d/${documentId}/export?format=txt`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(exportUrl, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Plainly document importer",
      },
    });

    if (!response.ok) {
      throw new Error(
        "Plainly could not open that Google Doc. Set sharing to anyone with the link, then try again."
      );
    }

    const contentLength = Number(response.headers.get("content-length") || 0);

    if (contentLength > MAX_GOOGLE_DOC_BYTES) {
      throw new Error("That Google Doc is too large to import.");
    }

    const bytes = new Uint8Array(await response.arrayBuffer());

    if (bytes.byteLength > MAX_GOOGLE_DOC_BYTES) {
      throw new Error("That Google Doc is too large to import.");
    }

    return finalizeExtraction(
      decodePlainText(bytes),
      "Google Doc",
      "google-doc"
    );
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The Google Doc import timed out. Try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function extractPdf(
  bytes: Uint8Array
): Promise<{ text: string; usedOcr: boolean }> {
  const pdfjs = await loadPdfJs();
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    useSystemFonts: true,
  });
  const document = await loadingTask.promise;

  try {
    const pageText: string[] = [];

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      pageText.push(text);
      page.cleanup();
    }

    const text = normalizeText(pageText.join("\n\n"));

    if (text.length >= MIN_USEFUL_TEXT_LENGTH) {
      return { text, usedOcr: false };
    }

    return await transcribeScannedPdf(document);
  } catch (error) {
    if (isPdfRenderingEnvironmentError(error)) {
      throw new Error(
        "This scanned PDF could not be processed in this deployment. Please upload page images or paste the text directly."
      );
    }

    throw error;
  } finally {
    await document.destroy();
    await loadingTask.destroy();
  }
}

async function transcribeScannedPdf(
  document: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof loadPdfJs>>["getDocument"]
    >["promise"]
  >
): Promise<{ text: string; usedOcr: true }> {
  const { createCanvas } = await import("@napi-rs/canvas");
  const transcriptions: string[] = [];
  const pageCount = Math.min(document.numPages, MAX_SCANNED_PDF_PAGES);

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = 1400 / baseViewport.width;
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(
      Math.ceil(viewport.width),
      Math.ceil(viewport.height)
    );
    const context = canvas.getContext("2d");

    await page.render({
      canvas: canvas as never,
      canvasContext: context as never,
      viewport,
    }).promise;

    const dataUrl = canvas.toDataURL("image/png");
    const pageText = await transcribeDocumentImage(dataUrl);
    transcriptions.push(`Page ${pageNumber}\n${pageText}`);
    page.cleanup();
  }

  return {
    text: transcriptions.join("\n\n"),
    usedOcr: true,
  };
}

function isPdfRenderingEnvironmentError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return [
    "DOMMatrix",
    "ImageData",
    "Path2D",
    "@napi-rs/canvas",
    "Cannot find module",
    "Canvas",
  ].some((term) => error.message.includes(term));
}

function finalizeExtraction(
  rawText: string,
  sourceName: string,
  method: ExtractionResult["method"]
): ExtractionResult {
  const text = normalizeText(rawText);

  if (text.length < MIN_USEFUL_TEXT_LENGTH) {
    throw new Error(
      "Plainly could not find enough readable text. Try a clearer image or paste the important section."
    );
  }

  const truncated = text.length > MAX_EXTRACTED_CHARACTERS;

  return {
    text: truncated ? text.slice(0, MAX_EXTRACTED_CHARACTERS) : text,
    sourceName,
    method,
    truncated,
  };
}

function getGoogleDocumentId(sharedUrl: string): string {
  let url: URL;

  try {
    url = new URL(sharedUrl);
  } catch {
    throw new Error("Enter a valid Google Docs sharing link.");
  }

  if (
    url.protocol !== "https:" ||
    url.hostname !== "docs.google.com" ||
    !url.pathname.startsWith("/document/d/")
  ) {
    throw new Error("Enter a Google Docs document sharing link.");
  }

  const match = url.pathname.match(/^\/document\/d\/([a-zA-Z0-9_-]+)/);

  if (!match) {
    throw new Error("Enter a valid Google Docs document sharing link.");
  }

  return match[1];
}

function getExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

function decodePlainText(bytes: Uint8Array): string {
  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

  if (text.includes("\u0000")) {
    throw new Error("This does not appear to be a supported plain-text file.");
  }

  return text;
}

function normalizeText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}
