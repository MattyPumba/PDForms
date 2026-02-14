"use client";

import type { PdfField } from "@/types/field";
import { FieldEditor } from "./FieldEditor";

type Props = {
  fields: PdfField[];
  onUpdate: (updated: PdfField) => void;
};

export function BuilderFieldList({ fields, onUpdate }: Props) {
  if (fields.length === 0) return <p style={{ opacity: 0.7 }}>No fields to edit.</p>;

  return (
    <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
      {fields.map((field) => (
        <FieldEditor key={field.id} field={field} onUpdate={onUpdate} />
      ))}
    </div>
  );
}
