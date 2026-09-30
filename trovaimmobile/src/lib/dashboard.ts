import { db } from "./db";

export type VisitRow = {
  id: number;
  listing_id: number;
  title: string;
  via: string;
  civico: string;
  comune: string;
  start_at: string;
  end_at: string;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  contract_signed: number;
  seeker_name: string;
  seeker_email: string;
  advertiser_name: string;
  advertiser_id: number;
  seeker_id: number;
  reviewed: number;
};

export function visitsFor(userId: number): VisitRow[] {
  return db()
    .prepare(
      `SELECT v.id, v.listing_id, l.title, p.via, p.civico, p.comune, v.start_at, v.end_at, v.status, v.contract_signed,
              s.name AS seeker_name, s.email AS seeker_email, COALESCE(a.agency_name, a.name) AS advertiser_name,
              v.advertiser_id, v.seeker_id, EXISTS(SELECT 1 FROM reviews r WHERE r.visit_id = v.id) AS reviewed
         FROM visits v JOIN listings l ON l.id = v.listing_id JOIN properties p ON p.id = l.property_id
         JOIN users s ON s.id = v.seeker_id JOIN users a ON a.id = v.advertiser_id
        WHERE v.seeker_id = ? OR v.advertiser_id = ?
        ORDER BY v.start_at DESC`,
    )
    .all(userId, userId) as VisitRow[];
}

export type ContactRow = {
  id: number;
  listing_id: number;
  title: string;
  message: string;
  reply: string | null;
  created_at: string;
  replied_at: string | null;
  payment_flag: number;
  seeker_name: string;
  advertiser_name: string;
  advertiser_id: number;
  seeker_id: number;
};

export function contactsFor(userId: number): ContactRow[] {
  return db()
    .prepare(
      `SELECT c.id, c.listing_id, l.title, c.message, c.reply, c.created_at, c.replied_at, c.payment_flag,
              s.name AS seeker_name, COALESCE(a.agency_name, a.name) AS advertiser_name, c.advertiser_id, c.seeker_id
         FROM contacts c JOIN listings l ON l.id = c.listing_id JOIN users s ON s.id = c.seeker_id JOIN users a ON a.id = c.advertiser_id
        WHERE c.seeker_id = ? OR c.advertiser_id = ?
        ORDER BY (c.replied_at IS NULL) DESC, c.created_at DESC`,
    )
    .all(userId, userId) as ContactRow[];
}
