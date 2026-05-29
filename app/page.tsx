"use client";

import { useRef, useState } from "react";

import { DocumentForm } from "@/components/DocumentForm";
import { LandingHero } from "@/components/LandingHero";
import { ResultView } from "@/components/ResultView";
import { detectHighRisk } from "@/lib/detectHighRisk";

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

      {hasResult ? (
        <ResultView
          showHighRiskAlert={showHighRiskAlert}
          feedback={feedback}
          onFeedbackChange={setFeedback}
        />
      ) : null}
    </main>
  );
}
