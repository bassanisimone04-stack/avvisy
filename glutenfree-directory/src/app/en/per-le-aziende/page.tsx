import BusinessOnboardingContent from "@/components/pages/BusinessOnboardingContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "For businesses: list your business",
  description: "Publish your business on Mappa Senza Glutine for free and reach Italy's celiac community.",
  path: "/per-le-aziende",
  locale: "en",
});

export default function BusinessOnboardingPageEn() {
  return <BusinessOnboardingContent locale="en" />;
}
