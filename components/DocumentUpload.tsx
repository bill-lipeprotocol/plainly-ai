"use client";

import { useRef, useState } from "react";

type ExtractionResponse = {
  text?: string;
  sourceName?: string;
  method?: string;
  truncated?: boolean;
  error?: string;
};

type DocumentUploadProps = {
  onTextExtracted: (text: string) => void;
};

export function DocumentUpload({ onTextExtracted }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [googleDocUrl, setGoogleDocUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function extractFile(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    await runExtraction(formData, file.name);
  }

  async function extractGoogleDoc() {
    const formData = new FormData();
    formData.set("googleDocUrl", googleDocUrl);
    await runExtraction(formData, "Google Doc");
  }

  async function runExtraction(formData: FormData, pendingName: string) {
    setIsExtracting(true);
    setIsError(false);
    setMessage(`Reading ${pendingName}...`);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as ExtractionResponse;

      if (!response.ok || !data.text) {
        throw new Error(data.error || "Plainly could not read this document.");
      }

      onTextExtracted(data.text);
      setMessage(
        `${data.sourceName || pendingName} is ready to review${
          data.truncated ? " (trimmed to the 12,000 character limit)" : ""
        }.`
      );
      setGoogleDocUrl("");
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Plainly could not read this document."
      );
    } finally {
      setIsExtracting(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="mb-6 border-2 border-black bg-[#f4f1e8] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-sm font-extrabold uppercase tracking-wider">
            Start with a file
          </p>
          <p className="mt-1 text-xs leading-5 text-black/55">
            TXT, DOCX, PDF, PNG, JPG, or WEBP. Maximum 4 MB. Images and scanned
            PDF pages use AI transcription.
          </p>
        </div>
        <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold">
          Optional
        </span>
      </div>

      <button
        type="button"
        disabled={isExtracting}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) void extractFile(file);
        }}
        className={`mt-4 flex w-full flex-col items-center border-2 border-dashed border-black px-4 py-6 text-center transition focus-visible:outline-2 focus-visible:outline-offset-4 ${
          isDragging ? "bg-[var(--lime)]" : "bg-white hover:bg-[var(--lime)]"
        }`}
      >
        <span className="font-display font-extrabold">
          {isExtracting ? "Reading document..." : "Drop a document here"}
        </span>
        <span className="mt-1 text-xs text-black/50">
          or click to choose a file
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept=".txt,.md,.csv,.docx,.pdf,image/jpeg,image/png,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void extractFile(file);
        }}
      />

      <div className="my-4 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-black/35">
        <span className="h-px flex-1 bg-black/20" />
        or import a public Google Doc
        <span className="h-px flex-1 bg-black/20" />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={googleDocUrl}
          disabled={isExtracting}
          onChange={(event) => setGoogleDocUrl(event.target.value)}
          placeholder="https://docs.google.com/document/d/..."
          aria-label="Public Google Docs sharing link"
          className="min-w-0 flex-1 border-2 border-black bg-white px-3 py-2.5 text-sm outline-none focus:shadow-[3px_3px_0_var(--lime)]"
        />
        <button
          type="button"
          disabled={isExtracting || !googleDocUrl.trim()}
          onClick={() => void extractGoogleDoc()}
          className="border-2 border-black bg-black px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--violet)] disabled:opacity-40"
        >
          Import
        </button>
      </div>

      {message ? (
        <p
          role={isError ? "alert" : undefined}
          aria-live="polite"
          className={`mt-3 border-l-4 p-3 text-sm ${
            isError
              ? "border-red-700 bg-red-50 text-red-900"
              : "border-[var(--violet)] bg-white"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
