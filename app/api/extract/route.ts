import { NextResponse } from "next/server";

import {
  extractPublicGoogleDoc,
  extractUploadedFile,
} from "@/lib/documentExtraction";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Send a supported file or Google Docs link." },
        { status: 400 }
      );
    }

    const file = formData.get("file");
    const googleDocUrl = formData.get("googleDocUrl");
    const result =
      file instanceof File
        ? await extractUploadedFile(file)
        : typeof googleDocUrl === "string" && googleDocUrl.trim()
          ? await extractPublicGoogleDoc(googleDocUrl.trim())
          : null;

    if (!result) {
      return NextResponse.json(
        { error: "Choose a supported file or enter a Google Docs link." },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Document extraction failed", {
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error: isExpectedExtractionError(error)
          ? error.message
          : "Document extraction failed. Please try a smaller file or paste the text directly.",
      },
      { status: isExpectedExtractionError(error) ? 400 : 500 }
    );
  }
}

function isExpectedExtractionError(error: unknown): error is Error {
  if (!(error instanceof Error)) {
    return false;
  }

  return [
    "Choose a non-empty document.",
    "The file is too large.",
    "Unsupported file type.",
    "This does not appear to be a supported plain-text file.",
    "Plainly could not find enough readable text.",
    "Enter a valid Google Docs sharing link.",
    "Enter a Google Docs document sharing link.",
    "Plainly could not open that Google Doc.",
    "That Google Doc is too large to import.",
    "The Google Doc import timed out.",
    "Image transcription timed out.",
    "No readable text was returned for this image.",
    "Gemini did not return readable text for this image.",
    "This scanned PDF could not be processed in this deployment.",
  ].some((message) => error.message.startsWith(message));
}
