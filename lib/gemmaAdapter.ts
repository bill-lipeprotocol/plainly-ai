import { mockResult } from "./mockResult.ts";
import {
  type PlainlyModelInput,
  type PlainlyResult,
  validatePlainlyResult,
} from "./plainlySchema.ts";

export type GemmaAdapterInput = PlainlyModelInput;

export function parseGemmaJsonResponse(rawText: string): PlainlyResult {
  let cleanedText = rawText.trim();

  // Remove Markdown JSON fences if present
  if (cleanedText.startsWith("```json") && cleanedText.endsWith("```")) {
    cleanedText = cleanedText.slice(7, -3).trim();
  } else if (cleanedText.startsWith("```") && cleanedText.endsWith("```")) {
    cleanedText = cleanedText.slice(3, -3).trim();
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleanedText);
  } catch {
    throw new Error("Gemma response was not valid JSON.");
  }

  const validation = validatePlainlyResult(parsed);

  if (!validation.success) {
    throw new Error("Gemma response did not match the Plainly result schema.");
  }

  return validation.data;
}

export async function callOpenAiCompatibleGemma(
  input: GemmaAdapterInput
): Promise<PlainlyResult> {
  const apiUrl = process.env.GEMMA_API_URL;
  const apiKey = process.env.GEMMA_API_KEY;
  const modelName = process.env.GEMMA_MODEL_NAME;
  const timeoutMsStr = process.env.GEMMA_TIMEOUT_MS;

  if (!apiUrl) {
    throw new Error("GEMMA_API_URL is required for live adapter calls.");
  }
  if (!modelName) {
    throw new Error("GEMMA_MODEL_NAME is required for live adapter calls.");
  }

  const timeoutMs = timeoutMsStr ? (parseInt(timeoutMsStr, 10) || 30000) : 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: "user",
            content: input.prompt,
          },
        ],
        temperature: 0.1,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Provider returned status ${response.status}.`);
    }

    const data = await response.json();
    
    // OpenAI shape: choices[0].message.content
    const content = data?.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
      throw new Error("Provider response did not contain a valid message content string.");
    }

    return parseGemmaJsonResponse(content);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Provider request timed out after ${timeoutMs}ms.`);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred during the provider call.");
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function callGemmaHostedMock(
  input: GemmaAdapterInput
): Promise<PlainlyResult> {
  void input;

  // Milestone 4B is still non-networked. Real hosted Gemma calls belong in a
  // later milestone and must not log document text, prompts, responses, or keys.
  return parseGemmaJsonResponse(JSON.stringify(mockResult));
}
