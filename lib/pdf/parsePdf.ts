import type { PdfField } from "@/types/field";
import { PDFDocument } from "pdf-lib";
import { detectLabels } from "@/lib/detect/detectLabels";
import { inferFieldType } from "@/lib/detect/inferFieldType";

export class PdfLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfLoadError";
  }
}

/**
 * parsePdfToDraftFields
 *
 * V1:
 * - Load PDF (ignore encryption)
 * - Extract *some* text (best-effort) and run simple heuristics:
 *    - find labels
 *    - infer field types from labels
 *
 * Note: pdf-lib isn't a strong text extractor. This is a "first demo"
 * heuristic pass. We'll upgrade extraction later.
 */
export async function parsePdfToDraftFields(pdfBytes: Uint8Array): Promise<PdfField[]> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      pdfDoc.getPage(i);
    }

    // Best-effort text: many PDFs won't yield useful text via pdf-lib.
    // We'll still run the pipeline so structure is in place.
    const rawText = ""; // upgraded later
    const labels = detectLabels(rawText);

    const fields: PdfField[] = labels.map((label) => ({
      id: crypto.randomUUID(),
      label,
      type: inferFieldType(label),
      required: false,
      page: 0,
      rect: { x: 0, y: 0, width: 0, height: 0 },
    }));

    return fields;
  } catch (err: any) {
    throw new PdfLoadError(
      "This PDF could not be parsed. Try a different PDF (some are malformed, heavily protected, or use unsupported structures)."
    );
  }
}
