import type { RefObject } from "react";

import { DocumentUpload } from "./DocumentUpload";

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

type DocumentFormProps = {
  formRef: RefObject<HTMLDivElement | null>;
  documentType: string;
  userQuestion: string;
  documentText: string;
  error: string;
  isLoading: boolean;
  onDocumentTypeChange: (value: string) => void;
  onUserQuestionChange: (value: string) => void;
  onDocumentTextChange: (value: string) => void;
  onUseSample: () => void;
  onSubmit: () => void;
};

export function DocumentForm({
  formRef,
  documentType,
  userQuestion,
  documentText,
  error,
  isLoading,
  onDocumentTypeChange,
  onUserQuestionChange,
  onDocumentTextChange,
  onUseSample,
  onSubmit,
}: DocumentFormProps) {
  const trimmedTextLength = documentText.trim().length;
  const hasSomeText = trimmedTextLength > 0;
  const textIsShort = hasSomeText && trimmedTextLength < 100;
  const textIsLong = documentText.length > 12000;
  const sensitiveDetailMentioned = mayMentionSensitiveDetails(documentText);

  return (
    <section ref={formRef} id="explain" className="paper-grid scroll-mt-4 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-5 lg:grid-cols-[.65fr_1fr] lg:items-end">
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--violet)]">
            01 / Paste it
          </p>
          <div>
            <h2 className="font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.06em] sm:text-7xl">
              Let&apos;s untangle it.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-black/65">
              One section is enough. Remove names, account numbers, and anything
              else you would rather keep private.
            </p>
          </div>
        </div>

        <div className="border-2 border-black bg-[var(--paper)] shadow-[10px_10px_0_#151515]">
          <div className="flex flex-col gap-3 border-b-2 border-black bg-[var(--violet)] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white font-bold">
                ✓
              </span>
              <p className="font-bold">Your document text is not saved.</p>
            </div>
            <button
              type="button"
              onClick={onUseSample}
              className="rounded-full border-2 border-white px-4 py-2 text-sm font-bold transition hover:bg-white hover:text-[var(--violet)] focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Use a safe sample
            </button>
          </div>

          <div className="grid lg:grid-cols-[.75fr_1.25fr]">
            <div className="space-y-6 border-b-2 border-black p-6 sm:p-8 lg:border-b-0 lg:border-r-2">
              <label className="block">
                <span className="font-display text-sm font-extrabold uppercase tracking-wider">
                  Document type
                </span>
                <select
                  value={documentType}
                  onChange={(event) => onDocumentTypeChange(event.target.value)}
                  className="mt-3 w-full border-2 border-black bg-white px-4 py-3.5 text-black outline-none transition focus:shadow-[4px_4px_0_var(--lime)]"
                >
                  <option value="">Choose the closest match</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="font-display text-sm font-extrabold uppercase tracking-wider">
                  Your question{" "}
                  <span className="font-sans font-normal normal-case tracking-normal text-black/45">
                    (optional)
                  </span>
                </span>
                <input
                  value={userQuestion}
                  onChange={(event) => onUserQuestionChange(event.target.value)}
                  placeholder="Do I owe money? Is there a deadline?"
                  className="mt-3 w-full border-2 border-black bg-white px-4 py-3.5 text-black outline-none transition placeholder:text-black/35 focus:shadow-[4px_4px_0_var(--lime)]"
                />
              </label>

              <div className="border-2 border-black bg-[var(--lime)] p-5">
                <p className="font-display text-sm font-extrabold uppercase tracking-wider">
                  Quick privacy check
                </p>
                <p className="mt-2 text-sm leading-6">
                  Remove names, addresses, account numbers, Social Security
                  numbers, claim numbers, and medical IDs.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <DocumentUpload onTextExtracted={onDocumentTextChange} />

              <label className="block">
                <span className="font-display text-sm font-extrabold uppercase tracking-wider">
                  Paste the confusing part
                </span>
                <textarea
                  value={documentText}
                  onChange={(event) => onDocumentTextChange(event.target.value)}
                  placeholder={
                    "Paste one important section here...\n\nTip: Include the paragraph before and after any date or dollar amount."
                  }
                  rows={13}
                  aria-describedby="document-help"
                  className="mt-3 w-full resize-y border-2 border-black bg-white px-5 py-4 leading-7 text-black outline-none transition placeholder:text-black/30 focus:shadow-[5px_5px_0_var(--coral)]"
                />
              </label>

              <div
                id="document-help"
                className="mt-3 flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-black/45 sm:flex-row sm:justify-between"
              >
                <span>
                  {hasSomeText
                    ? `${trimmedTextLength.toLocaleString()} characters`
                    : "At least 100 characters"}
                </span>
                <span>12,000 max</span>
              </div>

              {textIsShort ? (
                <p className="mt-3 border-l-4 border-[var(--coral)] bg-[#fff0ec] p-3 text-sm">
                  Add the surrounding paragraph so there is enough context.
                </p>
              ) : null}

              {textIsLong ? (
                <p className="mt-3 border-l-4 border-[var(--coral)] bg-[#fff0ec] p-3 text-sm">
                  Try the summary, charges, deadline, or action-needed section.
                </p>
              ) : null}

              {sensitiveDetailMentioned ? (
                <p className="mt-3 border-l-4 border-[var(--coral)] bg-[#fff0ec] p-3 text-sm">
                  This may include sensitive details. Please remove them before
                  submitting.
                </p>
              ) : null}

              {error ? (
                <p
                  role="alert"
                  className="mt-4 border-2 border-red-700 bg-red-50 p-4 text-sm font-semibold text-red-900"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="button"
                onClick={onSubmit}
                disabled={isLoading}
                className="group mt-6 flex w-full items-center justify-center gap-3 border-2 border-black bg-black px-6 py-4 font-display font-extrabold text-white shadow-[5px_5px_0_var(--coral)] transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_var(--coral)] focus-visible:outline-2 focus-visible:outline-offset-4 disabled:translate-y-0 disabled:opacity-60"
              >
                {isLoading ? "Reading the fine print..." : "Explain it plainly"}
                {!isLoading ? (
                  <span aria-hidden="true" className="transition group-hover:translate-x-1">
                    →
                  </span>
                ) : null}
              </button>

              <p aria-live="polite" className="mt-4 min-h-6 text-center text-sm text-black/55">
                {isLoading
                  ? "Finding the meaning, dates, money, and useful questions."
                  : "Plainly explains text. It does not provide professional advice."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function mayMentionSensitiveDetails(text: string): boolean {
  const normalized = text.toLowerCase();
  const sensitiveDetailTerms = [
    "account number",
    "ssn",
    "social security",
    "medical id",
    "claim number",
    "address",
  ];

  return sensitiveDetailTerms.some((term) => normalized.includes(term));
}
