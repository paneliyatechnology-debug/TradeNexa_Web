"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import ChatCompanyProfilePanel from "@/components/chat/ChatCompanyProfilePanel";
import {
  counterpartyDisplayName,
  counterpartySellerId,
} from "@/components/chat/chatCounterparty";
import { fetchSupplierById } from "@/services/supplierService";
import { getInitials, resolveImageUrl } from "@/utils/catalogHelpers";
import type { ApiChatConversation, ChatRole } from "@/types/chat";
import type { ApiSupplier } from "@/types/supplier";

export { counterpartyDisplayName, counterpartySellerId } from "@/components/chat/chatCounterparty";

interface ChatCounterpartyHeaderProps {
  role: ChatRole;
  name: string;
  logoUrl?: string | null;
  conversation?: ApiChatConversation | null;
  sellerId?: number | null;
  /** Person name under company (optional). */
  contactName?: string | null;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}

/**
 * Chat thread header: company identity + WhatsApp-style in-chat profile panel.
 */
export default function ChatCounterpartyHeader({
  role,
  name,
  logoUrl,
  conversation = null,
  sellerId = null,
  contactName = null,
  leading,
  trailing,
  className = "",
}: ChatCounterpartyHeaderProps) {
  const resolvedSellerId = counterpartySellerId(conversation, sellerId);
  const canViewProfile =
    role === "buyer"
      ? resolvedSellerId != null
      : Boolean(
          conversation?.other_party ||
            conversation?.buyer ||
            name.trim()
        );
  const [profileOpen, setProfileOpen] = useState(false);
  const [supplier, setSupplier] = useState<ApiSupplier | null>(null);

  useEffect(() => {
    if (role !== "buyer" || resolvedSellerId == null) {
      setSupplier(null);
      return;
    }
    let cancelled = false;
    void fetchSupplierById(resolvedSellerId)
      .then((data) => {
        if (!cancelled) setSupplier(data);
      })
      .catch(() => {
        if (!cancelled) setSupplier(null);
      });
    return () => {
      cancelled = true;
    };
  }, [role, resolvedSellerId]);

  const displayName = supplier?.company_name?.trim() || name;
  const resolvedLogo =
    resolveImageUrl(supplier?.logo) || resolveImageUrl(logoUrl) || null;
  const other =
    conversation?.other_party ??
    (role === "buyer" ? conversation?.seller : conversation?.buyer);
  const personName =
    contactName?.trim() ||
    (other?.company_name?.trim() && other?.name?.trim() && other.name.trim() !== displayName
      ? other.name.trim()
      : null);

  function openProfile() {
    if (!canViewProfile) return;
    setProfileOpen(true);
  }

  const identity = (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-sm font-bold text-primary sm:h-11 sm:w-11">
        {resolvedLogo ? (
          <Image
            src={resolvedLogo}
            alt=""
            width={44}
            height={44}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          getInitials(displayName)
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="truncate text-sm font-semibold tracking-tight text-foreground">
            {displayName}
          </p>
          {supplier?.verified ? (
            <BadgeCheck
              className="h-4 w-4 shrink-0 text-primary"
              aria-label="Verified company"
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
        {leading}
        {canViewProfile ? (
          <button
            type="button"
            onClick={openProfile}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-primary/25"
            title={`View ${displayName} profile`}
          >
            {identity}
          </button>
        ) : (
          identity
        )}
        {trailing}
      </div>

      <ChatCompanyProfilePanel
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        role={role}
        conversation={conversation}
        sellerId={sellerId}
        fallbackName={displayName}
        fallbackLogoUrl={resolvedLogo}
        contactName={personName}
      />
    </>
  );
}
