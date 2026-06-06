import { NextResponse } from "next/server";

import {
  extractPublicGoogleDoc,
  extractUploadedFile,
} from "@/lib/documentExtraction";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Send a supported file or Google Docs link." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  const googleDocUrl = formData.get("googleDocUrl");

  try {
    const result =
      file instanceof File
        ? await extractUploadedFile(file)
        : typeof googleDocUrl === "string" && googleDocUrl.trim()
          ? await extractPublicGoogleDoc(googleDocUrl.trim())
          : null;

    if (!result) {
      return NextResponse.json(
        { error: "Choose a supported file or enter a Google Docs link." },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Plainly could not read this document.",
      },
      { status: 400 }
    );
  }
}
