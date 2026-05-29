const highRiskTerms = [
  "eviction",
  "lawsuit",
  "court",
  "collections",
  "denied coverage",
  "termination",
  "foreclosure",
  "garnishment",
  "subpoena",
  "tax penalty",
  "emergency medical",
  "benefits denial",
];

export function detectHighRisk(text: string): boolean {
  const normalized = text.toLowerCase();
  return highRiskTerms.some((term) => normalized.includes(term));
}
