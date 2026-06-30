"use client";

import React, { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import CategoryCard from "@/components/CategoryCard";
import CTABanner from "@/components/CTABanner";
import { Search, Info, SlidersHorizontal, RefreshCw } from "lucide-react";
import {
  Tv,
  Wrench,
  Sprout,
  HeartPulse,
  Armchair,
  Car,
  Box,
  HardHat,
  Apple,
  Shirt,
  FlaskConical,
  Zap
} from "lucide-react";

export default function Categories() {
  const [filterQuery, setFilterQuery] = useState("");

  const allCategories = [
    { title: "Electronics", description: "Consumer electronics, wiring, semiconductors & components.", count: 2400, icon: Tv },
    { title: "Industrial Machinery", description: "Heavy fabrication plants, lathe machines & spare factory tools.", count: 1850, icon: Wrench },
    { title: "Agriculture", description: "Organic crop supplies, seeds, fertilizers & harvesting tools.", count: 1200, icon: Sprout },
    { title: "Medical & Healthcare", description: "Clinical supplies, surgical instruments & diagnostics apparatus.", count: 980, icon: HeartPulse },
    { title: "Furniture & Decor", description: "Office cabins, steel racks, wood fittings & commercial seating.", count: 800, icon: Armchair },
    { title: "Automobile & Parts", description: "Engine gears, brake pads, lights & auto body components.", count: 1400, icon: Car },
    { title: "Packaging Materials", description: "Corrugated boxes, food containers, wrapping films & tape rolls.", count: 1150, icon: Box },
    { title: "Construction & Real Estate", description: "Cement, TMT bars, bricks, scaffolding & safety gear.", count: 950, icon: HardHat },
    { title: "Food Processing", description: "Grains sorting, packing conveyor belts & commercial oven lines.", count: 720, icon: Apple },
    { title: "Textiles & Apparel", description: "Yarn rolls, cotton fabrics, clothing, and custom uniform items.", count: 3100, icon: Shirt },
    { title: "Chemicals & Minerals", description: "Industrial solvents, coloring agents, polymers & fertilizers.", count: 1500, icon: FlaskConical },
    { title: "Electrical Supplies", description: "Power transformers, switchgear boards, PVC conduits & circuit breaker boxes.", count: 1720, icon: Zap },
  ];

  const filtered = allCategories.filter((cat) =>
    cat.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Hero */}
      <section className="relative bg-slate-50 py-16 border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-6">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Directory
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Explore B2B Categories & Industries
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-500">
            Browse through our extensive collection of industrial, agricultural, and consumer goods categories to discover matching verified sellers.
          </p>

          {/* Search/Filter Bar */}
          <div className="mx-auto max-w-xl relative mt-4">
            <div className="relative rounded-2xl shadow-md border border-slate-200 bg-white">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search categories (e.g. Electronics, Machinery...)"
                className="w-full pl-12 pr-16 py-3.5 bg-transparent rounded-2xl text-sm outline-none text-slate-900 transition-colors focus:ring-2 focus:ring-primary/20"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  {filtered.length} Found
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 bg-white flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((cat, idx) => (
                <CategoryCard
                  key={idx}
                  icon={cat.icon}
                  title={cat.title}
                  description={cat.description}
                  productCount={cat.count}
                  delay={idx * 0.03}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center max-w-md mx-auto">
              <Info className="h-12 w-12 text-slate-350 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No categories match your search</h3>
              <p className="text-sm text-slate-500 mt-1">Try searching for generic terms like "chemicals", "machinery", or "apparel".</p>
              <button
                onClick={() => setFilterQuery("")}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover"
              >
                <RefreshCw className="h-4 w-4" /> Reset search filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <CTABanner />
    </div>
  );
}
