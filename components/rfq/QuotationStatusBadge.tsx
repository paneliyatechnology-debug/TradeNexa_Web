import { formatRfqStatus, quotationStatusClass } from "@/utils/rfqHelpers";

interface QuotationStatusBadgeProps {
  status?: string | null;
  className?: string;
}

export default function QuotationStatusBadge({ status, className = "" }: QuotationStatusBadgeProps) {
  const label = formatRfqStatus(status);
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${quotationStatusClass(status)} ${className}`}
    >
      {label}
    </span>
  );
}
