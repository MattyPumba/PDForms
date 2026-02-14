"use client";

import type { FormModel } from "@/types/formModel";

let currentModel: FormModel | null = null;

/**
 * Temporary in-memory store for V1.
 * This is enough for a demo and keeps scaffolding clean.
 * (Later we can replace with URL state, localStorage, or DB.)
 */
export function setCurrentModel(model: FormModel) {
  currentModel = model;
}

export function getCurrentModel(): FormModel | null {
  return currentModel;
}

export function clearCurrentModel() {
  currentModel = null;
}
