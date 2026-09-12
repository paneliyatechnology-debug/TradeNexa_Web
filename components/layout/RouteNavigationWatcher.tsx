"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cancelRouteInflightRequests } from "@/services/apiClient";

export default function RouteNavigationWatcher() {
  const pathname = usePathname();
  const prevPathRef = useRef<string>(pathname);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      cancelRouteInflightRequests(pathname);
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  return null;
}
