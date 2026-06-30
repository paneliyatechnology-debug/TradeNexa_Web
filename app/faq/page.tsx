"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";

export default function FAQ() {
  const faqItems = [
    {
      question: "How do I become a seller?",
      answer: "Becoming a seller is simple. Click on the 'Become a Seller' button in the navbar, complete the 30-second registration form with your name, company details, phone number, and primary industry category, and submit. Our verification team will review your business credentials and list your catalog live.",
    },
    {
      question: "How do buyers contact sellers?",
      answer: "Buyers can browse products in the Categories grid, click on 'Explore Products & Sellers', and fill in the simple Request for Quote (RFQ) form or select options to send direct inquiry details. The inquiry details are immediately forwarded to the seller via email and text, containing buyer contact details for direct negotiations.",
    },
    {
      question: "Is registration free?",
      answer: "Yes, basic registration and basic product listing are completely free. Our platform is commission-free, meaning buyers and sellers connect directly and settle payment terms offline without paying brokerage to us.",
    },
    {
      question: "Can I upload multiple products?",
      answer: "Absolutely! Sellers are allowed to upload unlimited product listings in their catalog. You can detail technical specifications, dimensions, shipping guidelines, and upload multiple high-resolution photos for each item.",
    },
    {
      question: "How are sellers verified?",
      answer: "Sellers receive a 'Verified' trust badge upon verification of their legal credentials. Our onboarding operations team cross-checks details such as corporate GSTIN, company PAN registration records, and physical office presence to build instant confidence for buyers.",
    },
    {
      question: "What is the difference between a Seller and a Supplier?",
      answer: "Our B2B marketplace uses the standard term 'Seller' to encompass manufacturers, wholesalers, trade agents, and commercial vendors listed on our platform, aligning with a modernized trading terminology.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Hero */}
      <section className="relative bg-slate-50 py-16 border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-4">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Help Center
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-500">
            Have questions about how to list products, send RFQs, or verify profiles? Explore our quick guidance answers.
          </p>
        </div>
      </section>

      {/* Accordions Section */}
      <section className="py-16 bg-white flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Help"
            title="General Queries"
            subtitle="Frequently asked questions about listing setup, buyer matching, and account trust."
          />
          <FAQAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA */}
      <CTABanner />
    </div>
  );
}
