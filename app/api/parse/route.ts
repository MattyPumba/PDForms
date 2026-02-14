import { NextResponse } from "next/server";
import { failure, success } from "@/lib/api/apiResponse";
import { parsePdfToDraftFields, PdfLoadError } from "@/lib/pdf/parsePdf";
import { pdfFieldListSchema } from "@/lib/schemas/pdfField";
import type { PdfDocumentMeta } from "@/types/document";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        failure("Missing file (multipart field name must be 'file')."),
        { status: 400 }
      );
    }

    const pdfBytes = new Uint8Array(await file.arrayBuffer());

    const fields = await parsePdfToDraftFields(pdfBytes);

    const parsed = pdfFieldListSchema.safeParse(fields);
    if (!parsed.success) {
      return NextResponse.json(
        failure("Parser returned invalid field data."),
        { status: 500 }
      );
    }

    const { PDFDocument } = await import("pdf-lib");
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    const meta: PdfDocumentMeta = {
      pageCount: pdfDoc.getPageCount(),
    };

    // TEMP DEBUG: show whether the raw stream has readable text at all
    const raw = new TextDecoder("utf-8", { fatal: false }).decode(pdfBytes);
    const sampleLines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 25);

    return NextResponse.json(
      success({
        fields: parsed.data,
        meta,
        debug: {
          fieldCount: parsed.data.length,
          sampleLines,
        },
      })
    );
  } catch (err: any) {
    if (err instanceof PdfLoadError) {
      return NextResponse.json(failure(err.message), { status: 400 });
    }

    return NextResponse.json(
      failure(err?.message ?? "Unknown server error."),
      { status: 500 }
    );
  }
}
