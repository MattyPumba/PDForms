import type { PdfField } from "@/types/field";

/**
 * exportFilledPdf
 *
 * V1 intent:
 * - Accept original PDF bytes
 * - Accept form values keyed by field ID
 * - Stamp values onto the correct page + rect
 * - Return new PDF bytes
 *
 * Multi-page support is required.
 */
export async function exportFilledPdf(
  _originalPdfBytes: Uint8Array,
  _fields: PdfField[],
  _values: Record<string, string | boolean>
): Promise<Uint8Array> {
  // Implementation added later, step-by-step.
  return _originalPdfBytes;
}
