export type PlainlyModelInput = {
  documentType: string;
  userQuestion?: string;
  documentText: string;
};

export async function callGemma(input: PlainlyModelInput) {
  void input;
  throw new Error("Gemma integration is not implemented in the mocked MVP.");
}