/**
 * detectLabels
 *
 * V1 heuristic: find likely field labels in extracted text by looking for:
 * - "Label:" patterns
 * - lines ending with ":" (common in forms)
 *
 * This returns labels only (no coordinates yet).
 */
export function detectLabels(text: string): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const labels: string[] = [];

  for (const line of lines) {
    // Keep it conservative: short-ish lines that look like labels
    const looksLikeLabel =
      line.endsWith(":") &&
      line.length >= 2 &&
      line.length <= 60 &&
      !line.includes("http") &&
      !/\d{3,}/.test(line);

    if (looksLikeLabel) {
      labels.push(line.replace(/:$/, "").trim());
      continue;
    }

    // Also capture "Label: value" patterns (we keep label part)
    const m = line.match(/^(.{2,60}?):\s+.+$/);
    if (m) {
      const label = m[1].trim();
      if (!label.includes("http") && !/\d{3,}/.test(label)) {
        labels.push(label);
      }
    }
  }

  // Deduplicate while preserving order
  const seen = new Set<string>();
  return labels.filter((l) => {
    const key = l.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
