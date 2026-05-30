type InferredMode =
  | "mock"
  | "live-openai-compatible"
  | "unsupported"
  | "not-implemented"
  | "misconfigured";

type ProviderStatus = {
  inferredMode: InferredMode;
  status: "pass" | "fail";
  message: string;
};

const provider = process.env.PLAINLY_MODEL_PROVIDER;
const apiUrlConfigured = isConfigured(process.env.GEMMA_API_URL);
const modelNameConfigured = isConfigured(process.env.GEMMA_MODEL_NAME);
const apiKeyConfigured = isConfigured(process.env.GEMMA_API_KEY);
const timeout = process.env.GEMMA_TIMEOUT_MS;
const timeoutConfigured = isConfigured(timeout);
const timeoutValid = !timeoutConfigured || isValidTimeout(timeout);

const normalizedProvider = provider || "mock/default";
const status = getProviderStatus(provider);

console.log("Plainly provider configuration check.");
console.log("No network calls are made.");
console.log("Secrets, URLs, model names, prompts, document text, headers, and bodies are not printed.");
console.log("");
console.log(`provider: ${normalizedProvider}`);
console.log(`GEMMA_API_URL configured: ${apiUrlConfigured}`);
console.log(`GEMMA_MODEL_NAME configured: ${modelNameConfigured}`);
console.log(`GEMMA_API_KEY configured: ${apiKeyConfigured}`);
console.log(`GEMMA_TIMEOUT_MS configured: ${timeoutConfigured}`);
console.log(`GEMMA_TIMEOUT_MS valid: ${timeoutValid}`);
console.log(`inferred mode: ${status.inferredMode}`);
console.log(`status: ${status.status}`);
console.log(`message: ${status.message}`);

if (timeoutConfigured && !timeoutValid) {
  console.log("warning: GEMMA_TIMEOUT_MS is configured but is not a positive integer.");
}

if (status.status === "fail") {
  process.exitCode = 1;
}

function getProviderStatus(inputProvider: string | undefined): ProviderStatus {
  if (!inputProvider || inputProvider === "mock") {
    return {
      inferredMode: "mock",
      status: "pass",
      message: "Mock/default provider is valid. No live provider variables are required.",
    };
  }

  if (inputProvider === "gemma-hosted-openai-compatible") {
    if (!apiUrlConfigured || !modelNameConfigured) {
      return {
        inferredMode: "misconfigured",
        status: "fail",
        message:
          "Live OpenAI-compatible provider requires GEMMA_API_URL and GEMMA_MODEL_NAME.",
      };
    }

    return {
      inferredMode: "live-openai-compatible",
      status: "pass",
      message:
        "Live OpenAI-compatible provider has required configuration. GEMMA_API_KEY is optional.",
    };
  }

  if (inputProvider === "gemma-hosted") {
    return {
      inferredMode: "mock",
      status: "pass",
      message: "gemma-hosted currently uses the mocked hosted adapter.",
    };
  }

  if (
    inputProvider === "gemma-hosted-custom-prompt" ||
    inputProvider === "gemma-local" ||
    inputProvider === "gemma"
  ) {
    return {
      inferredMode: "not-implemented",
      status: "fail",
      message: "Selected provider is not implemented for live use.",
    };
  }

  return {
    inferredMode: "unsupported",
    status: "fail",
    message: "Selected provider is unsupported.",
  };
}

function isConfigured(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidTimeout(value: string | undefined): boolean {
  if (!isConfigured(value)) {
    return true;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
}

export {};
