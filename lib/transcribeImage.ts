const TRANSCRIPTION_PROMPT = `
Transcribe all readable text in this document image.

Rules:
- Return only the transcription as plain text.
- Preserve headings, paragraph breaks, dates, currency amounts, and list items.
- Do not summarize, explain, correct, or infer missing text.
- Use [unclear] for text that cannot be read confidently.
`.trim();

export async function transcribeDocumentImage(
  imageDataUrl: string
): Promise<string> {
  const geminiApiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY;
  const geminiModel =
    process.env.GEMINI_MODEL ||
    process.env.GOOGLE_GENERATIVE_AI_MODEL ||
    "gemini-2.5-flash-lite";
  const apiUrl = process.env.GEMMA_API_URL;
  const apiKey = process.env.GEMMA_API_KEY;
  const modelName = process.env.GEMMA_MODEL_NAME;

  if (geminiApiKey) {
    return transcribeWithNativeGemini({
      imageDataUrl,
      apiKey: geminiApiKey,
      modelName: geminiModel,
    });
  }

  if (apiUrl && modelName) {
    return transcribeWithOpenAiCompatibleProvider({
      imageDataUrl,
      apiUrl,
      apiKey,
      modelName,
    });
  }

  throw new Error(
    "Image transcription needs GEMINI_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, or the GEMMA_API_URL and GEMMA_MODEL_NAME compatibility settings."
  );
}

async function transcribeWithNativeGemini({
  imageDataUrl,
  apiKey,
  modelName,
}: {
  imageDataUrl: string;
  apiKey: string;
  modelName: string;
}): Promise<string> {
  const image = parseImageDataUrl(imageDataUrl);
  const controller = new AbortController();
  const timeoutMs = 45000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        modelName
      )}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: TRANSCRIPTION_PROMPT },
                {
                  inline_data: {
                    mime_type: image.mimeType,
                    data: image.base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Gemini image transcription returned status ${response.status}.`
      );
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: unknown }>;
        };
      }>;
    };
    const content = data.candidates?.[0]?.content?.parts
      ?.map((part) => (typeof part.text === "string" ? part.text : ""))
      .join("")
      .trim();

    if (!content) {
      throw new Error("Gemini did not return readable text for this image.");
    }

    return content;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Image transcription timed out. Try a smaller image.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function transcribeWithOpenAiCompatibleProvider({
  imageDataUrl,
  apiUrl,
  apiKey,
  modelName,
}: {
  imageDataUrl: string;
  apiUrl: string;
  apiKey: string | undefined;
  modelName: string;
}): Promise<string> {
  const controller = new AbortController();
  const timeoutMs = 45000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: TRANSCRIPTION_PROMPT,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageDataUrl,
                },
              },
            ],
          },
        ],
        temperature: 0,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("The image transcription provider rejected the image.");
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const content = data.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      throw new Error("No readable text was returned for this image.");
    }

    return content.trim();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Image transcription timed out. Try a smaller image.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseImageDataUrl(imageDataUrl: string): {
  mimeType: string;
  base64Data: string;
} {
  const match = imageDataUrl.match(
    /^data:(image\/(?:jpeg|png|webp));base64,([a-zA-Z0-9+/=\r\n]+)$/
  );

  if (!match) {
    throw new Error("Plainly received an unsupported image format.");
  }

  return {
    mimeType: match[1],
    base64Data: match[2].replace(/\s/g, ""),
  };
}
