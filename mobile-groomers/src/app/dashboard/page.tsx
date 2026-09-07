import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import ZipCodeEditor from "@/components/ZipCodeEditor";
import UpgradeButton from "@/components/UpgradeButton";
import { getCurrentUser } from "@/lib/supabase/server";
import { getGroomersForOwner } from "@/lib/groomers";
import { getLeadsForOwner } from "@/lib/leads";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/lib/supabase/auth-actions";

export const metadata: Metadata = {
  title: "Your Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  if (!isSupabaseConfigured) {
    return (
      <section className="container-page py-20">
        <div className="card mx-auto max-w-lg p-8 text-center">
          <h1 className="text-2xl">Dashboard unavailable</h1>
          <p className="mt-3 text-ink-soft">
            The app is running in demo mode. Add your Supabase keys to
            <code className="mx-1 rounded bg-surface-2 px-1.5 py-0.5 text-sm">.env.local</code>
            to enable accounts, listings, and leads.
          </p>
        </div>
      </section>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const [listings, leads] = await Promise.all([
    getGroomersForOwner(user.id),
    getLeadsForOwner(),
  ]);

  return (
    <section className="container-page py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Your Dashboard</h1>
          <p className="mt-1 text-sm text-ink-soft">Signed in as {user.email}</p>
        </div>
        <form action={signOut}>
          <button type="submit" className="btn btn-outline btn-sm">Sign out</button>
        </form>
      </div>

      {listings.length === 0 ? (
        <div className="card mt-10 p-8 text-center">
          <h2 className="text-xl">No listing linked yet</h2>
          <p className="mt-2 text-ink-soft">
            Once your claim is approved, your listing appears here and you can
            edit your zip code coverage.
          </p>
          <Link href="/claim" className="btn btn-primary mt-5">Claim a listing</Link>
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {listings.map((listing) => (
            <div key={listing.id} className="card p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl">{listing.name}</h2>
                  <p className="text-sm text-ink-soft">
                    {listing.city}, {listing.state} · {listing.tier === "free" ? "Free plan" : listing.tier === "pro" ? "Pro Van" : "Multi-Fleet"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/groomers/${listing.citySlug}/${listing.slug}`}
                    className="btn btn-outline btn-sm"
                  >
                    View listing
                  </Link>
                  {listing.tier === "free" && <UpgradeButton groomerId={listing.id!} />}
                </div>
              </div>

              <div className="mt-7">
                <ZipCodeEditor groomerId={listing.id!} zipCodes={listing.zipCodes} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-14">
        <h2 className="text-2xl">Recent Leads</h2>
        {leads.length === 0 ? (
          <p className="mt-3 text-ink-soft">
            No leads yet. Leads from your listing pages land here.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-ink-soft">
                  <th className="py-2 pr-4 font-semibold">Received</th>
                  <th className="py-2 pr-4 font-semibold">Name</th>
                  <th className="py-2 pr-4 font-semibold">Contact</th>
                  <th className="py-2 pr-4 font-semibold">Zip</th>
                  <th className="py-2 font-semibold">Pet</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-line">
                    <td className="py-2.5 pr-4 text-ink-soft">
                      {new Date(lead.createdAt).toLocaleDateString("en-US")}
                    </td>
                    <td className="py-2.5 pr-4 font-semibold">{lead.name}</td>
                    <td className="py-2.5 pr-4">{lead.contact}</td>
                    <td className="py-2.5 pr-4">{lead.zipCode}</td>
                    <td className="py-2.5">{lead.pet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
