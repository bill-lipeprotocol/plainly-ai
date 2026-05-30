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

const negationPhrases = [
  "does not mention",
  "does not include",
  "no",
  "not about",
];

const contrastTerms = ["but", "however"];
const maxNegatedPhraseLength = 140;

export function detectHighRisk(text: string): boolean {
  const normalized = text.toLowerCase();

  return highRiskTerms.some((term) => hasUnsuppressedTerm(normalized, term));
}

function hasUnsuppressedTerm(text: string, term: string): boolean {
  let startIndex = 0;

  while (startIndex < text.length) {
    const termIndex = text.indexOf(term, startIndex);

    if (termIndex === -1) {
      return false;
    }

    if (!isInNegatedDisclaimer(text, termIndex)) {
      return true;
    }

    startIndex = termIndex + term.length;
  }

  return false;
}

function isInNegatedDisclaimer(text: string, termIndex: number): boolean {
  const sentenceStart = findSentenceStart(text, termIndex);
  const precedingText = text.slice(sentenceStart, termIndex);
  const negationIndex = findLastNegationIndex(precedingText);

  if (negationIndex === -1) {
    return false;
  }

  const textAfterNegation = precedingText.slice(negationIndex);

  if (textAfterNegation.length > maxNegatedPhraseLength) {
    return false;
  }

  return !contrastTerms.some((term) =>
    new RegExp(`\\b${term}\\b`).test(textAfterNegation)
  );
}

function findSentenceStart(text: string, termIndex: number): number {
  const sentenceBreaks = [".", "!", "?", ";", "\n"];
  const lastBreak = Math.max(
    ...sentenceBreaks.map((breakChar) => text.lastIndexOf(breakChar, termIndex))
  );

  return lastBreak === -1 ? 0 : lastBreak + 1;
}

function findLastNegationIndex(text: string): number {
  return Math.max(
    ...negationPhrases.map((phrase) => {
      const index = text.lastIndexOf(phrase);
      return phrase === "no" && index !== -1 && !hasWordAt(text, phrase, index)
        ? -1
        : index;
    })
  );
}

function hasWordAt(text: string, word: string, index: number): boolean {
  const before = index === 0 ? "" : text[index - 1];
  const after = text[index + word.length] || "";

  return !isAlphaNumeric(before) && !isAlphaNumeric(after);
}

function isAlphaNumeric(char: string): boolean {
  return /^[a-z0-9]$/.test(char);
}
