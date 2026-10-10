"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import PortalSection from "@/components/portal/PortalSection";
import { useLanguage } from "@/context/LanguageContext";
import {
  parseProductSpecifications,
  type ProductSpecificationItem,
} from "@/utils/productDetailHelpers";

interface ProductSpecificationsSectionProps {
  specifications?: unknown;
  compact?: boolean;
  initialLimit?: number;
}

const cardClass = "surface-card";
const DEFAULT_INITIAL_LIMIT = 3;

export default function ProductSpecificationsSection({
  specifications,
  compact = false,
  initialLimit = DEFAULT_INITIAL_LIMIT,
}: ProductSpecificationsSectionProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const items = useMemo<ProductSpecificationItem[]>(() => {
    return parseProductSpecifications(specifications);
  }, [specifications]);

  // Optional field: if array is blank, do not display anything
  if (!items || items.length === 0) {
    return null;
  }

  const hasMore = items.length > initialLimit;
  const visibleItems = expanded || !hasMore ? items : items.slice(0, initialLimit);
  const remainingCount = items.length - initialLimit;

  return (
    <PortalSection
      title={t("specs.specifications", "Specifications")}
      compact={compact}
    >
      <div className={`${cardClass} overflow-hidden`}>
        <div className="divide-y divide-border">
          {visibleItems.map((spec, index) => (
            <div
              key={`${spec.key}-${index}`}
              className={`grid grid-cols-2 items-center gap-3 sm:gap-6 ${
                compact ? "px-4 py-2.5" : "gap-4 px-5 py-3.5"
              } ${index % 2 === 0 ? "bg-card" : "bg-muted/40"}`}
            >
              <span className="text-sm font-bold text-foreground break-words">
                {spec.key}
              </span>
              <span className="text-sm font-medium text-foreground/85 break-words">
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        {hasMore ? (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 border-t border-border bg-card px-4 py-3 text-xs sm:text-sm font-semibold text-primary transition hover:bg-primary-soft/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
          >
            <span>
              {expanded
                ? t("specs.showLess", "Show less")
                : `${t("specs.showMore", "Show more")} (${remainingCount} ${t("specs.more", "more")})`}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : null}
      </div>
    </PortalSection>
  );
}
