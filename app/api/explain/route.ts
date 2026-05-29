import { NextResponse } from "next/server";

import { callPlainlyModel } from "@/lib/callGemma";
import { detectHighRisk } from "@/lib/detectHighRisk";
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

  let result: unknown;

  try {
    result = await callPlainlyModel({
      ...input,
      prompt,
    });
  } catch {
    return NextResponse.json(
      { error: "Plainly could not explain this document right now." },
      { status: 500 }
    );
  }

  const resultValidation = validatePlainlyResult(result);

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
