import { buildPlainlyPrompt } from "../lib/plainlyPrompt.ts";
import { callOpenAiCompatibleGemma } from "../lib/gemmaAdapter.ts";
import { type PlainlyModelInput } from "../lib/plainlySchema.ts";

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
  const inputBase = {
    documentType: "General",
    userQuestion: "What is the main point?",
    documentText: "This is a synthetic test document. It contains no sensitive information. It is used only to verify the adapter connectivity.",
  };

  const prompt = buildPlainlyPrompt(inputBase);

  const fullInput: PlainlyModelInput = {
    ...inputBase,
    prompt,
  };

  try {
    console.log("\nCalling callOpenAiCompatibleGemma...");
    const result = await callOpenAiCompatibleGemma(fullInput);
    
    console.log("SUCCESS: Validated PlainlyResult returned.");
    console.log("- plainEnglishSummary present: " + Boolean(result.plainEnglishSummary));
    console.log("- notAdviceNotice present: " + Boolean(result.notAdviceNotice));
  } catch (error) {
    if (error instanceof Error) {
      console.log("\nFAILED: Adapter call threw an error.");
      console.log(`Error: ${error.message}`);
    } else {
      console.log("\nFAILED: An unknown error occurred.");
    }
    process.exit(1);
  }
}

runLiveTest().catch((err) => {
  console.error("Unexpected test failure:", err);
  process.exit(1);
});
