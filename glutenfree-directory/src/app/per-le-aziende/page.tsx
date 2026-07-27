import BusinessOnboardingContent from "@/components/pages/BusinessOnboardingContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Per le aziende: inserisci la tua attività",
  description: "Pubblica gratuitamente la tua attività su GlutenFree Directory e raggiungi la community celiaca italiana.",
  path: "/per-le-aziende",
  locale: "it",
});

export default function BusinessOnboardingPage() {
  return <BusinessOnboardingContent locale="it" />;
}
