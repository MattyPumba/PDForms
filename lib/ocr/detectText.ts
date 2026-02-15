import Tesseract from "tesseract.js";

/**
 * detectTextFromImage
 *
 * Runs OCR on a PNG/JPEG image buffer and returns
 * detected text items with bounding boxes.
 *
 * Output:
 * [
 *   { text: "First Name", x: number, y: number, width: number, height: number }
 * ]
 */
export async function detectTextFromImage(imageBuffer: Buffer) {
  // create worker with no args, cast to any to satisfy TS
  const worker: any = Tesseract.createWorker();

  // attach a logger manually (optional)
  worker.logger = (m: any) => console.log("Tesseract:", m);

  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");

  const { data } = await worker.recognize(imageBuffer);

  const results = data.words.map((w: any) => ({
    text: w.text,
    x: w.bbox.x0,
    y: w.bbox.y0,
    width: w.bbox.x1 - w.bbox.x0,
    height: w.bbox.y1 - w.bbox.y0,
  }));

  await worker.terminate();

  return results;
}
