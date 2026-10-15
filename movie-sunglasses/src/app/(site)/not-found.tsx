import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="font-display text-6xl font-semibold">That scene was cut.</h1>
      <p className="mx-auto mt-5 max-w-md text-slate">The page you are looking for does not exist or has moved. Try a search, or head back to the directory.</p>
      <div className="mx-auto mt-8 max-w-md"><SearchBox /></div>
      <p className="mt-8"><Link className="underline underline-offset-4" href="/">Back to home</Link></p>
    </Container>
  );
}
