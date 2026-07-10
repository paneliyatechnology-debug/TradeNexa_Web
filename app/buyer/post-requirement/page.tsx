"use client";

import React, { Suspense } from "react";
import PortalBackLink from "@/components/portal/PortalBackLink";
import PortalPageHeader from "@/components/portal/PortalPageHeader";
import CreateRfqForm from "@/components/rfq/CreateRfqForm";
import { Loader2 } from "lucide-react";

export default function PostRequirementPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8">
      <PortalBackLink href="/buyer/home" />
      <PortalPageHeader
        title="Post Requirement"
        subtitle="Describe what you need — get multiple quotes"
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#546E7A]">
            <Loader2 className="h-5 w-5 animate-spin text-[#1565C0]" />
            Loading form...
          </div>
        }
      >
        <CreateRfqForm />
      </Suspense>
    </div>
  );
}
