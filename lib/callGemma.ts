import {
  callGemmaHostedMock,
  callNativeGemini,
  callOpenAiCompatibleGemma,
} from "./gemmaAdapter.ts";
import { mockResult } from "./mockResult.ts";
import type { PlainlyModelInput, PlainlyResult } from "./plainlySchema.ts";

export type { PlainlyModelInput } from "./plainlySchema.ts";

export type PlainlyModelProvider =
  | "mock"
  | "gemini"
  | "gemma-hosted"
  | "gemma-hosted-openai-compatible"
  | "gemma-hosted-custom-prompt"
  | "gemma-local";

export async function callPlainlyModel(
  input: PlainlyModelInput
): Promise<PlainlyResult> {
  const provider = process.env.PLAINLY_MODEL_PROVIDER;
  const mockEnabled =
    process.env.NEXT_PUBLIC_USE_MOCK_EXPLAIN?.toLowerCase() === "true";

  if (mockEnabled && (!provider || provider === "mock")) {
    return mockResult;
  }

  if (provider === "gemma-hosted") {
    if (!mockEnabled) {
      throw new ExplainProviderConfigurationError(
        "The configured explanation provider is mock-only. Configure Gemini or enable explicit mock mode."
      );
    }

    return callGemmaHostedMock(input);
  }

  if (provider === "gemini") {
    return callNativeGemini(input);
  }

  if (provider === "gemma-hosted-openai-compatible") {
    return callOpenAiCompatibleGemma(input);
  }

  if (provider === "gemma-hosted-custom-prompt") {
    throw new Error("Gemma hosted custom-prompt provider is not implemented yet.");
  }

  if (provider === "gemma-local") {
    // Future provider: call a local Gemma runtime with the same validation and
    // no-logging rules. No local model connection is active in this milestone.
    throw new Error("Gemma local provider is not implemented yet.");
  }

  if (provider === "gemma") {
    throw new Error(
      "Legacy Gemma provider is not implemented. Use a specific Plainly model provider."
    );
  }

  if (!provider || provider === "mock") {
    if (hasGeminiConfiguration()) {
      return callNativeGemini(input);
    }

    if (process.env.GEMMA_API_URL && process.env.GEMMA_MODEL_NAME) {
      return callOpenAiCompatibleGemma(input);
    }

    throw new ExplainProviderConfigurationError(
      "Live explanation is not configured. Set a Gemini API key or configure the OpenAI-compatible explanation provider."
    );
  }

  throw new ExplainProviderConfigurationError(
    `Unsupported Plainly explanation provider: ${provider}.`
  );
}

export class ExplainProviderConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExplainProviderConfigurationError";
  }
}

function hasGeminiConfiguration(): boolean {
  return Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY
  );
}
