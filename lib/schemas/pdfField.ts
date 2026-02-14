import { z } from "zod";

export const fieldTypeSchema = z.enum([
  "text",
  "email",
  "number",
  "date",
  "checkbox",
]);

export const pdfRectSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().finite().nonnegative(),
  height: z.number().finite().nonnegative(),
});

export const pdfFieldSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: fieldTypeSchema,
  required: z.boolean(),
  page: z.number().int().nonnegative(),
  rect: pdfRectSchema,
});

export const pdfFieldListSchema = z.array(pdfFieldSchema);
