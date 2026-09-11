"use client";

import React from "react";
import { Star, Quote, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export default function Testimonials() {
  const { t } = useLanguage();

  const testimonials: TestimonialItem[] = [
    {
      name: t("testimonials.t1Name", "Rajesh Kumar"),
      role: t("testimonials.t1Role", "Managing Director"),
      company: t("testimonials.t1Company", "Kumar Electronics & Cables"),
      content: t(
        "testimonials.t1Content",
        "Since listing our heavy machinery parts on the marketplace, we've received high-quality inquiries from buyers across states. The verification badge has significantly increased our business trust."
      ),
      rating: 5,
    },
    {
      name: t("testimonials.t2Name", "Priya Sharma"),
      role: t("testimonials.t2Role", "Founder"),
      company: t("testimonials.t2Company", "EcoOrganic Agricultural Exports"),
      content: t(
        "testimonials.t2Content",
        "As a seller, building our profile was incredibly simple. Within weeks, we got connected with three major bulk distributors who found us via the industry directory. Exceptional B2B portal!"
      ),
      rating: 5,
    },
    {
      name: t("testimonials.t3Name", "Amit Patel"),
      role: t("testimonials.t3Role", "Procurement Lead"),
      company: t("testimonials.t3Company", "BuildTech Construction Ltd."),
      content: t(
        "testimonials.t3Content",
        "We use the platform daily to search for steel and timber suppliers. It saves us weeks of catalog scanning because we can send inquiries and compare verified sellers instantly in one place."
      ),
      rating: 4,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {testimonials.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="surface-card-hover relative flex flex-col justify-between p-6 sm:p-8"
        >
          <div className="absolute right-6 top-6 text-border">
            <Quote className="h-8 w-8" aria-hidden />
          </div>

          <div>
            <div className="mb-4 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 fill-current ${i < item.rating ? "text-warning" : "text-border"}`}
                  aria-hidden
                />
              ))}
            </div>

            <p className="mb-6 text-sm leading-relaxed text-muted-fg">
              &ldquo;{item.content}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-3 border-t border-border pt-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
              {item.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-foreground">{item.name}</span>
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <p className="text-xs text-muted-fg">
                {item.role}, {item.company}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
