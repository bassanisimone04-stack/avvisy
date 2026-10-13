import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to manage your mobile grooming listing and leads.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section className="container-page flex justify-center py-20">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl">Sign in to your listing</h1>
        <p className="mt-2 text-sm text-ink-soft">
          We&apos;ll email you a secure sign-in link. No password to remember.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
