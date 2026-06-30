"use client";

import React from "react";
import { LucideIcon, Tag } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  productCount: number;
  delay?: number;
}

export default function CategoryCard({
  icon: Icon,
  title,
  description,
  productCount,
  delay = 0,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-lg"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Icon className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            <Tag className="h-3.5 w-3.5" />
            {productCount.toLocaleString()}+ Items
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Explore Products & Sellers →
      </div>
    </motion.div>
  );
}
