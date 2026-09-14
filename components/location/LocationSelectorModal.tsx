"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Crosshair,
  Globe,
  Loader2,
  MapPin,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { useGeoLocationContext } from "@/context/GeoLocationContext";
import { useLanguage } from "@/context/LanguageContext";
import { fetchCities, fetchStates } from "@/services/locationService";
import {
  formatLocationLabel,
  translateLocationName,
} from "@/utils/locationTranslations";
import type { ApiCity, ApiState } from "@/types/location";

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_STATES = [
  "Gujarat",
  "Maharashtra",
  "Delhi",
  "Rajasthan",
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Punjab",
  "Haryana",
  "West Bengal",
  "Telangana",
  "Kerala",
  "Andhra Pradesh",
  "Bihar",
  "Odisha",
];

// Fallback instant cities for top states to ensure zero-lag instant rendering
const FALLBACK_STATE_CITIES: Record<string, string[]> = {
  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Gandhinagar",
    "Junagadh",
    "Anand",
    "Navsari",
    "Morbi",
    "Bharuch",
    "Mehsana",
    "Bhuj",
    "Porbandar",
    "Valsad",
    "Vapi",
    "Patan",
    "Godhra",
    "Palanpur",
    "Botad",
    "Amreli",
    "Deesa",
    "Jetpur",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Aurangabad",
    "Solapur",
    "Kolhapur",
    "Navi Mumbai",
    "Amravati",
    "Jalgaon",
    "Akola",
  ],
  Delhi: ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Udaipur",
    "Bhilwara",
    "Alwar",
    "Sikar",
  ],
  "Madhya Pradesh": [
    "Indore",
    "Bhopal",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Sagar",
    "Dewas",
    "Satna",
    "Ratlam",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Ghaziabad",
    "Agra",
    "Varanasi",
    "Meerut",
    "Prayagraj",
    "Noida",
    "Bareilly",
    "Aligarh",
  ],
};

