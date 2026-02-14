"use client";

import { useState } from "react";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);

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

      <p style={{ marginTop: 16, opacity: 0.7 }}>
        Next step: POST this file to <code>/api/parse</code> and show detected fields.
      </p>
    </section>
  );
}
