type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs");

let pdfjsPromise: Promise<PdfJsModule> | null = null;

export async function loadPdfJs(): Promise<PdfJsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      try {
        const canvas = await import("@napi-rs/canvas");
        const globals = globalThis as unknown as Record<string, unknown>;

        if (canvas.DOMMatrix && !globals.DOMMatrix) {
          globals.DOMMatrix = canvas.DOMMatrix;
        }

        if (canvas.ImageData && !globals.ImageData) {
          globals.ImageData = canvas.ImageData;
        }

        if (canvas.Path2D && !globals.Path2D) {
          globals.Path2D = canvas.Path2D;
        }
      } catch (error) {
        console.error("Canvas polyfill load failed", {
          message: error instanceof Error ? error.message : String(error),
        });
      }

      return import("pdfjs-dist/legacy/build/pdf.mjs");
    })();
  }

  return pdfjsPromise;
}
