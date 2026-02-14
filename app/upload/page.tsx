export default function UploadPage() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Upload</h1>
      <p>Upload a PDF to generate a draft form model.</p>

      <p style={{ marginTop: 24, opacity: 0.7 }}>
        (UI coming next step: file picker + call to <code>/api/parse</code>)
      </p>
    </main>
  );
}
