export const RFQ_UNIT_OPTIONS = [
  { value: "pcs", labelKey: "units.pcs", label: "Pieces (pcs)" },
  { value: "kg", labelKey: "units.kg", label: "Kilograms (kg)" },
  { value: "tons", labelKey: "units.tons", label: "Tons" },
  { value: "liters", labelKey: "units.liters", label: "Liters" },
  { value: "meters", labelKey: "units.meters", label: "Meters" },
  { value: "boxes", labelKey: "units.boxes", label: "Boxes" },
  { value: "units", labelKey: "units.units", label: "Units" },
] as const;

/** Include a saved/custom unit when editing an existing RFQ. */
export function getUnitOptions(
  currentUnit?: string,
  t?: (key: string, defaultText?: string) => string
) {
  const trimmed = currentUnit?.trim();
  const base = RFQ_UNIT_OPTIONS.map((opt) => ({
    value: opt.value,
    label: t ? t(opt.labelKey, opt.label) : opt.label,
  }));
  if (trimmed && !RFQ_UNIT_OPTIONS.some((option) => option.value === trimmed)) {
    return [{ value: trimmed, label: trimmed }, ...base];
  }
  return base;
}

