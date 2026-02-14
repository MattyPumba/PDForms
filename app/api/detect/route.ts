import { NextResponse } from "next/server";
import { failure, success } from "@/lib/api/apiResponse";
import { detectLabels } from "@/lib/detect/detectLabels";
import { inferFieldType } from "@/lib/detect/inferFieldType";
import { pdfFieldListSchema } from "@/lib/schemas/pdfField";
import type { PdfField } from "@/types/field";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const text = typeof body?.text === "string" ? body.text : "";
    const pageCount = Number.isInteger(body?.pageCount) ? body.pageCount : 0;

    if (!text || pageCount <= 0) {
      return NextResponse.json(
        failure("Missing or invalid 'text' / 'pageCount' in request body."),
        { status: 400 }
      );
    }

    const labels = detectLabels(text);

    const fields: PdfField[] = labels.map((label) => ({
      id: crypto.randomUUID(),
      label,
      type: inferFieldType(label),
      required: false,
      page: 0,
      rect: { x: 0, y: 0, width: 0, height: 0 },
    }));

    const parsed = pdfFieldListSchema.safeParse(fields);
    if (!parsed.success) {
      return NextResponse.json(failure("Detector produced invalid fields."), { status: 500 });
    }

    return NextResponse.json(
      success({
        meta: { pageCount },
        fields: parsed.data,
      })
    );
  } catch (err: any) {
    return NextResponse.json(failure(err?.message ?? "Unknown server error."), { status: 500 });
  }
}
