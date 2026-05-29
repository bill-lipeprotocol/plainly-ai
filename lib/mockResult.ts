export const mockResult = {
  plainEnglishSummary:
    "This appears to be a notice saying your monthly service charge may increase soon. The document mentions a future date and a dollar amount, but the pasted text does not clearly show whether you can opt out.",
  documentTypeGuess: {
    type: "Bill or service notice",
    confidence: "medium",
    reason:
      "The text mentions a monthly charge, service account, and a future price change.",
  },
  importantDates: [
    {
      dateText: "June 1, 2026",
      whatItRefersTo: "The date the new monthly price appears to begin.",
      isDeadline: false,
    },
  ],
  moneyMentioned: [
    {
      amountText: "$15",
      whatItRefersTo: "The monthly increase mentioned in the notice.",
      userMayOweThis: "unclear",
    },
  ],
  possibleActionSteps: [
    "Save a copy of this document.",
    "Contact the sender to confirm when the price change starts.",
    "Ask whether there are lower-cost plans, discounts, or promotions available.",
  ],
  questionsToAskSender: [
    "When exactly will this new charge appear on my bill?",
    "Is this amount currently due?",
    "Is there a way to avoid or reduce this increase?",
    "Can you send the explanation in writing?",
  ],
  unclearOrRiskyParts: [
    "The pasted text does not show whether the user can opt out, cancel, or avoid the increase.",
  ],
  notAdviceNotice:
    "This is a plain-English explanation of the text you provided. It is not legal, medical, tax, financial, or professional advice.",
};
