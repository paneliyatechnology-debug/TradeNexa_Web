import { formatRfqStatus, rfqStatusClass } from "@/utils/rfqHelpers";

interface RfqStatusBadgeProps {
  status?: string | null;
  className?: string;
}

export default function RfqStatusBadge({ status, className = "" }: RfqStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${rfqStatusClass(status)} ${className}`}
    >
      {formatRfqStatus(status)}
    </span>
  );
}
