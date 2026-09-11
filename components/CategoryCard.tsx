"use client";

import React from "react";
import Link from "next/link";
import { Tag, Layers, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import CatalogImage from "@/components/catalog/CatalogImage";
import { getCategoryFallbackIcon } from "@/utils/categoryIcons";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon?: LucideIcon | string | null;
  iconUrl?: string | null;
  imageUrl?: string | null;
  slug?: string;
  title: string;
  description?: string;
  productCount?: number;
  subcategoryCount?: number;
  href?: string;
  delay?: number;
}

export default function CategoryCard({
  icon: iconProp,
  iconUrl,
  imageUrl,
  slug,
  title,
  description,
  productCount = 0,
  subcategoryCount,
  href,
  delay = 0,
}: CategoryCardProps) {
  const statsLabel =
    productCount > 0
      ? `${productCount.toLocaleString()} products`
      : subcategoryCount !== undefined
        ? `${subcategoryCount} subcategories`
        : "Explore";

  const LucideIconComp = typeof iconProp === "function" ? iconProp : undefined;
  const FallbackIcon = LucideIconComp ?? getCategoryFallbackIcon(slug, title);
  const imageSrc = imageUrl || iconUrl || (typeof iconProp === "string" ? iconProp : null);

  const inner = (
    <>
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-muted">
        <CatalogImage
          src={imageSrc}
          alt={title}
          fallbackIcon={FallbackIcon}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card/70 to-transparent pointer-events-none" />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1 text-[10px] font-bold text-muted-fg shadow-sm backdrop-blur-sm">
          <Tag className="h-3 w-3 text-primary" />
          {statsLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        {description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-fg">{description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xs font-semibold text-primary">View subcategories</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </>
  );

  console.log(`[CategoryCard] Title: "${title}", Image URL:`, imageSrc);

  const className =
    "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/25";

  if (href) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay }}
        whileHover={{ y: -4 }}
        className="h-full"
      >
        <Link href={href} className={className}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4 }}
      className={className}
    >
      {inner}
    </motion.div>
  );
}
