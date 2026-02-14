"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PdfField } from "@/types/field";
import type { PdfDocumentMeta } from "@/types/document";
import { extractPdfText } from "@/lib/client/extractPdfText";
import type { ApiResponse } from "@/lib/api/apiResponse";
import { FieldListByPage } from "@/components/fields/FieldListByPage";
import { setCurrentModel } from "@/lib/client/modelStore";
import type { FormModel } from "@/types/formModel";

type DetectApiData = {
  meta: PdfDocumentMeta;
  fields: PdfField[];
};

export function UploadForm() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<PdfField[] | null>(null);
  const [meta, setMeta] = useState<PdfDocumentMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleParse() {
    if (!file) return;

    setLoading(true);
    setError(null);
    setFields(null);
    setMeta(null);

    try {
      const extracted = await extractPdfText(file);

      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: extracted.text,
          pageCount: extracted.pageCount,
        }),
      });

      const json = (await res.json()) as ApiResponse<DetectApiData>;

      if (!json.ok) {
        setError(json.error);
        return;
      }

      setFields(json.data.fields);
      setMeta(json.data.meta);

      // Save as a FormModel for the Builder, including original PDF bytes
      const pdfBytes = new Uint8Array(await file.arrayBuffer());
      const model: FormModel = {
        id: crypto.randomUUID(),
        name: file.name.replace(/\.pdf$/i, ""),
        pageCount: json.data.meta.pageCount,
        fields: json.data.fields,
      };

      setCurrentModel(model, pdfBytes);

      // Redirect to builder
      router.push("/builder");
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error during extraction.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ marginTop: 20 }}>
      <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
        PDF file
      </label>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      {file && (
        <p style={{ marginTop: 12, opacity: 0.75 }}>
          Selected: <b>{file.name}</b> ({Math.round(file.size / 1024)} KB)
        </p>
      )}

      <div style={{ marginTop: 16 }}>
        <button
          onClick={handleParse}
          disabled={!file || loading}
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            background: "#111",
            color: "#fff",
            border: "none",
            cursor: file && !loading ? "pointer" : "not-allowed",
            opacity: file && !loading ? 1 : 0.6,
          }}
        >
          {loading ? "Extracting..." : "Extract + Detect → Builder"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 16 }}>
          <p style={{ color: "crimson", marginBottom: 8 }}>Error: {error}</p>
          <p style={{ opacity: 0.7, marginTop: 0 }}>
            Tip: Try “Print to PDF” to flatten/export and re-upload.
          </p>
        </div>
      )}

      {meta && (
        <p style={{ marginTop: 16, opacity: 0.8 }}>
          Pages detected: <b>{meta.pageCount}</b>
        </p>
      )}

      {fields && (
        <div style={{ marginTop: 20 }}>
          <h3>Detected Fields</h3>
          <p style={{ marginTop: 6, opacity: 0.7 }}>
            Note: coordinates + per-page placement is coming next (this is label-based detection).
          </p>

          <FieldListByPage fields={fields} />
        </div>
      )}
    </section>
  );
}
