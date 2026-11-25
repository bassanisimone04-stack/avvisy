import Image from "next/image";
import { SimplePage } from "@/components/layout/simple-page";
import { Badge } from "@/components/ui/badge";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Resources", description: "Guides and techniques for makers.", path: "/resources", index: false });

const planned = [
  { title: "Reading a lumber yard: grades, quarters and how to pick boards", kind: "Guide", image: "/images/materials/white-oak.jpg" },
  { title: "Sending your first file to a CNC shop", kind: "Guide", image: "/images/materials/plywood-edge.jpg" },
  { title: "Finishes that are actually food-safe", kind: "Technique", image: "/images/materials/end-grain.jpg" },
];

export default function ResourcesPage() {
  return (
    <SimplePage
      eyebrow="Resources"
      title={
        <>
          The workshop <em className="text-clay-ink italic">journal.</em>
        </>
      }
      lede="Practical, tested guides are in preparation. We would rather publish a few useful articles than many thin ones."
      path="/resources"
      label="Resources"
    >
      <ul className="grid gap-8 md:grid-cols-3">
        {planned.map((a) => (
          <li key={a.title}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md">
              <Image src={a.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover grayscale-[30%]" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="eyebrow">{a.kind}</span>
              <Badge tone="outline">In preparation</Badge>
            </div>
            <h2 className="mt-2 text-[1.375rem] leading-snug">{a.title}</h2>
          </li>
        ))}
      </ul>
      <div className="mt-16 max-w-xl">
        <h2 className="text-display-sm">Get them first</h2>
        <NewsletterForm />
      </div>
    </SimplePage>
  );
}
