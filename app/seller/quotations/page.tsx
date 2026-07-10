"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { Loader2, MessageSquare } from "lucide-react";
import PortalBackLink from "@/components/portal/PortalBackLink";
import PortalPageHeader from "@/components/portal/PortalPageHeader";
import PortalEmptyState from "@/components/portal/PortalEmptyState";
import PortalPagination from "@/components/portal/PortalPagination";
import RfqListToolbar from "@/components/rfq/RfqListToolbar";
import QuotationCard from "@/components/rfq/QuotationCard";
import { ReviseQuotationFormModal } from "@/components/rfq/ReviseQuotationForm";
import { UpdateQuotationFormModal } from "@/components/rfq/UpdateQuotationForm";
import { fetchSellerQuotations, withdrawQuotation } from "@/services/rfqService";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { ApiQuotation } from "@/types/rfq";
import { canSellerUpdateQuotation, canSellerWithdrawQuotation, isQuotationRevisionPending } from "@/utils/rfqHelpers";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

const PAGE_SIZE = 5;

export default function SellerQuotationsPage() {
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);
  const [revisingQuotation, setRevisingQuotation] = useState<ApiQuotation | null>(null);
  const [updatingQuotation, setUpdatingQuotation] = useState<ApiQuotation | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const fetchPage = useCallback(
    (page: number) =>
      fetchSellerQuotations({
        page,
        limit: PAGE_SIZE,
        sort_by: "created_at",
        sort_order: "desc",
        search: debouncedSearch || undefined,
      }),
    [debouncedSearch]
  );

  const { items, pagination, loading, error, goToPage, reload } = usePaginatedList({
    fetchPage,
    resetDeps: [debouncedSearch],
  });

  const hasSearch = debouncedSearch.trim().length > 0;

  async function handleWithdraw(quotationId: number) {
    setWithdrawingId(quotationId);
    try {
      await withdrawQuotation(quotationId);
      showSuccessToast("Quotation withdrawn");
      reload();
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to withdraw quotation";
      showErrorToast(message);
    } finally {
      setWithdrawingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8">
      <PortalBackLink href="/seller/leads" label="RFQ Feed" />
      <PortalPageHeader title="My Quotations" subtitle="Quotes you have submitted to buyers" />

      <RfqListToolbar
        loading={loading}
        countLabel={`${pagination.total} quotation${pagination.total === 1 ? "" : "s"}`}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search by RFQ title, buyer, or remarks...",
        }}
      />

      {error ? (
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">{error}</p>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#546E7A]">
          <Loader2 className="h-5 w-5 animate-spin text-[#1565C0]" />
          Loading quotations...
        </div>
      ) : items.length === 0 ? (
        <PortalEmptyState
          icon={MessageSquare}
          title={hasSearch ? "No quotations match your search" : "No quotations yet"}
          description={
            hasSearch
              ? `No results for "${debouncedSearch.trim()}". Try a different keyword or clear the search.`
              : "Browse the RFQ feed and submit your first quote."
          }
          action={
            hasSearch ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="cursor-pointer rounded-xl border border-[#E0E6ED] px-4 py-2 text-sm font-bold text-[#546E7A]"
              >
                Clear search
              </button>
            ) : (
              <Link
                href="/seller/leads"
                className="cursor-pointer rounded-xl bg-[#1565C0] px-4 py-2 text-sm font-bold text-white"
              >
                Browse RFQs
              </Link>
            )
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((quotation) => (
              <QuotationCard
                key={quotation.id}
                quotation={quotation}
                rfqStatus={quotation.rfq_status}
                actions={
                  <>
                    {isQuotationRevisionPending(quotation, quotation.rfq_status) ? (
                      <button
                        type="button"
                        onClick={() => setRevisingQuotation(quotation)}
                        className="cursor-pointer rounded-lg bg-[#1565C0] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1255A8]"
                      >
                        Revise quote
                      </button>
                    ) : canSellerUpdateQuotation(quotation.status) ? (
                      <button
                        type="button"
                        onClick={() => setUpdatingQuotation(quotation)}
                        className="cursor-pointer rounded-lg bg-[#1565C0] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1255A8]"
                      >
                        Update quote
                      </button>
                    ) : null}
                    {quotation.rfq_id ? (
                      <Link
                        href={`/seller/lead/${quotation.rfq_id}`}
                        className="cursor-pointer rounded-lg border border-[#E0E6ED] px-3 py-1.5 text-xs font-bold text-[#546E7A]"
                      >
                        View RFQ
                      </Link>
                    ) : null}
                    {canSellerWithdrawQuotation(quotation.status) ? (
                      <button
                        type="button"
                        disabled={withdrawingId === quotation.id}
                        onClick={() => void handleWithdraw(quotation.id)}
                        className="cursor-pointer rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Withdraw
                      </button>
                    ) : null}
                  </>
                }
              />
            ))}
          </div>
          <PortalPagination
            pagination={pagination}
            onPageChange={goToPage}
            loading={loading}
            itemLabel="quotations"
          />
        </>
      )}

      {revisingQuotation ? (
        <ReviseQuotationFormModal
          isOpen={Boolean(revisingQuotation)}
          onClose={() => setRevisingQuotation(null)}
          quotation={revisingQuotation}
          onRevised={() => {
            setRevisingQuotation(null);
            reload();
          }}
        />
      ) : null}

      {updatingQuotation ? (
        <UpdateQuotationFormModal
          isOpen={Boolean(updatingQuotation)}
          onClose={() => setUpdatingQuotation(null)}
          quotation={updatingQuotation}
          onUpdated={() => {
            setUpdatingQuotation(null);
            reload();
          }}
        />
      ) : null}
    </div>
  );
}
