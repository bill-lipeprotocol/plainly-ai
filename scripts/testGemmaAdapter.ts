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

try {
  const result = parseGemmaJsonResponse(JSON.stringify(mockResult));
  record("valid JSON parses successfully", Boolean(result.plainEnglishSummary));
} catch {
  record("valid JSON parses successfully", false);
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
  const result = await callGemmaHostedMock({
    documentType: "Notice",
    userQuestion: "",
    documentText:
      "Synthetic adapter test document text that is long enough to represent a pasted document but is not printed by this test script.",
    prompt:
      "Synthetic adapter test prompt that is passed to the mocked adapter but is not printed by this test script.",
  });

  record("hosted mock returns a valid Plainly result", Boolean(result.notAdviceNotice));
} catch {
  record("hosted mock returns a valid Plainly result", false);
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
