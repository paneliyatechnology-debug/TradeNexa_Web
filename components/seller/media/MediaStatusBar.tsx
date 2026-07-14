"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface MediaStatusBarProps {
  imageCount: number;
  videoCount: number;
  maxTotal: number;
  remaining: number;
}

export default function MediaStatusBar({
  imageCount,
  videoCount,
  maxTotal,
  remaining,
}: MediaStatusBarProps) {
  const used = imageCount + videoCount;
  const pct = Math.min(100, (used / maxTotal) * 100);
  const atLimit = remaining <= 0;

  return (
    <div className="rounded-xl border border-border bg-muted px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="text-muted-fg">
            Images:{" "}
            <span className="font-semibold text-foreground">
              {imageCount}/{maxTotal}
            </span>
          </span>
          <span className="text-muted-fg">
            Videos:{" "}
            <span className="font-semibold text-foreground">
              {videoCount}/{maxTotal}
            </span>
          </span>
          <span className={atLimit ? "font-semibold text-warning" : "text-muted-fg"}>
            Remaining:{" "}
            <span className="font-semibold text-foreground">{remaining}</span>
          </span>
        </div>

        {atLimit ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-warning/30 bg-warning-soft px-2.5 py-1 text-[11px] font-semibold text-warning">
            <AlertTriangle className="h-3.5 w-3.5" />
            Maximum media reached
          </span>
        ) : null}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div
          className={`h-full rounded-full ${atLimit ? "bg-warning" : "bg-primary"}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <p className="mt-2 text-[11px] text-muted-fg">
        Up to {maxTotal} photos + videos combined. Thumbnail is separate.
      </p>
    </div>
  );
}
