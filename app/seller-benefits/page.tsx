"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import BenefitCard from "@/components/BenefitCard";
import CTABanner from "@/components/CTABanner";
import MarketplacePageHero from "@/components/catalog/marketplace/MarketplacePageHero";
import { MARKETPLACE_CONTAINER } from "@/components/catalog/marketplace/marketplaceLayout";
import { useApp } from "@/app/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/common/Button";
import { Building, Upload, ShieldCheck, Mail, LineChart, Globe } from "lucide-react";

export default function SellerBenefits() {
  const { openRegisterModal } = useApp();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Building,
      title: t("sellerBenefits.b1Title", "Business Profile Setup"),
      description: t(
        "sellerBenefits.b1Desc",
        "Establish a comprehensive corporate profile listing address, registration details, catalog links, and operational scale."
      ),
      points: [
        t("sellerBenefits.b1p1", "Include GSTIN and business registration verification."),
        t("sellerBenefits.b1p2", "Add custom company brochures and branding logos."),
        t("sellerBenefits.b1p3", "Highlight factory size, export status, and capabilities."),
      ],
      highlighted: false,
    },
    {
      icon: Upload,
      title: t("sellerBenefits.b2Title", "Unlimited Product Listings"),
      description: t(
        "sellerBenefits.b2Desc",
        "List your complete product catalog, specify distinct models, list dimensions, and outline wholesale bulk discount levels."
      ),
      points: [
        t("sellerBenefits.b2p1", "No listing caps or high subscription listing boundaries."),
        t("sellerBenefits.b2p2", "Detailed descriptions, technical specifications, and rich graphics."),
        t("sellerBenefits.b2p3", "Manage prices dynamically in response to market raw material rates."),
      ],
      highlighted: true,
    },
    {
      icon: Globe,
      title: t("sellerBenefits.b3Title", "Business Visibility"),
      description: t(
        "sellerBenefits.b3Desc",
        "Stand out in search query results. Our SEO-friendly category system feeds detailed product listings straight into search engines."
      ),
      points: [
        t("sellerBenefits.b3p1", "Optimized pages designed for high search result ranking."),
        t("sellerBenefits.b3p2", "Dedicated category mapping based on product keywords."),
        t("sellerBenefits.b3p3", "Clean sharing URLs to promote your catalog externally."),
      ],
      highlighted: false,
    },
    {
      icon: Mail,
      title: t("sellerBenefits.b4Title", "Lead Generation"),
      description: t(
        "sellerBenefits.b4Desc",
        "Receive hot, actionable business leads from commercial buyers looking for products in your specific category."
      ),
      points: [
        t("sellerBenefits.b4p1", "Direct RFQs sent straight to your email or dashboard."),
        t("sellerBenefits.b4p2", "Verified buyer contact details including phone numbers."),
        t("sellerBenefits.b4p3", "Filter and categorize incoming leads by region or budget."),
      ],
      highlighted: false,
    },
    {
      icon: LineChart,
      title: t("sellerBenefits.b5Title", "Inquiry Management"),
      description: t(
        "sellerBenefits.b5Desc",
        "Use simplified messaging setups to follow up with leads, dispatch custom quotes, and keep track of negotiations."
      ),
      points: [
        t("sellerBenefits.b5p1", "Receive instant notifications for every inquiry."),
        t("sellerBenefits.b5p2", "Track customer follow-up statuses inside your workspace."),
        t("sellerBenefits.b5p3", "Archive past communications for long-term customer relations."),
      ],
      highlighted: false,
    },
    {
      icon: ShieldCheck,
      title: t("sellerBenefits.b6Title", "Professional Online Presence"),
      description: t(
        "sellerBenefits.b6Desc",
        "Generate instant credibility. Your catalog serves as a clean, responsive mini-website that you can share with potential clients."
      ),
      points: [
        t("sellerBenefits.b6p1", "Modern layout that renders perfectly on mobile viewports."),
        t("sellerBenefits.b6p2", "Integrated inquiry form on every product page."),
        t("sellerBenefits.b6p3", "Verification status badge highlighting your business trust."),
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketplacePageHero
        eyebrow={t("sellerBenefits.eyebrow", "For Sellers")}
        title={t("sellerBenefits.heroTitle", "Empowering Sellers to Scale Digital Trade")}
        subtitle={t(
          "sellerBenefits.heroSubtitle",
          "List your business catalog on India's smart marketplace directory. Attract verified procurers and collect direct sales inquiries without paying commission."
        )}
      >
        {!isAuthenticated && (
          <Button onClick={() => openRegisterModal("seller")}>
            {t("sellerBenefits.getStartedCta", "Get Started as a Seller")}
          </Button>
        )}
      </MarketplacePageHero>

      <section className="flex-1 py-12 lg:py-16">
        <div className={MARKETPLACE_CONTAINER}>
          <SectionHeading
            badge={t("sellerBenefits.featuresBadge", "Features")}
            title={t("sellerBenefits.sectionTitle", "Sellers Growth Suite")}
            subtitle={t(
              "sellerBenefits.sectionSubtitle",
              "Discover everything you receive when launching your catalog pages on our platform."
            )}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, idx) => (
              <BenefitCard
                key={idx}
                icon={b.icon}
                title={b.title}
                description={b.description}
                points={b.points}
                highlighted={b.highlighted}
                badge={b.highlighted ? t("sellerBenefits.mostListedBadge", "Most listed") : undefined}
                delay={idx * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
