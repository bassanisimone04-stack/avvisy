import { HubPage, hubMetadata } from "@/features/directory/hubPage";

type P = { params: Promise<{ locale: string; country?: string; place?: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export const generateMetadata = (p: P) => hubMetadata(p);
export default function Page(p: P) {
  return HubPage(p);
}
