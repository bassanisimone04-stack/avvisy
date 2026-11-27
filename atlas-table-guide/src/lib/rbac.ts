export const ROLES = ["admin", "editor", "data-verifier", "partner-manager", "viewer", "partner", "user"] as const;
export type Role = (typeof ROLES)[number];

export type Action =
  | "admin:access" | "restaurant:edit" | "restaurant:publish" | "price:update" | "price:verify" | "award:edit"
  | "import:run" | "partner:approve" | "user:manage" | "audit:read" | "article:edit" | "article:publish" | "seo:edit";

const MATRIX: Record<Role, Action[]> = {
  admin: ["admin:access", "restaurant:edit", "restaurant:publish", "price:update", "price:verify", "award:edit", "import:run", "partner:approve", "user:manage", "audit:read", "article:edit", "article:publish", "seo:edit"],
  editor: ["admin:access", "restaurant:edit", "restaurant:publish", "article:edit", "article:publish", "seo:edit", "audit:read"],
  "data-verifier": ["admin:access", "restaurant:edit", "price:update", "price:verify", "award:edit", "import:run", "audit:read"],
  "partner-manager": ["admin:access", "partner:approve", "audit:read"],
  viewer: ["admin:access", "audit:read"],
  partner: [],
  user: [],
};

export function can(role: Role | null | undefined, action: Action): boolean {
  return !!role && MATRIX[role]?.includes(action) === true;
}

/**
 * A partner may edit a restaurant only when they hold an APPROVED claim for it and their
 * partner account is verified. Mirrors the RLS policy `restaurants_partner_update`.
 */
export function partnerCanEdit(
  user: { id: string; role: Role; partnerVerified?: boolean },
  restaurantId: string,
  claims: { partnerUserId: string; restaurantId: string; status: "pending" | "approved" | "rejected" }[],
): boolean {
  if (can(user.role, "restaurant:edit")) return true;
  if (user.role !== "partner" || !user.partnerVerified) return false;
  return claims.some((c) => c.partnerUserId === user.id && c.restaurantId === restaurantId && c.status === "approved");
}

/** Partners may only edit operational fields — never recognitions or editorial status. */
export const PARTNER_EDITABLE_FIELDS = ["description", "website", "phone", "email", "hours", "menus", "images", "reservation"] as const;
export function sanitizePartnerPatch(patch: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(patch).filter(([k]) => (PARTNER_EDITABLE_FIELDS as readonly string[]).includes(k)));
}
