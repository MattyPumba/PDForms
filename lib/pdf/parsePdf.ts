import type { PdfField } from "@/types/field";
import { detectLabels } from "@/lib/detect/detectLabels";
import { inferFieldType } from "@/lib/detect/inferFieldType";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

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
 * - Use PDF.js to extract text content (handles FlateDecode streams)
 * - Run label detection on extracted text
 *
 * Still no coordinates yet.
 */
export async function parsePdfToDraftFields(pdfBytes: Uint8Array): Promise<PdfField[]> {
  try {
    const lib: any = pdfjsLib;

    // Worker served from /public
    lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const loadingTask = lib.getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;

    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const strings = (content.items ?? [])
        .map((it: any) => (typeof it.str === "string" ? it.str : ""))
        .filter(Boolean);

      pageTexts.push(strings.join("\n"));
    }

    const extractedText = pageTexts.join("\n");

    const labels = detectLabels(extractedText);

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
