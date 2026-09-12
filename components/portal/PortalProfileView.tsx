"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  Briefcase,
  Hash,
  Mail,
  MapPin,
  Phone,
  LogOut,
  Laptop,
  User as UserIcon,
} from "lucide-react";
import PortalSection from "@/components/portal/PortalSection";
import RoleSwitcher from "@/components/portal/RoleSwitcher";
import PortalLanguageSetting from "@/components/portal/PortalLanguageSetting";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import DeleteAccountButton from "@/components/portal/DeleteAccountButton";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
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

type DetailRow = { icon: LucideIcon; label: string; value: string };

function formatMobile(user: User): string {
  const phone = user.phone?.trim();
  if (!phone) return "";
  const code = user.country_code?.trim() || "+91";
  return `${code} ${phone}`;
}

function buildBuyerRequiredDetailRows(user: User | null, t: (k: string, d?: string) => string): DetailRow[] {
  if (!user) return [];
  const rows: DetailRow[] = [];

  if (user.name.trim()) {
    rows.push({ icon: UserIcon, label: t("profile.fullName", "Full name"), value: user.name.trim() });
  }
  const mobile = formatMobile(user);
  if (mobile) {
    rows.push({ icon: Phone, label: t("profile.mobileNumber", "Mobile number"), value: mobile });
  }
  if (user.email.trim()) {
    rows.push({ icon: Mail, label: t("profile.email", "Email"), value: user.email.trim() });
  }
  if (user.businessType?.trim()) {
    rows.push({
      icon: Briefcase,
      label: t("profile.businessType", "Business type"),
      value: user.businessType.trim(),
    });
  }
  if (user.company.trim()) {
    rows.push({
      icon: Building2,
      label: t("profile.companyName", "Company name"),
      value: user.company.trim(),
    });
  }
  if (user.industry?.trim()) {
    rows.push({
      icon: Building2,
      label: t("profile.industry", "Industry"),
      value: user.industry.trim(),
    });
  }
  if (user.address.trim()) {
    rows.push({ icon: MapPin, label: t("profile.address", "Address"), value: user.address.trim() });
  }
  if (user.state.trim()) {
    rows.push({ icon: MapPin, label: t("profile.state", "State"), value: user.state.trim() });
  }
  if (user.city.trim()) {
    rows.push({ icon: MapPin, label: t("profile.city", "City"), value: user.city.trim() });
  }
  if (user.pincode.trim()) {
    rows.push({ icon: Hash, label: t("profile.pincode", "Pincode"), value: user.pincode.trim() });
  }

  return rows;
}

function buildSellerAccountDetailRows(user: User | null, t: (k: string, d?: string) => string): DetailRow[] {
  const rows: DetailRow[] = [];

  if (user?.name) rows.push({ icon: UserIcon, label: t("profile.fullName", "Full name"), value: user.name });
  if (user?.company) rows.push({ icon: Building2, label: t("profile.companyName", "Company name"), value: user.company });
  if (user?.email) rows.push({ icon: Mail, label: t("profile.email", "Email"), value: user.email });
  if (user?.phone) rows.push({ icon: Phone, label: t("profile.mobileNumber", "Mobile number"), value: user.phone });

  const hasCityState = Boolean(user?.city || user?.state);
  const locationValue = [user?.address, user?.city, user?.state, user?.pincode]
    .filter(Boolean)
    .join(", ");

  if (locationValue) {
    rows.push({
      icon: MapPin,
      label: hasCityState ? t("profile.address", "Location") : t("profile.address", "Address"),
      value: locationValue,
    });
  }

  return rows;
}

export default function PortalProfileView({ variant }: PortalProfileViewProps) {
  const router = useRouter();
  const { user, logoutUser } = useAuth();
  const { t } = useLanguage();
  const theme = themes[variant];

  const companyName = user?.company?.trim() || "";
  const fullName = user?.name?.trim() || "";
  const displayName =
    variant === "buyer"
      ? companyName || fullName || t("portalNav.buyer", "Buyer")
      : companyName || fullName || t("portalNav.seller", "Seller");
  const secondaryLine =
    variant === "buyer"
      ? companyName && fullName
        ? fullName
        : null
      : fullName || null;
  const initial = (displayName || "U").charAt(0).toUpperCase();
  const accountDetails =
    variant === "buyer"
      ? buildBuyerRequiredDetailRows(user, t)
      : buildSellerAccountDetailRows(user, t);

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-sm text-muted-fg">{t("profile.yourAccount", "Your account,")}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {displayName}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className={`mb-8 relative z-20 rounded-xl border border-navy/20 ${theme.heroGradient} p-6 text-white sm:p-8`}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl font-semibold text-white ring-2 ring-white/30 sm:h-20 sm:w-20 sm:text-3xl">
              {initial}
            </div>
            <div className="min-w-0">
              <span className="inline-flex rounded-lg bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90">
                {variant === "buyer" ? t("profile.buyerAccount", "Buyer account") : t("profile.sellerAccount", "Seller account")}
              </span>
              <h3 className="mt-2 truncate text-xl font-semibold sm:text-2xl">{displayName}</h3>
              {secondaryLine ? (
                <p className="mt-1 truncate text-sm text-white/80">{secondaryLine}</p>
              ) : null}
              {user?.phone ? <p className="mt-1 text-xs text-white/70">{formatMobile(user)}</p> : null}
            </div>
          </div>
          <div className="relative z-30 flex flex-wrap items-center gap-3">
            <LanguageSelector
              align="auto"
              className="[&>button]:h-10 [&>button]:rounded-lg [&>button]:border-white/20 [&>button]:bg-white/10 [&>button]:text-white [&>button]:backdrop-blur-sm hover:[&>button]:bg-white/20 [&>button_span]:text-white [&>button_svg]:text-white/80"
            />
            <Link
              href={theme.editHref}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-card px-4 text-sm font-semibold text-primary transition hover:bg-card/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            >
              {t("profile.editProfile", "Edit Profile")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:col-span-2">
          <PortalSection
            title={t("profile.accountDetails", "Account Details")}
            subtitle={
              variant === "buyer"
                ? "Registration and complete-profile required fields"
                : "Your registered information"
            }
          >
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
                      key={`${row.label}-${row.value}`}
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
                  {t("profile.completeProfile", "Complete your profile")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </PortalSection>

          <PortalLanguageSetting />
        </div>

        <div className="space-y-6">
          <RoleSwitcher />

          <div className="surface-card p-5">
            <p className="text-sm font-semibold text-foreground">{t("settings.loginDevices", "Login Devices")}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-fg">
              {t("settings.loginDevicesDesc", "Manage active sessions and all devices logged into your account.")}
            </p>
            <Link
              href={variant === "buyer" ? "/buyer/settings/login-devices" : "/seller/settings/login-devices"}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary-soft px-4 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            >
              <Laptop className="h-4 w-4" />
              {t("settings.loginDevices", "Manage Login Devices")}
            </Link>
          </div>

          <div className="surface-card p-5">
            <p className="text-sm font-semibold text-foreground">{t("common.signOut", "Sign out")}</p>
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
              {t("common.signOut", "Sign Out")}
            </button>
          </div>

          <div className="surface-card p-5">
            <p className="text-sm font-semibold text-foreground">{t("profile.accountSecurity", "Account security")}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-fg">
              {t("profile.deleteAccountDesc", "Permanently remove your profile and all associated data from TradeNexa.")}
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
