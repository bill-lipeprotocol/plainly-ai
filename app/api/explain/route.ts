import { NextResponse } from "next/server";

import {
  callPlainlyModel,
  ExplainProviderConfigurationError,
} from "@/lib/callGemma";
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
  } catch (error) {
    if (error instanceof ExplainProviderConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    return NextResponse.json(
      {
        error:
          "The live explanation service could not process this document right now.",
      },
      { status: 502 }
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
