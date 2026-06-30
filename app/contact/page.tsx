"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const offices = [
    {
      city: "Corporate Office (New Delhi)",
      address: "B-22, Okhla Industrial Area, Phase-III, New Delhi, 110020",
      phone: "+91 11 4050 9000",
      email: "contact@tradenexa.com",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Hero */}
      <section className="relative bg-slate-50 py-16 border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-4">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Support
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Get in Touch with Our Team
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-500">
            Have questions about platform integration, business verification, or bulk directory listings? Reach out directly.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 bg-white flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left: Forms */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Right: Office details, Business Hours */}
            <div className="lg:col-span-5 space-y-8">
              {/* Office Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Our Office</h3>
                {offices.map((office, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="h-4.5 w-4.5 text-primary" />
                      {office.city}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed pl-6">{office.address}</p>
                    <div className="pl-6 space-y-1 text-xs text-slate-500">
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {office.phone}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {office.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours & Socials */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-primary" />
                    Business Hours
                  </h4>
                  <div className="text-xs text-slate-500 space-y-1 pl-6">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 2:00 PM</p>
                    <p className="text-primary font-semibold">Sunday: Closed</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Connect Socially</h4>
                  <div className="flex gap-3 pl-1">
                    <span className="h-8 w-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-primary transition cursor-pointer">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                    </span>
                    <span className="h-8 w-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-primary transition cursor-pointer">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                    </span>
                    <span className="h-8 w-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-primary transition cursor-pointer">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </span>
                    <span className="h-8 w-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-primary transition cursor-pointer">
                      <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
