"use client";

import React from "react";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import CTABanner from "@/components/CTABanner";
import { useApp } from "@/app/context/AppContext";
import {
  Shield,
  Target,
  Compass,
  Heart,
  Store,
  ShoppingCart,
  ArrowLeftRight,
  Users,
  Package,
  MapPin,
  Handshake,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const { openRegisterModal } = useApp();

  const values = [
    {
      title: "Trust & Transparency",
      desc: "Verifying seller profiles and maintaining clear communication channels to foster reliable business deals.",
      icon: Shield,
    },
    {
      title: "Empowerment",
      desc: "Equipping local sellers with digital catalog management and lead generation systems to scale nationwide.",
      icon: Target,
    },
    {
      title: "Innovation",
      desc: "Continuously improving search queries, category sorting, and match speeds to simplify B2B trade.",
      icon: Compass,
    },
    {
      title: "Customer Centricity",
      desc: "Prioritizing ease of use for traditional business owners who might not be technically advanced.",
      icon: Heart,
    },
  ];

  const impactStats = [
    { label: "Verified Sellers", value: "5,000+", icon: Store, color: "text-primary bg-primary/10" },
    { label: "Products Listed", value: "10,000+", icon: Package, color: "text-emerald-600 bg-emerald-50" },
    { label: "Cities Connected", value: "50+", icon: MapPin, color: "text-amber-600 bg-amber-50" },
    { label: "Successful Matches", value: "25,000+", icon: Handshake, color: "text-indigo-600 bg-indigo-50" },
  ];

  const roleCards = [
    {
      role: "seller" as const,
      title: "For Sellers",
      icon: Store,
      description:
        "Manufacturers, distributors, and wholesalers list catalogs, receive RFQs, and grow reach beyond their local market.",
      features: ["Free business profile", "Product catalog listing", "Direct buyer inquiries", "Nationwide visibility"],
      cta: "Register as Seller",
      accent: "from-blue-500 to-primary",
    },
    {
      role: "buyer" as const,
      title: "For Buyers",
      icon: ShoppingCart,
      description:
        "Retailers, contractors, and procurement teams discover verified suppliers and compare quotes without middlemen.",
      features: ["Verified supplier search", "One-click RFQ forms", "Direct seller contact", "No platform commission"],
      cta: "Register as Buyer",
      accent: "from-emerald-500 to-teal-600",
    },
    {
      role: "both" as const,
      title: "For Both",
      icon: ArrowLeftRight,
      description:
        "Many businesses buy raw materials and sell finished goods. One account handles both sides of your trade.",
      features: ["Dual buyer & seller dashboard", "Unified business profile", "Cross-category sourcing", "Flexible role switching"],
      cta: "Register for Both",
      accent: "from-indigo-500 to-violet-600",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden bg-slate-900 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
        <div className="relative z-10 mx-auto max-w-5xl space-y-4 px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 inline-block rounded-full bg-primary/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary"
          >
            About Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            Our Mission is to <span className="text-primary">Digitally Empower Businesses</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-base leading-relaxed text-slate-300"
          >
            We build marketplace tools that let sellers, buyers, and dual-role businesses connect instantly,
            transparently, and nationwide.
          </motion.p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Who We Are</h2>
              <p className="text-sm leading-relaxed text-slate-500">
                We are a modern team dedicated to rebuilding B2B marketplace tools. Traditional commerce directories
                are often slow and cluttered. We provide a sleek, search-optimized platform designed to help
                manufacturers, distributors, bulk buyers, and businesses that do both connect with confidence.
              </p>
              <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <h3 className="mb-2 flex items-center gap-2 font-bold text-slate-900">
                    <Target className="h-5 w-5 text-primary" />
                    Our Mission
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500">
                    To digitize trading and communication for over 10 million small and medium enterprises across
                    India, converting local catalog setups into high-volume national sales pipelines.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <h3 className="mb-2 flex items-center gap-2 font-bold text-slate-900">
                    <Compass className="h-5 w-5 text-primary" />
                    Our Vision
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500">
                    To become the most user-friendly and trusted marketplace where B2B negotiations and supply
                    catalog searches resolve within minutes rather than weeks.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full max-w-md rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6 shadow-lg"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Platform at a Glance</h4>
                    <p className="text-xs text-slate-500">Real impact across India&apos;s B2B ecosystem</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {impactStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                      >
                        <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${stat.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-lg font-extrabold text-slate-900">{stat.value}</p>
                        <p className="text-[11px] font-medium text-slate-500">{stat.label}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Ethos"
            title="Our Values"
            subtitle="The fundamental standards guiding our development, platform policies, and support systems."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-slate-900">{v.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Ecosystem"
            title="Built For Every Business"
            subtitle="Whether you sell, buy, or do both — TradeNexa adapts to how your business actually operates."
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {roleCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.role}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-md`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">{card.title}</h3>
                  <p className="mb-5 text-sm leading-relaxed text-slate-500">{card.description}</p>
                  <ul className="mb-6 flex-1 space-y-2">
                    {card.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => openRegisterModal(card.role)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-hover"
                  >
                    {card.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              See how each role works
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
