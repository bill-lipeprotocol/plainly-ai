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
  const apiUrl = process.env.GEMMA_API_URL;
  const apiKey = process.env.GEMMA_API_KEY;
  const modelName = process.env.GEMMA_MODEL_NAME;

  if (!apiUrl || !modelName) {
    throw new Error(
      "Image transcription is not configured for this deployment."
    );
  }

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
