import Link from "next/link";
import { UploadForm } from "@/components/upload/UploadForm";

export default function UploadPage() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Upload</h1>
      <p>Upload a PDF to generate a draft form model.</p>

      <UploadForm />

      <div style={{ marginTop: 28 }}>
        <Link href="/builder" style={{ opacity: 0.8 }}>
          Go to Builder →
        </Link>
      </div>
    </main>
  );
}
