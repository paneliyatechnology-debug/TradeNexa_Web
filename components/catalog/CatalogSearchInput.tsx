"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface CatalogSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  loading?: boolean;
  className?: string;
}

export default function CatalogSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  resultCount,
  loading = false,
  className = "",
}: CatalogSearchInputProps) {
  const hasValue = value.length > 0;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative flex h-10 items-center rounded-lg border bg-card transition-colors duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25 ${
          hasValue ? "border-border-hover" : "border-border"
        }`}
      >
        <div className="pointer-events-none absolute left-3.5 flex items-center text-muted-fg">
          <Search className="h-4 w-4" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg bg-transparent py-0 pl-10 pr-24 text-sm text-foreground placeholder:text-muted-placeholder outline-none"
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          {hasValue && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-fg transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {resultCount !== undefined && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-fg">
              {loading ? "…" : `${resultCount} found`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
