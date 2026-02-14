import type { PdfField } from "./field";

export interface FormModel {
  id: string;
  name: string;
  pageCount: number;
  fields: PdfField[];
}
