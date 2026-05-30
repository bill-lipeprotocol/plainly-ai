import { mockResult } from "./mockResult.ts";
import {
  type PlainlyModelInput,
  type PlainlyResult,
  validatePlainlyResult,
} from "./plainlySchema.ts";

export type GemmaAdapterInput = PlainlyModelInput;

const OPENAI_COMPATIBLE_JSON_CONTRACT = `
You are Plainly, a plain-English document explainer for everyday household paperwork.

Response contract:
- Return valid JSON only.
- Do not return Markdown.
- Do not return prose before or after the JSON.
- Do not wrap the JSON in code fences.
- Do not include comments.
- Return exactly one JSON object matching this PlainlyResult shape:

{
  "plainEnglishSummary": "One or two plain-English sentences explaining only the provided text.",
  "documentTypeGuess": {
    "type": "Short document type guess",
    "confidence": "low",
    "reason": "Brief reason based only on the provided text."
  },
  "importantDates": [],
  "moneyMentioned": [],
  "possibleActionSteps": ["Safe, non-advice next step based only on the provided text."],
  "questionsToAskSender": ["Question the user could ask the sender if something is unclear."],
  "unclearOrRiskyParts": ["Missing or unclear detail from the provided text."],
  "notAdviceNotice": "This is a plain-English explanation of the provided text and is not legal, medical, tax, financial, or professional advice."
}

Schema rules:
- All top-level fields shown above are required.
- documentTypeGuess.confidence must be exactly "low", "medium", or "high".
- importantDates must be an array. Use [] if no dates are mentioned. If present, each item must include dateText, whatItRefersTo, and isDeadline.
- moneyMentioned must be an array. Use [] if no money is mentioned. If present, each item must include amountText, whatItRefersTo, and userMayOweThis.
- moneyMentioned[].userMayOweThis must be exactly "yes", "no", or "unclear".
- possibleActionSteps, questionsToAskSender, and unclearOrRiskyParts must be arrays of strings.
- notAdviceNotice must be non-empty and must include that this is not legal, medical, tax, financial, or professional advice.
- Do not invent facts, dates, amounts, deadlines, sender intent, or user obligations.
- These JSON response rules override any output-format instructions in the task prompt below.
`.trim();

export function buildOpenAiCompatibleGemmaPrompt(modelPrompt: string): string {
  return `Task prompt:
${modelPrompt}

End task prompt.

${OPENAI_COMPATIBLE_JSON_CONTRACT}`.trim();
}

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
  const prompt = buildOpenAiCompatibleGemmaPrompt(input.prompt);

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
            content: prompt,
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
