"use client";

import { useState, useEffect } from "react";
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
  const [value, setValue] = useState<string | boolean>("");

  // Initialize boolean for checkbox
  useEffect(() => {
    if (type === "checkbox") {
      setValue(false);
    } else {
      setValue("");
    }
  }, [type]);

  function handleChange() {
    onUpdate({
      ...field,
      label,
      type,
      required,
      value,
    } as any);
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

      <div style={{ marginBottom: 8 }}>
        <label style={{ fontWeight: 600 }}>Value: </label>
        {type === "checkbox" ? (
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => {
              setValue(e.target.checked);
              handleChange();
            }}
            style={{ marginLeft: 6 }}
          />
        ) : (
          <input
            type={type === "date" ? "date" : "text"}
            value={value as string}
            onChange={(e) => {
              setValue(e.target.value);
              handleChange();
            }}
            style={{ marginLeft: 8, width: "50%" }}
          />
        )}
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