export default function LocationSelectorModal({
  isOpen,
  onClose,
}: LocationSelectorModalProps) {
  const {
    stateId,
    cityId,
    stateName,
    cityName,
    locating,
    requestLocation,
    selectLocation,
  } = useGeoLocationContext();
  const { currentLanguage } = useLanguage();

  const [states, setStates] = useState<ApiState[]>([]);
  const [allCities, setAllCities] = useState<ApiCity[]>([]);
  const [selectedStateName, setSelectedStateName] = useState<string>("Gujarat");
  const [selectedState, setSelectedState] = useState<ApiState | null>(null);
  const [stateCities, setStateCities] = useState<ApiCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [gpsTriggered, setGpsTriggered] = useState(false);

  // Initialize or align selected state when opened
  useEffect(() => {
    if (!isOpen) return;

    if (stateName) {
      setSelectedStateName(stateName);
    } else {
      setSelectedStateName("Gujarat");
    }
    setSearchQuery("");
  }, [isOpen, stateName]);

  // Load States & Initial Cities on Open
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function bootstrapLocations() {
      setLoading(true);
      try {
        const [statesRes, citiesRes] = await Promise.all([
          fetchStates({
            country_id: 4,
            limit: 100,
            is_active: true,
            sort_by: "name",
            sort_order: "asc",
          }),
          fetchCities({
            limit: 250,
            is_active: true,
            sort_by: "name",
            sort_order: "asc",
          }),
        ]);

        if (!cancelled) {
          const loadedStates = statesRes?.results || [];
          const loadedCities = citiesRes?.results || [];
          setStates(loadedStates);
          setAllCities(loadedCities);

          // Match active state object
          const currentTargetState = stateName || selectedStateName || "Gujarat";
          const matched = loadedStates.find(
            (s) => s.name.toLowerCase() === currentTargetState.toLowerCase()
          );
          if (matched) {
            setSelectedState(matched);
            setSelectedStateName(matched.name);
          } else if (loadedStates.length > 0) {
            setSelectedState(loadedStates[0]);
            setSelectedStateName(loadedStates[0].name);
          }
        }
      } catch {
        if (!cancelled) {
          setStates([]);
          setAllCities([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void bootstrapLocations();
    return () => {
      cancelled = true;
    };
  }, [isOpen, stateName]);

  // When selected state changes, load cities for that state
  useEffect(() => {
    if (!selectedStateName) return;

    let cancelled = false;

    // Check matched state in states array
    const matchedState = states.find(
      (s) => s.name.toLowerCase() === selectedStateName.toLowerCase()
    );
    if (matchedState && (!selectedState || selectedState.id !== matchedState.id)) {
      setSelectedState(matchedState);
    }

    // 1. Gather instant cities from pre-loaded cities
    const localMatches = allCities.filter((c) => {
      if (matchedState && c.state_id === matchedState.id) return true;
      return (
        c.state_name &&
        c.state_name.toLowerCase() === selectedStateName.toLowerCase()
      );
    });

    // 2. If empty, check fallback curated cities
    if (localMatches.length > 0) {
      setStateCities(localMatches);
    } else {
      const fallbacks = FALLBACK_STATE_CITIES[selectedStateName] || [];
      const sId = matchedState?.id || 1000;
      const syntheticCities: ApiCity[] = fallbacks.map((cName, idx) => ({
        id: sId * 100 + idx + 1,
        name: cName,
        state_id: sId,
        state_name: selectedStateName,
        is_active: true,
        created_at: new Date().toISOString(),
      }));
      setStateCities(syntheticCities);
    }

    // 3. If matchedState has ID, fetch from backend to ensure up-to-date list
    if (matchedState?.id) {
      async function loadStateCities() {
        setLoadingCities(true);
        try {
          const res = await fetchCities({
            state_id: matchedState!.id,
            limit: 200,
            is_active: true,
            sort_by: "name",
            sort_order: "asc",
          });
          if (!cancelled && res?.results?.length) {
            setStateCities(res.results);
          }
        } catch {
          // Keep local / fallback cities
        } finally {
          if (!cancelled) setLoadingCities(false);
        }
      }
      void loadStateCities();
    }

    return () => {
      cancelled = true;
    };
  }, [selectedStateName, states, allCities]);

  // Handle GPS completion
  useEffect(() => {
    if (gpsTriggered && !locating) {
      setGpsTriggered(false);
      if (cityName || stateName) {
        onClose();
      }
    }
  }, [gpsTriggered, locating, cityName, stateName, onClose]);

  const handleUseGps = async () => {
    setGpsTriggered(true);
    await requestLocation();
  };

  const handleSelectCityDirect = (city: ApiCity | { id?: number; name: string; state_id?: number | null; state_name?: string | null }) => {
    const sId = city.state_id || selectedState?.id || null;
    let sName = city.state_name || selectedState?.name || selectedStateName || null;

    if (!sName && sId && states.length > 0) {
      const match = states.find((s) => s.id === sId);
      if (match) sName = match.name;
    }

    selectLocation({
      state_id: sId,
      state_name: sName,
      city_id: city.id || null,
      city_name: city.name,
    });
    onClose();
  };

  const handleApplyStateOnly = (stateNameParam: string, stateObj?: ApiState | null) => {
    const matched = stateObj || states.find((s) => s.name.toLowerCase() === stateNameParam.toLowerCase());
    selectLocation({
      state_id: matched?.id || null,
      state_name: matched?.name || stateNameParam,
      city_id: null,
      city_name: null,
    });
    onClose();
  };

  const handleClearLocation = () => {
    selectLocation({
      state_id: null,
      state_name: null,
      city_id: null,
      city_name: null,
    });
    onClose();
  };

  // Search Results across all cities and states
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    // Search in loaded cities + states + fallbacks
    const results: Array<{ id?: number; name: string; state_name?: string; state_id?: number | null }> = [];
    const seen = new Set<string>();

    // 1. Search in all pre-loaded cities
    for (const city of allCities) {
      const cityNameEn = city.name.toLowerCase();
      const stateNameEn = (city.state_name || "").toLowerCase();
      const cityNameTrans = translateLocationName(city.name, currentLanguage).toLowerCase();
      const stateNameTrans = translateLocationName(city.state_name || "", currentLanguage).toLowerCase();

      if (
        cityNameEn.includes(q) ||
        stateNameEn.includes(q) ||
        cityNameTrans.includes(q) ||
        stateNameTrans.includes(q)
      ) {
        const key = `${city.name}-${city.state_name}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push(city);
        }
      }
    }

    // 2. Search in fallback cities
    Object.entries(FALLBACK_STATE_CITIES).forEach(([stName, cList]) => {
      cList.forEach((cName) => {
        const cityNameEn = cName.toLowerCase();
        const stateNameEn = stName.toLowerCase();
        const cityNameTrans = translateLocationName(cName, currentLanguage).toLowerCase();
        const stateNameTrans = translateLocationName(stName, currentLanguage).toLowerCase();

        if (
          cityNameEn.includes(q) ||
          stateNameEn.includes(q) ||
          cityNameTrans.includes(q) ||
          stateNameTrans.includes(q)
        ) {
          const key = `${cName}-${stName}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              name: cName,
              state_name: stName,
            });
          }
        }
      });
    });

    return results;
  }, [searchQuery, allCities, currentLanguage]);

  const isSearching = searchQuery.trim().length > 0;
  const hasActiveLocation = Boolean(cityName || stateName);
  const activeLocationLabel = formatLocationLabel(cityName, stateName, currentLanguage);
  const displaySelectedStateName = translateLocationName(selectedStateName, currentLanguage);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      placement="center"
      bodyClassName="p-3 sm:p-3.5"
      title={
        <div className="flex items-center gap-2">
          <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-primary-soft text-primary shadow-xs">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground leading-tight">
              {currentLanguage === "gu"
                ? "સ્થાન પસંદ કરો"
                : currentLanguage === "hi"
                ? "स्थान चुनें"
                : "Select Location"}
            </h2>
            <p className="text-[10.5px] text-muted-fg font-normal leading-tight">
              {currentLanguage === "gu"
                ? "તમારા વિસ્તારના સપ્લાયર્સ અને પ્રોડક્ટ્સ શોધો"
                : currentLanguage === "hi"
                ? "अपने क्षेत्र के उत्पाद और आपूर्तिकर्ता खोजें"
                : "Find products & suppliers near your region"}
            </p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-2.5 text-xs">
        {/* Active Location & GPS Bar */}
        <div className="flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-muted/30 p-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="h-3 w-3" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-foreground leading-tight">
                {hasActiveLocation
                  ? activeLocationLabel
                  : currentLanguage === "gu"
                  ? "સમગ્ર ભારત (All India)"
                  : currentLanguage === "hi"
                  ? "अखिल भारतीय (All India)"
                  : "All India (No filter)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {hasActiveLocation && (
              <button
                type="button"
                onClick={handleClearLocation}
                className="inline-flex h-7 items-center gap-1 rounded-lg border border-border bg-card px-2 text-[10.5px] font-medium text-muted-fg hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Reset to All India"
              >
                <RotateCcw className="h-2.5 w-2.5" />
                <span>
                  {currentLanguage === "gu"
                    ? "રીસેટ"
                    : currentLanguage === "hi"
                    ? "रीसेट"
                    : "Reset"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={handleUseGps}
              disabled={locating}
              className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-primary px-2 text-[10.5px] font-semibold text-white shadow-xs hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
            >
              {locating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Crosshair className="h-3 w-3" />
              )}
              <span>
                {locating
                  ? currentLanguage === "gu"
                    ? "શોધી રહ્યું છે..."
                    : "Detecting..."
                  : currentLanguage === "gu"
                  ? "લાઇવ GPS"
                  : currentLanguage === "hi"
                  ? "लाइव GPS"
                  : "Live GPS"}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-fg pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              currentLanguage === "gu"
                ? "શહેર અથવા રાજ્ય શોધો (દા.ત. અમદાવાદ, સુરત)..."
                : currentLanguage === "hi"
                ? "शहर या राज्य खोजें (जैसे अहमदाबाद, सूरत)..."
                : "Search any city or state..."
            }
            className="h-8.5 w-full rounded-lg border border-border bg-card pl-8 pr-7 text-xs text-foreground placeholder:text-muted-fg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-fg hover:text-foreground cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Search Results Mode */}
        {isSearching ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10.5px] text-muted-fg font-medium">
              <span>
                {currentLanguage === "gu" ? "શોધ પરિણામો" : "Search Results"}
              </span>
              <span className="font-semibold text-primary">
                {searchResults.length}{" "}
                {currentLanguage === "gu" ? "મળ્યા" : "found"}
              </span>
            </div>

            <div className="max-h-52 overflow-y-auto rounded-xl border border-border bg-card divide-y divide-border/60">
              {searchResults.length === 0 ? (
                <div className="py-6 text-center text-muted-fg text-xs">
                  <p className="font-medium">
                    {currentLanguage === "gu"
                      ? `"${searchQuery}" માટે કોઈ શહેર મળ્યું નથી`
                      : `No cities found for "${searchQuery}"`}
                  </p>
                </div>
              ) : (
                searchResults.map((city, idx) => {
                  const isSelected =
                    cityName?.toLowerCase() === city.name.toLowerCase();
                  const letter = (city.name.trim().charAt(0) || "A").toUpperCase();
                  const displayCity = translateLocationName(
                    city.name,
                    currentLanguage
                  );
                  const displayState = city.state_name
                    ? translateLocationName(city.state_name, currentLanguage)
                    : "";

                  return (
                    <button
                      key={`${city.name}-${city.state_name}-${idx}`}
                      type="button"
                      onClick={() => handleSelectCityDirect(city as ApiCity)}
                      className={`flex w-full items-center justify-between p-2 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-primary-soft text-primary font-semibold"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-md font-bold text-xs ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-primary-soft text-primary"
                          }`}
                        >
                          {letter}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">
                            {displayCity}
                          </p>
                          {displayState && (
                            <p className="truncate text-[10px] text-muted-fg">
                              {displayState}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Normal State -> City Hierarchy Flow */
          <div className="space-y-2">
            {/* 1. States Horizontal Chips */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-fg">
                  {currentLanguage === "gu"
                    ? "૧. રાજ્ય પસંદ કરો"
                    : currentLanguage === "hi"
                    ? "1. राज्य चुनें"
                    : "1. Select State"}
                </span>
                <span className="text-[10.5px] font-semibold text-primary">
                  {displaySelectedStateName}
                </span>
              </div>

              <div className="no-scrollbar -mx-0.5 flex gap-1 overflow-x-auto px-0.5 py-0.5">
                {POPULAR_STATES.map((popStateName) => {
                  const isSelected =
                    selectedStateName.toLowerCase() ===
                    popStateName.toLowerCase();
                  const displayState = translateLocationName(
                    popStateName,
                    currentLanguage
                  );

                  return (
                    <button
                      key={popStateName}
                      type="button"
                      onClick={() => setSelectedStateName(popStateName)}
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white shadow-xs font-semibold"
                          : "border border-border/80 bg-card text-foreground hover:border-primary/50 hover:bg-muted"
                      }`}
                    >
                      <span>{displayState}</span>
                      {isSelected && <Check className="h-2.5 w-2.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Cities under Selected State */}
            <div className="space-y-1 pt-1 border-t border-border/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-fg">
                  {currentLanguage === "gu"
                    ? `૨. ${displaySelectedStateName} ના શહેરો`
                    : currentLanguage === "hi"
                    ? `2. ${displaySelectedStateName} के शहर`
                    : `2. Cities in ${selectedStateName}`}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleApplyStateOnly(selectedStateName, selectedState)
                  }
                  className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-primary hover:underline cursor-pointer"
                >
                  <span>
                    {currentLanguage === "gu"
                      ? `સમગ્ર ${displaySelectedStateName} લાગુ કરો →`
                      : `Apply whole ${selectedStateName} →`}
                  </span>
                </button>
              </div>

              {/* Cities Grid List */}
              <div className="max-h-40 sm:max-h-48 overflow-y-auto rounded-xl border border-border bg-card p-1">
                {loadingCities && stateCities.length === 0 ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-fg">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>
                      {currentLanguage === "gu"
                        ? "શહેરો લોડ થઈ રહ્યાં છે..."
                        : "Loading cities..."}
                    </span>
                  </div>
                ) : stateCities.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-fg space-y-1.5">
                    <p>
                      {currentLanguage === "gu"
                        ? `${displaySelectedStateName} માટે શહેરો ઉપલબ્ધ નથી`
                        : `No cities listed for ${selectedStateName}`}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyStateOnly(selectedStateName, selectedState)
                      }
                      className="inline-block rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                    >
                      {currentLanguage === "gu"
                        ? `સમગ્ર ${displaySelectedStateName} રાજ્ય પસંદ કરો`
                        : `Apply ${selectedStateName} State`}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                    {stateCities.map((city) => {
                      const isSelected =
                        cityName?.toLowerCase() === city.name.toLowerCase();
                      const displayCityName = translateLocationName(
                        city.name,
                        currentLanguage
                      );

                      return (
                        <button
                          key={`${city.id}-${city.name}`}
                          type="button"
                          onClick={() => handleSelectCityDirect(city)}
                          className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-left text-[11px] transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary text-white shadow-xs font-semibold"
                              : "border border-border/50 bg-muted/20 text-foreground hover:bg-primary-soft hover:text-primary hover:border-primary/40"
                          }`}
                        >
                          <span className="truncate font-medium">
                            {displayCityName}
                          </span>
                          {isSelected && (
                            <Check className="h-3 w-3 shrink-0 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
