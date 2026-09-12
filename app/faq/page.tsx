"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import MarketplacePageHero from "@/components/catalog/marketplace/MarketplacePageHero";
import { MARKETPLACE_CONTAINER } from "@/components/catalog/marketplace/marketplaceLayout";
import { useLanguage } from "@/context/LanguageContext";

export default function FAQ() {
  const { t } = useLanguage();

  const faqItems = [
    {
      question: t("faq.q1", "How do I become a seller?"),
      answer: t(
        "faq.a1",
        "Becoming a seller is simple. Click on the 'Become a Seller' button in the navbar, complete the 30-second registration form with your name, company details, phone number, and primary industry category, and submit. Our verification team will review your business credentials and list your catalog live."
      ),
    },
    {
      question: t("faq.q2", "How do buyers contact sellers?"),
      answer: t(
        "faq.a2",
        "Buyers can browse products in the Categories grid, click on 'Explore Products & Sellers', and fill in the simple Request for Quote (RFQ) form or select options to send direct inquiry details. The inquiry details are immediately forwarded to the seller via email and text, containing buyer contact details for direct negotiations."
      ),
    },
    {
      question: t("faq.q3", "Is registration free?"),
      answer: t(
        "faq.a3",
        "Yes, basic registration and basic product listing are completely free. Our platform is commission-free, meaning buyers and sellers connect directly and settle payment terms offline without paying brokerage to us."
      ),
    },
    {
      question: t("faq.q4", "Can I upload multiple products?"),
      answer: t(
        "faq.a4",
        "Absolutely! Sellers are allowed to upload unlimited product listings in their catalog. You can detail technical specifications, dimensions, shipping guidelines, and upload multiple high-resolution photos for each item."
      ),
    },
    {
      question: t("faq.q5", "How are sellers verified?"),
      answer: t(
        "faq.a5",
        "Sellers receive a 'Verified' trust badge upon verification of their legal credentials. Our onboarding operations team cross-checks details such as corporate GSTIN, company PAN registration records, and physical office presence to build instant confidence for buyers."
      ),
    },
    {
      question: t("faq.q6", "What is the difference between a Seller and a Supplier?"),
      answer: t(
        "faq.a6",
        "Our B2B marketplace uses the standard term 'Seller' to encompass manufacturers, wholesalers, trade agents, and commercial vendors listed on our platform, aligning with a modernized trading terminology."
      ),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketplacePageHero
        eyebrow={t("faq.eyebrow", "Help Center")}
        title={t("faq.heroTitle", "Frequently Asked Questions")}
        subtitle={t(
          "faq.heroSubtitle",
          "Have questions about how to list products, send RFQs, or verify profiles? Explore our quick guidance answers."
        )}
      />

      <section className="flex-1 py-12 lg:py-16">
        <div className={MARKETPLACE_CONTAINER}>
          <SectionHeading
            badge={t("faq.helpBadge", "Help")}
            title={t("faq.sectionTitle", "General Queries")}
            subtitle={t(
              "faq.sectionSubtitle",
              "Frequently asked questions about listing setup, buyer matching, and account trust."
            )}
          />
          <div className="surface-card p-6 sm:p-8">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
