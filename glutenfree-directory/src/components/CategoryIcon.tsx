import {
  UtensilsCrossed,
  Pizza,
  BedDouble,
  Stethoscope,
  ShoppingCart,
  Store,
  Croissant,
  IceCreamCone,
  type LucideProps,
} from "lucide-react";

const MAP: Record<string, React.ComponentType<LucideProps>> = {
  UtensilsCrossed,
  Pizza,
  BedDouble,
  Stethoscope,
  ShoppingCart,
  Store,
  Croissant,
  IceCreamCone,
};

export default function CategoryIcon({ icon, ...props }: { icon: string } & LucideProps) {
  const Icon = MAP[icon] ?? Store;
  return <Icon {...props} />;
}
