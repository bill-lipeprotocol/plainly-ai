import { callPlainlyModel } from "../lib/callGemma.ts";
import {
  buildOpenAiCompatibleGemmaPrompt,
  callOpenAiCompatibleGemma,
  callGemmaHostedMock,
  parseGemmaJsonResponse,
} from "../lib/gemmaAdapter.ts";
import { mockResult } from "../lib/mockResult.ts";

type AdapterCheck = {
  name: string;
  passed: boolean;
};

const checks: AdapterCheck[] = [];
let mockedFetchCallCount = 0;

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
  const livePrompt = buildOpenAiCompatibleGemmaPrompt(modelInput.prompt);
  record(
    "OpenAI-compatible prompt keeps original model prompt before JSON contract",
    livePrompt.includes(modelInput.prompt) &&
      livePrompt.indexOf(modelInput.prompt) <
        livePrompt.indexOf("Return valid JSON only.")
  );
} catch {
  record(
    "OpenAI-compatible prompt keeps original model prompt before JSON contract",
    false
  );
}

try {
  const livePrompt = buildOpenAiCompatibleGemmaPrompt(modelInput.prompt);
  const hasJsonOnlyContract =
    livePrompt.includes("Return valid JSON only.") &&
    livePrompt.includes("Do not return Markdown.") &&
    livePrompt.includes("Do not return prose before or after the JSON.") &&
    livePrompt.includes("Do not wrap the JSON in code fences.") &&
    livePrompt.includes("Do not include comments.") &&
    livePrompt.includes("PlainlyResult shape");
  record("OpenAI-compatible prompt includes strict JSON contract", hasJsonOnlyContract);
} catch {
  record("OpenAI-compatible prompt includes strict JSON contract", false);
}

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
  const result = await withModelProvider(undefined, () => callPlainlyModel(modelInput));
  record("missing provider returns mock result", Boolean(result.plainEnglishSummary));
} catch {
  record("missing provider returns mock result", false);
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
  await withModelProvider("gemma-hosted-openai-compatible", () =>
    withoutGemmaLiveEnv(() => callPlainlyModel(modelInput))
  );
  record("gemma-hosted-openai-compatible fails safely without URL", false);
} catch (error) {
  record(
    "gemma-hosted-openai-compatible fails safely without URL",
    error instanceof Error &&
      error.message === "GEMMA_API_URL is required for live adapter calls."
  );
}

try {
  await withModelProvider("gemma-hosted-openai-compatible", () =>
    withoutGemmaModelName(() => callPlainlyModel(modelInput))
  );
  record("gemma-hosted-openai-compatible fails safely without model", false);
} catch (error) {
  record(
    "gemma-hosted-openai-compatible fails safely without model",
    error instanceof Error &&
      error.message === "GEMMA_MODEL_NAME is required for live adapter calls."
  );
}

