import { mockResult } from "./mockResult";
import type { PlainlyModelInput, PlainlyResult } from "./plainlySchema";

export type { PlainlyModelInput } from "./plainlySchema";

export type PlainlyModelProvider = "mock" | "gemma";

export async function callPlainlyModel(
  input: PlainlyModelInput
): Promise<PlainlyResult> {
  void input;

  const provider = process.env.PLAINLY_MODEL_PROVIDER || "mock";

  if (provider === "mock") {
    return mockResult;
  }

  if (provider === "gemma") {
    // Milestone 3B only routes providers. Real Gemma integration belongs in
    // the next milestone and must not log or store document text or prompts.
    throw new Error("Gemma provider is not implemented yet.");
  }

  throw new Error(`Unsupported Plainly model provider: ${provider}`);
}
