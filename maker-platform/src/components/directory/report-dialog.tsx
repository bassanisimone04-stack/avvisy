"use client";

import { Flag, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { Select } from "@/components/ui/field";

/**
 * "Report incorrect information" — UI only in this preview. Phase 2 stores
 * reports server-side (rate-limited) for admin review. Never paywalled.
 */
export function ReportDialog({ businessName }: { businessName: string }) {
  const [sent, setSent] = useState(false);
  return (
    <Dialog.Root onOpenChange={(o) => !o && setSent(false)}>
      <Dialog.Trigger className="inline-flex items-center gap-2 text-sm text-muted underline-offset-4 hover:text-forest hover:underline">
        <Flag className="size-4" aria-hidden /> Report incorrect information
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-forest-deep/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-ivory p-6 shadow-lift focus:outline-none">
          <Dialog.Title className="font-display text-2xl text-forest">Report an issue</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted">Help us keep {businessName} accurate. Corrections are always free.</Dialog.Description>
          {sent ? (
            <p role="status" className="mt-6 rounded-sm bg-sage-tint p-4 text-sm text-sage-ink">
              Thank you. This is a preview, so your report was not sent or stored. Reporting goes live with accounts and the admin panel.
            </p>
          ) : (
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div>
                <label htmlFor="issue" className="mb-1.5 block text-[0.8125rem] font-medium text-forest">
                  What&apos;s wrong?
                </label>
                <Select id="issue" required defaultValue="">
                  <option value="" disabled>
                    Choose an issue
                  </option>
                  <option>Permanently closed</option>
                  <option>Wrong address or location</option>
                  <option>Wrong contact details</option>
                  <option>Services or machines are incorrect</option>
                  <option>Something else</option>
                </Select>
              </div>
              <div>
                <label htmlFor="details" className="mb-1.5 block text-[0.8125rem] font-medium text-forest">
                  Details
                </label>
                <textarea id="details" rows={4} maxLength={1000} className="w-full rounded-sm border border-line-strong bg-white p-3 text-[0.9375rem] focus:border-forest focus:outline-none" />
              </div>
              <button type="submit" className="h-11 w-full rounded-sm bg-forest text-sm font-medium text-ivory hover:bg-forest-deep">
                Send report
              </button>
            </form>
          )}
          <Dialog.Close className="absolute top-4 right-4 rounded-sm p-1 text-muted hover:text-forest" aria-label="Close">
            <X className="size-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
