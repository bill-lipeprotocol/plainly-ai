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
  "Plainly could not prepare an explanation right now. Try a shorter section, remove unusual formatting, or try again in a moment.";

const SAMPLE_NOTICE = {
  documentType: "Notice",
  userQuestion: "What is changing, and is there a deadline?",
  documentText:
    "Synthetic sample notice for Plainly demo use. This household service notice says the monthly service plan will change on June 1, 2026. The base charge will increase by $15 per month after that date. The notice says the current balance is not due today and asks the customer to review plan options before the next billing cycle. It does not include any real name, address, account number, or personal information.",
};

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
  const [explanationId, setExplanationId] = useState("");
  const [explainedDocumentType, setExplainedDocumentType] = useState("");

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function useSampleNotice() {
    setDocumentType(SAMPLE_NOTICE.documentType);
    setUserQuestion(SAMPLE_NOTICE.userQuestion);
    setDocumentText(SAMPLE_NOTICE.documentText);
    setError("");
    setHasResult(false);
    setResult(null);
    setExplanationId("");
    setExplainedDocumentType("");
    scrollToForm();
  }

  async function handleSubmit() {
    setError("");
    setHasResult(false);
    setResult(null);
    setExplanationId("");
    setExplainedDocumentType("");

    if (!documentType) {
      setError('Please choose a document type, or select "Other / not sure."');
      return;
    }

    if (documentText.trim().length < 100) {
      setError(
        "Please paste a little more text from the section you want explained. Plainly works best with at least a paragraph."
      );
      return;
    }

    if (documentText.length > 12000) {
      setError(
        "This is too much text for the first version. Paste one important section or notice at a time, such as the summary, charges, or deadline paragraph."
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
      setExplanationId(window.crypto.randomUUID());
      setExplainedDocumentType(documentType);
      setHasResult(true);
    } catch {
      setError(SAFE_EXPLAIN_ERROR);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <LandingHero
        onPrimaryClick={scrollToForm}
        onSecondaryClick={useSampleNotice}
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
        onUseSample={useSampleNotice}
        onSubmit={handleSubmit}
      />

      {hasResult && result ? (
        <ResultView
          result={result}
          showHighRiskAlert={showHighRiskAlert}
          explanationId={explanationId}
          documentType={explainedDocumentType}
        />
      ) : null}

      <footer className="border-t-2 border-black bg-[var(--coral)] px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-4xl font-extrabold tracking-[-0.06em]">
              plainly<span className="text-white">.</span>
            </p>
            <p className="mt-2 max-w-md text-sm leading-6">
              Confusing paperwork, translated into language that sounds human.
            </p>
          </div>
          <p className="max-w-xl text-xs leading-5 text-black/65 sm:text-right">
            Plainly explains pasted text. It is not legal, medical, tax,
            insurance, financial, or other professional advice. Remove
            sensitive details before pasting.
          </p>
        </div>
      </footer>
    </main>
  );
}
