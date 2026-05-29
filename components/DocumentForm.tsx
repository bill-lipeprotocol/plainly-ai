import type { RefObject } from "react";

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
  onSubmit,
}: DocumentFormProps) {
  return (
    <section ref={formRef} className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Paste your document
        </h2>

        <p className="mt-3 text-slate-700">
          Copy and paste the text from your bill, notice, letter, or paperwork
          below. Plainly will explain what it appears to say in simple English.
        </p>

        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          For this first version, Plainly does not save your document text after
          generating the explanation.
        </p>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-medium">
              What kind of document is this?
            </span>

            <select
              value={documentType}
              onChange={(event) => onDocumentTypeChange(event.target.value)}
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
              onChange={(event) => onUserQuestionChange(event.target.value)}
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
              onChange={(event) => onDocumentTextChange(event.target.value)}
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
            onClick={onSubmit}
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
  );
}
