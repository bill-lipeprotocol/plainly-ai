import { callPlainlyModel } from "../lib/callGemma.ts";
import { callGemmaHostedMock, parseGemmaJsonResponse } from "../lib/gemmaAdapter.ts";
import { mockResult } from "../lib/mockResult.ts";

type AdapterCheck = {
  name: string;
  passed: boolean;
};

const checks: AdapterCheck[] = [];

function record(name: string, passed: boolean) {
  checks.push({ name, passed });
  console.log(`${passed ? "PASS" : "FAIL"} | ${name}`);
}

console.log("Testing Gemma adapter parsing.");
console.log("Full document text, prompts, and raw model responses are not printed.");
console.log("");

const modelInput = {
  documentType: "Notice",
  userQuestion: "",
  documentText:
    "Synthetic adapter test document text that is long enough to represent a pasted document but is not printed by this test script.",
  prompt:
    "Synthetic adapter test prompt that is passed through mocked provider routing but is not printed by this test script.",
};

// --- Parser Hardening Tests ---

try {
  const result = parseGemmaJsonResponse(JSON.stringify(mockResult));
  record("raw JSON parses successfully", Boolean(result.plainEnglishSummary));
} catch {
  record("raw JSON parses successfully", false);
}

try {
  const fencedJson = "```json\n" + JSON.stringify(mockResult) + "\n```";
  const result = parseGemmaJsonResponse(fencedJson);
  record("fenced ```json parses successfully", Boolean(result.plainEnglishSummary));
} catch {
  record("fenced ```json parses successfully", false);
}

try {
  const fencedPlain = "```\n" + JSON.stringify(mockResult) + "\n```";
  const result = parseGemmaJsonResponse(fencedPlain);
  record("fenced plain ``` parses successfully", Boolean(result.plainEnglishSummary));
} catch {
  record("fenced plain ``` parses successfully", false);
}

try {
  const whitespaceJson = "  \n" + JSON.stringify(mockResult) + "  \t ";
  const result = parseGemmaJsonResponse(whitespaceJson);
  record("whitespace around JSON parses successfully", Boolean(result.plainEnglishSummary));
} catch {
  record("whitespace around JSON parses successfully", false);
}

try {
  parseGemmaJsonResponse("{not valid json");
  record("invalid JSON fails safely", false);
} catch (error) {
  record(
    "invalid JSON fails safely",
    error instanceof Error && error.message === "Gemma response was not valid JSON."
  );
}

try {
  parseGemmaJsonResponse(
    JSON.stringify({
      plainEnglishSummary: "Missing required result fields.",
    })
  );
  record("schema-invalid JSON fails safely", false);
} catch (error) {
  record(
    "schema-invalid JSON fails safely",
    error instanceof Error &&
      error.message === "Gemma response did not match the Plainly result schema."
  );
}

try {
  const proseAroundJson = "Here is the result: \n```json\n" + JSON.stringify(mockResult) + "\n```\nHope this helps!";
  parseGemmaJsonResponse(proseAroundJson);
  record("prose around JSON still fails safely", false);
} catch (error) {
  record(
    "prose around JSON still fails safely",
    error instanceof Error && error.message === "Gemma response was not valid JSON."
  );
}

// --- Integration Mock Tests ---

try {
  const result = await callGemmaHostedMock(modelInput);
  record("hosted mock returns a valid Plainly result", Boolean(result.notAdviceNotice));
} catch {
  record("hosted mock returns a valid Plainly result", false);
}

try {
  const result = await withModelProvider("mock", () => callPlainlyModel(modelInput));
  record("mock provider returns result", Boolean(result.plainEnglishSummary));
} catch {
  record("mock provider returns result", false);
}

try {
  const result = await withModelProvider("gemma-hosted", () =>
    callPlainlyModel(modelInput)
  );
  record("gemma-hosted provider returns mocked adapter result", Boolean(result));
} catch {
  record("gemma-hosted provider returns mocked adapter result", false);
}

try {
  await withModelProvider("gemma-local", () => callPlainlyModel(modelInput));
  record("gemma-local provider fails safely", false);
} catch (error) {
  record(
    "gemma-local provider fails safely",
    error instanceof Error &&
      error.message === "Gemma local provider is not implemented yet."
  );
}

try {
  await withModelProvider("unknown-provider", () => callPlainlyModel(modelInput));
  record("unknown provider fails safely", false);
} catch (error) {
  record(
    "unknown provider fails safely",
    error instanceof Error &&
      error.message === "Unsupported Plainly model provider: unknown-provider"
  );
}

const passed = checks.filter((check) => check.passed).length;
const failed = checks.length - passed;

console.log("");
console.log(`Total checks: ${checks.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exitCode = 1;
}

async function withModelProvider<T>(
  provider: string,
  callback: () => Promise<T>
): Promise<T> {
  const previousProvider = process.env.PLAINLY_MODEL_PROVIDER;
  process.env.PLAINLY_MODEL_PROVIDER = provider;

  try {
    return await callback();
  } finally {
    if (typeof previousProvider === "undefined") {
      delete process.env.PLAINLY_MODEL_PROVIDER;
    } else {
      process.env.PLAINLY_MODEL_PROVIDER = previousProvider;
    }
  }
}
