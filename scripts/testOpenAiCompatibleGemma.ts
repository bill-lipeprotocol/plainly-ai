import { callOpenAiCompatibleGemma } from "../lib/gemmaAdapter.ts";
import {
  type PlainlyExplainRequest,
  type PlainlyModelInput,
} from "../lib/plainlySchema.ts";

type LiveFailureCategory =
  | "invalid-json"
  | "schema-invalid-json"
  | "missing-env"
  | "timeout"
  | "provider-response-shape"
  | "provider-status"
  | "unknown";

async function runLiveTest() {
  console.log("Starting isolated OpenAI-compatible Gemma adapter test...");
  console.log("");

  const apiUrl = process.env.GEMMA_API_URL;
  const modelName = process.env.GEMMA_MODEL_NAME;
  const apiKey = process.env.GEMMA_API_KEY;
  const timeout = process.env.GEMMA_TIMEOUT_MS;

  console.log(`- GEMMA_API_URL configured: ${!!apiUrl}`);
  console.log(`- GEMMA_MODEL_NAME configured: ${!!modelName}`);
  console.log(`- GEMMA_API_KEY configured: ${!!apiKey}`);
  console.log(`- GEMMA_TIMEOUT_MS configured: ${!!timeout}`);

  if (!apiUrl || !modelName) {
    console.log("\nERROR: Missing required environment variables. Test cannot proceed.");
    process.exit(1);
  }

  // Synthetic, non-sensitive input
  const inputBase: PlainlyExplainRequest = {
    documentType: "General",
    userQuestion: "What is the main point?",
    documentText: "This is a synthetic test document. It contains no sensitive information. It is used only to verify the adapter connectivity.",
  };

  const prompt = buildLiveJsonOnlyPlainlyPrompt(inputBase);

  const fullInput: PlainlyModelInput = {
    ...inputBase,
    prompt,
  };

  try {
    console.log("\nCalling callOpenAiCompatibleGemma...");
    const result = await callOpenAiCompatibleGemma(fullInput);
    
    console.log("SUCCESS: Live adapter returned a validated PlainlyResult.");
    console.log("- plainEnglishSummary present: " + Boolean(result.plainEnglishSummary));
    console.log("- notAdviceNotice present: " + Boolean(result.notAdviceNotice));
  } catch (error) {
    if (error instanceof Error) {
      const category = classifyLiveFailure(error.message);
      console.log("\nFAILED: Live adapter did not return a validated PlainlyResult.");
      console.log(`- failure category: ${category}`);
      console.log(`- safe error summary: ${safeErrorSummary(category)}`);
    } else {
      console.log("\nFAILED: An unknown error occurred.");
      console.log("- failure category: unknown");
    }
    process.exit(1);
  }
}

runLiveTest().catch((err) => {
  console.error(
    "Unexpected test failure category:",
    err instanceof Error ? classifyLiveFailure(err.message) : "unknown"
  );
  process.exit(1);
});

function buildLiveJsonOnlyPlainlyPrompt(input: PlainlyExplainRequest): string {
  return `
You are Plainly, a plain-English document explainer for everyday household paperwork.

Return valid JSON only.
Do not return Markdown.
Do not return prose before or after the JSON.
Do not wrap the JSON in code fences.
Do not include comments.
Return exactly one JSON object matching this PlainlyResult shape:

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

Document type selected:
${input.documentType}

User question:
${input.userQuestion || "No specific question provided."}

Document text:
${input.documentText}
`.trim();
}

function classifyLiveFailure(message: string): LiveFailureCategory {
  if (message.includes("GEMMA_API_URL") || message.includes("GEMMA_MODEL_NAME")) {
    return "missing-env";
  }
  if (message.includes("timed out")) {
    return "timeout";
  }
  if (message === "Gemma response was not valid JSON.") {
    return "invalid-json";
  }
  if (message === "Gemma response did not match the Plainly result schema.") {
    return "schema-invalid-json";
  }
  if (message.includes("valid message content string")) {
    return "provider-response-shape";
  }
  if (message.includes("Provider returned status")) {
    return "provider-status";
  }
  return "unknown";
}

function safeErrorSummary(category: LiveFailureCategory): string {
  switch (category) {
    case "missing-env":
      return "Required live adapter environment variables are not configured.";
    case "timeout":
      return "The provider request timed out before a validated result was returned.";
    case "invalid-json":
      return "The provider message content was not parseable as strict JSON.";
    case "schema-invalid-json":
      return "The provider returned JSON, but it did not match PlainlyResult.";
    case "provider-response-shape":
      return "The provider response did not match the expected OpenAI-compatible message shape.";
    case "provider-status":
      return "The provider returned a non-success HTTP status.";
    case "unknown":
      return "The adapter failed for an unclassified reason.";
  }
}
