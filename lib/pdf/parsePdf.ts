import type { PdfField } from "@/types/field";
import { PDFDocument } from "pdf-lib";

export class PdfLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfLoadError";
  }
}

/**
 * parsePdfToDraftFields
 *
 * V1 baseline:
 * - Attempt to load PDF (ignore encryption)
 * - If pdf-lib cannot parse it, throw a typed error
 */
export async function parsePdfToDraftFields(pdfBytes: Uint8Array): Promise<PdfField[]> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    // Confirm we can read pages (multi-page baseline)
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      pdfDoc.getPage(i);
    }

    return [];
  } catch (err: any) {
    throw new PdfLoadError(
      "This PDF could not be parsed. Try a different PDF (some are malformed, heavily protected, or use unsupported structures)."
    );
  }
}
