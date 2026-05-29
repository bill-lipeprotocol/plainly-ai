import { mockResult } from "./mockResult";
import type { PlainlyModelInput, PlainlyResult } from "./plainlySchema";

export type { PlainlyModelInput } from "./plainlySchema";

export type PlainlyModelProvider = "mock" | "gemma-hosted" | "gemma-local";

export async function callPlainlyModel(
  input: PlainlyModelInput
): Promise<PlainlyResult> {
  void input;

  const provider = process.env.PLAINLY_MODEL_PROVIDER || "mock";

  if (provider === "mock") {
    return mockResult;
  }

  if (provider === "gemma" || provider === "gemma-hosted") {
    // Future provider: call a hosted Gemma-compatible endpoint with timeouts,
    // JSON validation, and no document text or prompt logging.
    throw new Error("Gemma provider is not implemented yet.");
  }

  if (provider === "gemma-local") {
    // Future provider: call a local Gemma runtime with the same validation and
    // no-logging rules. No local model connection is active in this milestone.
    throw new Error("Gemma provider is not implemented yet.");
  }

  throw new Error(`Unsupported Plainly model provider: ${provider}`);
}
