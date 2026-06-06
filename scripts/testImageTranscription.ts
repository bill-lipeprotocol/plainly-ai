import { transcribeDocumentImage } from "../lib/transcribeImage.ts";

const previousGeminiKey = process.env.GEMINI_API_KEY;
const previousGoogleKey = process.env.GOOGLE_API_KEY;
const previousGeminiModel = process.env.GEMINI_MODEL;
const originalFetch = globalThis.fetch;

process.env.GEMINI_API_KEY = "synthetic-test-key";
delete process.env.GOOGLE_API_KEY;
process.env.GEMINI_MODEL = "gemini-2.5-flash-lite";

let requestValidated = false;

globalThis.fetch = async (input, init) => {
  const url = String(input);
  const headers = new Headers(init?.headers);
  const body = JSON.parse(String(init?.body)) as {
    contents?: Array<{
      parts?: Array<{
        text?: string;
        inline_data?: { mime_type?: string; data?: string };
      }>;
    }>;
  };

  requestValidated =
    url.endsWith(
      "/v1beta/models/gemini-2.5-flash-lite:generateContent"
    ) &&
    headers.get("x-goog-api-key") === "synthetic-test-key" &&
    body.contents?.[0]?.parts?.[1]?.inline_data?.mime_type === "image/png" &&
    body.contents?.[0]?.parts?.[1]?.inline_data?.data === "aGVsbG8=";

  return Response.json({
    candidates: [
      {
        content: {
          parts: [{ text: "Synthetic transcribed document text." }],
        },
      },
    ],
  });
};

try {
  const result = await transcribeDocumentImage(
    "data:image/png;base64,aGVsbG8="
  );

  if (!requestValidated || result !== "Synthetic transcribed document text.") {
    throw new Error("Native Gemini transcription request was not valid.");
  }

  console.log("PASS | native Gemini image transcription request");
} finally {
  globalThis.fetch = originalFetch;
  restoreEnv("GEMINI_API_KEY", previousGeminiKey);
  restoreEnv("GOOGLE_API_KEY", previousGoogleKey);
  restoreEnv("GEMINI_MODEL", previousGeminiModel);
}

function restoreEnv(name: string, value: string | undefined) {
  if (typeof value === "undefined") {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}
