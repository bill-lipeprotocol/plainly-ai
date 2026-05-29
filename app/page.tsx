"use client";

import { useRef, useState } from "react";

import { DocumentForm } from "@/components/DocumentForm";
import { LandingHero } from "@/components/LandingHero";
import { ResultView } from "@/components/ResultView";
import type { PlainlyResult } from "@/lib/plainlySchema";

type ExplainResponse = {
  result?: PlainlyResult;
  showHighRiskAlert?: boolean;
  error?: string;
};

const SAFE_EXPLAIN_ERROR =
  "Plainly had trouble generating the explanation. Please try again with a shorter section of text.";

export default function Home() {
  const formRef = useRef<HTMLDivElement | null>(null);

  const [documentType, setDocumentType] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [result, setResult] = useState<PlainlyResult | null>(null);
  const [showHighRiskAlert, setShowHighRiskAlert] = useState(false);
  const [feedback, setFeedback] = useState("");

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit() {
    setError("");
    setHasResult(false);
    setResult(null);
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

    try {
      const [response] = await Promise.all([
        fetch("/api/explain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentType,
            userQuestion,
            documentText,
          }),
        }),
        new Promise((resolve) => window.setTimeout(resolve, 800)),
      ]);

      let data: ExplainResponse = {};

      try {
        data = (await response.json()) as ExplainResponse;
      } catch {
        data = {};
      }

      if (!response.ok) {
        setError(
          response.status === 400 && data.error ? data.error : SAFE_EXPLAIN_ERROR
        );
        return;
      }

      if (!data.result) {
        setError(SAFE_EXPLAIN_ERROR);
        return;
      }

      setResult(data.result);
      setShowHighRiskAlert(Boolean(data.showHighRiskAlert));
      setHasResult(true);
    } catch {
      setError(SAFE_EXPLAIN_ERROR);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <LandingHero
        onPrimaryClick={scrollToForm}
        onSecondaryClick={scrollToForm}
      />

      <DocumentForm
        formRef={formRef}
        documentType={documentType}
        userQuestion={userQuestion}
        documentText={documentText}
        error={error}
        isLoading={isLoading}
        onDocumentTypeChange={setDocumentType}
        onUserQuestionChange={setUserQuestion}
        onDocumentTextChange={setDocumentText}
        onSubmit={handleSubmit}
      />

      {hasResult && result ? (
        <ResultView
          result={result}
          showHighRiskAlert={showHighRiskAlert}
          feedback={feedback}
          onFeedbackChange={setFeedback}
        />
      ) : null}
    </main>
  );
}
