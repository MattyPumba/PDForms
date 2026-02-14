import type { PdfField } from "@/types/field";

type Props = {
  fields: PdfField[];
};

export function FieldListByPage({ fields }: Props) {
  const byPage = new Map<number, PdfField[]>();

  for (const f of fields) {
    const arr = byPage.get(f.page) ?? [];
    arr.push(f);
    byPage.set(f.page, arr);
  }

  const pages = Array.from(byPage.keys()).sort((a, b) => a - b);

  if (fields.length === 0) {
    return <p style={{ opacity: 0.7 }}>No fields detected yet.</p>;
  }

  return (
    <div style={{ marginTop: 12, display: "grid", gap: 16 }}>
      {pages.map((page) => (
        <section
          key={page}
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 10,
            padding: 12,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Page {page + 1}
          </div>

          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {byPage.get(page)!.map((f) => (
              <li key={f.id}>
                {f.label} (type: {f.type})
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
