"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import BenefitCard from "@/components/BenefitCard";
import CTABanner from "@/components/CTABanner";
import { useApp } from "@/app/context/AppContext";
import { Building, Upload, ShieldCheck, Mail, LineChart, Globe } from "lucide-react";

export default function SellerBenefits() {
  const { openRegisterModal } = useApp();

  const benefits = [
    {
      icon: Building,
      title: "Business Profile Setup",
      description: "Establish a comprehensive corporate profile listing address, registration details, catalog links, and operational scale.",
      points: [
        "Include GSTIN and business registration verification.",
        "Add custom company brochures and branding logos.",
        "Highlight factory size, export status, and capabilities."
      ],
      highlighted: false,
    },
    {
      icon: Upload,
      title: "Unlimited Product Listings",
      description: "List your complete product catalog, specify distinct models, list dimensions, and outline wholesale bulk discount levels.",
      points: [
        "No listing caps or high subscription listing boundaries.",
        "Detailed descriptions, technical specifications, and rich graphics.",
        "Manage prices dynamically in response to market raw material rates."
      ],
      highlighted: true,
    },
    {
      icon: Globe,
      title: "Business Visibility",
      description: "Stand out in search query results. Our SEO-friendly category system feeds detailed product listings straight into search engines.",
      points: [
        "Optimized pages designed for high search result ranking.",
        "Dedicated category mapping based on product keywords.",
        "Clean sharing URLs to promote your catalog externally."
      ],
      highlighted: false,
    },
    {
      icon: Mail,
      title: "Lead Generation",
      description: "Receive hot, actionable business leads from commercial buyers looking for products in your specific category.",
      points: [
        "Direct RFQs sent straight to your email or dashboard.",
        "Verified buyer contact details including phone numbers.",
        "Filter and categorize incoming leads by region or budget."
      ],
      highlighted: false,
    },
    {
      icon: LineChart,
      title: "Inquiry Management",
      description: "Use simplified messaging setups to follow up with leads, dispatch custom quotes, and keep track of negotiations.",
      points: [
        "Receive instant notifications for every inquiry.",
        "Track customer follow-up statuses inside your workspace.",
        "Archive past communications for long-term customer relations."
      ],
      highlighted: false,
    },
    {
      icon: ShieldCheck,
      title: "Professional Online Presence",
      description: "Generate instant credibility. Your catalog serves as a clean, responsive mini-website that you can share with potential clients.",
      points: [
        "Modern layout that renders perfectly on mobile viewports.",
        "Integrated inquiry form on every product page.",
        "Verification status badge highlighting your business trust."
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
            For Sellers
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Empowering Sellers to Scale Digital Trade
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-500">
            List your business catalog on India's smart marketplace directory. Attract verified procurers and collect direct sales inquiries without paying commission.
          </p>

          <div className="pt-6">
            <button
              onClick={() => openRegisterModal("seller")}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary-hover transition shadow-md shadow-primary/10"
            >
              Get Started as a Seller
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-white flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Features"
            title="Sellers Growth Suite"
            subtitle="Discover everything you receive when launching your catalog pages on our platform."
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
