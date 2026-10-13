import type { Metadata } from "next";
import UnsubscribeForm from "@/components/UnsubscribeForm";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Stop receiving outreach emails from FindMobileGrooming.",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const { e } = await searchParams;

  return (
    <section className="container-page flex justify-center py-20">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl">Unsubscribe</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Confirm below and we&apos;ll stop emailing this address. Your business
          listing stays live and free either way — unsubscribing only stops the
          messages, it does not remove your page.
        </p>
        <div className="mt-6">
          <UnsubscribeForm defaultEmail={e ?? ""} />
        </div>
      </div>
    </section>
  );
}
