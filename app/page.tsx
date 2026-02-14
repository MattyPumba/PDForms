import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>PDForms</h1>
      <p>
        A web app that converts PDFs into editable form models,
        then re-exports them back to PDF.
      </p>

      <div style={{ marginTop: 32 }}>
        <Link
          href="/upload"
          style={{
            display: "inline-block",
            padding: "10px 16px",
            background: "#111",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none"
          }}
        >
          Upload a PDF
        </Link>
      </div>

      <p style={{ marginTop: 32, opacity: 0.6 }}>
        Status: Scaffold ready.
      </p>
    </main>
  );
}
