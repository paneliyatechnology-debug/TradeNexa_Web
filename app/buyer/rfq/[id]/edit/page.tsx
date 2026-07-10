"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import PortalBackLink from "@/components/portal/PortalBackLink";
import PortalPageHeader from "@/components/portal/PortalPageHeader";
import CreateRfqForm from "@/components/rfq/CreateRfqForm";

export default function EditRfqPage() {
  const params = useParams();
  const rfqId = Number(params.id);
  const invalidId = !rfqId || Number.isNaN(rfqId);

  if (invalidId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8">
        <PortalBackLink href="/buyer/inquiries" label="My RFQs" />
        <p className="text-sm text-red-600">Invalid RFQ id</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8">
      <PortalBackLink href={`/buyer/rfq/${rfqId}`} label="RFQ details" />
      <PortalPageHeader
        title="Edit Draft RFQ"
        subtitle="Update your requirement before publishing"
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#546E7A]">
            <Loader2 className="h-5 w-5 animate-spin text-[#1565C0]" />
            Loading form...
          </div>
        }
      >
        <CreateRfqForm rfqId={rfqId} />
      </Suspense>
    </div>
  );
}
