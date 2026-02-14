import type { FieldType } from "@/types/field";

/**
 * inferFieldType
 *
 * V1 heuristic: guess a field type from its label.
 * This is deliberately simple and deterministic.
 */
export function inferFieldType(label: string): FieldType {
  const s = label.trim().toLowerCase();

  if (s.includes("email")) return "email";
  if (s.includes("date") || s.includes("dob") || s.includes("birth")) return "date";
  if (s.includes("phone") || s.includes("mobile")) return "text";
  if (s.includes("amount") || s.includes("$") || s.includes("total")) return "number";

  return "text";
}
