"use client";

import React, { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { useGeoLocationContext } from "@/context/GeoLocationContext";
import { useLanguage } from "@/context/LanguageContext";
import LocationSelectorModal from "@/components/location/LocationSelectorModal";
import { formatLocationLabel } from "@/utils/locationTranslations";

interface LocationSelectorButtonProps {
  className?: string;
  variant?: "portal" | "navbar" | "compact";
}

export default function LocationSelectorButton({
  className = "",
  variant = "portal",
}: LocationSelectorButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { cityName, stateName } = useGeoLocationContext();
  const { currentLanguage, t } = useLanguage();

  const label = formatLocationLabel(cityName, stateName, currentLanguage);
  const locationTitle = t("common.location", "Location");

  if (variant === "compact") {
    return (
      <>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted hover:border-primary/40 transition-colors cursor-pointer ${className}`}
          title="Change location"
        >
          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="max-w-[130px] truncate">{label}</span>
        </button>
        <LocationSelectorModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </>
    );
  }

  if (variant === "navbar") {
    return (
      <>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={`group inline-flex h-9 items-center gap-1.5 sm:gap-2 rounded-lg border border-border/80 bg-card px-2 sm:px-2.5 text-xs font-medium text-foreground hover:border-primary/50 hover:bg-primary-soft/30 hover:text-primary transition-all duration-200 cursor-pointer shadow-xs ${className}`}
          title="Choose location"
        >
          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-muted-fg leading-none font-semibold truncate">
              {locationTitle}
            </span>
            <span className="max-w-[80px] xs:max-w-[110px] sm:max-w-[140px] md:max-w-[170px] truncate leading-tight font-medium text-foreground group-hover:text-primary">
              {label}
            </span>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-fg group-hover:text-primary transition-transform shrink-0" />
        </button>
        <LocationSelectorModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </>
    );
  }

  // default: portal variant
  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`group inline-flex h-9 items-center gap-1.5 sm:gap-2 rounded-lg border border-portal-border bg-card px-2 sm:px-2.5 text-xs font-medium text-muted-fg hover:border-portal-border hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer ${className}`}
        title="Change trading / delivery location"
      >
        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
        <span className="max-w-[75px] xs:max-w-[100px] sm:max-w-[140px] md:max-w-[170px] truncate font-medium text-foreground">
          {label}
        </span>
        <ChevronDown className="h-3 w-3 text-muted-fg/70 group-hover:text-muted-fg shrink-0" />
      </button>
      <LocationSelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
