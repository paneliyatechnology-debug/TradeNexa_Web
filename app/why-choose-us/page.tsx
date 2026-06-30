"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import CTABanner from "@/components/CTABanner";
import { Check, X, Shield, Users, Compass, Megaphone, Smartphone, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const comparisonItems = [
    {
      feature: "Lead Generation Speed",
      traditional: "Months searching contacts at local expos and directories",
      platform: "Instant buyer inquiries directly inside your dashboard",
      status: true,
    },
    {
      feature: "Market Coverage",
      traditional: "Limited to your local region or state buyers",
      platform: "Nationwide visibility across all major Indian cities",
      status: true,
    },
    {
      feature: "Verification Trust",
      traditional: "Uncertain buyers and high risk of non-payment",
      platform: "Strict profile check badge showing authenticated companies",
      status: true,
    },
    {
      feature: "Product Showcasing",
      traditional: "Paper booklets or expensive custom websites",
      platform: "Unlimited listing catalog with rich photos and description",
      status: true,
    },
    {
      feature: "Direct Negotiations",
      traditional: "Intermediaries and brokers taking high cut commission",
      platform: "Zero brokerage. Direct buyer-to-seller negotiation",
      status: true,
    },
    {
      feature: "Accessibility",
      traditional: "Only manageable from physical office desk documents",
      platform: "Mobile-responsive tracking anywhere, anytime",
      status: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Hero */}
      <section className="relative bg-slate-50 py-16 border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-4">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Comparison
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Why Choose Our Marketplace?
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-500">
            See how listing and sourcing on our modernized B2B marketplace platform stacks up against traditional, offline commercial channels.
          </p>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-16 bg-white flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Versus"
            title="Traditional Business vs. Our B2B Marketplace"
            subtitle="Comparing key indicators affecting bulk lead generation and procurement speeds."
          />

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full border-collapse bg-white text-left text-sm text-slate-500">
              <thead className="bg-slate-55 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-900">Feature Segment</th>
                  <th className="px-6 py-4 font-bold text-red-650 bg-red-50/20">Traditional Business Channels</th>
                  <th className="px-6 py-4 font-bold text-primary bg-primary/5">Our Premium B2B Marketplace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonItems.map((item, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-5 font-semibold text-slate-900">{item.feature}</td>
                    <td className="px-6 py-5 bg-red-50/10">
                      <div className="flex items-start gap-2 text-slate-500">
                        <X className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                        <span>{item.traditional}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 bg-primary/5/10">
                      <div className="flex items-start gap-2 text-slate-900 font-medium">
                        <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item.platform}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Check Highlights */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                ✓ Faster Inquiries
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect directly with manufacturers and sellers without waiting for agents or trade show dates to process requirements.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                ✓ Better Visibility
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                SEO-friendly product structures help indexing search spiders read details, displaying listings directly inside search results.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                ✓ Easy Product Listing
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                A simple dashboard allows loading specifications, prices, images, and descriptions in minutes, avoiding heavy website build costs.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                ✓ Verified Business Profiles
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Strict GST and corporate record validation establishes safety, building instant confidence for buyers placing large orders.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                ✓ Simple Communication
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant inquiry updates routed directly through text or mail, connecting buyers and sellers without friction.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                ✓ Nationwide Exposure
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                List products in New Delhi and gather inquiries from Chennai or Mumbai. Expand business beyond physical borders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner />
    </div>
  );
}
