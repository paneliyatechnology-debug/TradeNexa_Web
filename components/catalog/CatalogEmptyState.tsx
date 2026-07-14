"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/common/Button";

interface CatalogEmptyStateProps {
  title: string;
  description: string;
  onReset?: () => void;
  resetLabel?: string;
}

export default function CatalogEmptyState({
  title,
  description,
  onReset,
  resetLabel = "Reset filters",
}: CatalogEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="mx-auto max-w-md py-14 text-center sm:py-16"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted">
        <Package className="h-6 w-6 text-muted-fg" />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-fg">{description}</p>
      {onReset && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RefreshCw className="h-3.5 w-3.5" />
            {resetLabel}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
