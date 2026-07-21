// Conversione righe DB (snake_case) → tipi applicativi (camelCase).
import type {
  Company,
  Lot,
  Notification,
  Offer,
  Order,
  Review,
  SavedSearch,
} from "@/lib/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function rowToCompany(r: any): Company {
  return {
    id: r.id,
    ragioneSociale: r.ragione_sociale,
    displayName: r.display_name,
    vatNumber: r.vat_number,
    sector: r.sector ?? "",
    description: r.description ?? "",
    region: r.region ?? "",
    province: r.province ?? "",
    address: r.address ?? "",
    foundedYear: r.founded_year ?? 0,
    employees: r.employees ?? "",
    verification: r.verification,
    rating: Number(r.rating ?? 0),
    reviewsCount: r.reviews_count ?? 0,
    logo: r.logo ?? "",
    verifiedDocuments: r.verified_documents ?? [],
    registeredAt: r.registered_at ?? new Date().toISOString(),
    salesCount: r.sales_count ?? 0,
    walletBalance: Number(r.wallet_balance ?? 0),
  };
}

export function rowToLot(r: any): Lot {
  return {
    id: r.id,
    code: r.code,
    title: r.title,
    shortDescription: r.short_description ?? "",
    description: r.description ?? "",
    category: r.category,
    subcategory: r.subcategory ?? "",
    images: (r.images ?? []).map((x: string) => Number(x) || 1),
    imageUrls: r.image_urls && r.image_urls.length ? r.image_urls : undefined,
    quantity: Number(r.quantity),
    unit: r.unit ?? "pz",
    minQuantity: Number(r.min_quantity ?? 1),
    unitPrice: Number(r.unit_price),
    negotiable: !!r.negotiable,
    condition: r.condition,
    region: r.region ?? "",
    province: r.province ?? "",
    delivery: r.delivery,
    documents: r.documents ?? [],
    certifications: r.certifications ?? [],
    sellerId: r.seller_id,
    publishedAt: r.published_at,
    expiresAt: r.expires_at,
    views: r.views ?? 0,
    offersCount: r.offers_count ?? 0,
    status: r.status,
    featured: !!r.featured,
  };
}

export function rowToOffer(r: any): Offer {
  return {
    id: r.id,
    lotId: r.lot_id,
    buyerId: r.buyer_id,
    sellerId: r.seller_id,
    quantity: Number(r.quantity),
    unitPrice: Number(r.unit_price),
    totalValue: Number(r.total_value),
    message: r.message ?? "",
    date: r.date,
    expiresAt: r.expires_at,
    status: r.status,
    history: r.history ?? [],
  };
}

export function rowToOrder(r: any): Order {
  return {
    id: r.id,
    code: r.code,
    lotId: r.lot_id,
    lotTitle: r.lot_title,
    buyerId: r.buyer_id,
    sellerId: r.seller_id,
    quantity: Number(r.quantity),
    unitPrice: Number(r.unit_price),
    subtotal: Number(r.subtotal),
    commission: Number(r.commission),
    total: Number(r.total),
    delivery: r.delivery,
    status: r.status,
    history: r.history ?? [],
    documents: r.documents ?? [],
    date: r.date,
    paid: !!r.paid,
    paymentMethod: r.payment_method ?? undefined,
  };
}

export function rowToNotification(r: any): Notification {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    detail: r.detail ?? "",
    date: r.date,
    read: !!r.read,
    href: r.href ?? undefined,
    audience: r.audience ?? "both",
  };
}

export function rowToReview(r: any): Review {
  return {
    id: r.id,
    companyId: r.company_id,
    authorCompany: r.author_company,
    rating: r.rating,
    date: r.date,
    title: r.title,
    body: r.body ?? "",
    lotId: r.lot_id ?? undefined,
  };
}

export function rowToSavedSearch(r: any): SavedSearch {
  return {
    id: r.id,
    label: r.label,
    query: r.query ?? "",
    alerts: !!r.alerts,
  };
}

// Tipi applicativi → payload DB (per gli insert/update)
export function lotToRow(l: Lot) {
  return {
    code: l.code,
    title: l.title,
    short_description: l.shortDescription,
    description: l.description,
    category: l.category,
    subcategory: l.subcategory,
    images: l.images.map(String),
    image_urls: l.imageUrls ?? [],
    quantity: l.quantity,
    unit: l.unit,
    min_quantity: l.minQuantity,
    unit_price: l.unitPrice,
    negotiable: l.negotiable,
    condition: l.condition,
    region: l.region,
    province: l.province,
    delivery: l.delivery,
    documents: l.documents,
    certifications: l.certifications,
    seller_id: l.sellerId,
    published_at: l.publishedAt,
    expires_at: l.expiresAt,
    views: l.views,
    offers_count: l.offersCount,
    status: l.status,
    featured: l.featured ?? false,
  };
}

export function offerToRow(o: Offer) {
  return {
    id: o.id,
    lot_id: o.lotId,
    buyer_id: o.buyerId,
    seller_id: o.sellerId,
    quantity: o.quantity,
    unit_price: o.unitPrice,
    total_value: o.totalValue,
    message: o.message,
    date: o.date,
    expires_at: o.expiresAt,
    status: o.status,
    history: o.history,
  };
}

export function orderToRow(o: Order) {
  return {
    code: o.code,
    lot_id: o.lotId,
    lot_title: o.lotTitle,
    buyer_id: o.buyerId,
    seller_id: o.sellerId,
    quantity: o.quantity,
    unit_price: o.unitPrice,
    subtotal: o.subtotal,
    commission: o.commission,
    total: o.total,
    delivery: o.delivery,
    status: o.status,
    history: o.history,
    documents: o.documents,
    date: o.date,
    paid: o.paid,
    payment_method: o.paymentMethod ?? null,
  };
}
