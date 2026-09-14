"use client";

import React from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/store";
import { hydrateFromGeoCache } from "@/store/slices/filtersSlice";
import { referenceApi } from "@/store/api/referenceApi";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Ref (not module singleton) so each SSR render gets a clean store and the
  // client keeps one stable instance across re-renders.
  const storeRef = React.useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    // Client-only: seed city filter from geo cache before any catalog page mounts.
    if (typeof window !== "undefined") {
      storeRef.current.dispatch(hydrateFromGeoCache());
    }
  }

  React.useEffect(() => {
    const handleLanguageChange = () => {
      if (storeRef.current) {
        storeRef.current.dispatch(referenceApi.util.resetApiState());
      }
    };
    window.addEventListener("tradenexa_language_change", handleLanguageChange);
    return () => {
      window.removeEventListener("tradenexa_language_change", handleLanguageChange);
    };
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
