import {
  callGemmaHostedMock,
  callOpenAiCompatibleGemma,
} from "./gemmaAdapter.ts";
import { mockResult } from "./mockResult.ts";
import type { PlainlyModelInput, PlainlyResult } from "./plainlySchema.ts";

export type { PlainlyModelInput } from "./plainlySchema.ts";

export type PlainlyModelProvider =
  | "mock"
  | "gemma-hosted"
  | "gemma-hosted-openai-compatible"
  | "gemma-hosted-custom-prompt"
  | "gemma-local";

export async function callPlainlyModel(
  input: PlainlyModelInput
): Promise<PlainlyResult> {
  const provider = process.env.PLAINLY_MODEL_PROVIDER || "mock";

  if (provider === "mock") {
    return mockResult;
  }

  if (provider === "gemma-hosted") {
    // Milestone 4C routes to a mocked hosted adapter only. Real hosted Gemma
    // calls belong in a later milestone and must keep the no-logging rules.
    return callGemmaHostedMock(input);
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

  throw new Error(`Unsupported Plainly model provider: ${provider}`);
}
