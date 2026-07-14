"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import PortalPageHeader from "@/components/portal/PortalPageHeader";
import PortalBackLink from "@/components/portal/PortalBackLink";
import { Button } from "@/components/common/Button";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

export default function SendInquiryPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      showErrorToast("Please enter your inquiry message.");
      return;
    }
    showSuccessToast("Inquiry sent successfully!");
    setMessage("");
    setQuantity("");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-5 sm:px-6 lg:px-8">
      <PortalBackLink href={productId ? `/buyer/product/${productId}` : "/buyer/inquiries"} />
      <PortalPageHeader title="Send Inquiry" subtitle="Get a quote from the supplier" />
      <form onSubmit={handleSubmit} className="surface-card space-y-4 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Quantity Required</label>
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 500 units"
            className="input-base"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Describe your requirement..."
            className="w-full resize-y rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground outline-none transition-colors duration-200 hover:border-border-hover focus:border-primary focus:ring-2 focus:ring-primary/25"
          />
        </div>
        <Button type="submit" variant="primary" size="lg" fullWidth>
          Send Inquiry
        </Button>
      </form>
    </div>
  );
}
