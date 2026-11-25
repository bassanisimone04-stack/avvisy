import { SimplePage } from "@/components/layout/simple-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "About this preview", description: "What is real and what is demo in this preview.", path: "/about-this-preview", index: false });

const rows: [string, "Working" | "Demo" | "Planned", string][] = [
  ["Board Foot, CNC Cost and Cut List calculators", "Working", "Real calculations, tested."],
  ["Directory search, filters, distance and map", "Working", "Runs on fictional demo listings and a demo location lookup."],
  ["Business listings", "Demo", "Fictional businesses. Not real places."],
  ["Digital products and prices", "Demo", "Illustrative catalog. No files are for sale."],
  ["Cart and favorites", "Demo", "Stored only in your browser."],
  ["Map basemap", "Demo", "State boundaries only; a licensed map provider comes later."],
  ["Photography", "Demo", "Generated material textures stand in for licensed photos."],
  ["Accounts, checkout, downloads, newsletter", "Planned", "Not connected yet."],
];

export default function AboutPreviewPage() {
  return (
    <SimplePage eyebrow="Transparency" title="What’s real in this preview?" lede="This is an early interface preview. Here is exactly what works and what is placeholder." path="/about-this-preview" label="About this preview">
      <table className="w-full max-w-3xl text-left text-sm">
        <thead>
          <tr className="border-b border-line-strong text-xs text-muted">
            <th scope="col" className="pb-2 font-medium">Feature</th>
            <th scope="col" className="pb-2 font-medium">Status</th>
            <th scope="col" className="pb-2 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([f, s, n]) => (
            <tr key={f} className="border-b border-line align-top">
              <td className="py-3 pr-4 text-ink">{f}</td>
              <td className="py-3 pr-4">
                <span className={s === "Working" ? "font-semibold text-success" : s === "Demo" ? "font-semibold text-warning" : "font-semibold text-muted"}>{s}</span>
              </td>
              <td className="py-3 text-muted">{n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SimplePage>
  );
}
