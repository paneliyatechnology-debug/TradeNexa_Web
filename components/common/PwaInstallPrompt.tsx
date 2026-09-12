"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Download, MoreVertical, Share2, Smartphone, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PwaInstallPrompt() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Detect mobile
    const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : "";
    const mobileCheck = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobileCheck);

    // 2. Check if already installed or running standalone
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 3. Check dismissal cooldown from localStorage
    const dismissedAt = localStorage.getItem("tradenexa_pwa_dismissed");
    if (dismissedAt) {
      const diffHours = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60);
      if (diffHours < 24) {
        setDismissed(true);
      }
    }

    // 4. Register PWA service worker immediately
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          console.log("[PWA] ServiceWorker registered with scope:", reg.scope);
        })
        .catch((err) => console.error("[PWA] ServiceWorker registration error:", err));
    }

    // 5. Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowGuideModal(false);
      localStorage.setItem("tradenexa_pwa_installed", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setInstalling(true);
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setIsInstalled(true);
          setDeferredPrompt(null);
        }
      } catch {
        // ignore
      } finally {
        setInstalling(false);
      }
      return;
    }

    // If deferredPrompt is not available (e.g. running on local HTTP IP or iOS Safari), show interactive guide
    setShowGuideModal(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("tradenexa_pwa_dismissed", String(Date.now()));
  };

  if (isInstalled || dismissed) {
    return null;
  }

  // Show banner if deferredPrompt is available OR if on mobile
  const canShowBanner = Boolean(deferredPrompt || isMobile);
  if (!canShowBanner) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300 sm:bottom-6 sm:left-auto sm:right-6">
        <div className="flex items-center gap-3.5 rounded-2xl border border-primary/20 bg-card/95 p-3.5 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:bg-card/95 sm:p-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/15 bg-primary-soft shadow-inner">
            <Image
              src="/web-app-manifest-192x192.png"
              alt="TradeNexa"
              width={48}
              height={48}
              className="h-10 w-10 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = "none";
              }}
            />
            <Smartphone className="h-6 w-6 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-foreground">TradeNexa App</h4>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                APK / PWA
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-fg">
              Install on your phone for full screen app
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={installing}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-primary/20 transition hover:bg-primary/90 active:scale-95 disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" />
              {installing ? "Installing…" : "Install"}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-fg transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Mobile Install Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
          <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-fg transition hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Install TradeNexa</h3>
                <p className="text-xs text-muted-fg">Fast 2-second install on mobile</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-muted/50 p-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                  1
                </div>
                <div className="text-xs leading-relaxed text-foreground">
                  Tap the <strong className="inline-flex items-center gap-0.5"><MoreVertical className="inline h-3.5 w-3.5" /> 3 Dots</strong> (Menu) at top right of Chrome.
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-muted/50 p-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                  2
                </div>
                <div className="text-xs leading-relaxed text-foreground">
                  Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-muted/50 p-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                  3
                </div>
                <div className="text-xs leading-relaxed text-foreground">
                  TradeNexa App will be added to your home screen!
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 active:scale-98"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
