"use client";

import React from "react";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import BenefitCard from "@/components/BenefitCard";
import CTABanner from "@/components/CTABanner";
import MarketplacePageHero from "@/components/catalog/marketplace/MarketplacePageHero";
import { MARKETPLACE_CONTAINER } from "@/components/catalog/marketplace/marketplaceLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/common/Button";
import { Search, CheckCircle, List, Zap, Clock, ShieldCheck, ArrowRight } from "lucide-react";

export default function BuyerBenefits() {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Search,
      title: t("buyerBenefits.b1Title", "Easy Search"),
      description: t(
        "buyerBenefits.b1Desc",
        "Instantly find bulk industrial materials, components, and goods by keywords, brand models, or industrial segments."
      ),
      points: [
        t("buyerBenefits.b1p1", "Faceted sidebar filters to sort items by region or city."),
        t("buyerBenefits.b1p2", "Keyword auto-suggestions indicating active catalogs."),
        t("buyerBenefits.b1p3", "Mobile-first responsive search layout."),
      ],
      highlighted: false,
    },
    {
      icon: CheckCircle,
      title: t("buyerBenefits.b2Title", "Verified Sellers"),
      description: t(
        "buyerBenefits.b2Desc",
        "Source confidently. We verify registered seller profiles by checking PAN, GST registration status, and physical location."
      ),
      points: [
        t("buyerBenefits.b2p1", "Distinct verification trust badge on profiles."),
        t("buyerBenefits.b2p2", "View registered office location and contact details."),
        t("buyerBenefits.b2p3", "Report suspicious catalog listings instantly to admins."),
      ],
      highlighted: true,
    },
    {
      icon: List,
      title: t("buyerBenefits.b3Title", "Multiple Product Options"),
      description: t(
        "buyerBenefits.b3Desc",
        "Compare multiple manufacturing suppliers offering the same components or goods in order to achieve competitive bulk pricing."
      ),
      points: [
        t("buyerBenefits.b3p1", "Broader market view across small, medium, and large mills."),
        t("buyerBenefits.b3p2", "Access technical catalogs and downloadable brochures."),
        t("buyerBenefits.b3p3", "Explore related products in identical category pages."),
      ],
      highlighted: false,
    },
    {
      icon: Zap,
      title: t("buyerBenefits.b4Title", "Quick Contact"),
      description: t(
        "buyerBenefits.b4Desc",
        "Reach out to target companies directly. Send a digital inquiry or use direct call lines to request quotes in seconds."
      ),
      points: [
        t("buyerBenefits.b4p1", "Direct RFQs forwarded immediately without broker steps."),
        t("buyerBenefits.b4p2", "Integration for direct call, mail, or message channels."),
        t("buyerBenefits.b4p3", "No platform brokerage fees or contact access limits."),
      ],
      highlighted: false,
    },
    {
      icon: Clock,
      title: t("buyerBenefits.b5Title", "Save Time"),
      description: t(
        "buyerBenefits.b5Desc",
        "Avoid manual directory phone calls. Distribute a single Request for Quote (RFQ) to multiple sellers simultaneously."
      ),
      points: [
        t("buyerBenefits.b5p1", "Sellers contact you back with pricing quotes."),
        t("buyerBenefits.b5p2", "Receive matching catalogs within hours."),
        t("buyerBenefits.b5p3", "Consolidated dashboard view to manage active inquiries."),
      ],
      highlighted: false,
    },
    {
      icon: ShieldCheck,
      title: t("buyerBenefits.b6Title", "Reliable Marketplace"),
      description: t(
        "buyerBenefits.b6Desc",
        "Our structured directory ensures that spam profiles and invalid listings are weeded out, keeping the focus on genuine trade."
      ),
      points: [
        t("buyerBenefits.b6p1", "Constant monitoring of seller activity."),
        t("buyerBenefits.b6p2", "Clean, spam-free interfaces without banner ads."),
        t("buyerBenefits.b6p3", "Direct B2B matching focused purely on business procurement."),
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketplacePageHero
        eyebrow={t("buyerBenefits.eyebrow", "For Buyers")}
        title={t("buyerBenefits.heroTitle", "Streamlined Bulk Sourcing for Buyers")}
        subtitle={t(
          "buyerBenefits.heroSubtitle",
          "Find the right wholesale partner. Source raw materials, machinery, finished goods, and commercial products directly from verified sellers across India."
        )}
      >
        <Link href="/categories">
          <Button>
            {t("buyerBenefits.startSourcingCta", "Start Sourcing Products")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </MarketplacePageHero>

      <section className="flex-1 py-12 lg:py-16">
        <div className={MARKETPLACE_CONTAINER}>
          <SectionHeading
            badge={t("buyerBenefits.solutionsBadge", "Solutions")}
            title={t("buyerBenefits.sectionTitle", "Procurement Advantages")}
            subtitle={t(
              "buyerBenefits.sectionSubtitle",
              "Discover how our simplified B2B platform saves weeks of manual vendor sourcing."
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
                badge={b.highlighted ? t("buyerBenefits.topRatedBadge", "Top rated") : undefined}
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
