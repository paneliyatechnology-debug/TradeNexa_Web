"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  Clock3,
  FileText,
  Hash,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  Star,
  TrendingUp,
  User as UserIcon,
} from "lucide-react";
import {
  counterpartyDisplayName,
  counterpartySellerId,
} from "@/components/chat/chatCounterparty";
import { fetchSupplierById } from "@/services/supplierService";
import { getInitials, resolveImageUrl } from "@/utils/catalogHelpers";
import type { ApiChatConversation, ChatRole } from "@/types/chat";
import type { ApiSupplier } from "@/types/supplier";

interface ChatCompanyProfilePanelProps {
  open: boolean;
  onClose: () => void;
  role: ChatRole;
  conversation?: ApiChatConversation | null;
  sellerId?: number | null;
  fallbackName?: string | null;
  fallbackLogoUrl?: string | null;
  contactName?: string | null;
}

type ProfileRow = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-fg">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function pushRow(rows: ProfileRow[], icon: ProfileRow["icon"], label: string, value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return;
  rows.push({ icon, label, value: trimmed });
}

/**
 * WhatsApp-style company profile overlay opened from chat header.
 * Seller profiles (buyer view) load supplier API + catalog CTA.
 * Buyer profiles (seller view) show only register + buyer complete-profile required fields.
 */
