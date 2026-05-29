"use client";

import { useRef, useState } from "react";

const mockResult = {
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

const documentTypes = [
  "Bill",
  "Notice",
  "Insurance letter",
  "Medical bill",
  "School letter",
  "Rental or landlord letter",
  "Government letter",
  "Other / not sure",
];

const feedbackOptions = [
  "Yes, this helped",
  "Something was wrong",
  "I still feel confused",
  "I want PDF upload",
  "I want private saved summaries",
];

function detectHighRisk(text: string): boolean {
  const normalized = text.toLowerCase();
  return highRiskTerms.some((term) => normalized.includes(term));
}

export default function Home() {
  const formRef = useRef<HTMLDivElement | null>(null);

  const [documentType, setDocumentType] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [showHighRiskAlert, setShowHighRiskAlert] = useState(false);
  const [feedback, setFeedback] = useState("");

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSubmit() {
    setError("");
    setHasResult(false);
    setFeedback("");

    if (!documentType) {
      setError('Please choose a document type, or select "Other / not sure."');
      return;
    }

    if (documentText.trim().length < 100) {
      setError(
        "Please paste more of the document so Plainly has enough context to explain it."
      );
      return;
    }

    if (documentText.length > 12000) {
      setError(
        "This document is too long for the first version. Please paste the most important section, such as the first page, summary, charges, or deadline notice."
      );
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      setShowHighRiskAlert(detectHighRisk(documentText));
      setHasResult(true);
      setIsLoading(false);
    }, 800);
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="mb-3 text-sm font-medium text-slate-500">Plainly.ai</p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Confusing letter? Plainly explains it in simple English.
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-700">
          Paste a bill, notice, school letter, insurance letter, rental letter,
          or other paperwork. Plainly summarizes what it appears to say,
          highlights dates and money, and suggests questions to ask the sender.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
          <p>No account required. No document storage in this first version.</p>
          <p className="mt-2">
            Plainly explains text. It does not provide legal, medical, tax, or
            financial advice.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={scrollToForm}
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Paste your document
          </button>

          <button
            type="button"
            onClick={scrollToForm}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            See an example
          </button>
        </div>
      </section>

      <section ref={formRef} className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Paste your document
          </h2>

          <p className="mt-3 text-slate-700">
            Copy and paste the text from your bill, notice, letter, or paperwork
            below. Plainly will explain what it appears to say in simple
            English.
          </p>

          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            For this first version, Plainly does not save your document text
            after generating the explanation.
          </p>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-medium">
                What kind of document is this?
              </span>

              <select
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
              >
                <option value="">Choose a document type</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">
                What are you trying to understand?
              </span>
              <span className="ml-2 text-sm text-slate-500">Optional</span>

              <input
                value={userQuestion}
                onChange={(event) => setUserQuestion(event.target.value)}
                placeholder="Example: Do I owe money? Is there a deadline? What should I ask them?"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">
                Paste the document text here
              </span>

              <textarea
                value={documentText}
                onChange={(event) => setDocumentText(event.target.value)}
                placeholder={
                  "Paste the text from your bill, notice, letter, or paperwork here.\n\nTip: You can remove names, account numbers, addresses, or other personal details before submitting."
                }
                rows={10}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
              />
            </label>

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Reading your document..." : "Explain it plainly"}
            </button>

            {isLoading ? (
              <p className="text-center text-sm text-slate-600">
                Plainly is looking for the summary, dates, money, possible next
                steps, and unclear parts.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {hasResult ? (
        <section className="mx-auto max-w-3xl px-6 py-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Here&apos;s the plain-English version
          </h2>

          <p className="mt-3 text-slate-700">
            This explanation is based only on the text you pasted. If something
            important is missing or unclear, confirm directly with the sender.
          </p>

          <div className="mt-6 space-y-5">
            {showHighRiskAlert ? (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                This document may involve important rights, deadlines, health,
                housing, or financial consequences. Plainly can help explain the
                text, but you may want to contact the sender or a qualified
                professional as soon as possible.
              </div>
            ) : null}

            <ResultSection title="Plain-English Summary">
              <p>{mockResult.plainEnglishSummary}</p>
            </ResultSection>

            <ResultSection title="Document Type Guess">
              <p>Type: {mockResult.documentTypeGuess.type}</p>
              <p>Confidence: {mockResult.documentTypeGuess.confidence}</p>
              <p>Why: {mockResult.documentTypeGuess.reason}</p>
            </ResultSection>

            <ResultSection title="Important Dates">
              <ul className="list-disc space-y-2 pl-5">
                {mockResult.importantDates.map((item) => (
                  <li key={item.dateText}>
                    <strong>{item.dateText}:</strong> {item.whatItRefersTo}
                  </li>
                ))}
              </ul>
            </ResultSection>

            <ResultSection title="Money Mentioned">
              <ul className="list-disc space-y-2 pl-5">
                {mockResult.moneyMentioned.map((item) => (
                  <li key={item.amountText}>
                    <strong>{item.amountText}:</strong> {item.whatItRefersTo}
                  </li>
                ))}
              </ul>
            </ResultSection>

            <ResultSection title="Possible Action Steps">
              <ul className="list-disc space-y-2 pl-5">
                {mockResult.possibleActionSteps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ResultSection>

            <ResultSection title="Questions to Ask">
              <ul className="list-disc space-y-2 pl-5">
                {mockResult.questionsToAskSender.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ResultSection>

            <ResultSection title="Unclear or Risky Parts">
              <ul className="list-disc space-y-2 pl-5">
                {mockResult.unclearOrRiskyParts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ResultSection>

            <ResultSection title="Important Note">
              <p>{mockResult.notAdviceNotice}</p>
            </ResultSection>
          </div>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold">
              Was this explanation helpful?
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Your feedback helps improve Plainly without saving your document
              text.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {feedbackOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFeedback(option)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-800 hover:bg-slate-50"
                >
                  {option}
                </button>
              ))}
            </div>

            {feedback ? (
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                Thanks. You selected: <strong>{feedback}</strong>
              </p>
            ) : null}
          </section>

          <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white">
            <h3 className="text-xl font-semibold">
              Want Plainly to handle longer documents and PDFs?
            </h3>

            <p className="mt-2 text-sm text-slate-200">
              Join early access for private uploads, longer explanations, saved
              summaries, and better document support.
            </p>

            <button
              type="button"
              className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
            >
              Join early access
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function ResultSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-slate-950">{title}</h3>
      {children}
    </div>
  );
}