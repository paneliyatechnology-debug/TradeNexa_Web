"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface PortalEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PortalEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: PortalEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-portal-border bg-card px-6 py-14 text-center"
    >
      <div className="mb-3 rounded-lg bg-muted p-3">
        <Icon className="h-7 w-7 text-muted-fg" aria-hidden />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-fg">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </motion.div>
  );
}
