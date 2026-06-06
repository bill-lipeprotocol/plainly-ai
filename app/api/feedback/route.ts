import { NextResponse } from "next/server";

import { validatePlainlyFeedback } from "@/lib/plainlySchema";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Please send valid feedback." },
      { status: 400 }
    );
  }

  const validation = validatePlainlyFeedback(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  console.info("plainly_feedback", JSON.stringify(validation.data));

  return NextResponse.json({ ok: true });
}
