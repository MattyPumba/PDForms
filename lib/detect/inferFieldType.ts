import type { FieldType } from "@/types/field";

/**
 * inferFieldType
 *
 * V1 heuristic: guess a field type from its label.
 * Simple, deterministic rules.
 */
export function inferFieldType(label: string): FieldType {
  const s = label.trim().toLowerCase();

  const normalized = s.replace(/\./g, "").replace(/\s+/g, " ").trim(); // "d.o.b" -> "dob"

  if (normalized.includes("email")) return "email";
  if (normalized.includes("dob") || normalized.includes("date of birth")) return "date";
  if (normalized.includes("date")) return "date";

  if (normalized.includes("amount") || normalized.includes("total") || normalized.includes("$")) return "number";

  // phone is typically text in v1 (formatting varies)
  if (normalized.includes("phone") || normalized.includes("mobile")) return "text";

  return "text";
}
