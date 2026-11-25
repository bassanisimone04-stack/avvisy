import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center md:py-32">
      <p className="nums font-display text-[6rem] leading-none font-[300] text-clay-ink italic">404</p>
      <h1 className="mt-4 text-display-md">This board was cut too short.</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">The page you are looking for does not exist or has moved.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className={buttonVariants({ variant: "primary" })}>
          Back home
        </Link>
        <Link href="/explore/us/woodworking" className={buttonVariants({ variant: "outline" })}>
          Explore the map
        </Link>
      </div>
    </div>
  );
}
