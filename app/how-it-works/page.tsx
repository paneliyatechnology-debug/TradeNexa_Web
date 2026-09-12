"use client";

import React, { useState } from "react";
import Link from "next/link";
import CTABanner from "@/components/CTABanner";
import MarketplacePageHero from "@/components/catalog/marketplace/MarketplacePageHero";
import { MARKETPLACE_CONTAINER } from "@/components/catalog/marketplace/marketplaceLayout";
import { useApp } from "@/app/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/common/Button";
import { motion } from "framer-motion";
import {
  UserPlus,
  Building,
  Upload,
  MessageSquare,
  TrendingUp,
  Search,
  CheckCircle,
  MailQuestion,
  Users2,
  ShieldCheck,
  ArrowRight,
  ArrowLeftRight,
  Store,
  ShoppingCart,
} from "lucide-react";

type TabRole = "sellers" | "buyers" | "both";

export default function HowItWorks() {
  const { openRegisterModal } = useApp();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabRole>("sellers");

  const sellerSteps = [
    {
      title: t("howItWorks.sellerStep1Title", "Create Account"),
      desc: t("howItWorks.sellerStep1Desc", "Sign up in 30 seconds using your mobile number and business details."),
      icon: UserPlus,
    },
    {
      title: t("howItWorks.sellerStep2Title", "Create Business Profile"),
      desc: t("howItWorks.sellerStep2Desc", "Add GST credentials, office addresses, and categories to build trust."),
      icon: Building,
    },
    {
      title: t("howItWorks.sellerStep3Title", "Upload Products"),
      desc: t("howItWorks.sellerStep3Desc", "List bulk supplies, upload catalogs, and define flexible pricing terms."),
      icon: Upload,
    },
    {
      title: t("howItWorks.sellerStep4Title", "Receive Buyer Inquiries"),
      desc: t("howItWorks.sellerStep4Desc", "Interested procurers send purchase requirements. You get alerts instantly."),
      icon: MessageSquare,
    },
    {
      title: t("howItWorks.sellerStep5Title", "Grow Business"),
      desc: t("howItWorks.sellerStep5Desc", "Respond via WhatsApp, call, or email to finalize bulk sales nationwide."),
      icon: TrendingUp,
    },
  ];

  const buyerSteps = [
    {
      title: t("howItWorks.buyerStep1Title", "Search Products"),
      desc: t("howItWorks.buyerStep1Desc", "Use keyword search or filters to locate products, supplies, and manufacturers."),
      icon: Search,
    },
    {
      title: t("howItWorks.buyerStep2Title", "Compare Sellers"),
      desc: t("howItWorks.buyerStep2Desc", "Review verification badges, catalogs, and filter by logistics capability."),
      icon: CheckCircle,
    },
    {
      title: t("howItWorks.buyerStep3Title", "Send Inquiry"),
      desc: t("howItWorks.buyerStep3Desc", "Fill in the RFQ form specifying quantities and specifications."),
      icon: MailQuestion,
    },
    {
      title: t("howItWorks.buyerStep4Title", "Connect Directly"),
      desc: t("howItWorks.buyerStep4Desc", "Communicate with sellers via phone, email, or chat — no platform fees."),
      icon: Users2,
    },
    {
      title: t("howItWorks.buyerStep5Title", "Purchase with Confidence"),
      desc: t("howItWorks.buyerStep5Desc", "Finalize payment and delivery conditions with your verified partner."),
      icon: ShieldCheck,
    },
  ];

  const bothSteps = [
    {
      title: t("howItWorks.bothStep1Title", "Register Once"),
      desc: t("howItWorks.bothStep1Desc", "Choose 'Both' during signup to enable buyer and seller capabilities in one account."),
      icon: ArrowLeftRight,
    },
    {
      title: t("howItWorks.bothStep2Title", "Set Up Dual Profile"),
      desc: t("howItWorks.bothStep2Desc", "Configure your buying needs and selling catalog from a unified dashboard."),
      icon: Building,
    },
    {
      title: t("howItWorks.bothStep3Title", "Source & Supply"),
      desc: t("howItWorks.bothStep3Desc", "Procure raw materials from other sellers while listing your own products."),
      icon: Store,
    },
    {
      title: t("howItWorks.bothStep4Title", "Manage Both Flows"),
      desc: t("howItWorks.bothStep4Desc", "Track incoming RFQs and outgoing purchase inquiries in one place."),
      icon: ShoppingCart,
    },
    {
      title: t("howItWorks.bothStep5Title", "Scale Both Sides"),
      desc: t("howItWorks.bothStep5Desc", "Expand sourcing networks and customer base simultaneously across India."),
      icon: TrendingUp,
    },
  ];

  const tabs: { id: TabRole; label: string }[] = [
    { id: "sellers", label: t("howItWorks.tabSellers", "For Sellers") },
    { id: "buyers", label: t("howItWorks.tabBuyers", "For Buyers") },
    { id: "both", label: t("howItWorks.tabBoth", "For Both") },
  ];

  const tabConfig = {
    sellers: {
      badge: t("howItWorks.sellerBadge", "Seller Journey"),
      title: t("howItWorks.sellerTitle", "List, Discover, and Scale"),
      subtitle: t("howItWorks.sellerSubtitle", "Five simple steps to take your offline manufacturing or wholesale trade digital."),
      steps: sellerSteps,
      cta: { label: t("howItWorks.sellerCta", "Start Listing Your Products"), role: "seller" as const },
    },
    buyers: {
      badge: t("howItWorks.buyerBadge", "Buyer Journey"),
      title: t("howItWorks.buyerTitle", "Locate, Request, and Negotiate"),
      subtitle: t("howItWorks.buyerSubtitle", "Five straightforward milestones for sourcing bulk materials safely and quickly."),
      steps: buyerSteps,
      cta: { label: t("howItWorks.buyerCta", "Browse Product Catalog"), href: "/categories" },
    },
    both: {
      badge: t("howItWorks.bothBadge", "Dual-Role Journey"),
      title: t("howItWorks.bothTitle", "Buy, Sell, and Grow Together"),
      subtitle: t("howItWorks.bothSubtitle", "One account for businesses that source materials and sell finished goods."),
      steps: bothSteps,
      cta: { label: t("howItWorks.bothCta", "Register as Buyer & Seller"), role: "both" as const },
    },
  };

  const config = tabConfig[activeTab];

  const renderCta = () => {
    if (activeTab === "buyers") {
      return (
        <Link href="/categories">
          <Button>
            {t("howItWorks.buyerCta", "Browse Product Catalog")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      );
    }
    if (isAuthenticated) return null;
    const role = activeTab === "sellers" ? "seller" : "both";
    return (
      <Button onClick={() => openRegisterModal(role)}>
        {config.cta.label}
        <ArrowRight className="h-4 w-4" />
      </Button>
    );
  };

  const cta = renderCta();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketplacePageHero
        eyebrow={t("howItWorks.eyebrow", "Ecosystem")}
        title={t("howItWorks.heroTitle", "How Our Marketplace Connects Businesses")}
        subtitle={t(
          "howItWorks.heroSubtitle",
          "Whether you sell, buy, or do both — here is how TradeNexa works for your business."
        )}
      >
        <div className="inline-flex rounded-xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all sm:px-6 ${
                activeTab === tab.id
                  ? "bg-white text-navy shadow"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </MarketplacePageHero>

      <section className="flex-1 py-12 lg:py-16">
        <div className={MARKETPLACE_CONTAINER}>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-2 inline-block rounded bg-primary/15 px-2.5 py-0.5 text-xs font-semibold uppercase text-primary">
              {config.badge}
            </span>
            <h2 className="text-2xl font-semibold text-foreground">{config.title}</h2>
            <p className="mt-1 text-sm text-muted-fg">{config.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            {config.steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="group relative flex flex-col justify-between surface-card-hover p-6"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-2xl font-bold text-border transition-colors group-hover:text-primary/20">
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-foreground">{step.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-fg">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {cta && <div className="mt-12 text-center">{cta}</div>}
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
