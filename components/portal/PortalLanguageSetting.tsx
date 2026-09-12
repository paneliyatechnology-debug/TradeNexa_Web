"use client";

import React from "react";
import { Check, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PortalLanguageSettingProps {
  compact?: boolean;
}

export default function PortalLanguageSetting({ compact = false }: PortalLanguageSettingProps) {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();

  return (
    <div className="surface-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t("settings.languageTitle", "Language / ભાષા / भाषा")}
          </p>
          <p className="text-xs text-muted-fg">
            {t("settings.languageDesc", "Select your preferred display language for products, categories, and account.")}
          </p>
        </div>
      </div>

      <div className={`mt-4 grid gap-3 ${compact ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3"}`}>
        {languages.map((lang) => {
          const isSelected = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary-soft text-primary ring-2 ring-primary/20 shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl leading-none shrink-0">{lang.flag}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate">{lang.nativeName}</p>
                  <p className="text-xs text-muted-fg leading-tight truncate">{lang.name}</p>
                </div>
              </div>

              {isSelected && (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
