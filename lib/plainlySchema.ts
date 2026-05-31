export type PlainlyExplainRequest = {
  documentType: string;
  userQuestion?: string;
  documentText: string;
};

export type PlainlyModelInput = PlainlyExplainRequest & {
  prompt: string;
};

export type PlainlyResult = {
  plainEnglishSummary: string;
  documentTypeGuess: {
    type: string;
    confidence: "low" | "medium" | "high";
    reason: string;
  };
  importantDates: Array<{
    dateText: string;
    whatItRefersTo: string;
    isDeadline: boolean;
  }>;
  moneyMentioned: Array<{
    amountText: string;
    whatItRefersTo: string;
    userMayOweThis: "yes" | "no" | "unclear";
  }>;
  possibleActionSteps: string[];
  questionsToAskSender: string[];
  unclearOrRiskyParts: string[];
  notAdviceNotice: string;
};

export type PlainlyFeedback = {
  explanationId: string;
  feedback: "helpful" | "not_helpful";
  documentType: string;
  highRiskDetected: boolean;
  createdAt: string;
};

type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

const REQUIRED_DOCUMENT_TYPE_ERROR =
  'Please choose a document type, or select "Other / not sure."';
const SHORT_DOCUMENT_TEXT_ERROR =
  "Please paste more of the document so Plainly has enough context to explain it.";
const LONG_DOCUMENT_TEXT_ERROR =
  "This document is too long for the first version. Please paste the most important section, such as the first page, summary, charges, or deadline notice.";
const FEEDBACK_KEYS = [
  "explanationId",
  "feedback",
  "documentType",
  "highRiskDetected",
  "createdAt",
];
const FEEDBACK_DOCUMENT_TYPES = [
  "Bill",
  "Bill or account notice",
  "Notice",
  "Insurance letter",
  "Medical bill",
  "School letter",
  "Rental or landlord letter",
  "Government letter",
  "Other / not sure",
];

export function validatePlainlyExplainRequest(
  input: unknown
): ValidationResult<PlainlyExplainRequest> {
  if (!isRecord(input)) {
    return {
      success: false,
      error: "Please send valid document text for Plainly to explain.",
    };
  }

  const documentType = input.documentType;
  const userQuestion = input.userQuestion;
  const documentText = input.documentText;

  if (typeof documentType !== "string" || !documentType.trim()) {
    return {
      success: false,
      error: REQUIRED_DOCUMENT_TYPE_ERROR,
    };
  }

  if (typeof userQuestion !== "undefined" && typeof userQuestion !== "string") {
    return {
      success: false,
      error: "The optional question must be text.",
    };
  }

  if (typeof documentText !== "string" || documentText.trim().length < 100) {
    return {
      success: false,
      error: SHORT_DOCUMENT_TEXT_ERROR,
    };
  }

  if (documentText.length > 12000) {
    return {
      success: false,
      error: LONG_DOCUMENT_TEXT_ERROR,
    };
  }

  return {
    success: true,
    data: {
      documentType,
      userQuestion,
      documentText,
    },
  };
}

export function validatePlainlyResult(
  input: unknown
): ValidationResult<PlainlyResult> {
  if (!isRecord(input)) {
    return invalidResult();
  }

  if (
    !isNonEmptyString(input.plainEnglishSummary) ||
    !validateDocumentTypeGuess(input.documentTypeGuess) ||
    !validateImportantDates(input.importantDates) ||
    !validateMoneyMentioned(input.moneyMentioned) ||
    !isStringArray(input.possibleActionSteps) ||
    !isStringArray(input.questionsToAskSender) ||
    !isStringArray(input.unclearOrRiskyParts) ||
    !isNonEmptyString(input.notAdviceNotice)
  ) {
    return invalidResult();
  }

  return {
    success: true,
    data: input as PlainlyResult,
  };
}

export function validatePlainlyFeedback(
  input: unknown
): ValidationResult<PlainlyFeedback> {
  if (!isRecord(input) || !hasOnlyKeys(input, FEEDBACK_KEYS)) {
    return invalidFeedback();
  }

  if (
    !isUuid(input.explanationId) ||
    !isFeedbackValue(input.feedback) ||
    !isFeedbackDocumentType(input.documentType) ||
    typeof input.highRiskDetected !== "boolean" ||
    !isIsoDateString(input.createdAt)
  ) {
    return invalidFeedback();
  }

  return {
    success: true,
    data: {
      explanationId: input.explanationId,
      feedback: input.feedback,
      documentType: input.documentType,
      highRiskDetected: input.highRiskDetected,
      createdAt: input.createdAt,
    },
  };
}

function validateDocumentTypeGuess(input: unknown): boolean {
  return (
    isRecord(input) &&
    isNonEmptyString(input.type) &&
    isConfidence(input.confidence) &&
    isNonEmptyString(input.reason)
  );
}

function validateImportantDates(input: unknown): boolean {
  return (
    Array.isArray(input) &&
    input.every(
      (item) =>
        isRecord(item) &&
        isNonEmptyString(item.dateText) &&
        isNonEmptyString(item.whatItRefersTo) &&
        typeof item.isDeadline === "boolean"
    )
  );
}

function validateMoneyMentioned(input: unknown): boolean {
  return (
    Array.isArray(input) &&
    input.every(
      (item) =>
        isRecord(item) &&
        isNonEmptyString(item.amountText) &&
        isNonEmptyString(item.whatItRefersTo) &&
        isUserMayOweThis(item.userMayOweThis)
    )
  );
}

function isStringArray(input: unknown): input is string[] {
  return Array.isArray(input) && input.every((item) => typeof item === "string");
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function hasOnlyKeys(
  input: Record<string, unknown>,
  allowedKeys: string[]
): boolean {
  const keys = Object.keys(input);

  return (
    keys.length === allowedKeys.length &&
    keys.every((key) => allowedKeys.includes(key))
  );
}

function isNonEmptyString(input: unknown): input is string {
  return typeof input === "string" && input.trim().length > 0;
}

function isUuid(input: unknown): input is string {
  return (
    typeof input === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      input
    )
  );
}

function isConfidence(input: unknown): input is "low" | "medium" | "high" {
  return input === "low" || input === "medium" || input === "high";
}

function isFeedbackValue(input: unknown): input is PlainlyFeedback["feedback"] {
  return input === "helpful" || input === "not_helpful";
}

function isFeedbackDocumentType(input: unknown): input is string {
  return (
    typeof input === "string" && FEEDBACK_DOCUMENT_TYPES.includes(input)
  );
}

function isIsoDateString(input: unknown): input is string {
  return (
    typeof input === "string" &&
    input.length <= 40 &&
    !Number.isNaN(Date.parse(input)) &&
    new Date(input).toISOString() === input
  );
}

function isUserMayOweThis(input: unknown): input is "yes" | "no" | "unclear" {
  return input === "yes" || input === "no" || input === "unclear";
}

function invalidResult(): ValidationResult<PlainlyResult> {
  return {
    success: false,
    error: "Plainly could not prepare a valid mocked explanation.",
  };
}

function invalidFeedback(): ValidationResult<PlainlyFeedback> {
  return {
    success: false,
    error: "Please send valid feedback.",
  };
}
