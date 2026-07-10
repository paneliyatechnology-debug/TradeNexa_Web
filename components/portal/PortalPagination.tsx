"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ApiPagination } from "@/types/catalog";

interface PortalPaginationProps {
  pagination: ApiPagination;
  onPageChange: (page: number) => void;
  loading?: boolean;
  itemLabel?: string;
  compact?: boolean;
}

export default function PortalPagination({
  pagination,
  onPageChange,
  loading = false,
  itemLabel = "items",
  compact = false,
}: PortalPaginationProps) {
  const { page, totalPages, total } = pagination;
  if (totalPages <= 1) return null;

  const hoverClass = "hover:border-[#1565C0]/40 hover:text-[#1565C0]";

  return (
    <div
      className={`flex flex-col items-center justify-between gap-3 sm:flex-row ${
        compact ? "mt-5 border-t border-[#E8ECF0] pt-4" : "mt-6"
      }`}
    >
      <p className={`text-[#546E7A] ${compact ? "text-xs" : "text-sm"}`}>
        Page <span className="font-semibold text-[#0D1B2A]">{page}</span> of{" "}
        <span className="font-semibold text-[#0D1B2A]">{totalPages}</span>
        <span className="mx-2 text-[#E0E6ED]">·</span>
        {total.toLocaleString()} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className={`inline-flex cursor-pointer items-center gap-1 border border-[#E0E6ED] bg-white font-semibold text-[#546E7A] transition disabled:cursor-not-allowed disabled:opacity-40 ${hoverClass} ${
            compact ? "rounded-lg px-3 py-1.5 text-xs" : "rounded-xl px-4 py-2 text-sm"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <button
          type="button"
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
          className={`inline-flex cursor-pointer items-center gap-1 border border-[#E0E6ED] bg-white font-semibold text-[#546E7A] transition disabled:cursor-not-allowed disabled:opacity-40 ${hoverClass} ${
            compact ? "rounded-lg px-3 py-1.5 text-xs" : "rounded-xl px-4 py-2 text-sm"
          }`}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
