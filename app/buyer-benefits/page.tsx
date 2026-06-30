"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import BenefitCard from "@/components/BenefitCard";
import CTABanner from "@/components/CTABanner";
import Link from "next/link";
import { Search, CheckCircle, List, Zap, Clock, ShieldCheck } from "lucide-react";

export default function BuyerBenefits() {
  const benefits = [
    {
      icon: Search,
      title: "Easy Search",
      description: "Instantly find bulk industrial materials, components, and goods by keywords, brand models, or industrial segments.",
      points: [
        "Faceted sidebar filters to sort items by region or city.",
        "Keyword auto-suggestions indicating active catalogs.",
        "Mobile-first responsive search layout."
      ],
      highlighted: false,
    },
    {
      icon: CheckCircle,
      title: "Verified Sellers",
      description: "Source confidently. We verify registered seller profiles by checking PAN, GST registration status, and physical location.",
      points: [
        "Distinct verification trust badge on profiles.",
        "View registered office location and contact details.",
        "Report suspicious catalog listings instantly to admins."
      ],
      highlighted: true,
    },
    {
      icon: List,
      title: "Multiple Product Options",
      description: "Compare multiple manufacturing suppliers offering the same components or goods in order to achieve competitive bulk pricing.",
      points: [
        "Broader market view across small, medium, and large mills.",
        "Access technical catalogs and downloadable brochures.",
        "Explore related products in identical category pages."
      ],
      highlighted: false,
    },
    {
      icon: Zap,
      title: "Quick Contact",
      description: "Reach out to target companies directly. Send a digital inquiry or use direct call lines to request quotes in seconds.",
      points: [
        "Direct RFQs forwarded immediately without broker steps.",
        "Integration for direct call, mail, or message channels.",
        "No platform brokerage fees or contact access limits."
      ],
      highlighted: false,
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Avoid manual directory phone calls. Distribute a single Request for Quote (RFQ) to multiple sellers simultaneously.",
      points: [
        "Sellers contact you back with pricing quotes.",
        "Receive matching catalogs within hours.",
        "Consolidated dashboard view to manage active inquiries."
      ],
      highlighted: false,
    },
    {
      icon: ShieldCheck,
      title: "Reliable Marketplace",
      description: "Our structured directory ensures that spam profiles and invalid listings are weeded out, keeping the focus on genuine trade.",
      points: [
        "Constant monitoring of seller activity.",
        "Clean, spam-free interfaces without banner ads.",
        "Direct B2B matching focused purely on business procurement."
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Hero */}
      <section className="relative bg-slate-50 py-16 border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-4">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            For Buyers
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Streamlined Bulk Sourcing for Buyers
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-500">
            Find the right wholesale partner. Source raw materials, machinery, finished goods, and commercial products directly from verified sellers across India.
          </p>

          <div className="pt-6">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary-hover transition shadow-md shadow-primary/10"
            >
              Start Sourcing Products
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-white flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Solutions"
            title="Procurement Advantages"
            subtitle="Discover how our simplified B2B platform saves weeks of manual vendor sourcing."
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, idx) => (
              <BenefitCard
                key={idx}
                icon={b.icon}
                title={b.title}
                description={b.description}
                points={b.points}
                highlighted={b.highlighted}
                delay={idx * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner />
    </div>
  );
}
