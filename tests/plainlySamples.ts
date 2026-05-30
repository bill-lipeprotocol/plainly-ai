export type PlainlySampleDocument = {
  id: string;
  title: string;
  documentType: string;
  documentText: string;
  expectedDates: string[];
  expectedMoney: string[];
  expectedHighRiskAlert: boolean;
  expectedSummaryNotes: string[];
};

export const plainlySamples: PlainlySampleDocument[] = [
  {
    id: "sample-utility-price-increase",
    title: "Utility Price Increase Notice",
    documentType: "Notice",
    documentText:
      "Synthetic sample document. This notice says the monthly utility service rate for a household plan will change on June 1, 2026. The base service charge will increase by $15 per month. The notice says the current balance is not due today and that the next bill will show the updated amount. It suggests reviewing plan options before the change date.",
    expectedDates: ["June 1, 2026"],
    expectedMoney: ["$15 per month"],
    expectedHighRiskAlert: false,
    expectedSummaryNotes: [
      "Monthly utility service rate is increasing.",
      "The notice says the current balance is not due today.",
      "The user may want to ask about lower-cost plan options.",
    ],
  },
  {
    id: "sample-internet-hidden-fee",
    title: "Internet Bill Hidden Fee",
    documentType: "Bill",
    documentText:
      "Synthetic sample document. This internet bill lists a service total of $64.99 for the billing period ending July 12, 2026. A separate line shows a network access recovery fee of $8.50. The bill says payment is due by July 28, 2026. It does not clearly explain whether the fee is optional, temporary, or part of the regular monthly service charge.",
    expectedDates: ["July 12, 2026", "July 28, 2026"],
    expectedMoney: ["$64.99", "$8.50"],
    expectedHighRiskAlert: false,
    expectedSummaryNotes: [
      "Internet bill includes a separate fee.",
      "The fee purpose is unclear from the pasted text.",
      "Payment due date should be confirmed.",
    ],
  },
  {
    id: "sample-medical-bill",
    title: "Medical Bill Balance Notice",
    documentType: "Medical bill",
    documentText:
      "Synthetic sample document. This medical bill says a patient responsibility balance of $230 remains after plan adjustments. The statement date is August 3, 2026, and payment is requested by September 2, 2026. The bill lists a visit charge, an adjustment, and a remaining balance, but it does not show whether a payment plan is available.",
    expectedDates: ["August 3, 2026", "September 2, 2026"],
    expectedMoney: ["$230"],
    expectedHighRiskAlert: false,
    expectedSummaryNotes: [
      "Medical bill shows a remaining patient responsibility balance.",
      "Payment is requested by a stated date.",
      "Payment plan availability is unclear.",
    ],
  },
  {
    id: "sample-insurance-denial",
    title: "Insurance Denial Letter",
    documentType: "Insurance letter",
    documentText:
      "Synthetic sample document. This insurance letter says a request for coverage was reviewed and denied coverage for the listed service. The letter date is May 9, 2026. It says an appeal may be submitted within 30 days of the letter date. The text mentions a billed amount of $1,240 but does not clearly say whether the household currently owes that amount.",
    expectedDates: ["May 9, 2026", "30 days of the letter date"],
    expectedMoney: ["$1,240"],
    expectedHighRiskAlert: true,
    expectedSummaryNotes: [
      "Coverage request was denied.",
      "There may be an appeal window.",
      "Whether the billed amount is currently owed is unclear.",
    ],
  },
  {
    id: "sample-rent-increase",
    title: "Rent Increase Notice",
    documentType: "Rental or landlord letter",
    documentText:
      "Synthetic sample document. This rental notice says the monthly rent for the unit will increase from $1,450 to $1,525 starting October 1, 2026. The notice is dated August 15, 2026. It asks the resident to contact the property office with questions before the new rental period begins. The pasted text does not mention a lease renewal form.",
    expectedDates: ["August 15, 2026", "October 1, 2026"],
    expectedMoney: ["$1,450", "$1,525"],
    expectedHighRiskAlert: false,
    expectedSummaryNotes: [
      "Monthly rent is increasing.",
      "The new amount begins on a future date.",
      "Lease renewal details are not included in the pasted text.",
    ],
  },
  {
    id: "sample-school-permission-slip",
    title: "School Permission Slip",
    documentType: "School letter",
    documentText:
      "Synthetic sample document. This school permission slip asks a caregiver to approve a class museum trip scheduled for March 18, 2026. The signed form is requested by March 10, 2026. The document lists a suggested activity fee of $12 and says students may bring a packed lunch. It does not say the activity fee is required.",
    expectedDates: ["March 10, 2026", "March 18, 2026"],
    expectedMoney: ["$12"],
    expectedHighRiskAlert: false,
    expectedSummaryNotes: [
      "Permission is requested for a school trip.",
      "There is a form return date and trip date.",
      "The activity fee appears suggested, not clearly required.",
    ],
  },
  {
    id: "sample-government-benefits-notice",
    title: "Government Benefits Notice",
    documentType: "Government letter",
    documentText:
      "Synthetic sample document. This benefits notice says there is a benefits denial for a household support program because a requested verification document was not received. The notice date is April 4, 2026. It says the household may send missing paperwork by April 24, 2026 for review. No payment amount is listed in the pasted text.",
    expectedDates: ["April 4, 2026", "April 24, 2026"],
    expectedMoney: [],
    expectedHighRiskAlert: true,
    expectedSummaryNotes: [
      "Benefits were denied because verification was missing.",
      "There is a date for sending missing paperwork.",
      "No money amount is shown.",
    ],
  },
  {
    id: "sample-medical-benefits-coverage-denied",
    title: "Medical Benefits Coverage Denied Notice",
    documentType: "Insurance letter",
    documentText:
      "Synthetic sample document. This benefits notice says coverage for a requested medical service has been denied because the reviewer says the service was not approved under the plan rules. It mentions an appeal deadline and says the recipient may submit more information before the deadline. This text is fictional and contains no medical ID, claim number, name, address, or real health information.",
    expectedDates: ["appeal deadline"],
    expectedMoney: [],
    expectedHighRiskAlert: true,
    expectedSummaryNotes: [
      "Coverage for a requested medical service was denied.",
      "The notice mentions an appeal deadline.",
      "The recipient may submit more information before the deadline.",
    ],
  },
  {
    id: "sample-debt-collection-letter",
    title: "Debt Collection Letter",
    documentType: "Notice",
    documentText:
      "Synthetic sample document. This collections letter says a household account has a claimed balance of $486.75. The letter date is February 6, 2026, and it says the recipient may dispute the debt within 30 days of receiving the letter. The pasted text does not prove the debt is valid or say that payment must be made today.",
    expectedDates: ["February 6, 2026", "30 days of receiving the letter"],
    expectedMoney: ["$486.75"],
    expectedHighRiskAlert: true,
    expectedSummaryNotes: [
      "Letter claims a balance is owed.",
      "There is a dispute window.",
      "The pasted text does not prove the debt is valid.",
    ],
  },
  {
    id: "sample-hoa-violation-letter",
    title: "HOA Violation Letter",
    documentType: "Notice",
    documentText:
      "Synthetic sample document. This community association letter says an exterior item must be removed from a visible area by November 14, 2026. The notice is dated October 31, 2026. It says a $50 review fee may be added if the issue is not resolved by the listed date. The pasted text does not explain how to appeal the notice.",
    expectedDates: ["October 31, 2026", "November 14, 2026"],
    expectedMoney: ["$50"],
    expectedHighRiskAlert: false,
    expectedSummaryNotes: [
      "Community association says an exterior item must be removed.",
      "A possible fee is listed.",
      "Appeal process is unclear.",
    ],
  },
  {
    id: "sample-warranty-expiration",
    title: "Warranty Expiration Notice",
    documentType: "Notice",
    documentText:
      "Synthetic sample document. This warranty notice says a household appliance protection plan will expire on December 31, 2026. It offers renewal for $89 per year if selected by December 20, 2026. The notice says renewal is optional. It does not say that a repair is currently needed or that any money is past due.",
    expectedDates: ["December 20, 2026", "December 31, 2026"],
    expectedMoney: ["$89 per year"],
    expectedHighRiskAlert: false,
    expectedSummaryNotes: [
      "Warranty coverage is expiring.",
      "Renewal is optional according to the pasted text.",
      "No past-due amount is stated.",
    ],
  },
  {
    id: "sample-low-risk-negated-disclaimer",
    title: "Low-Risk Notice With Negated Risk Words",
    documentType: "Notice",
    documentText:
      "Synthetic sample document. This household service notice says a routine plan update will take effect on December 1, 2026. It says the update does not mention cancellation fees, legal action, medical issues, taxes, debt collection, eviction, foreclosure, collections, or denied coverage. It asks the household to review the updated service description.",
    expectedDates: ["December 1, 2026"],
    expectedMoney: [],
    expectedHighRiskAlert: false,
    expectedSummaryNotes: [
      "Routine service update takes effect on a future date.",
      "The notice uses high-risk words only in a negated disclaimer.",
      "The household is asked to review the updated service description.",
    ],
  },
  {
    id: "sample-mixed-negated-and-real-risk",
    title: "Mixed Disclaimer and Eviction Risk Notice",
    documentType: "Rental or landlord letter",
    documentText:
      "Synthetic sample document. This rental notice says the general FAQ does not mention eviction or foreclosure. However, the final section says eviction may occur if the listed unpaid balance is not addressed by February 15, 2026. The text is fictional and does not include any real names, addresses, or account numbers.",
    expectedDates: ["February 15, 2026"],
    expectedMoney: [],
    expectedHighRiskAlert: true,
    expectedSummaryNotes: [
      "The FAQ disclaimer contains negated risk words.",
      "A later section says eviction may occur.",
      "There is a date connected to the unpaid balance.",
    ],
  },
  {
    id: "sample-eviction-related-notice",
    title: "Eviction-Related Notice",
    documentType: "Rental or landlord letter",
    documentText:
      "Synthetic sample document. This rental notice mentions eviction and says the resident has an unpaid rent balance of $950. The notice is dated January 5, 2026 and says payment or a written response is requested by January 12, 2026. The pasted text does not include a court filing, but it may involve housing consequences and deadlines.",
    expectedDates: ["January 5, 2026", "January 12, 2026"],
    expectedMoney: ["$950"],
    expectedHighRiskAlert: true,
    expectedSummaryNotes: [
      "Notice mentions eviction.",
      "A rent balance and response date are listed.",
      "The pasted text does not include a court filing.",
    ],
  },
  {
    id: "sample-court-related-notice",
    title: "Court-Related Notice",
    documentType: "Government letter",
    documentText:
      "Synthetic sample document. This court-related notice says a small claims hearing is scheduled for September 16, 2026. It lists a claimed amount of $720 and says written materials should be submitted by September 9, 2026. The notice mentions a lawsuit but does not explain whether the claim is valid or what outcome will happen.",
    expectedDates: ["September 9, 2026", "September 16, 2026"],
    expectedMoney: ["$720"],
    expectedHighRiskAlert: true,
    expectedSummaryNotes: [
      "Notice mentions court and a lawsuit.",
      "A hearing date and materials date are listed.",
      "The validity or outcome of the claim is not shown.",
    ],
  },
];
