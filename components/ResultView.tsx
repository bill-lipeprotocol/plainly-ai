import type { ReactNode } from "react";

import type { PlainlyResult } from "@/lib/plainlySchema";
import { AlertBanner } from "./AlertBanner";
import { FeedbackButtons } from "./FeedbackButtons";

type ResultViewProps = {
  result: PlainlyResult;
  showHighRiskAlert: boolean;
  explanationId: string;
  documentType: string;
};

export function ResultView({
  result,
  showHighRiskAlert,
  explanationId,
  documentType,
}: ResultViewProps) {
  return (
    <section
      aria-live="polite"
      className="reveal-up bg-[#151515] px-5 py-24 text-white sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[.65fr_1fr] lg:items-end">
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--lime)]">
            02 / Understand it
          </p>
          <div>
            <h2 className="font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.06em] sm:text-7xl">
              Here&apos;s what it says.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
              Based only on the text you pasted. Check the original document for
              anything missing, especially dates, amounts, and instructions.
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-6">
        {showHighRiskAlert ? <AlertBanner /> : null}

        <ResultSection title="The short version" number="01" variant="featured">
          <p>{result.plainEnglishSummary}</p>
        </ResultSection>

        <div className="grid gap-6 md:grid-cols-2">
        <ResultSection title="What this looks like" number="02">
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

        <ResultSection title="Dates to notice" number="03" accent="lime">
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

        <ResultSection title="Money mentioned" number="04" accent="coral">
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

        <ResultSection title="Possible next steps" number="05">
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

        <ResultSection title="Questions you could ask" number="06" accent="violet">
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

        <ResultSection title="Worth checking" number="07">
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
        </div>

        <ResultSection title="One important note" number="08" variant="notice">
          <p>{result.notAdviceNotice}</p>
          <p className="mt-2">
            Plainly can help you understand text, but it is not a substitute for
            advice from a qualified professional.
          </p>
        </ResultSection>
      </div>

      <FeedbackButtons
        key={explanationId}
        explanationId={explanationId}
        documentType={documentType}
        highRiskDetected={showHighRiskAlert}
      />
      </div>
    </section>
  );
}

function ResultSection({
  title,
  children,
  variant = "default",
  number,
  accent,
}: {
  title: string;
  children: ReactNode;
  variant?: "default" | "notice" | "featured";
  number: string;
  accent?: "lime" | "coral" | "violet";
}) {
  const accentClass =
    accent === "lime"
      ? "bg-[var(--lime)]"
      : accent === "coral"
        ? "bg-[var(--coral)]"
        : accent === "violet"
          ? "bg-[var(--violet)] text-white"
          : "bg-white";

  return (
    <div
      className={
        variant === "notice"
          ? "border-2 border-white/30 bg-white/10 p-6 text-white"
          : variant === "featured"
            ? "border-2 border-black bg-[var(--lime)] p-7 text-black shadow-[7px_7px_0_var(--coral)] sm:p-9"
            : `border-2 border-black p-6 text-black shadow-[5px_5px_0_#6f6f6f] ${accentClass}`
      }
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="font-display text-xs font-extrabold opacity-50">
          {number}
        </span>
        <h3 className="font-display text-xl font-extrabold">{title}</h3>
      </div>
      <div className="space-y-2 leading-7">{children}</div>
    </div>
  );
}

function EmptySectionText({ text }: { text: string }) {
  return <p className="text-sm opacity-65">{text}</p>;
}
