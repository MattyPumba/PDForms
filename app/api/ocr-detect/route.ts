import { NextResponse } from "next/server";
import { PdfLoadError } from "@/lib/pdf/parsePdf";
import { renderPdfPageToImage } from "@/lib/pdf/renderPage";
import { detectTextFromImage } from "@/lib/ocr/detectText";
import { detectLabels } from "@/lib/detect/detectLabels";
import { inferFieldType } from "@/lib/detect/inferFieldType";
import type { PdfField } from "@/types/field";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Missing file (multipart field name must be 'file')." },
        { status: 400 }
      );
    }

    const pdfBytes = new Uint8Array(await file.arrayBuffer());

    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pageCount = pdf.getPageCount();

    const fields: PdfField[] = [];

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
      // Render page to image
      const pageImage = await renderPdfPageToImage(pdfBytes, pageIndex);

      // Run OCR
      const ocrResults = await detectTextFromImage(pageImage);

      // Detect labels
      const labels = detectLabels(ocrResults.map((r: any) => r.text).join("\n"));

      for (const label of labels) {
        const match = ocrResults.find(
          (r: any) => r.text.trim().toLowerCase() === label.trim().toLowerCase()
        );
        const rect = match
          ? { x: match.x, y: match.y, width: match.width, height: match.height }
          : { x: 50, y: 500, width: 200, height: 16 };

        fields.push({
          id: crypto.randomUUID(),
          label,
          type: inferFieldType(label),
          required: false,
          page: pageIndex,
          rect,
        });
      }
    }

    return NextResponse.json({ ok: true, fields, meta: { pageCount } });
  } catch (err: any) {
    console.error(err);
    const msg = err instanceof PdfLoadError ? err.message : "Unknown OCR error.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
