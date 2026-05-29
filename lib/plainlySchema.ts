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