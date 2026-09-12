"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Laptop } from "lucide-react";
import RoleSwitcher from "@/components/portal/RoleSwitcher";
import PortalPageHeader from "@/components/portal/PortalPageHeader";
import PortalLanguageSetting from "@/components/portal/PortalLanguageSetting";
import DeleteAccountButton from "@/components/portal/DeleteAccountButton";

export default function SellerSettingsPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-5 sm:px-6 lg:px-8">
      <PortalPageHeader title="Settings" />
      <div className="mb-6 space-y-4">
        <RoleSwitcher />
        <PortalLanguageSetting />
      </div>
      <div className="space-y-4">
        {[
          { label: "Push Notifications", desc: "Buyer inquiries and quotation requests", defaultOn: true },
          { label: "Email Updates", desc: "Weekly seller analytics & leads digest", defaultOn: true },
          { label: "Two-Factor Auth", desc: "Extra security for your seller account", defaultOn: false },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between surface-card p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-fg">{item.desc}</p>
            </div>
            <div className={`h-6 w-11 rounded-full p-0.5 ${item.defaultOn ? "bg-primary" : "bg-border"}`}>
              <div className={`h-5 w-5 rounded-full bg-card shadow-sm transition ${item.defaultOn ? "translate-x-5" : ""}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Link
          href="/seller/settings/login-devices"
          className="surface-card flex items-center justify-between p-4 transition hover:border-primary/40 hover:bg-muted/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Login Devices</p>
              <p className="text-xs text-muted-fg">Manage active sessions and logged in browsers</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-fg" />
        </Link>
      </div>

      <div className="mt-8">
        <DeleteAccountButton />
      </div>
      <Link href="/seller/profile" className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-primary">
        <ChevronRight className="h-4 w-4 rotate-180" />
        Back to Profile
      </Link>
    </div>
  );
}
