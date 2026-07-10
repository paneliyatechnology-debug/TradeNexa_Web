"use client";

import React, { useState } from "react";
import type { ApiQuotation } from "@/types/rfq";
import { formatPrice } from "@/utils/catalogHelpers";
import {
  computeQuotationTotalWithGst,
  formatRfqDate,
  getBuyerRevisionRemarks,
  getQuotationStatusHint,
  getSellerRevisionStatusHint,
  isQuotationInactiveForBuyer,
  isQuotationRevisionPending,
} from "@/utils/rfqHelpers";
import QuotationStatusBadge from "@/components/rfq/QuotationStatusBadge";

interface QuotationCardProps {
  quotation: ApiQuotation;
  actions?: React.ReactNode;
  /** When false, shows "Your quotation" instead of seller identity. */
  showSellerInfo?: boolean;
  /** When true, shows RFQ product/title instead of seller identity (seller list view). */
  showProductName?: boolean;
  /** Dim inactive quotes and show status explanation (buyer view). */
  emphasizeStatus?: boolean;
  /** RFQ status helps detect negotiation when quotation status is still "Submitted". */
  rfqStatus?: string | null;
}

export default function QuotationCard({
  quotation,
  actions,
  showSellerInfo = true,
  showProductName = false,
  emphasizeStatus = false,
  rfqStatus,
}: QuotationCardProps) {
  const [showRemarks, setShowRemarks] = useState(false);
  const inactive = emphasizeStatus && isQuotationInactiveForBuyer(quotation.status);
  const statusHint = emphasizeStatus ? getQuotationStatusHint(quotation.status) : null;
  const sellerRevisionHint = !showSellerInfo ? getSellerRevisionStatusHint(quotation, rfqStatus) : null;
  const buyerRevisionRemarks = !showSellerInfo ? getBuyerRevisionRemarks(quotation, rfqStatus) : null;
  const revisionPending = isQuotationRevisionPending(quotation, rfqStatus);
  const totals = computeQuotationTotalWithGst(quotation);

  const company = quotation.seller_company?.trim();
  const contact = quotation.seller_name?.trim();
  const sellerPrimary = company || contact || "Seller";
  const sellerSecondary = company && contact ? contact : null;
  const productPrimary =
    quotation.product_name?.trim() || quotation.rfq_title?.trim() || "Quotation";

  return (
    <article
      className={`rounded-2xl border p-4 sm:p-5 ${
        inactive
          ? "border-[#E0E6ED] bg-[#FAFBFC] opacity-80"
          : "border-[#E8ECF0] bg-white shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {showProductName ? (
            <p
              className={`truncate text-base font-extrabold sm:text-lg ${
                inactive ? "text-[#546E7A]" : "text-[#0D1B2A]"
              }`}
            >
              {productPrimary}
            </p>
          ) : showSellerInfo ? (
            <>
              <p
                className={`truncate text-base font-extrabold sm:text-lg ${
                  inactive ? "text-[#546E7A]" : "text-[#0D1B2A]"
                }`}
              >
                {sellerPrimary}
              </p>
              {sellerSecondary ? (
                <p className="mt-0.5 truncate text-xs font-medium text-[#90A4AE]">
                  Contact: {sellerSecondary}
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-base font-extrabold text-[#0D1B2A]">Your quotation</p>
          )}
        </div>
        <QuotationStatusBadge status={quotation.status} className="shrink-0" />
      </div>

      {totals ? (
        <div
          className={`mt-4 rounded-xl px-4 py-3 ${
            inactive ? "bg-[#F4F6F9]" : "bg-[#E3F2FD]/60"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#90A4AE]">Estimated total</p>
          <p className={`mt-0.5 text-xl font-extrabold ${inactive ? "text-[#546E7A]" : "text-[#1565C0]"}`}>
            {formatPrice(totals.total, quotation.currency)}
          </p>
          <p className="mt-1 text-xs text-[#546E7A]">
            {quotation.price != null && quotation.quantity != null
              ? `${formatPrice(quotation.price, quotation.currency)} × ${quotation.quantity} ${quotation.unit ?? ""}`.trim()
              : null}
            {quotation.gst_percentage != null ? ` + ${quotation.gst_percentage}% GST` : null}
            {quotation.transportation_charge != null && quotation.transportation_charge > 0
              ? ` + ${formatPrice(quotation.transportation_charge, quotation.currency)} transport`
              : null}
          </p>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#90A4AE]">Unit price</p>
          <p className={`mt-0.5 text-sm font-semibold ${inactive ? "text-[#546E7A]" : "text-[#0D1B2A]"}`}>
            {quotation.price != null ? formatPrice(quotation.price, quotation.currency) : "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#90A4AE]">Quantity</p>
          <p className="mt-0.5 text-sm font-semibold text-[#0D1B2A]">
            {quotation.quantity ?? "—"} {quotation.unit ?? ""}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#90A4AE]">Delivery</p>
          <p className="mt-0.5 text-sm font-semibold text-[#0D1B2A]">
            {quotation.delivery_days != null ? `${quotation.delivery_days} days` : "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#90A4AE]">GST</p>
          <p className="mt-0.5 text-sm font-semibold text-[#0D1B2A]">
            {quotation.gst_percentage != null ? `${quotation.gst_percentage}%` : "—"}
          </p>
        </div>
      </div>

      {buyerRevisionRemarks ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-amber-800">
            Buyer&apos;s revision request
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#546E7A]">{buyerRevisionRemarks}</p>
        </div>
      ) : null}

      {quotation.payment_terms ? (
        <p className="mt-3 text-xs text-[#546E7A]">
          <span className="font-bold text-[#0D1B2A]">Payment:</span> {quotation.payment_terms}
        </p>
      ) : null}

      {quotation.remarks && !(revisionPending && buyerRevisionRemarks) ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowRemarks((v) => !v)}
            className="cursor-pointer text-xs font-semibold text-[#1565C0]"
          >
            {showRemarks ? "Hide remarks" : "View remarks"}
          </button>
          {showRemarks ? (
            <p className="mt-1 text-sm text-[#546E7A]">{quotation.remarks}</p>
          ) : null}
        </div>
      ) : null}

      <p className="mt-3 text-xs text-[#90A4AE]">Submitted {formatRfqDate(quotation.created_at)}</p>

      {sellerRevisionHint ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2.5 text-xs leading-relaxed text-[#546E7A]">
          {sellerRevisionHint}
        </p>
      ) : null}

      {statusHint ? (
        <p className="mt-4 rounded-xl border border-[#E8ECF0] bg-white px-3 py-2.5 text-xs leading-relaxed text-[#546E7A]">
          {statusHint}
        </p>
      ) : null}

      {actions ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[#F0F2F5] pt-4">{actions}</div>
      ) : null}
    </article>
  );
}
