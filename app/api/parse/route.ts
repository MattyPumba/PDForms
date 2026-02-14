import { NextResponse } from "next/server";
import { failure, success } from "@/lib/api/apiResponse";
import { parsePdfToDraftFields } from "@/lib/pdf/parsePdf";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(failure("Missing file (multipart field name must be 'file')."), { status: 400 });
    }

    const pdfBytes = new Uint8Array(await file.arrayBuffer());
    const fields = await parsePdfToDraftFields(pdfBytes);

    return NextResponse.json(success({ fields }));
  } catch (err: any) {
    return NextResponse.json(failure(err?.message ?? "Unknown server error."), { status: 500 });
  }
}
