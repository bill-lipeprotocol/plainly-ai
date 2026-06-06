"use client";

import { useState } from "react";

import type { PlainlyFeedback } from "@/lib/plainlySchema";

type FeedbackButtonsProps = {
  explanationId: string;
  documentType: string;
  highRiskDetected: boolean;
};

type FeedbackStatus = "idle" | "submitting" | "sent" | "failed";

export function FeedbackButtons({
  explanationId,
  documentType,
  highRiskDetected,
}: FeedbackButtonsProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<
    PlainlyFeedback["feedback"] | ""
  >("");
  const [status, setStatus] = useState<FeedbackStatus>("idle");

  async function submitFeedback(feedback: PlainlyFeedback["feedback"]) {
    if (selectedFeedback) {
      return;
    }

    setSelectedFeedback(feedback);
    setStatus("submitting");

    const payload: PlainlyFeedback = {
      explanationId,
      feedback,
      documentType,
      highRiskDetected,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setStatus(response.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  const buttonsDisabled = Boolean(selectedFeedback);

  return (
    <section className="mt-8 border-2 border-black bg-[var(--lime)] p-6 shadow-[5px_5px_0_#151515]">
      <h3 className="font-display text-xl font-extrabold">
        Did this make things clearer?
      </h3>

      <p className="mt-1 text-sm text-black/65">
        Your feedback helps improve Plainly without saving your document text.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={buttonsDisabled}
          onClick={() => submitFeedback("helpful")}
          className="rounded-full border-2 border-black bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-white hover:text-black hover:shadow-[3px_3px_0_#151515] focus-visible:text-black focus-visible:outline-2 focus-visible:outline-offset-4 disabled:bg-white disabled:text-black disabled:opacity-60"
        >
          Yes, much clearer
        </button>
        <button
          type="button"
          disabled={buttonsDisabled}
          onClick={() => submitFeedback("not_helpful")}
          className="rounded-full border-2 border-black bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-white hover:text-black hover:shadow-[3px_3px_0_#151515] focus-visible:text-black focus-visible:outline-2 focus-visible:outline-offset-4 disabled:bg-white disabled:text-black disabled:opacity-60"
        >
          Not quite
        </button>
      </div>

      {status === "sent" ? (
        <p aria-live="polite" className="mt-4 border-l-4 border-black bg-white/60 p-3 text-sm">
          Thanks for the feedback.
        </p>
      ) : null}

      {status === "failed" ? (
        <p aria-live="polite" className="mt-4 border-l-4 border-black bg-white/60 p-3 text-sm">
          Feedback was not sent.
        </p>
      ) : null}
    </section>
  );
}
