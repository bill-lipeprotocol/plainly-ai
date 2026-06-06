import {
  extractPublicGoogleDoc,
  extractUploadedFile,
} from "../lib/documentExtraction.ts";
import { loadPdfJs } from "../lib/loadPdfJs.ts";

let failed = 0;

await check("plain text extraction", async () => {
  const text =
    "Synthetic sample document. This notice says a household service charge changes on June 1, 2026. The increase is $15 per month, and the current balance is not due today.";
  const result = await extractUploadedFile(
    new File([text], "sample.txt", { type: "text/plain" })
  );

  if (result.text !== text || result.method !== "text" || result.truncated) {
    throw new Error("Plain text extraction returned an unexpected result.");
  }
});

await check("unsupported file rejection", async () => {
  await expectFailure(
    () =>
      extractUploadedFile(
        new File(["synthetic"], "sample.exe", {
          type: "application/octet-stream",
        })
      ),
    "Unsupported file type"
  );
});

await check("invalid Google Docs URL rejection", async () => {
  await expectFailure(
    () => extractPublicGoogleDoc("https://example.com/document"),
    "Google Docs"
  );
});

await check("PDF.js loads after canvas globals", async () => {
  const pdfjs = await loadPdfJs();

  if (
    !globalThis.DOMMatrix ||
    !globalThis.ImageData ||
    !globalThis.Path2D ||
    typeof pdfjs.getDocument !== "function"
  ) {
    throw new Error("PDF.js loaded without required canvas globals.");
  }
});

if (failed > 0) {
  process.exitCode = 1;
}

async function check(name: string, run: () => Promise<void>) {
  try {
    await run();
    console.log(`PASS | ${name}`);
  } catch (error) {
    failed += 1;
    console.error(
      `FAIL | ${name} | ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
  }
}

async function expectFailure(
  run: () => Promise<unknown>,
  expectedMessage: string
) {
  try {
    await run();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes(expectedMessage.toLowerCase())
    ) {
      return;
    }

    throw error;
  }

  throw new Error("Expected extraction to fail.");
}
