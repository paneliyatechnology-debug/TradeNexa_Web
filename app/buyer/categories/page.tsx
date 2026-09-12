"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Loader2, Search } from "lucide-react";
import PortalPageHeader from "@/components/portal/PortalPageHeader";
import PortalSearchBar from "@/components/portal/PortalSearchBar";
import PortalEmptyState from "@/components/portal/PortalEmptyState";
import PortalInfiniteScroll from "@/components/portal/PortalInfiniteScroll";
import { fetchCategories } from "@/services/catalogService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLoadMoreList } from "@/hooks/useLoadMoreList";
import { getCategoryFallbackIcon } from "@/utils/categoryIcons";
import CatalogImage from "@/components/catalog/CatalogImage";

import { useLanguage } from "@/context/LanguageContext";

export default function BuyerCategoriesPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const fetchPage = useCallback(
    (page: number) =>
      fetchCategories({
        page,
        limit: 16,
        search: debouncedSearch || undefined,
        is_active: true,
        sort_by: "name",
        sort_order: "asc",
      }),
    [debouncedSearch]
  );

  const {
    items: categories,
    pagination,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    error,
  } = useLoadMoreList({
    fetchPage,
    resetDeps: [debouncedSearch],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <PortalPageHeader
        title={t("catalog.browseCategories", "Categories")}
        subtitle={t("catalog.browseCategoriesDesc", "Browse products by industry")}
      />

      <PortalSearchBar
        value={search}
        onChange={setSearch}
        placeholder={t("catalog.searchCategoriesPlaceholder", "Search categories...")}
        className="mb-4"
      />

      {error ? (
        <p className="mb-4 rounded-xl border border-error/20 bg-error-soft p-3 text-sm text-error">{error}</p>
      ) : null}

      {!loading && categories.length > 0 ? (
        <p className="mb-4 text-sm text-muted-fg">
          {t("catalog.showing", "Showing")} <span className="font-semibold text-foreground">{categories.length}</span>
          {pagination.total > categories.length ? (
            <>
              {" "}
              {t("catalog.of", "of")}{" "}
              <span className="font-semibold text-foreground">{pagination.total}</span>
            </>
          ) : null}{" "}
          {t("catalog.categories", "categories")}
          {debouncedSearch ? (
            <>
              {" "}
              {t("catalog.forQuery", "for")} &ldquo;<span className="font-semibold text-primary">{debouncedSearch}</span>&rdquo;
            </>
          ) : null}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-fg">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          {t("catalog.loadingCategories", "Loading categories...")}
        </div>
      ) : categories.length === 0 ? (
        <PortalEmptyState
          icon={search.trim() ? Search : LayoutGrid}
          title={
            search.trim()
              ? t("catalog.noCategoriesFound", "No categories found")
              : t("catalog.noCategoriesAvailable", "No categories available")
          }
          description={
            search.trim()
              ? t("leads.noMatchesDesc", `No results for "${search.trim()}". Try a different keyword or clear the search.`).replace("{search}", search.trim())
              : t("catalog.categoriesAvailableDesc", "Categories will appear here when available.")
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = getCategoryFallbackIcon(cat.slug, cat.name);
              return (
                <Link
                  key={cat.id}
                  href={`/buyer/category/${cat.id}`}
                  className="surface-card-hover flex items-center gap-3 p-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-soft">
                    <CatalogImage
                      src={cat.icon || cat.image}
                      alt={cat.name}
                      fallbackIcon={Icon}
                      fallbackClassName="bg-primary-soft"
                      fallbackIconClassName="h-5 w-5 text-primary"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{cat.name}</p>
                    <p className="text-xs text-muted-fg">
                      {cat.product_count ?? 0}{" "}
                      {(cat.product_count ?? 0) === 1
                        ? t("catalog.productCount", "product")
                        : t("catalog.productsCount", "products")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <PortalInfiniteScroll
            hasMore={hasMore}
            loading={loading}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
          />
        </>
      )}
    </div>
  );
}
