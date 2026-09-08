import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClaimRow from "@/components/admin/ClaimRow";
import { isAdminConfigured, requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Claim Review",
  robots: { index: false, follow: false },
};

/**
 * Never prerender an auth-gated page. Without this, a build that runs
 * without ADMIN_EMAILS set bakes in the notFound() branch, and the route
 * then 404s in production even though the variable is present at runtime.
 */
export const dynamic = "force-dynamic";

type ClaimWithListing = {
  id: string;
  business_name: string;
  city: string;
  phone: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  groomer_id: string | null;
  groomers: { name: string; city: string; state: string; slug: string; city_slug: string; owner: string | null } | null;
};

export default async function AdminClaimsPage() {
  // 404 rather than 403 so the route's existence is not advertised to
  // anyone probing for an admin surface.
  if (!isAdminConfigured()) notFound();
  const admin = await requireAdmin();
  if (!admin) notFound();

  const db = createAdminClient();
  if (!db) notFound();

  const { data } = await db
    .from("claims")
    .select(
      "id, business_name, city, phone, email, status, created_at, groomer_id, groomers(name, city, state, slug, city_slug, owner)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  const claims = (data ?? []) as unknown as ClaimWithListing[];
  const pending = claims.filter((c) => c.status === "pending");
  const settled = claims.filter((c) => c.status !== "pending");

  return (
    <section className="container-page py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Claim Review</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Signed in as {admin.email} · {pending.length} awaiting review
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-outline btn-sm">Dashboard</Link>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-surface-2 p-5 text-sm text-ink-soft">
        <p className="font-semibold text-navy">Before approving, verify the claimant.</p>
        <p className="mt-1">
          Approving assigns the listing to this account: they can edit it and
          receive its leads. Check that the work email&apos;s domain, the phone
          number, or a reply from the business&apos;s published contact actually
          matches. A claim is a request, not proof.
        </p>
      </div>

      <h2 className="mt-10 text-xl">Pending</h2>
      {pending.length === 0 ? (
        <p className="mt-3 text-ink-soft">Nothing awaiting review.</p>
      ) : (
        <div className="mt-5 space-y-4">
          {pending.map((claim) => (
            <ClaimRow
              key={claim.id}
              id={claim.id}
              businessName={claim.business_name}
              city={claim.city}
              phone={claim.phone}
              email={claim.email}
              createdAt={claim.created_at}
              listing={
                claim.groomers
                  ? {
                      name: claim.groomers.name,
                      href: `/groomers/${claim.groomers.city_slug}/${claim.groomers.slug}`,
                      hasOwner: !!claim.groomers.owner,
                    }
                  : null
              }
            />
          ))}
        </div>
      )}

      {settled.length > 0 && (
        <>
          <h2 className="mt-12 text-xl">Recently settled</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-ink-soft">
                  <th className="py-2 pr-4 font-semibold">Business</th>
                  <th className="py-2 pr-4 font-semibold">Email</th>
                  <th className="py-2 pr-4 font-semibold">Status</th>
                  <th className="py-2 font-semibold">Filed</th>
                </tr>
              </thead>
              <tbody>
                {settled.map((claim) => (
                  <tr key={claim.id} className="border-b border-line">
                    <td className="py-2.5 pr-4 font-semibold">{claim.business_name}</td>
                    <td className="py-2.5 pr-4">{claim.email}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`chip ${claim.status === "approved" ? "chip-success" : "chip-neutral"}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-ink-soft">
                      {new Date(claim.created_at).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
