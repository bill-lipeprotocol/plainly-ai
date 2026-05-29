import { plainlySamples } from "../tests/plainlySamples.ts";

type ExplainResponse = {
  result?: unknown;
  showHighRiskAlert?: boolean;
  error?: string;
};

const API_URL = "http://localhost:3000/api/explain";

let passed = 0;
let failed = 0;

console.log(`Testing Plainly API at ${API_URL}`);
console.log("Full document text and prompts are not printed by this script.");
console.log("");

for (const sample of plainlySamples) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documentType: sample.documentType,
      userQuestion: "",
      documentText: sample.documentText,
    }),
  });

  let data: ExplainResponse = {};

  try {
    data = (await response.json()) as ExplainResponse;
  } catch {
    data = {};
  }

  const resultExists = Boolean(data.result);
  const highRiskMatches =
    data.showHighRiskAlert === sample.expectedHighRiskAlert;
  const samplePassed =
    response.status === 200 && resultExists && highRiskMatches;

  if (samplePassed) {
    passed += 1;
  } else {
    failed += 1;
  }

  console.log(
    [
      samplePassed ? "PASS" : "FAIL",
      sample.id,
      sample.title,
      `status=${response.status}`,
      `result=${resultExists ? "yes" : "no"}`,
      `highRisk=${String(data.showHighRiskAlert)}`,
      `expectedHighRisk=${String(sample.expectedHighRiskAlert)}`,
    ].join(" | ")
  );
}

console.log("");
console.log(`Total samples: ${plainlySamples.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exitCode = 1;
}
