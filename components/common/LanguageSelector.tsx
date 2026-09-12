"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageSelectorProps {
  className?: string;
  isMobile?: boolean;
  align?: "left" | "right" | "auto";
}

export function LanguageSelector({
  className = "",
  isMobile = false,
  align = "auto",
}: LanguageSelectorProps) {
  const { currentLanguage, activeLanguageOption, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const alignClasses =
    align === "left"
      ? "left-0"
      : align === "right"
      ? "right-0"
      : "left-0 sm:left-auto sm:right-0";

  if (isMobile) {
    return (
      <div className={`w-full py-2 ${className}`}>
        <div className="flex items-center gap-2 mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Globe className="w-3.5 h-3.5 text-primary" />
          <span>Language / ભાષા / भाषा</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {languages.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg font-medium border transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary text-primary font-semibold"
                    : "bg-background border-border text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-sm">{lang.flag}</span>
                  <span className="truncate">{lang.nativeName}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Select Language"
      >
        <span className="text-base leading-none">{activeLanguageOption.flag}</span>
        <span className="font-semibold">{activeLanguageOption.nativeName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute ${alignClasses} mt-2 w-48 max-w-[calc(100vw-2rem)] rounded-xl bg-card border border-border shadow-2xl p-1.5 z-[999] focus:outline-none`}
          >
            <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-fg uppercase tracking-wider flex items-center gap-1.5 border-b border-border/60 mb-1">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>Select Language</span>
            </div>
            <div className="space-y-0.5">
              {languages.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all text-left ${
                      isSelected
                        ? "bg-primary-soft text-primary font-semibold shadow-xs"
                        : "text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base leading-none shrink-0">{lang.flag}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-xs leading-tight truncate">{lang.nativeName}</span>
                        <span className="text-[10px] text-muted-fg leading-tight truncate">
                          {lang.name}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-1.5 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
