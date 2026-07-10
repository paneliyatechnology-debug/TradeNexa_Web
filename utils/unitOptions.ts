export const RFQ_UNIT_OPTIONS = [
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "kg", label: "Kilograms (kg)" },
  { value: "tons", label: "Tons" },
  { value: "liters", label: "Liters" },
  { value: "meters", label: "Meters" },
  { value: "boxes", label: "Boxes" },
  { value: "units", label: "Units" },
] as const;

/** Include a saved/custom unit when editing an existing RFQ. */
export function getUnitOptions(currentUnit?: string) {
  const trimmed = currentUnit?.trim();
  if (trimmed && !RFQ_UNIT_OPTIONS.some((option) => option.value === trimmed)) {
    return [{ value: trimmed, label: trimmed }, ...RFQ_UNIT_OPTIONS];
  }
  return [...RFQ_UNIT_OPTIONS];
}
