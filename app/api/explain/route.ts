import { NextResponse } from "next/server";

import { detectHighRisk } from "@/lib/detectHighRisk";
import { mockResult } from "@/lib/mockResult";

type ExplainRequestBody = {
  documentType?: unknown;
  userQuestion?: unknown;
  documentText?: unknown;
};

export async function POST(request: Request) {
  let body: ExplainRequestBody;

  try {
    body = (await request.json()) as ExplainRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Please send valid document text for Plainly to explain." },
      { status: 400 }
    );
  }

  const documentType =
    typeof body.documentType === "string" ? body.documentType : "";
  const documentText =
    typeof body.documentText === "string" ? body.documentText : "";

  if (!documentType.trim()) {
    return NextResponse.json(
      { error: 'Please choose a document type, or select "Other / not sure."' },
      { status: 400 }
    );
  }

  if (documentText.trim().length < 100) {
    return NextResponse.json(
      {
        error:
          "Please paste more of the document so Plainly has enough context to explain it.",
      },
      { status: 400 }
    );
  }

  if (documentText.length > 12000) {
    return NextResponse.json(
      {
        error:
          "This document is too long for the first version. Please paste the most important section, such as the first page, summary, charges, or deadline notice.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    result: mockResult,
    showHighRiskAlert: detectHighRisk(documentText),
  });
}
