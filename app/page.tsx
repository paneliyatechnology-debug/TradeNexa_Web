"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import {
  ArrowRight,
  Search,
  CheckCircle,
  TrendingUp,
  UserPlus,
  Package,
  ArrowRightLeft,
  Smartphone,
  Zap,
  Globe,
  Lock,
  ShieldCheck,
  Building2,
} from "lucide-react";

import SectionHeading from "@/components/SectionHeading";
import ProcessStep from "@/components/ProcessStep";
import CTABanner from "@/components/CTABanner";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/common/Button";
import { MARKETPLACE_CONTAINER } from "@/components/catalog/marketplace/marketplaceLayout";

export default function Home() {
  const { openRegisterModal } = useApp();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const processSteps = [
    {
      number: "1",
      title: t("home.step1Title", "Create Profile"),
      description: t("home.step1Desc", "Seller creates a detailed, trustable business profile."),
      icon: UserPlus,
    },
    {
      number: "2",
      title: t("home.step2Title", "Upload Products"),
      description: t("home.step2Desc", "Seller lists products with pricing, specifications, and images."),
      icon: Package,
    },
    {
      number: "3",
      title: t("home.step3Title", "Search & Match"),
      description: t("home.step3Desc", "Buyer searches products and discovers verified listings."),
      icon: Search,
    },
    {
      number: "4",
      title: t("home.step4Title", "Direct Connect"),
      description: t("home.step4Desc", "Buyer contacts seller directly to finalize deals."),
      icon: ArrowRightLeft,
    },
  ];

  const features = [
    {
      icon: CheckCircle,
      title: t("home.featVerifiedSellers", "Verified Sellers"),
      description: t(
        "home.featVerifiedSellersDesc",
        "Every registered business goes through verification of GST, company PAN, and operational existence."
      ),
    },
    {
      icon: Search,
      title: t("home.featEasyDiscovery", "Easy Product Discovery"),
      description: t(
        "home.featEasyDiscoveryDesc",
        "Faceted category navigation and keyword search help you find the right commercial supplies."
      ),
    },
    {
      icon: Zap,
      title: t("home.featFastInquiries", "Fast Business Inquiries"),
      description: t(
        "home.featFastInquiriesDesc",
        "One-click RFQs send your requirements instantly to sellers for competitive quotes."
      ),
    },
    {
      icon: Lock,
      title: t("home.featSecureProfiles", "Secure Business Profiles"),
      description: t(
        "home.featSecureProfilesDesc",
        "Verified profiles and clean contact channels keep communications transparent."
      ),
    },
    {
      icon: Globe,
      title: t("home.featNationwideReach", "Nationwide Reach"),
      description: t(
        "home.featNationwideReachDesc",
        "Discover manufacturers, wholesale distributors, and sellers across India."
      ),
    },
    {
      icon: Smartphone,
      title: t("home.featMobileFriendly", "Mobile Friendly"),
      description: t(
        "home.featMobileFriendlyDesc",
        "Optimized for mobile so business owners can manage leads on the go."
      ),
    },
  ];

  const trustPoints = [
    { icon: ShieldCheck, label: t("home.trustGstPan", "GST & PAN verification") },
    { icon: Building2, label: t("home.trustBusinessProfiles", "Business profiles") },
    { icon: Zap, label: t("home.trustDirectRfq", "Direct RFQ & inquiries") },
  ];

  const stats = [
    { label: t("home.statProductsListed", "Products Listed"), value: "10,000+" },
    { label: t("home.statVerifiedSellers", "Verified Sellers"), value: "5,000+" },
    { label: t("home.statCategories", "Categories"), value: "25+" },
    { label: t("home.statCitiesActive", "Cities Active"), value: "50+" },
  ];

  const tradeTags = [
    t("home.tagManufacturers", "Manufacturers"),
    t("home.tagWholesalers", "Wholesalers"),
    t("home.tagDistributors", "Distributors"),
    t("home.tagProcurementTeams", "Procurement teams"),
    t("home.tagSmes", "SMEs"),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pb-16 pt-10 sm:pt-12 lg:pb-20 lg:pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,rgb(21_101_192/0.35),transparent)]" />
        <div className={MARKETPLACE_CONTAINER}>
          <div className="relative flex flex-col gap-10 sm:gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div className="max-w-2xl space-y-5 text-center sm:space-y-6 lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-soft/90">
                {t("home.heroBadge", "India's modern B2B platform")}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                {t("home.heroTitle", "Connect with verified sellers. Source smarter across India.")}
              </h1>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/80 sm:text-base lg:mx-0 lg:text-lg">
                {t(
                  "home.heroSubtitle",
                  "TradeNexa helps buyers find trusted suppliers and sellers win quality inquiries — through transparent profiles, product discovery, and direct RFQs."
                )}
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                {!isAuthenticated ? (
                  <>
                    <Button
                      size="lg"
                      onClick={() => openRegisterModal("buyer")}
                      className="w-full sm:w-auto min-w-[160px]"
                    >
                      {t("home.getStarted", "Get started")}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                    <Link href="/categories" className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        variant="secondary"
                        className="w-full sm:w-auto min-w-[160px] border-white/20 bg-white/10 text-white hover:border-white/30 hover:bg-white/15"
                      >
                        {t("home.browseCatalog", "Browse catalog")}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/categories" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto min-w-[160px]">
                      {t("home.browseCategories", "Browse Categories")}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                )}
              </div>
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
                {trustPoints.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.label}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-white/75"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary-soft" aria-hidden />
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4 lg:shrink-0">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm"
                >
                  <p className="text-xs font-medium text-white/70">{stat.label}</p>
                  <p className="mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip — structure for logos / proof */}
      <section className="border-b border-border bg-card py-8">
        <div className={MARKETPLACE_CONTAINER}>
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-wider text-muted-fg">
            {t("home.trustStripTitle", "Built for Indian B2B trade")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {tradeTags.map((label) => (
              <span
                key={label}
                className="rounded-lg border border-border bg-muted/60 px-4 py-2 text-sm font-medium text-muted-fg"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-16 lg:py-20">
        <div className={MARKETPLACE_CONTAINER}>
          <SectionHeading
            badge={t("home.platformBadge", "Platform")}
            title={t("home.platformTitle", "Everything you need to trade with confidence")}
            subtitle={t(
              "home.platformSubtitle",
              "Discover products, verify partners, and move from inquiry to deal — without middlemen."
            )}
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="surface-card-hover flex flex-col justify-between p-8 lg:row-span-2">
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Search className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {t("home.findProductsTitle", "Find Products")}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-muted-fg">
                  {t(
                    "home.findProductsDesc",
                    "Browse thousands of certified products and raw supplies across industrial, agricultural, and retail categories."
                  )}
                </p>
              </div>
              <Link
                href="/categories"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-hover"
              >
                {t("home.exploreCategories", "Explore Categories")}{" "}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="surface-card-hover flex flex-col justify-between p-6">
              <div>
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <CheckCircle className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  {t("home.verifiedSellersTitle", "Verified Sellers")}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-fg">
                  {t(
                    "home.verifiedSellersDesc",
                    "Partner with businesses that have credentials and verified profiles."
                  )}
                </p>
              </div>
              <Link
                href="/buyer-benefits"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-hover"
              >
                {t("home.buyerGuide", "Buyer guide")} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="surface-card-hover flex flex-col justify-between p-6">
              <div>
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <TrendingUp className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  {t("home.growBusinessTitle", "Grow Your Business")}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-fg">
                  {t(
                    "home.growBusinessDesc",
                    "List your catalog, expand digital reach, and receive genuine buyer inquiries."
                  )}
                </p>
              </div>
              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => openRegisterModal("seller")}
                  className="inline-flex cursor-pointer items-center gap-1 text-left text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-hover"
                >
                  {t("home.becomeSeller", "Become a Seller")}{" "}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              ) : (
                <Link
                  href="/seller-benefits"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-hover"
                >
                  {t("home.sellerBenefits", "Seller benefits")}{" "}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Role */}
      {!isAuthenticated && (
        <section className="border-y border-border bg-card py-16 lg:py-20">
          <div className={MARKETPLACE_CONTAINER}>
            <SectionHeading
              badge={t("home.chooseRoleBadge", "Get Started")}
              title={t("home.chooseRoleTitle", "Choose your path")}
              subtitle={t(
                "home.chooseRoleSubtitle",
                "TradeNexa supports sellers, buyers, and businesses that do both."
              )}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  role: "seller" as const,
                  title: t("home.sellerRoleTitle", "I'm a Seller"),
                  desc: t(
                    "home.sellerRoleDesc",
                    "List products and receive buyer inquiries from across India."
                  ),
                  icon: Package,
                },
                {
                  role: "buyer" as const,
                  title: t("home.buyerRoleTitle", "I'm a Buyer"),
                  desc: t(
                    "home.buyerRoleDesc",
                    "Source verified suppliers and send RFQs without middlemen."
                  ),
                  icon: Search,
                },
                {
                  role: "both" as const,
                  title: t("home.bothRoleTitle", "I Do Both"),
                  desc: t(
                    "home.bothRoleDesc",
                    "Buy raw materials and sell your own catalog from one account."
                  ),
                  icon: ArrowRightLeft,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => openRegisterModal(item.role)}
                    className="group surface-card-hover cursor-pointer p-6 text-left"
                  >
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-fg">{item.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all duration-200 group-hover:gap-2">
                      {t("home.getStarted", "Get started")}{" "}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 lg:py-20">
        <div className={MARKETPLACE_CONTAINER}>
          <SectionHeading
            badge={t("home.processBadge", "Process")}
            title={t("home.processTitle", "How it works")}
            subtitle={t(
              "home.processSubtitle",
              "A clear path from profile to deal for commercial buyers and sellers."
            )}
          />
          <ProcessStep steps={processSteps} />
          <div className="mt-10 text-center">
            <Link href="/how-it-works">
              <Button variant="outline" size="md">
                {t("home.seeFullProcess", "See full process")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-t border-border bg-card py-16 lg:py-20">
        <div className={MARKETPLACE_CONTAINER}>
          <SectionHeading
            badge={t("home.whyBadge", "Benefits")}
            title={t("home.whyTitle", "Why businesses choose TradeNexa")}
            subtitle={t(
              "home.whySubtitle",
              "A streamlined experience for SMEs and bulk procurers who need trust and speed."
            )}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="surface-card-hover p-6"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-fg">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border py-16 lg:py-20">
        <div className={MARKETPLACE_CONTAINER}>
          <SectionHeading
            badge={t("home.socialProofBadge", "Social proof")}
            title={t("home.testimonialsTitle", "What our users say")}
            subtitle={t(
              "home.testimonialsSubtitle",
              "Feedback from sellers and buyers already trading on the platform."
            )}
          />
          <Testimonials />
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
