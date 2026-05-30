type LiveFailureCategory =
  | "server-unreachable"
  | "http-status"
  | "invalid-json-response"
  | "missing-result"
  | "missing-summary"
  | "missing-not-advice-notice"
  | "high-risk-mismatch"
  | "unknown";

type LiveApiCase = {
  id: string;
  title: string;
  expectedHighRiskAlert: boolean;
  request: {
    documentType: string;
    userQuestion: string;
    documentText: string;
  };
};

type ExplainResponse = {
  result?: {
    plainEnglishSummary?: unknown;
    notAdviceNotice?: unknown;
  };
  showHighRiskAlert?: unknown;
};

type CaseResult = {
  passed: boolean;
  category?: LiveFailureCategory;
  status?: number;
};

const DEFAULT_API_URL = "http://localhost:3000/api/explain";
const API_URL = process.env.PLAINLY_API_URL || DEFAULT_API_URL;

const testCases: LiveApiCase[] = [
  {
    id: "live-low-risk",
    title: "Synthetic Renewal Notice",
    expectedHighRiskAlert: false,
    request: {
      documentType: "General",
      userQuestion: "What is the main point?",
      documentText:
        "This is a synthetic household service renewal notice created only for Plainly testing. It says a fictional service plan will renew on June 30 unless the customer contacts the sender before that date. It mentions that no payment is due today and includes no personal information.",
    },
  },
  {
    id: "live-high-risk",
    title: "Synthetic Court Notice",
    expectedHighRiskAlert: true,
    request: {
      documentType: "Court or legal notice",
      userQuestion: "What should I pay attention to?",
      documentText:
        "This is a synthetic court-related notice created only for Plainly testing. It says a fictional household account has a court hearing scheduled on July 15 and that missing the court date may affect the recipient's options. It includes no real names, addresses, account numbers, or personal information.",
    },
  },
];

let passedCount = 0;
let failedCount = 0;

console.log("Testing live Plainly API route with synthetic inputs.");
console.log("Dev server must already be running with live provider environment.");
console.log(`PLAINLY_API_URL configured: ${Boolean(process.env.PLAINLY_API_URL)}`);
console.log("Document text, prompts, response bodies, headers, and secrets are not printed.");
console.log("");

for (const testCase of testCases) {
  const result = await executeTestCase(testCase);

  if (result.passed) {
    passedCount += 1;
    console.log(`PASS | ${testCase.id} | ${testCase.title}`);
  } else {
    failedCount += 1;
    console.log(formatFailure(testCase, result));
  }
}

console.log("");
console.log(`Total cases: ${testCases.length}`);
console.log(`Passed: ${passedCount}`);
console.log(`Failed: ${failedCount}`);

if (failedCount > 0) {
  process.exitCode = 1;
}

async function executeTestCase(testCase: LiveApiCase): Promise<CaseResult> {
  let response: Response;

  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testCase.request),
    });
  } catch {
    return {
      passed: false,
      category: "server-unreachable",
    };
  }

  if (response.status !== 200) {
    return {
      passed: false,
      category: "http-status",
      status: response.status,
    };
  }

  let data: ExplainResponse;

  try {
    data = (await response.json()) as ExplainResponse;
  } catch {
    return {
      passed: false,
      category: "invalid-json-response",
    };
  }

  if (!data.result) {
    return {
      passed: false,
      category: "missing-result",
    };
  }

  if (!isNonEmptyString(data.result.plainEnglishSummary)) {
    return {
      passed: false,
      category: "missing-summary",
    };
  }

  if (!isNonEmptyString(data.result.notAdviceNotice)) {
    return {
      passed: false,
      category: "missing-not-advice-notice",
    };
  }

  if (data.showHighRiskAlert !== testCase.expectedHighRiskAlert) {
    return {
      passed: false,
      category: "high-risk-mismatch",
    };
  }

  return {
    passed: true,
  };
}

function formatFailure(testCase: LiveApiCase, result: CaseResult): string {
  const parts = [
    "FAIL",
    testCase.id,
    testCase.title,
    `category=${result.category || "unknown"}`,
  ];

  if (typeof result.status === "number") {
    parts.push(`status=${result.status}`);
  }

  if (result.category === "high-risk-mismatch") {
    parts.push(`expectedHighRisk=${String(testCase.expectedHighRiskAlert)}`);
  }

  return parts.join(" | ");
}

function isNonEmptyString(input: unknown): input is string {
  return typeof input === "string" && input.trim().length > 0;
}

export {};
