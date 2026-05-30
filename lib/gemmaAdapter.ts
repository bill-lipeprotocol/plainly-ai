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

export async function callGemmaHostedMock(
  input: GemmaAdapterInput
): Promise<PlainlyResult> {
  void input;

  // Milestone 4B is still non-networked. Real hosted Gemma calls belong in a
  // later milestone and must not log document text, prompts, responses, or keys.
  return parseGemmaJsonResponse(JSON.stringify(mockResult));
}
