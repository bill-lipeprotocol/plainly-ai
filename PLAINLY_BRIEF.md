# Plainly.ai — MVP Build Brief for Codex

## Product Summary

Plainly.ai is a text-only MVP that explains confusing household paperwork in simple English.

The user pastes text from a bill, notice, letter, school form, rental notice, insurance letter, medical bill, government letter, or similar document. Plainly returns a structured explanation with a summary, dates, money mentioned, possible action steps, questions to ask, unclear/risky parts, and a fixed not-advice notice.

## Current Build Stage

We are at the first implementation stage.

Build only the mocked front-end MVP. Do not connect a real model yet.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui can be added later, but do not require it for the first pass
- No database
- No authentication
- No file uploads
- No PDF support
- No payments
- No document storage

## Core Product Promise

Confusing paperwork, explained in simple English.

Primary user flow:

1. User lands on the page.
2. User selects a document type.
3. User optionally enters what they are trying to understand.
4. User pastes document text.
5. User clicks "Explain it plainly."
6. App shows a loading state.
7. App renders a mocked structured result.
8. User clicks a feedback button.

## Important Product Boundary

Plainly explains text. It does not provide legal, medical, tax, financial, or professional advice.

The UI must include this boundary clearly near the input and again in the result.

## First Screen Copy

Headline:

"Confusing letter? Plainly explains it in simple English."

Subheadline:

"Paste a bill, notice, school letter, insurance letter, rental letter, or other paperwork. Plainly summarizes what it appears to say, highlights dates and money, and suggests questions to ask the sender."

Trust line:

"No account required. No document storage in this first version."

Boundary line:

"Plainly explains text. It does not provide legal, medical, tax, or financial advice."

Primary button:

"Paste your document"

Secondary link:

"See an example"

## Input Form

Page headline:

"Paste your document"

Instruction copy:

"Copy and paste the text from your bill, notice, letter, or paperwork below. Plainly will explain what it appears to say in simple English."

Privacy note:

"For this first version, Plainly does not save your document text after generating the explanation."

Fields:

1. Document type dropdown
Options:
- Bill
- Notice
- Insurance letter
- Medical bill
- School letter
- Rental or landlord letter
- Government letter
- Other / not sure

2. Optional user question
Label:
"What are you trying to understand?"

Placeholder:
"Example: Do I owe money? Is there a deadline? What should I ask them?"

3. Document text textarea
Label:
"Paste the document text here"

Placeholder:
"Paste the text from your bill, notice, letter, or paperwork here.

Tip: You can remove names, account numbers, addresses, or other personal details before submitting."

Validation:
- If document text is under 100 characters, show:
"Please paste more of the document so Plainly has enough context to explain it."

- If document text is over 12000 characters, show:
"This document is too long for the first version. Please paste the most important section, such as the first page, summary, charges, or deadline notice."

Primary button:
"Explain it plainly"

Loading state:
"Reading your document..."
"Plainly is looking for the summary, dates, money, possible next steps, and unclear parts."

## Result Screen

Page headline:

"Here’s the plain-English version"

Intro line:

"This explanation is based only on the text you pasted. If something important is missing or unclear, confirm directly with the sender."

Render these sections:

1. Plain-English Summary
2. Document Type Guess
3. Important Dates
4. Money Mentioned
5. Possible Action Steps
6. Questions to Ask
7. Unclear or Risky Parts
8. Important Note

Fixed Important Note:

"This is a plain-English explanation of the text you provided. It is not legal, medical, tax, financial, or professional advice. For important decisions, deadlines, health issues, money disputes, housing problems, or legal matters, confirm directly with the sender or a qualified professional."

## High-Risk Alert Banner

If the pasted text includes any of these words, show a warning banner above the result:

- eviction
- lawsuit
- court
- collections
- denied coverage
- termination
- foreclosure
- garnishment
- subpoena
- tax penalty
- emergency medical
- benefits denial

Banner copy:

"This document may involve important rights, deadlines, health, housing, or financial consequences. Plainly can help explain the text, but you may want to contact the sender or a qualified professional as soon as possible."

## Feedback Buttons

After the result, show:

Header:
"Was this explanation helpful?"

Helper text:
"Your feedback helps improve Plainly without saving your document text."

Buttons:
- Yes, this helped
- Something was wrong
- I still feel confused
- I want PDF upload
- I want private saved summaries

Click behavior can be local UI state only for now. No backend required.

## Mock Result Data

Use a mock result object in `lib/mockResult.ts`.

Shape:

```ts
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