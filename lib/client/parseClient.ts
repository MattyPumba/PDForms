import type { PdfField } from "@/types/field";
import type { PdfDocumentMeta } from "@/types/document";
import type { ApiResponse } from "@/lib/api/apiResponse";

export type ParseApiData = {
  fields: PdfField[];
  meta: PdfDocumentMeta;
};

export async function parsePdfFile(file: File): Promise<ApiResponse<ParseApiData>> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/parse", {
    method: "POST",
    body: formData,
  });

  return (await res.json()) as ApiResponse<ParseApiData>;
}
