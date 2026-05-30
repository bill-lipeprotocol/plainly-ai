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
    <section ref={formRef} className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Paste your document
        </h2>

        <p className="mt-3 text-slate-700">
          Copy and paste one section from your bill, notice, letter, or
          paperwork. Plainly works best with a single notice, page, or paragraph
          group at a time.
        </p>

        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
          For this first version, Plainly does not save your document text after
          generating the explanation.
        </p>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <p className="font-semibold text-slate-950">Want to see how it works?</p>
          <p className="mt-1">
            Fill the form with a synthetic sample notice, then run the
            explanation. The sample does not contain personal information.
          </p>
          <button
            type="button"
            onClick={onUseSample}
            className="mt-3 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Use sample notice
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-medium">
              What kind of document is this?
            </span>
            <span className="mt-1 block text-sm text-slate-500">
              Pick the closest match. If you are unsure, choose Other / not
              sure.
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
            <span className="mt-1 block text-sm text-slate-500">
              A short question can help focus the explanation.
            </span>

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
            <span className="mt-1 block text-sm text-slate-500">
              Use one important section at a time. Remove personal details before
              submitting.
            </span>

            <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm font-medium leading-6 text-amber-950">
              Before pasting, remove names, addresses, account numbers, Social
              Security numbers, claim numbers, medical IDs, and other sensitive
              details.
            </p>

            <textarea
              value={documentText}
              onChange={(event) => onDocumentTextChange(event.target.value)}
              placeholder={
                "Paste the text from your bill, notice, letter, or paperwork here.\n\nTip: You can remove names, account numbers, addresses, or other personal details before submitting."
              }
              rows={10}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
            />
            <div className="mt-2 flex flex-col gap-1 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {hasSomeText
                  ? `${trimmedTextLength} characters pasted`
                  : "Paste at least a paragraph for the clearest explanation."}
              </span>
              <span>Limit: 12,000 characters</span>
            </div>

            {textIsShort ? (
              <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                This may be too short to explain well. Add the surrounding
                paragraph or the main section of the notice.
              </p>
            ) : null}

            {textIsLong ? (
              <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                This is longer than the current limit. Try the first page,
                summary, charges, deadline, or action-needed section.
              </p>
            ) : null}

            {sensitiveDetailMentioned ? (
              <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Quick reminder: if the pasted text includes sensitive details,
                remove them before submitting. This reminder does not block
                submission.
              </p>
            ) : null}
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
            {isLoading ? "Preparing explanation..." : "Explain it plainly"}
          </button>

          {isLoading ? (
            <p className="text-center text-sm text-slate-600">
              Reading the text and preparing a plain-English explanation. This
              may take a moment.
            </p>
          ) : null}
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
