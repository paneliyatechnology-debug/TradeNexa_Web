"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { formatRfqStatus, quotationStatusClass } from "@/utils/rfqHelpers";

interface QuotationStatusBadgeProps {
  status?: string | null;
  className?: string;
}

export default function QuotationStatusBadge({ status, className = "" }: QuotationStatusBadgeProps) {
  const { t } = useLanguage();
  const label = formatRfqStatus(status, t);
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${quotationStatusClass(status)} ${className}`}
    >
      {label}
    </span>
  );
}
