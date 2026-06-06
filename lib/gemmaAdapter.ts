import { mockResult } from "./mockResult.ts";
import {
  type PlainlyModelInput,
  type PlainlyResult,
  validatePlainlyResult,
} from "./plainlySchema.ts";

export type GemmaAdapterInput = PlainlyModelInput;

const TRANSIENT_PROVIDER_STATUSES = new Set([429, 500, 502, 503, 504]);
const OPENAI_COMPATIBLE_RETRY_DELAY_MS = 750;

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

const GEMINI_PLAINLY_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    plainEnglishSummary: { type: "STRING" },
    documentTypeGuess: {
      type: "OBJECT",
      properties: {
        type: { type: "STRING" },
        confidence: {
          type: "STRING",
          enum: ["low", "medium", "high"],
        },
        reason: { type: "STRING" },
      },
      required: ["type", "confidence", "reason"],
    },
    importantDates: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          dateText: { type: "STRING" },
          whatItRefersTo: { type: "STRING" },
          isDeadline: { type: "BOOLEAN" },
        },
        required: ["dateText", "whatItRefersTo", "isDeadline"],
      },
    },
    moneyMentioned: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          amountText: { type: "STRING" },
          whatItRefersTo: { type: "STRING" },
          userMayOweThis: {
            type: "STRING",
            enum: ["yes", "no", "unclear"],
          },
        },
        required: ["amountText", "whatItRefersTo", "userMayOweThis"],
      },
    },
    possibleActionSteps: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    questionsToAskSender: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    unclearOrRiskyParts: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    notAdviceNotice: { type: "STRING" },
  },
  required: [
    "plainEnglishSummary",
    "documentTypeGuess",
    "importantDates",
    "moneyMentioned",
    "possibleActionSteps",
    "questionsToAskSender",
    "unclearOrRiskyParts",
    "notAdviceNotice",
  ],
};

export function buildOpenAiCompatibleGemmaPrompt(modelPrompt: string): string {
  return `Task prompt:
${modelPrompt}

End task prompt.

${OPENAI_COMPATIBLE_JSON_CONTRACT}`.trim();
}

export async function callNativeGemini(
  input: GemmaAdapterInput
): Promise<PlainlyResult> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY;
  const modelName =
    process.env.GEMINI_MODEL ||
    process.env.GOOGLE_GENERATIVE_AI_MODEL ||
    "gemini-2.5-flash-lite";

  if (!apiKey) {
    throw new Error("A Gemini API key is required for live explanations.");
  }

  const controller = new AbortController();
  const timeoutMs = 30000;
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
                {
                  text: buildOpenAiCompatibleGemmaPrompt(input.prompt),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: GEMINI_PLAINLY_RESPONSE_SCHEMA,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini returned status ${response.status}.`);
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
      throw new Error("Gemini did not return an explanation.");
    }

    return parseGemmaJsonResponse(content);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Gemini explanation request timed out.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
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
    const response = await fetchOpenAiCompatibleGemmaResponse({
      apiUrl,
      apiKey,
      modelName,
      prompt,
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

async function fetchOpenAiCompatibleGemmaResponse({
  apiUrl,
  apiKey,
  modelName,
  prompt,
  signal,
}: {
  apiUrl: string;
  apiKey: string | undefined;
  modelName: string;
  prompt: string;
  signal: AbortSignal;
}): Promise<Response> {
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
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
      signal,
    });

    const shouldRetry =
      attempt < maxAttempts && TRANSIENT_PROVIDER_STATUSES.has(response.status);

    if (!shouldRetry) {
      return response;
    }

    await delay(OPENAI_COMPATIBLE_RETRY_DELAY_MS);
  }

  throw new Error("Provider request failed before a response was available.");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function callGemmaHostedMock(
  input: GemmaAdapterInput
): Promise<PlainlyResult> {
  void input;

  // Milestone 4B is still non-networked. Real hosted Gemma calls belong in a
  // later milestone and must not log document text, prompts, responses, or keys.
  return parseGemmaJsonResponse(JSON.stringify(mockResult));
}
