export type FieldType =
  | "text"
  | "email"
  | "number"
  | "date"
  | "checkbox";

export interface PdfRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PdfField {
  id: string;              // Stable unique ID
  label: string;           // Display label
  type: FieldType;         // Input type
  required: boolean;       // Validation rule
  page: number;            // 0-based page index
  rect: PdfRect;           // Bounding box in PDF coordinate space
}
