"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useOptionalGeoLocation } from "@/context/GeoLocationContext";
import { isGeoCacheFresh, readGeoLastLocation } from "@/utils/geoLocationStorage";

interface UseCityFilterOptions {
  /** When true, apply granted geo state/city until the user edits filters. */
  syncFromGeo?: boolean;
}

export function useCityFilter(options: UseCityFilterOptions = {}) {
  const { syncFromGeo = false } = options;
  const geo = useOptionalGeoLocation();

  const [stateId, setStateId] = useState("");
  const [stateLabel, setStateLabel] = useState("");
  const [cityId, setCityId] = useState("");
  const [cityLabel, setCityLabel] = useState("");
  const [userTouched, setUserTouched] = useState(false);
  const appliedGeoKey = useRef<string | null>(null);
  const requestedRef = useRef(false);

  const cityNumericId = Number(cityId);
  const hasCityFilter =
    Boolean(cityId) && Number.isInteger(cityNumericId) && cityNumericId > 0;

  const cityFilterParams = useMemo(
    () => (hasCityFilter ? { city_id: cityNumericId } : {}),
    [hasCityFilter, cityNumericId]
  );

  // Apply cached geo immediately so dropdowns don't wait on context bootstrap.
  useEffect(() => {
    if (!syncFromGeo || userTouched) return;
    const cached = readGeoLastLocation();
    if (!cached || !isGeoCacheFresh(cached)) return;

    const key = `${cached.state_id}:${cached.city_id}`;
    if (appliedGeoKey.current === key) return;
    appliedGeoKey.current = key;

    setStateId(String(cached.state_id));
    setStateLabel(cached.state_name?.trim() || "");
    setCityId(String(cached.city_id));
    setCityLabel(cached.city_name?.trim() || "");
  }, [syncFromGeo, userTouched, geo?.stateId, geo?.cityId]);

  // Apply live geo context once coordinates resolve to state/city IDs.
  useEffect(() => {
    if (!syncFromGeo || userTouched || !geo) return;
    if (geo.stateId == null || geo.cityId == null) return;

    const key = `${geo.stateId}:${geo.cityId}`;
    if (appliedGeoKey.current === key) return;
    appliedGeoKey.current = key;

    setStateId(String(geo.stateId));
    setStateLabel(geo.stateName?.trim() || "");
    setCityId(String(geo.cityId));
    setCityLabel(geo.cityName?.trim() || "");
  }, [
    syncFromGeo,
    userTouched,
    geo?.stateId,
    geo?.cityId,
    geo?.stateName,
    geo?.cityName,
  ]);

  // If filters are still empty after geo is ready, ask context to resolve.
  useEffect(() => {
    if (!syncFromGeo || userTouched || !geo) return;
    if (!geo.ready || geo.locating) return;
    if (geo.stateId != null && geo.cityId != null) return;
    if (geo.permissionStatus === "denied") return;
    if (requestedRef.current) return;

    requestedRef.current = true;
    void geo.requestLocation().finally(() => {
      // Allow one more retry if IDs still missing after this attempt.
      window.setTimeout(() => {
        if (readGeoLastLocation()) return;
        requestedRef.current = false;
      }, 1500);
    });
  }, [
    syncFromGeo,
    userTouched,
    geo,
    geo?.ready,
    geo?.locating,
    geo?.stateId,
    geo?.cityId,
    geo?.permissionStatus,
    geo?.requestLocation,
  ]);

  function handleStateChange(nextStateId: string, label?: string) {
    setUserTouched(true);
    setStateId(nextStateId);
    setStateLabel(nextStateId ? (label?.trim() || "") : "");
    setCityId("");
    setCityLabel("");
  }

  function handleCityChange(nextCityId: string, label?: string) {
    setUserTouched(true);
    setCityId(nextCityId);
    setCityLabel(nextCityId ? (label?.trim() || "") : "");
  }

  function clearStateFilter() {
    setUserTouched(true);
    setStateId("");
    setStateLabel("");
    setCityId("");
    setCityLabel("");
  }

  function clearCityFilter() {
    setUserTouched(true);
    setCityId("");
    setCityLabel("");
  }

  function clearLocationFilters() {
    clearStateFilter();
  }

  return {
    stateId,
    stateLabel,
    cityId,
    cityLabel,
    setCityId: handleCityChange,
    handleStateChange,
    handleCityChange,
    clearStateFilter,
    clearCityFilter,
    clearLocationFilters,
    hasLocationFilter: Boolean(stateId || cityId),
    cityFilterParams,
  };
}
