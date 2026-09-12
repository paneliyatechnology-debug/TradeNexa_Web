"use client";

import React, { useState } from "react";
import { Globe, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TranslatableTextProps {
  originalText?: string | null;
  translatedText?: string | null;
  className?: string;
  textClassName?: string;
  badgeClassName?: string;
  showBadge?: boolean;
}

export default function TranslatableText({
  originalText,
  translatedText,
  className = "",
  textClassName = "",
  badgeClassName = "",
  showBadge = true,
}: TranslatableTextProps) {
  const { t } = useLanguage();
  const [showOriginal, setShowOriginal] = useState(false);

  const original = (originalText ?? "").trim();
  const translated = (translatedText ?? "").trim();

  // If both empty, render nothing
  if (!translated && !original) return null;

  // It is translated if we have both original and translated text and they differ
  const isTranslated = Boolean(original && translated && original !== translated);

  const displayedText = isTranslated && showOriginal ? original : (translated || original);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <p className={`whitespace-pre-wrap break-words leading-relaxed text-foreground/90 ${textClassName}`}>
        {displayedText}
      </p>

      {isTranslated && showBadge ? (
        <div className={`flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-muted-fg ${badgeClassName}`}>
          <span className="inline-flex items-center gap-1 rounded-md bg-primary-soft/80 px-2 py-0.5 font-medium text-primary shadow-xs">
            <Globe className="h-3 w-3" />
            {showOriginal
              ? t("translation.originalText", "Original text")
              : t("translation.autoTranslated", "Auto-translated")}
          </span>

          <button
            type="button"
            onClick={() => setShowOriginal((prev) => !prev)}
            className="inline-flex cursor-pointer items-center gap-1 font-semibold text-primary transition hover:underline focus:outline-none"
          >
            <RefreshCw className="h-2.5 w-2.5" />
            {showOriginal
              ? t("translation.showTranslated", "Show translation")
              : t("translation.showOriginal", "Show original")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
