"use client";

import * as pdfjsLib from "pdfjs-dist";

let workerConfigured = false;

/**
 * extractPdfText
 *
 * Runs PDF.js in the browser (client-side), which avoids Next/Vercel server bundling issues.
 * Requires the worker file to exist at: /public/pdf.worker.min.mjs
 */
export async function extractPdfText(file: File): Promise<{ pageCount: number; text: string }> {
  if (!workerConfigured) {
    // Served from /public (you already copied it there)
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    workerConfigured = true;
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const loadingTask = (pdfjsLib as any).getDocument({ data: bytes });
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

  return {
    pageCount: pdf.numPages,
    text: pageTexts.join("\n"),
  };
}
