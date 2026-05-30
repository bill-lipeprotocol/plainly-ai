const highRiskTerms = [
  "eviction",
  "lawsuit",
  "court",
  "collections",
  "denied coverage",
  "coverage denied",
  "coverage has been denied",
  "benefits denied",
  "termination",
  "foreclosure",
  "garnishment",
  "subpoena",
  "tax penalty",
  "emergency medical",
  "benefits denial",
  "medical service denied",
  "appeal deadline",
  "not approved under the plan rules",
];

export function detectHighRisk(text: string): boolean {
  const normalized = text.toLowerCase();
  return highRiskTerms.some((term) => normalized.includes(term));
}
