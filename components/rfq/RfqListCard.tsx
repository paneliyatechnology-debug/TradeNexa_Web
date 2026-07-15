"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin, MessageSquare, Package, Users } from "lucide-react";
import type { ApiRfqListItem } from "@/types/rfq";
import {
  formatRfqDate,
  formatRfqDeadlineUrgency,
  formatRfqLocation,
  formatRfqQuantity,
  formatRfqQuoteCount,
  formatSellerCompetitionCount,
  isRfqDeadlineUrgent,
  shouldShowRfqStatusBadge,
} from "@/utils/rfqHelpers";
import RfqStatusBadge from "@/components/rfq/RfqStatusBadge";

interface RfqListCardProps {
  rfq: ApiRfqListItem;
  href: string;
  variant?: "buyer" | "seller";
  meta?: string;
}

export default function RfqListCard({ rfq, href, variant = "buyer", meta }: RfqListCardProps) {
  const isSeller = variant === "seller";
  const quantity = formatRfqQuantity(rfq);
  const location = formatRfqLocation(rfq);
  const deadlineUrgency = formatRfqDeadlineUrgency(rfq.quotation_deadline);
  const deadlineUrgent = isRfqDeadlineUrgent(rfq.quotation_deadline);
  const showStatus = shouldShowRfqStatusBadge(rfq.status, variant);
  const hasQuotes = rfq.quotations_count != null && rfq.quotations_count > 0;

  const companyLine = isSeller
    ? meta?.trim() || rfq.buyer_company?.trim() || null
    : null;
  const categoryLine =
    [rfq.category_name, rfq.subcategory_name].filter(Boolean).join(" · ") || null;
  const subtitle = [companyLine, categoryLine].filter(Boolean).join(" · ") || null;

  const showUrgentChip = deadlineUrgent && Boolean(deadlineUrgency);
  const showCalmDeadline = !deadlineUrgent && Boolean(deadlineUrgency);

  return (
    <article className="group surface-card-hover flex h-full flex-col overflow-hidden">
      <Link
        href={href}
        aria-label={rfq.title}
        className="flex flex-col gap-2.5 p-4 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
              {rfq.title}
            </p>
            {subtitle ? (
              <p className="mt-1 truncate text-xs text-muted-fg">{subtitle}</p>
            ) : null}
          </div>
          {showStatus ? <RfqStatusBadge status={rfq.status} className="shrink-0" /> : null}
        </div>

        {showUrgentChip || hasQuotes ? (
          <div className="flex flex-wrap items-center gap-2">
            {showUrgentChip ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-warning-soft px-2 py-1 text-xs font-semibold text-warning">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {deadlineUrgency}
              </span>
            ) : null}
            {hasQuotes ? (
              isSeller ? (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-fg">
                  <Users className="h-3.5 w-3.5" aria-hidden />
                  {formatSellerCompetitionCount(rfq.quotations_count)}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-soft px-2 py-1 text-xs font-semibold text-primary">
                  <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                  {formatRfqQuoteCount(rfq.quotations_count)}
                </span>
              )
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-fg">
          {quantity ? (
            <span className="inline-flex items-center gap-1">
              <Package className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {quantity}
            </span>
          ) : null}
          <span className="inline-flex min-w-0 max-w-[40%] items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{location}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {formatRfqDate(rfq.created_at)}
          </span>
          {showCalmDeadline ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {deadlineUrgency}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="mt-auto border-t border-border px-4 pb-4 pt-3 sm:px-5">
        <Link
          href={href}
          className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-[var(--shadow-button)] transition-all duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 active:scale-[0.98]"
        >
          {isSeller ? "View & Quote" : "View RFQ & Quotes"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
