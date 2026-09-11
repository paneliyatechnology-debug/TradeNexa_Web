"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Search } from "lucide-react";
import PortalPageHeader from "@/components/portal/PortalPageHeader";
import PortalProductCard from "@/components/portal/PortalProductCard";
import PortalEmptyState from "@/components/portal/PortalEmptyState";
import PortalInfiniteScroll from "@/components/portal/PortalInfiniteScroll";
import PortalSearchBar from "@/components/portal/PortalSearchBar";
import { Button } from "@/components/common/Button";
import { fetchMyProducts } from "@/services/catalogService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLoadMoreList } from "@/hooks/useLoadMoreList";
import { useLanguage } from "@/context/LanguageContext";
import { sellerCatalogProductLinks } from "@/utils/productDetailLinks";
import {
  approvalTabToApiStatus,
  formatApprovalStatusTabLabel,
  SELLER_PRODUCT_APPROVAL_TABS,
  type SellerProductApprovalTab,
} from "@/utils/productApprovalHelpers";
import { portalFilterChipClass } from "@/components/portal/portalLayout";

export default function SellerCatalogPage() {
  const { t } = useLanguage();
  const links = sellerCatalogProductLinks();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<SellerProductApprovalTab>("all");
  const debouncedSearch = useDebouncedValue(search, 400);

  const fetchPage = useCallback(
    (page: number) =>
      fetchMyProducts({
        page,
        limit: 12,
        search: debouncedSearch || undefined,
        sort_by: "created_at",
        sort_order: "desc",
        approval_status: approvalTabToApiStatus(activeTab),
      }),
    [debouncedSearch, activeTab]
  );

  const {
    items: products,
    pagination,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    setItems,
  } = useLoadMoreList({
    fetchPage,
    resetDeps: [debouncedSearch, activeTab],
  });

  const handleProductDeleted = useCallback(
    (productId: number) => {
      setItems((prev) => prev.filter((item) => item.id !== productId));
    },
    [setItems]
  );

  const getTabLabel = (tab: SellerProductApprovalTab) => {
    switch (tab) {
      case "all":
        return t("catalog.tabs.all", "All");
      case "in_review":
        return t("catalog.tabs.in_review", "In Review");
      case "revision_required":
        return t("catalog.tabs.revision_required", "Revision Required");
      case "approved":
        return t("catalog.tabs.approved", "Approved");
      case "rejected":
        return t("catalog.tabs.rejected", "Rejected");
      default:
        return formatApprovalStatusTabLabel(tab);
    }
  };

  const hasSearch = debouncedSearch.trim().length > 0;
  const tabLabel = getTabLabel(activeTab).toLowerCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <PortalPageHeader
        title={t("catalog.title", "My Catalog")}
        subtitle={t("catalog.subtitle", "Manage your product listings")}
        action={
          <Link href="/seller/add-product">
            <Button>
              <Plus className="h-4 w-4" aria-hidden />
              {t("catalog.addProduct", "Add Product")}
            </Button>
          </Link>
        }
      />

      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-0.5">
        {SELLER_PRODUCT_APPROVAL_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={portalFilterChipClass(activeTab === tab)}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <PortalSearchBar
          value={search}
          onChange={setSearch}
          placeholder={t("catalog.searchPlaceholder", "Search your products by name...")}
        />
        {!loading && (hasSearch || activeTab !== "all") ? (
          <p className="mt-2 text-xs text-muted-fg">
            {pagination.total === 0
              ? t("catalog.noMatches", "No matches")
              : `${pagination.total} ${pagination.total === 1 ? t("catalog.productFound", "product found") : t("catalog.productsFound", "products found")}`}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-error/20 bg-error-soft p-3 text-sm text-error">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-fg">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          {hasSearch ? t("catalog.searching", "Searching...") : t("catalog.loading", "Loading catalog...")}
        </div>
      ) : products.length === 0 ? (
        <PortalEmptyState
          icon={Search}
          title={
            hasSearch
              ? t("catalog.noProductsFound", "No products found")
              : activeTab === "all"
                ? t("catalog.noProductsYet", "No products yet")
                : `${t("catalog.noStatusProducts", `No ${tabLabel} products`).replace("{status}", tabLabel)}`
          }
          description={
            hasSearch
              ? t("catalog.searchEmptyDesc", "Try a different search term or clear the search to see all listings.")
              : activeTab === "all"
                ? t("catalog.noProductsYetDesc", "Add your first product to start receiving buyer inquiries.")
                : `${t("catalog.noStatusDesc", `No listings are currently ${tabLabel}.`).replace("{status}", tabLabel)}`
          }
          action={
            hasSearch || activeTab !== "all" ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch("");
                  setActiveTab("all");
                }}
              >
                {t("catalog.clearFilters", "Clear filters")}
              </Button>
            ) : (
              <Link href="/seller/add-product">
                <Button>{t("catalog.addProduct", "Add Product")}</Button>
              </Link>
            )
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <PortalProductCard
                key={p.id}
                product={p}
                href={links.product(p.id)}
                editHref={links.editProduct?.(p.id)}
                showDelete
                showWishlist={false}
                showApprovalStatus
                onDeleted={handleProductDeleted}
              />
            ))}
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
