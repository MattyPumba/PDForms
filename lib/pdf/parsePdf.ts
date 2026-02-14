import type { PdfField } from "@/types/field";

/**
 * parsePdfToDraftFields
 *
 * V1 intent:
 * - Accept PDF bytes
 * - Extract text/layout per page
 * - Run heuristics to produce draft fields (label/type/page/rect)
 *
 * Note: Multi-page is first-class, so returned fields must include `page`.
 */
export async function parsePdfToDraftFields(_pdfBytes: Uint8Array): Promise<PdfField[]> {
  // Step-by-step: implemented later. For now, keep boundary stable.
  return [];
}
