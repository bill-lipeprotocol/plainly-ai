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
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold">Was this explanation helpful?</h3>

      <p className="mt-1 text-sm text-slate-600">
        Your feedback helps improve Plainly without saving your document text.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={buttonsDisabled}
          onClick={() => submitFeedback("helpful")}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Helpful
        </button>
        <button
          type="button"
          disabled={buttonsDisabled}
          onClick={() => submitFeedback("not_helpful")}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Not helpful
        </button>
      </div>

      {status === "sent" ? (
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          Thanks for the feedback.
        </p>
      ) : null}

      {status === "failed" ? (
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          Feedback was not sent.
        </p>
      ) : null}
    </section>
  );
}
