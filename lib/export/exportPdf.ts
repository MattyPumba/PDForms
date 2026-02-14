import type { PdfField } from "@/types/field";

/**
 * exportFilledPdf
 *
 * V1 stub:
 * - Accept original PDF bytes
 * - Accept form values keyed by field ID
 * - Stamp values onto PDF (coordinates currently placeholder)
 * - Return new PDF bytes
 *
 * Multi-page support included.
 */
export async function exportFilledPdf(
  _originalPdfBytes: Uint8Array,
  _fields: PdfField[],
  _values: Record<string, string | boolean>
): Promise<Uint8Array> {
  // Implementation added step-by-step
  return _originalPdfBytes;
}
