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
 * - TEMP: Attempt to extract *any* text by reading the raw PDF bytes as UTF-8
 *   and running label heuristics against it.
 *
 * This is a debugging bridge until we add a proper text extractor.
 */
export async function parsePdfToDraftFields(pdfBytes: Uint8Array): Promise<PdfField[]> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      pdfDoc.getPage(i);
    }

    // TEMP DEBUG EXTRACTION:
    // Many PDFs embed text as readable strings in the byte stream.
    // This is NOT a final approach, but lets us validate label detection quickly.
    const rawText = new TextDecoder("utf-8", { fatal: false }).decode(pdfBytes);

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
  } catch (_err: any) {
    throw new PdfLoadError(
      "This PDF could not be parsed. Try a different PDF (some are malformed, heavily protected, or use unsupported structures)."
    );
  }
}
