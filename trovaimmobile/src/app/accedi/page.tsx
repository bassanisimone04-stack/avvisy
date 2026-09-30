import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/AuthForms";

export const metadata: Metadata = { title: "Accedi" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="container section" style={{ maxWidth: 440 }}>
      <div className="card card-pad stack">
        <h1>Accedi</h1>
        <LoginForm next={next} />
        <p className="small" style={{ margin: 0 }}>
          Non hai un account? <Link href={`/registrati${next ? `?next=${encodeURIComponent(next)}` : ""}`}>Registrati</Link>
        </p>
      </div>
    </div>
  );
}
