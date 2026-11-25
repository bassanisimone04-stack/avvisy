import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Sign in", description: "Sign in to your account.", path: "/sign-in", index: false });

export default function SignInPage() {
  return (
    <div className="container-page grid gap-10 pt-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-16">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-display-md">Welcome back.</h1>
        <p className="mt-3 text-muted">Accounts are not available in this preview. They arrive with the database phase, together with your library, orders and synced favorites.</p>
        <form className="mt-8 space-y-4" aria-describedby="signin-note">
          <fieldset disabled className="space-y-4 opacity-60">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[0.8125rem] font-medium text-forest">
                Email
              </label>
              <input id="email" type="email" autoComplete="email" className="h-11 w-full rounded-sm border border-line-strong bg-white px-3" />
            </div>
            <button type="button" className="h-11 w-full rounded-sm bg-forest text-sm font-medium text-ivory">
              Email me a sign-in link
            </button>
          </fieldset>
          <p id="signin-note" className="text-xs text-muted">
            Sign-in is disabled until authentication is connected. <Link href="/about-this-preview" className="underline">What works today?</Link>
          </p>
        </form>
      </div>
      <div className="relative hidden aspect-[4/5] overflow-hidden rounded-lg lg:block">
        <Image src="/images/materials/cherry.jpg" alt="" fill sizes="50vw" className="object-cover" />
      </div>
    </div>
  );
}