export default function ChatCompanyProfilePanel({
  open,
  onClose,
  role,
  conversation = null,
  sellerId = null,
  fallbackName = null,
  fallbackLogoUrl = null,
  contactName = null,
}: ChatCompanyProfilePanelProps) {
  const isViewingSeller = role === "buyer";
  const resolvedSellerId = counterpartySellerId(conversation, sellerId);
  const buyerPartyId =
    conversation?.buyer_id ??
    conversation?.buyer?.id ??
    conversation?.buyer?.user_id ??
    conversation?.other_party?.id ??
    conversation?.other_party?.user_id ??
    null;
  const profileLookupId = isViewingSeller
    ? resolvedSellerId
    : typeof buyerPartyId === "number" && buyerPartyId > 0
      ? buyerPartyId
      : null;

  const [supplier, setSupplier] = useState<ApiSupplier | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || profileLookupId == null) {
      setSupplier(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    // Seller profiles: need supplier for marketplace stats + contact fallback.
    // Buyer profiles: fetch is only best-effort for dual-role contact fields
    // (buyer user also registered as a supplier). Show spinner only for the
    // seller path where absence of supplier is user-visible.
    setLoading(isViewingSeller);
    void fetchSupplierById(profileLookupId)
      .then((data) => {
        if (!cancelled) setSupplier(data);
      })
      .catch(() => {
        if (!cancelled) setSupplier(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, isViewingSeller, profileLookupId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const other =
    conversation?.other_party ??
    (role === "buyer" ? conversation?.seller : conversation?.buyer);
  const displayName =
    supplier?.company_name?.trim() ||
    counterpartyDisplayName(conversation, role, fallbackName);
  const logoUrl =
    resolveImageUrl(supplier?.logo) ||
    resolveImageUrl(fallbackLogoUrl) ||
    resolveImageUrl(other?.company_logo) ||
    resolveImageUrl(other?.profile_image) ||
    null;
  const personName =
    contactName?.trim() ||
    (other?.name?.trim() && other.name.trim() !== displayName
      ? other.name.trim()
      : null);
  const industry =
    supplier?.industry?.trim() || other?.industry?.trim() || null;
  const businessType =
    supplier?.business_type?.trim() || other?.business_type?.trim() || null;
  const phone =
    supplier?.mobile_number?.trim() ||
    other?.mobile_number?.trim() ||
    supplier?.phone?.trim() ||
    other?.phone?.trim() ||
    supplier?.whatsapp?.trim() ||
    null;
  const email = supplier?.email?.trim() || other?.email?.trim() || null;
  const address =
    other?.address_line_1?.trim() || null;
  const state = other?.state?.trim() || supplier?.state?.trim() || null;
  const city = other?.city?.trim() || supplier?.city?.trim() || null;
  const pincode = other?.pincode?.trim() || null;

  const rfqLabel =
    conversation?.rfq_title?.trim() ||
    conversation?.rfq_reference?.trim() ||
    (conversation?.rfq_id ? `RFQ #${conversation.rfq_id}` : null);
  const inquiryLabel = conversation?.inquiry_id
    ? `Inquiry #${conversation.inquiry_id}`
    : null;
  const contextLabel =
    conversation?.last_context?.title?.trim() ||
    (conversation?.last_context?.type
      ? String(conversation.last_context.type)
      : null);

  const aboutRows: ProfileRow[] = [];

  if (isViewingSeller) {
    // Seller profile: industry / business type / location / contact / linked context
    const location = [city, state].filter(Boolean).join(", ");
    const normalizedIndustry = industry?.toLowerCase();
    const normalizedBusinessType = businessType?.toLowerCase();
    const showBothClassification =
      Boolean(industry) &&
      Boolean(businessType) &&
      normalizedIndustry !== normalizedBusinessType;
    if (showBothClassification) {
      pushRow(aboutRows, Building2, "Industry", industry);
      pushRow(aboutRows, Briefcase, "Business type", businessType);
    } else if (industry) {
      pushRow(aboutRows, Building2, "Industry", industry);
    } else if (businessType) {
      pushRow(aboutRows, Briefcase, "Business type", businessType);
    }
    pushRow(aboutRows, MapPin, "Location", location);
    pushRow(aboutRows, Phone, "Contact no", phone);
    pushRow(aboutRows, Mail, "Email", email);
    if (other?.is_online != null) {
      pushRow(aboutRows, BadgeCheck, "Status", other.is_online ? "Online" : "Offline");
    }
    pushRow(aboutRows, FileText, "Linked RFQ", rfqLabel);
    pushRow(aboutRows, FileText, "Linked inquiry", inquiryLabel);
    if (contextLabel && contextLabel !== rfqLabel && contextLabel !== inquiryLabel) {
      pushRow(aboutRows, FileText, "Context", contextLabel);
    }
  } else {
    // Buyer profile: register + buyer complete-profile required fields only.
    // Register: full name, mobile, email, business type.
    // Complete profile: company (hero), industry, address, state, city, pincode.
    pushRow(aboutRows, UserIcon, "Full name", personName);
    pushRow(aboutRows, Phone, "Mobile number", phone);
    pushRow(aboutRows, Mail, "Email", email);
    pushRow(aboutRows, Briefcase, "Business type", businessType);
    pushRow(aboutRows, Building2, "Industry", industry);
    pushRow(aboutRows, MapPin, "Address", address);
    pushRow(aboutRows, MapPin, "State", state);
    pushRow(aboutRows, MapPin, "City", city);
    pushRow(aboutRows, Hash, "Pincode", pincode);
  }

  const showCatalogCta = isViewingSeller && resolvedSellerId != null;
  const hasSupplierStats = isViewingSeller && Boolean(supplier);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="chat-company-profile"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute inset-0 z-20 flex flex-col bg-muted"
          role="dialog"
          aria-modal="true"
          aria-label={`${displayName} profile`}
        >
          <header className="flex shrink-0 items-center gap-2 border-b border-border bg-card px-3 py-3 sm:px-4">
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-fg transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Back to chat"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <p className="truncate text-sm font-semibold text-foreground">
              {isViewingSeller ? "Company profile" : "Buyer profile"}
            </p>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="bg-card px-6 pb-8 pt-8 text-center">
              <span className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-3xl font-bold text-primary shadow-sm ring-4 ring-primary-soft/60 sm:h-32 sm:w-32 sm:text-4xl">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt=""
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  getInitials(displayName)
                )}
              </span>
              <div className="mt-4 flex items-center justify-center gap-1.5">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {displayName}
                </h2>
                {isViewingSeller && supplier?.verified ? (
                  <BadgeCheck
                    className="h-5 w-5 shrink-0 text-primary"
                    aria-label="Verified"
                  />
                ) : null}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-fg">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Loading profile...
              </div>
            ) : (
              <div className="mt-2 space-y-2 pb-6">
                {aboutRows.length > 0 ? (
                  <section className="mx-3 overflow-hidden rounded-2xl border border-border bg-card sm:mx-4">
                    {aboutRows.map((row, index) => (
                      <div
                        key={`${row.label}-${row.value}`}
                        className={index > 0 ? "border-t border-border" : undefined}
                      >
                        <DetailRow icon={row.icon} label={row.label} value={row.value} />
                      </div>
                    ))}
                  </section>
                ) : (
                  <p className="mx-4 py-8 text-center text-sm text-muted-fg">
                    No profile details available yet.
                  </p>
                )}

                {hasSupplierStats ? (
                  <section className="mx-3 overflow-hidden rounded-2xl border border-border bg-card sm:mx-4">
                    <DetailRow
                      icon={Star}
                      label="Rating"
                      value={
                        supplier!.rating != null
                          ? `${supplier!.rating.toFixed(1)} / 5`
                          : "—"
                      }
                    />
                    <div className="border-t border-border">
                      <DetailRow
                        icon={Package}
                        label="Products"
                        value={
                          supplier!.product_count != null
                            ? String(supplier!.product_count)
                            : "—"
                        }
                      />
                    </div>
                    <div className="border-t border-border">
                      <DetailRow
                        icon={TrendingUp}
                        label="Response rate"
                        value={
                          supplier!.response_rate != null
                            ? `${Math.round(supplier!.response_rate)}%`
                            : "—"
                        }
                      />
                    </div>
                    <div className="border-t border-border">
                      <DetailRow
                        icon={Clock3}
                        label="Years in business"
                        value={
                          supplier!.years_in_business != null
                            ? String(supplier!.years_in_business)
                            : "—"
                        }
                      />
                    </div>
                  </section>
                ) : null}

                {showCatalogCta ? (
                  <div className="px-3 pt-2 sm:px-4">
                    <Link
                      href={`/buyer/supplier/${resolvedSellerId}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                    >
                      <Package className="h-4 w-4" aria-hidden />
                      View catalog
                    </Link>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
