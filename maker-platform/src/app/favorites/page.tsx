import { FavoritesView } from "@/components/account/favorites-view";
import { SimplePage } from "@/components/layout/simple-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Favorites", description: "Saved places and projects.", path: "/favorites", index: false });

export default function FavoritesPage() {
  return (
    <SimplePage title="Saved for later" lede="Favorites are kept in this browser for now. They will sync to your account once sign-in is available." path="/favorites" label="Favorites">
      <FavoritesView />
    </SimplePage>
  );
}
