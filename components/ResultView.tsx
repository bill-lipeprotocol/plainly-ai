import type { ReactNode } from "react";

import type { PlainlyResult } from "@/lib/plainlySchema";
import { AlertBanner } from "./AlertBanner";
import { FeedbackButtons } from "./FeedbackButtons";

type ResultViewProps = {
  result: PlainlyResult;
  showHighRiskAlert: boolean;
  feedback: string;
  onFeedbackChange: (value: string) => void;
};

export function ResultView({
  result,
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
        This explanation is based only on the text you pasted. If a page,
        deadline, amount, or instruction is missing, check the original document
        or ask the sender.
      </p>

      <div className="mt-6 space-y-5">
        {showHighRiskAlert ? <AlertBanner /> : null}

        <ResultSection title="Quick Summary">
          <p>{result.plainEnglishSummary}</p>
        </ResultSection>

        <ResultSection title="What This Looks Like">
          <p>
            <strong>Type:</strong> {result.documentTypeGuess.type}
          </p>
          <p>
            <strong>Confidence:</strong> {result.documentTypeGuess.confidence}
          </p>
          <p>
            <strong>Why:</strong> {result.documentTypeGuess.reason}
          </p>
        </ResultSection>

        <ResultSection title="Dates to Notice">
          {result.importantDates.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5">
              {result.importantDates.map((item) => (
                <li key={`${item.dateText}-${item.whatItRefersTo}`}>
                  <strong>{item.dateText}:</strong> {item.whatItRefersTo}
                  {item.isDeadline ? " This appears to be a deadline." : ""}
                </li>
              ))}
            </ul>
          ) : (
            <EmptySectionText text="No specific dates were found in the pasted text." />
          )}
        </ResultSection>

        <ResultSection title="Money Mentioned">
          {result.moneyMentioned.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5">
              {result.moneyMentioned.map((item) => (
                <li key={`${item.amountText}-${item.whatItRefersTo}`}>
                  <strong>{item.amountText}:</strong> {item.whatItRefersTo}
                  <span className="block text-sm text-slate-600">
                    May be owed by you: {item.userMayOweThis}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptySectionText text="No money amounts were found in the pasted text." />
          )}
        </ResultSection>

        <ResultSection title="Possible Next Steps">
          {result.possibleActionSteps.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5">
              {result.possibleActionSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <EmptySectionText text="No clear next steps were found in the pasted text." />
          )}
        </ResultSection>

        <ResultSection title="Questions You Could Ask">
          {result.questionsToAskSender.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5">
              {result.questionsToAskSender.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <EmptySectionText text="No specific sender questions were found in the pasted text." />
          )}
        </ResultSection>

        <ResultSection title="Unclear or Worth Checking">
          {result.unclearOrRiskyParts.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5">
              {result.unclearOrRiskyParts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <EmptySectionText text="No unclear parts were flagged from the pasted text." />
          )}
        </ResultSection>

        <ResultSection title="Important Note" variant="notice">
          <p>{result.notAdviceNotice}</p>
          <p className="mt-2">
            Plainly can help you understand text, but it is not a substitute for
            advice from a qualified professional.
          </p>
        </ResultSection>
      </div>

      <FeedbackButtons
        feedback={feedback}
        onFeedbackChange={onFeedbackChange}
      />

      <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white">
        <h3 className="text-xl font-semibold">
          Want to help improve Plainly?
        </h3>

        <p className="mt-2 text-sm text-slate-200">
          Use the feedback buttons above to tell us whether the explanation was
          helpful. This MVP works best with short sections of text.
        </p>
      </div>
    </section>
  );
}

function ResultSection({
  title,
  children,
  variant = "default",
}: {
  title: string;
  children: ReactNode;
  variant?: "default" | "notice";
}) {
  return (
    <div
      className={
        variant === "notice"
          ? "rounded-2xl border border-sky-200 bg-sky-50 p-5 text-slate-800 shadow-sm"
          : "rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-sm"
      }
    >
      <h3 className="mb-2 text-lg font-semibold text-slate-950">{title}</h3>
      {children}
    </div>
  );
}

function EmptySectionText({ text }: { text: string }) {
  return <p className="text-sm text-slate-600">{text}</p>;
}
