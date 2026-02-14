"use client";

import { useState } from "react";
import type { PdfField, FieldType } from "@/types/field";

type Props = {
  field: PdfField;
  onUpdate: (updated: PdfField) => void;
};

const typeOptions: FieldType[] = ["text", "email", "number", "date", "checkbox"];

export function FieldEditor({ field, onUpdate }: Props) {
  const [label, setLabel] = useState(field.label);
  const [type, setType] = useState<FieldType>(field.type);
  const [required, setRequired] = useState(field.required);

  function handleChange() {
    onUpdate({
      ...field,
      label,
      type,
      required,
    });
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontWeight: 600 }}>Label: </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleChange}
          style={{ marginLeft: 8, width: "60%" }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ fontWeight: 600 }}>Type: </label>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as FieldType);
            handleChange();
          }}
          style={{ marginLeft: 8 }}
        >
          {typeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => {
              setRequired(e.target.checked);
              handleChange();
            }}
            style={{ marginRight: 6 }}
          />
          Required
        </label>
      </div>
    </div>
  );
}
