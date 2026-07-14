"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  Mail,
  MapPin,
  Phone,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import PortalSection from "@/components/portal/PortalSection";
import RoleSwitcher from "@/components/portal/RoleSwitcher";
import DeleteAccountButton from "@/components/portal/DeleteAccountButton";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/auth";

export interface PortalProfileMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

interface PortalProfileViewProps {
  variant: "buyer" | "seller";
  /** @deprecated Overview/quick actions removed — kept optional for call-site compatibility */
  menuItems?: PortalProfileMenuItem[];
}

const themes = {
  buyer: {
    heroGradient: "bg-navy",
    accent: "text-primary",
    editHref: "/buyer/edit-profile",
    roleLabel: "Buyer account",
  },
  seller: {
    heroGradient: "bg-navy",
    accent: "text-primary",
    editHref: "/seller/edit-profile",
    roleLabel: "Seller account",
  },
} as const;

function buildAccountDetailRows(user: User | null) {
  const rows: { icon: typeof UserIcon; label: string; value: string }[] = [];

  if (user?.name) rows.push({ icon: UserIcon, label: "Full name", value: user.name });
  if (user?.company) rows.push({ icon: Building2, label: "Company", value: user.company });
  if (user?.email) rows.push({ icon: Mail, label: "Email", value: user.email });
  if (user?.phone) rows.push({ icon: Phone, label: "Phone", value: user.phone });

  const hasCityState = Boolean(user?.city || user?.state);
  const locationValue = [user?.address, user?.city, user?.state, user?.pincode]
    .filter(Boolean)
    .join(", ");

  if (locationValue) {
    rows.push({
      icon: MapPin,
      label: hasCityState ? "Location" : "Address",
      value: locationValue,
    });
  }

  return rows;
}

export default function PortalProfileView({ variant }: PortalProfileViewProps) {
  const router = useRouter();
  const { user, logoutUser } = useAuth();
  const theme = themes[variant];

  const displayName =
    variant === "seller" ? user?.company || user?.name || "Seller" : user?.name || "Buyer";
  const secondaryLine = variant === "seller" ? user?.name : user?.company;
  const initial = (displayName || "U").charAt(0).toUpperCase();
  const accountDetails = buildAccountDetailRows(user);

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-sm text-muted-fg">Your account,</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {displayName}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className={`mb-8 overflow-hidden rounded-xl border border-navy/20 ${theme.heroGradient} p-6 text-white sm:p-8`}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl font-semibold text-white ring-2 ring-white/30 sm:h-20 sm:w-20 sm:text-3xl">
              {initial}
            </div>
            <div className="min-w-0">
              <span className="inline-flex rounded-lg bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90">
                {theme.roleLabel}
              </span>
              <h3 className="mt-2 truncate text-xl font-semibold sm:text-2xl">{displayName}</h3>
              {secondaryLine ? (
                <p className="mt-1 truncate text-sm text-white/80">{secondaryLine}</p>
              ) : null}
              {user?.phone ? <p className="mt-1 text-xs text-white/70">{user.phone}</p> : null}
            </div>
          </div>
          <Link
            href={theme.editHref}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-card px-4 text-sm font-semibold text-primary transition hover:bg-card/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
          >
            Edit Profile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <PortalSection title="Account Details" subtitle="Your registered information">
            {accountDetails.length > 0 ? (
              <div className="surface-card grid grid-cols-1 overflow-hidden sm:grid-cols-2">
                {accountDetails.map((row, index) => {
                  const Icon = row.icon;
                  const total = accountDetails.length;
                  const isLast = index === total - 1;
                  const oddTotal = total % 2 === 1;
                  const spanFullOnSm = isLast && oddTotal;
                  const lastRowStart = oddTotal ? total - 1 : total - 2;
                  const inLastRow = index >= lastRowStart;
                  const showRightDividerOnSm = !spanFullOnSm && index % 2 === 0;

                  return (
                    <div
                      key={row.label}
                      className={[
                        "flex items-start gap-3 border-border p-4 sm:p-5",
                        !inLastRow ? "border-b" : "",
                        showRightDividerOnSm ? "sm:border-r" : "",
                        spanFullOnSm ? "sm:col-span-2" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
                          {row.label}
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-foreground">
                          {row.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="surface-card flex flex-col items-center gap-3 border-dashed px-6 py-10 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <UserIcon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-muted-fg">
                  No account details available yet.
                </p>
                <Link
                  href={theme.editHref}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-hover"
                >
                  Complete your profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </PortalSection>
        </div>

        <div className="space-y-6">
          <RoleSwitcher />

          <div className="surface-card p-5">
            <p className="text-sm font-semibold text-foreground">Sign out</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-fg">
              Sign out from your account on this device.
            </p>
            <button
              type="button"
              onClick={() => {
                void logoutUser().then(() => router.replace("/"));
              }}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted px-4 text-sm font-semibold text-muted-fg transition hover:border-primary/40 hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          <div className="surface-card p-5">
            <p className="text-sm font-semibold text-foreground">Account security</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-fg">
              Permanently remove your profile and all associated data from TradeNexa.
            </p>
            <div className="mt-4">
              <DeleteAccountButton compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
