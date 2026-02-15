"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormModel } from "@/types/formModel";
import { getCurrentModel, getCurrentPdfBytes, setCurrentModel } from "@/lib/client/modelStore";
import { BuilderFieldList } from "@/components/builder/BuilderFieldList";
import { ExportControls } from "@/components/builder/ExportControls";

export default function BuilderPage() {
  const [model, setModel] = useState<FormModel | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);

  useEffect(() => {
    const m = getCurrentModel();
    setModel(m);
    const bytes = getCurrentPdfBytes();
    if (bytes) setPdfBytes(bytes);
  }, []);

  function handleFieldUpdate(updatedField: any) {
    if (!model) return;

    const updatedFields = model.fields.map((f) =>
      f.id === updatedField.id ? updatedField : f
    );

    const updatedModel = { ...model, fields: updatedFields };
    setModel(updatedModel);
    setCurrentModel(updatedModel, pdfBytes ?? undefined);
  }

  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Builder</h1>

      {!model && (
        <div style={{ marginTop: 16 }}>
          <p style={{ color: "crimson" }}>
            No active model found. Please upload a PDF first.
          </p>
          <Link href="/upload">Go to Upload →</Link>
        </div>
      )}

      {model && (
        <>
          <p style={{ marginTop: 8, opacity: 0.8 }}>
            Editing model: <b>{model.name}</b> • pages: <b>{model.pageCount}</b>
          </p>

          <div style={{ marginTop: 20 }}>
            <h3>Fields</h3>
            <p style={{ marginTop: 6, opacity: 0.7 }}>
              Click each field to rename, change type, or toggle required.
            </p>

            <BuilderFieldList
              fields={model.fields}
              onUpdate={handleFieldUpdate}
            />

            {pdfBytes && (
              <ExportControls originalPdfBytes={pdfBytes} fields={model.fields} />
            )}
          </div>
        </>
      )}
    </main>
  );
}
