import { PDFDocument } from "pdf-lib";
import { createCanvas } from "canvas";

/**
 * renderPdfPageToImage
 *
 * Renders a single PDF page to a PNG buffer for OCR/AI detection.
 * @param pdfBytes - original PDF bytes
 * @param pageIndex - zero-based page number
 */
export async function renderPdfPageToImage(pdfBytes: Uint8Array, pageIndex: number): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const page = pdfDoc.getPage(pageIndex);

  const { width, height } = page.getSize();

  // Create a canvas matching page size (1pt ~ 1px for V1)
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // For now, we fill white background (PDF drawing comes later)
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  // TODO: render page contents here with pdf-lib / or headless PDF.js if needed

  return canvas.toBuffer("image/png");
}
