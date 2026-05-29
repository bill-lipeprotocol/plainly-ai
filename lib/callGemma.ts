import { mockResult } from "./mockResult";
import type { PlainlyModelInput, PlainlyResult } from "./plainlySchema";

export type { PlainlyModelInput } from "./plainlySchema";

export type PlainlyModelProvider = "mock";

export async function callPlainlyModel(
  input: PlainlyModelInput
): Promise<PlainlyResult> {
  void input;

  // Milestone 3A is intentionally non-networked. Real Gemma integration
  // belongs in a later milestone and must not log or store document text.
  return mockResult;
}
