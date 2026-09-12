"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import CTABanner from "@/components/CTABanner";
import MarketplacePageHero from "@/components/catalog/marketplace/MarketplacePageHero";
import { MARKETPLACE_CONTAINER } from "@/components/catalog/marketplace/marketplaceLayout";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const comparisonItems = [
    {
      feature: t("whyChooseUs.f1Name", "Lead Generation Speed"),
      traditional: t(
        "whyChooseUs.f1Trad",
        "Months searching contacts at local expos and directories"
      ),
      platform: t(
        "whyChooseUs.f1Plat",
        "Instant buyer inquiries directly inside your dashboard"
      ),
    },
    {
      feature: t("whyChooseUs.f2Name", "Market Coverage"),
      traditional: t(
        "whyChooseUs.f2Trad",
        "Limited to your local region or state buyers"
      ),
      platform: t(
        "whyChooseUs.f2Plat",
        "Nationwide visibility across all major Indian cities"
      ),
    },
    {
      feature: t("whyChooseUs.f3Name", "Verification Trust"),
      traditional: t(
        "whyChooseUs.f3Trad",
        "Uncertain buyers and high risk of non-payment"
      ),
      platform: t(
        "whyChooseUs.f3Plat",
        "Strict profile check badge showing authenticated companies"
      ),
    },
    {
      feature: t("whyChooseUs.f4Name", "Product Showcasing"),
      traditional: t(
        "whyChooseUs.f4Trad",
        "Paper booklets or expensive custom websites"
      ),
      platform: t(
        "whyChooseUs.f4Plat",
        "Unlimited listing catalog with rich photos and description"
      ),
    },
    {
      feature: t("whyChooseUs.f5Name", "Direct Negotiations"),
      traditional: t(
        "whyChooseUs.f5Trad",
        "Intermediaries and brokers taking high cut commission"
      ),
      platform: t(
        "whyChooseUs.f5Plat",
        "Zero brokerage. Direct buyer-to-seller negotiation"
      ),
    },
    {
      feature: t("whyChooseUs.f6Name", "Accessibility"),
      traditional: t(
        "whyChooseUs.f6Trad",
        "Only manageable from physical office desk documents"
      ),
      platform: t(
        "whyChooseUs.f6Plat",
        "Mobile-responsive tracking anywhere, anytime"
      ),
    },
  ];

  const highlights = [
    {
      title: t("whyChooseUs.h1Title", "Faster Inquiries"),
      desc: t(
        "whyChooseUs.h1Desc",
        "Connect directly with manufacturers and sellers without waiting for agents or trade show dates."
      ),
    },
    {
      title: t("whyChooseUs.h2Title", "Better Visibility"),
      desc: t(
        "whyChooseUs.h2Desc",
        "SEO-friendly product structures help listings appear directly inside search results."
      ),
    },
    {
      title: t("whyChooseUs.h3Title", "Easy Product Listing"),
      desc: t(
        "whyChooseUs.h3Desc",
        "Load specifications, prices, images, and descriptions in minutes — no heavy website build costs."
      ),
    },
    {
      title: t("whyChooseUs.h4Title", "Verified Business Profiles"),
      desc: t(
        "whyChooseUs.h4Desc",
        "GST and corporate record validation builds instant confidence for buyers placing large orders."
      ),
    },
    {
      title: t("whyChooseUs.h5Title", "Simple Communication"),
      desc: t(
        "whyChooseUs.h5Desc",
        "Instant inquiry updates routed directly through text or mail, connecting buyers and sellers without friction."
      ),
    },
    {
      title: t("whyChooseUs.h6Title", "Nationwide Exposure"),
      desc: t(
        "whyChooseUs.h6Desc",
        "List products in New Delhi and gather inquiries from Chennai or Mumbai. Expand beyond physical borders."
      ),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketplacePageHero
        eyebrow={t("whyChooseUs.eyebrow", "Comparison")}
        title={t("whyChooseUs.heroTitle", "Why Choose Our Marketplace?")}
        subtitle={t(
          "whyChooseUs.heroSubtitle",
          "See how listing and sourcing on our modernized B2B marketplace stacks up against traditional, offline commercial channels."
        )}
      />

      <section className="flex-1 py-12 lg:py-16">
        <div className={MARKETPLACE_CONTAINER}>
          <SectionHeading
            badge={t("whyChooseUs.versusBadge", "Versus")}
            title={t(
              "whyChooseUs.tableTitle",
              "Traditional Business vs. Our B2B Marketplace"
            )}
            subtitle={t(
              "whyChooseUs.tableSubtitle",
              "Comparing key indicators affecting bulk lead generation and procurement speeds."
            )}
          />

          <div className="overflow-x-auto surface-card">
            <table className="w-full border-collapse text-left text-sm text-muted-fg">
              <thead className="border-b border-border bg-muted">
                <tr>
                  <th className="px-6 py-4 font-semibold text-foreground">
                    {t("whyChooseUs.colFeature", "Feature Segment")}
                  </th>
                  <th className="bg-error-soft/50 px-6 py-4 font-semibold text-error">
                    {t("whyChooseUs.colTraditional", "Traditional Business Channels")}
                  </th>
                  <th className="bg-primary-soft px-6 py-4 font-semibold text-primary">
                    {t("whyChooseUs.colPlatform", "Our Premium B2B Marketplace")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonItems.map((item, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-5 font-semibold text-foreground">{item.feature}</td>
                    <td className="bg-error-soft/30 px-6 py-5">
                      <div className="flex items-start gap-2">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-error" />
                        <span>{item.traditional}</span>
                      </div>
                    </td>
                    <td className="bg-primary-soft px-6 py-5">
                      <div className="flex items-start gap-2 font-medium text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item.platform}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="surface-card-hover p-6"
              >
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Check className="h-5 w-5 text-primary" />
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-fg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