try {
  await withModelProvider("gemma-hosted-custom-prompt", () =>
    callPlainlyModel(modelInput)
  );
  record("gemma-hosted-custom-prompt provider fails safely", false);
} catch (error) {
  record(
    "gemma-hosted-custom-prompt provider fails safely",
    error instanceof Error &&
      error.message === "Gemma hosted custom-prompt provider is not implemented yet."
  );
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
  await withModelProvider("gemma", () => callPlainlyModel(modelInput));
  record("legacy gemma provider fails safely", false);
} catch (error) {
  record(
    "legacy gemma provider fails safely",
    error instanceof Error &&
      error.message ===
        "Legacy Gemma provider is not implemented. Use a specific Plainly model provider."
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

try {
  let fetchCalls = 0;

  const result = await withGemmaLiveEnv(() =>
    withMockedFetch(async () => {
      fetchCalls += 1;

      if (fetchCalls === 1) {
        return new Response(null, { status: 503 });
      }

      return openAiCompatibleResponse();
    }, () => callOpenAiCompatibleGemma(modelInput))
  );

  record(
    "OpenAI-compatible live adapter retries one transient provider status",
    fetchCalls === 2 && Boolean(result.plainEnglishSummary)
  );
} catch {
  record("OpenAI-compatible live adapter retries one transient provider status", false);
}

try {
  await withGemmaLiveEnv(() =>
    withMockedFetch(async () => {
      return new Response(null, { status: 400 });
    }, () => callOpenAiCompatibleGemma(modelInput))
  );

  record("OpenAI-compatible live adapter does not retry non-transient status", false);
} catch (error) {
  record(
    "OpenAI-compatible live adapter does not retry non-transient status",
    error instanceof Error &&
      error.message === "Provider returned status 400." &&
      getMockedFetchCallCount() === 1
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
  provider: string | undefined,
  callback: () => Promise<T>
): Promise<T> {
  const previousProvider = process.env.PLAINLY_MODEL_PROVIDER;
  if (typeof provider === "undefined") {
    delete process.env.PLAINLY_MODEL_PROVIDER;
  } else {
    process.env.PLAINLY_MODEL_PROVIDER = provider;
  }

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

async function withoutGemmaLiveEnv<T>(callback: () => Promise<T>): Promise<T> {
  const previousApiUrl = process.env.GEMMA_API_URL;
  const previousModelName = process.env.GEMMA_MODEL_NAME;

  delete process.env.GEMMA_API_URL;
  delete process.env.GEMMA_MODEL_NAME;

  try {
    return await callback();
  } finally {
    if (typeof previousApiUrl === "undefined") {
      delete process.env.GEMMA_API_URL;
    } else {
      process.env.GEMMA_API_URL = previousApiUrl;
    }

    if (typeof previousModelName === "undefined") {
      delete process.env.GEMMA_MODEL_NAME;
    } else {
      process.env.GEMMA_MODEL_NAME = previousModelName;
    }
  }
}

async function withoutGemmaModelName<T>(callback: () => Promise<T>): Promise<T> {
  const previousApiUrl = process.env.GEMMA_API_URL;
  const previousModelName = process.env.GEMMA_MODEL_NAME;

  process.env.GEMMA_API_URL = "http://127.0.0.1:1/v1/chat/completions";
  delete process.env.GEMMA_MODEL_NAME;

  try {
    return await callback();
  } finally {
    if (typeof previousApiUrl === "undefined") {
      delete process.env.GEMMA_API_URL;
    } else {
      process.env.GEMMA_API_URL = previousApiUrl;
    }

    if (typeof previousModelName === "undefined") {
      delete process.env.GEMMA_MODEL_NAME;
    } else {
      process.env.GEMMA_MODEL_NAME = previousModelName;
    }
  }
}

async function withGemmaLiveEnv<T>(callback: () => Promise<T>): Promise<T> {
  const previousApiUrl = process.env.GEMMA_API_URL;
  const previousModelName = process.env.GEMMA_MODEL_NAME;
  const previousApiKey = process.env.GEMMA_API_KEY;
  const previousTimeout = process.env.GEMMA_TIMEOUT_MS;

  process.env.GEMMA_API_URL = "http://127.0.0.1:1/v1/chat/completions";
  process.env.GEMMA_MODEL_NAME = "synthetic-test-model";
  delete process.env.GEMMA_API_KEY;
  process.env.GEMMA_TIMEOUT_MS = "5000";

  try {
    return await callback();
  } finally {
    restoreEnvValue("GEMMA_API_URL", previousApiUrl);
    restoreEnvValue("GEMMA_MODEL_NAME", previousModelName);
    restoreEnvValue("GEMMA_API_KEY", previousApiKey);
    restoreEnvValue("GEMMA_TIMEOUT_MS", previousTimeout);
  }
}

async function withMockedFetch<T>(
  fetchImplementation: typeof fetch,
  callback: () => Promise<T>
): Promise<T> {
  const previousFetch = globalThis.fetch;
  mockedFetchCallCount = 0;

  globalThis.fetch = (async (...args: Parameters<typeof fetch>) => {
    mockedFetchCallCount += 1;
    return fetchImplementation(...args);
  }) as typeof fetch;

  try {
    return await callback();
  } finally {
    globalThis.fetch = previousFetch;
  }
}

function getMockedFetchCallCount(): number {
  return mockedFetchCallCount;
}

function openAiCompatibleResponse(): Response {
  return Response.json({
    choices: [
      {
        message: {
          content: JSON.stringify(mockResult),
        },
      },
    ],
  });
}

function restoreEnvValue(key: string, value: string | undefined) {
  if (typeof value === "undefined") {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}
