import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { PdfField } from "@/types/field";

/**
 * exportFilledPdf
 *
 * V1 implementation:
 * - Accepts original PDF bytes
 * - Accepts fields and values keyed by field ID
 * - Stamps values at the placeholder rects (currently uses rects; future AI can adjust)
 */
export async function exportFilledPdf(
  originalPdfBytes: Uint8Array,
  fields: PdfField[],
  values: Record<string, string | boolean>
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const field of fields) {
    const value = values[field.id];
    if (value === undefined) continue;

    const page = pdfDoc.getPage(field.page);
    const text = String(value);

    // Use rect coordinates if available; fallback if 0
    const { x, y, width, height } = field.rect;
    const fontSize = Math.min(12, height || 12);

    page.drawText(text, {
      x: x || 50,
      y: y || 500,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
      maxWidth: width || 300,
    });
  }

  const bytes = await pdfDoc.save();
  return bytes;
}
