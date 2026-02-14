"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormModel } from "@/types/formModel";
import { getCurrentModel } from "@/lib/client/modelStore";
import { FieldListByPage } from "@/components/fields/FieldListByPage";

export default function BuilderPage() {
  const [model, setModel] = useState<FormModel | null>(null);

  useEffect(() => {
    setModel(getCurrentModel());
  }, []);

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
            <h3>Current Fields</h3>
            <p style={{ marginTop: 6, opacity: 0.7 }}>
              Next step: add editing controls (rename/type/required) per field.
            </p>

            <FieldListByPage fields={model.fields} />
          </div>
        </>
      )}
    </main>
  );
}
