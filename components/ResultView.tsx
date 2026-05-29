import type { ReactNode } from "react";

import { mockResult } from "@/lib/mockResult";
import { AlertBanner } from "./AlertBanner";
import { FeedbackButtons } from "./FeedbackButtons";

type ResultViewProps = {
  showHighRiskAlert: boolean;
  feedback: string;
  onFeedbackChange: (value: string) => void;
};

export function ResultView({
  showHighRiskAlert,
  feedback,
  onFeedbackChange,
}: ResultViewProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="text-3xl font-bold tracking-tight">
        Here&apos;s the plain-English version
      </h2>

      <p className="mt-3 text-slate-700">
        This explanation is based only on the text you pasted. If something
        important is missing or unclear, confirm directly with the sender.
      </p>

      <div className="mt-6 space-y-5">
        {showHighRiskAlert ? <AlertBanner /> : null}

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

      <FeedbackButtons
        feedback={feedback}
        onFeedbackChange={onFeedbackChange}
      />

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
  );
}

function ResultSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-slate-950">{title}</h3>
      {children}
    </div>
  );
}
