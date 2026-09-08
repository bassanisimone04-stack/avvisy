"use client";

import Link from "next/link";
import { useState } from "react";
import { approveClaim, rejectClaim } from "@/lib/actions/claims";

export default function ClaimRow({
  id,
  businessName,
  city,
  phone,
  email,
  createdAt,
  listing,
}: {
  id: string;
  businessName: string;
  city: string;
  phone: string;
  email: string;
  createdAt: string;
  listing: { name: string; href: string; hasOwner: boolean } | null;
}) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function run(action: (fd: FormData) => Promise<{ ok?: boolean; error?: string }>, fd: FormData) {
    setPending(true);
    setResult(await action(fd));
    setPending(false);
    setConfirming(false);
  }

  if (result?.ok) {
    return (
      <div className="card border-teal bg-teal-soft p-5 text-sm text-teal-dark">
        <p className="font-semibold">Done — {businessName}</p>
        <p className="mt-1">Refresh to see it in the settled list.</p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg">{businessName}</h3>
          <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm text-ink-soft sm:grid-cols-2">
            <div><dt className="inline font-semibold">Email: </dt><dd className="inline">{email}</dd></div>
            <div><dt className="inline font-semibold">Phone: </dt><dd className="inline">{phone || "—"}</dd></div>
            <div><dt className="inline font-semibold">City: </dt><dd className="inline">{city || "—"}</dd></div>
            <div>
              <dt className="inline font-semibold">Filed: </dt>
              <dd className="inline">{new Date(createdAt).toLocaleDateString("en-US")}</dd>
            </div>
          </dl>
        </div>

        <div className="text-right text-sm">
          {listing ? (
            <>
              <Link href={listing.href} className="font-semibold text-teal-dark underline">
                {listing.name}
              </Link>
              {listing.hasOwner && (
                <p className="mt-1 text-xs font-semibold text-amber-700">
                  Listing already has an owner
                </p>
              )}
            </>
          ) : (
            <p className="text-xs font-semibold text-amber-700">
              Not linked to a listing
            </p>
          )}
        </div>
      </div>

      {result?.error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {result.error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {confirming ? (
          <>
            <span className="self-center text-sm text-ink-soft">
              Assign {listing?.name ?? businessName} to {email}?
            </span>
            <button
              type="button"
              disabled={pending}
              className="btn btn-primary btn-sm"
              onClick={() => {
                const fd = new FormData();
                fd.set("claimId", id);
                run(approveClaim, fd);
              }}
            >
              {pending ? "Working…" : "Yes, approve"}
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={pending || !listing}
              onClick={() => setConfirming(true)}
            >
              Approve
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={pending}
              onClick={() => {
                const fd = new FormData();
                fd.set("claimId", id);
                fd.set("note", "Could not verify ownership.");
                run(rejectClaim, fd);
              }}
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}
