import type { PdfField } from "@/types/field";
import { detectLabels } from "@/lib/detect/detectLabels";
import { inferFieldType } from "@/lib/detect/inferFieldType";
import { renderPdfPageToImage } from "../pdf/renderPage";
import { detectTextFromImage } from "../ocr/detectText";

export class PdfLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfLoadError";
  }
}

/**
 * parsePdfToDraftFields
 *
 * V2: AI-assisted coordinates
 * - Renders each page to an image
 * - Runs Tesseract OCR to detect text + bounding boxes
 * - Matches detected labels with OCR boxes
 * - Populates PdfField.rect
 */
export async function parsePdfToDraftFields(pdfBytes: Uint8Array): Promise<PdfField[]> {
  try {
    const fields: PdfField[] = [];

    // Load PDF to get page count
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBytes);

    const pageCount = pdf.getPageCount();

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
      // Render page to image
      const pageImage = await renderPdfPageToImage(pdfBytes, pageIndex);

      // Run OCR
      const ocrResults = await detectTextFromImage(pageImage);

      // Extract plain labels from OCR text
      const labels = detectLabels(
        ocrResults.map((r: { text: string }) => r.text).join("\n")
      );

      for (const label of labels) {
        // Find OCR box with that text
        const match = ocrResults.find(
          (r: { text: string; x: number; y: number; width: number; height: number }) =>
            r.text.trim().toLowerCase() === label.trim().toLowerCase()
        );

        const rect = match
          ? { x: match.x, y: match.y, width: match.width, height: match.height }
          : { x: 50, y: 500, width: 200, height: 16 }; // fallback

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

    return fields;
  } catch (err: any) {
    throw new PdfLoadError(
      "This PDF could not be parsed. Try a different PDF (scanned forms or heavily structured PDFs may require AI-assisted detection)."
    );
  }
}
