"use client";

import type { FormModel } from "@/types/formModel";

let currentModel: FormModel | null = null;
let currentPdfBytes: Uint8Array | null = null;

export function setCurrentModel(model: FormModel, pdfBytes?: Uint8Array) {
  currentModel = model;
  if (pdfBytes) currentPdfBytes = pdfBytes;
}

export function getCurrentModel(): FormModel | null {
  return currentModel;
}

export function getCurrentPdfBytes(): Uint8Array | null {
  return currentPdfBytes;
}

export function clearCurrentModel() {
  currentModel = null;
  currentPdfBytes = null;
}
