import { NextResponse } from "next/server";

import { detectHighRisk } from "@/lib/detectHighRisk";
import { mockResult } from "@/lib/mockResult";
import { buildPlainlyPrompt } from "@/lib/plainlyPrompt";
import {
  validatePlainlyExplainRequest,
  validatePlainlyResult,
} from "@/lib/plainlySchema";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Please send valid document text for Plainly to explain." },
      { status: 400 }
    );
  }

  const requestValidation = validatePlainlyExplainRequest(body);

  if (!requestValidation.success) {
    return NextResponse.json(
      { error: requestValidation.error },
      { status: 400 }
    );
  }

  const input = requestValidation.data;
  const prompt = buildPlainlyPrompt(input);
  void prompt;

  const resultValidation = validatePlainlyResult(mockResult);

  if (!resultValidation.success) {
    return NextResponse.json(
      { error: resultValidation.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    result: resultValidation.data,
    showHighRiskAlert: detectHighRisk(input.documentText),
  });
}
