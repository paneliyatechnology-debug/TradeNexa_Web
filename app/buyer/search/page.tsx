"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import PortalPageHeader from "@/components/portal/PortalPageHeader";
import PortalProductCard from "@/components/portal/PortalProductCard";
import PortalEmptyState from "@/components/portal/PortalEmptyState";
import PortalInfiniteScroll from "@/components/portal/PortalInfiniteScroll";
import PortalSearchBar from "@/components/portal/PortalSearchBar";
import { Button } from "@/components/common/Button";
import LocationFilterBar from "@/components/location/LocationFilterBar";
import { fetchProducts } from "@/services/catalogService";
import { useCityFilter } from "@/hooks/useCityFilter";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLoadMoreList } from "@/hooks/useLoadMoreList";

export default function BuyerSearchPage() {
  const [query, setQuery] = React.useState("");
  const debounced = useDebouncedValue(query, 400);
  const {
    stateId,
    stateLabel,
    cityId,
    cityLabel,
    setCityId,
    handleStateChange,
    clearLocationFilters,
    clearStateFilter,
    clearCityFilter,
    hasLocationFilter,
    cityFilterParams,
  } = useCityFilter({ syncFromGeo: true });

  const fetchPage = useCallback(
    (page: number) =>
      fetchProducts({
        page,
        limit: 12,
        search: debounced || undefined,
        sort_by: "name",
        sort_order: "asc",
        ...cityFilterParams,
      }),
    [cityFilterParams, debounced]
  );

  const { items: products, pagination, loading, loadingMore, error, hasMore, loadMore } =
    useLoadMoreList({
      fetchPage,
      resetDeps: [debounced, cityId],
    });

  const hasAnyFilter = Boolean(query.trim() || hasLocationFilter);

  function clearFilters() {
    setQuery("");
    clearLocationFilters();
  }

  const resultsLabel = loading
    ? "Searching..."
    : `${pagination.total.toLocaleString()} product${pagination.total === 1 ? "" : "s"} found`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <PortalPageHeader title="Search Products" subtitle="Find suppliers and products across India" />
      <div className="mb-6 space-y-2.5">
        <PortalSearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by product, category, or supplier..."
        />
        <LocationFilterBar
          idPrefix="buyer-search"
          variant="toolbar"
          stateId={stateId}
          stateLabel={stateLabel}
          cityId={cityId}
          cityLabel={cityLabel}
          onStateChange={handleStateChange}
          onCityChange={setCityId}
          onClear={clearFilters}
          onClearState={clearStateFilter}
          onClearCity={clearCityFilter}
          clearDisabled={!hasAnyFilter}
          resultsLabel={resultsLabel}
        />
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-error/20 bg-error-soft p-3 text-sm text-error">{error}</p>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-fg">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Searching...
        </div>
      ) : products.length === 0 ? (
        <PortalEmptyState
          icon={Search}
          title="No products found"
          description="Try a different search term, city, or browse categories."
          action={
            <Link href="/buyer/categories">
              <Button>Browse Categories</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <PortalProductCard key={p.id} product={p} />
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
