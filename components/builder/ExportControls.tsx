"use client";

import { useState } from "react";
import type { PdfField } from "@/types/field";
import { exportFilledPdf } from "@/lib/export/exportPdf";

type Props = {
  originalPdfBytes: Uint8Array;
  fields: PdfField[];
};

export function ExportControls({ originalPdfBytes, fields }: Props) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);

    // For V1 demo: fill each field with its label as value
    const values: Record<string, string | boolean> = {};
    fields.forEach((f) => (values[f.id] = f.label));

    const resultBytes = await exportFilledPdf(originalPdfBytes, fields, values);

    const blob = new Blob([resultBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "filled.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    setExporting(false);
  }

  return (
    <div style={{ marginTop: 24 }}>
      <button
        onClick={handleExport}
        disabled={exporting}
        style={{
          padding: "10px 16px",
          borderRadius: 6,
          background: "#111",
          color: "#fff",
          border: "none",
          cursor: exporting ? "not-allowed" : "pointer",
        }}
      >
        {exporting ? "Exporting..." : "Export PDF"}
      </button>
    </div>
  );
}
