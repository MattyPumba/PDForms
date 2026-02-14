import { UploadForm } from "@/components/upload/UploadForm";

export default function UploadPage() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Upload</h1>
      <p>Upload a PDF to generate a draft form model.</p>

      <UploadForm />
    </main>
  );
}
