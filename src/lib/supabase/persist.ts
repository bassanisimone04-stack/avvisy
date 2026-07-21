"use client";

import { createClient } from "./client";
import { lotToRow, offerToRow, orderToRow } from "./mappers";
import type { StoreState } from "@/lib/store";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Scrive su Supabase l'effetto dell'azione appena eseguita.
 * "Best effort": ogni errore viene ignorato per non bloccare la UI (lo stato
 * locale resta la fonte immediata, il DB si allinea alla prossima ricarica).
 */
export async function persistAction(
  action: any,
  state: StoreState,
  companyId: string | null,
): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;

  // Inserisce una notifica reale destinata a una specifica azienda.
  const notif = (
    forCompany: string,
    type: string,
    title: string,
    detail: string,
    href: string,
    audience: string,
  ) =>
    supabase
      .from("notifications")
      .insert({ company_id: forCompany, type, title, detail, href, audience, read: false });

  try {
    switch (action.type) {
      case "PUBLISH_LOT":
        await supabase.from("lots").insert({ id: action.lot.id, ...lotToRow(action.lot) });
        break;

      case "DUPLICATE_LOT": {
        const dup = state.lots[0];
        if (dup) await supabase.from("lots").insert({ id: dup.id, ...lotToRow(dup) });
        break;
      }

      case "UPDATE_LOT_STATUS":
        await supabase.from("lots").update({ status: action.status }).eq("id", action.lotId);
        break;

      case "EDIT_LOT":
        await supabase
          .from("lots")
          .update({ unit_price: action.patch.unitPrice, quantity: action.patch.quantity })
          .eq("id", action.lotId);
        break;

      case "SEND_OFFER": {
        await supabase.from("offers").insert(offerToRow(action.offer));
        const lot = state.lots.find((l) => l.id === action.offer.lotId);
        if (lot) await supabase.from("lots").update({ offers_count: lot.offersCount }).eq("id", lot.id);
        await notif(
          action.offer.sellerId,
          "offerta_ricevuta",
          "Nuova offerta ricevuta",
          `Hai ricevuto un'offerta su “${lot?.title ?? "un lotto"}”.`,
          "/venditore/offerte",
          "seller",
        );
        break;
      }

      case "WITHDRAW_OFFER":
        await supabase.from("offers").update({ status: "Ritirata" }).eq("id", action.offerId);
        break;

      case "MARK_OFFER_VIEWED":
        await supabase.from("offers").update({ status: "Visualizzata" }).eq("id", action.offerId);
        break;

      case "SELLER_REJECT_OFFER":
      case "BUYER_REJECT_COUNTER":
        await supabase.from("offers").update({ status: "Rifiutata" }).eq("id", action.offerId);
        break;

      case "SELLER_COUNTER_OFFER": {
        const of = state.offers.find((o) => o.id === action.offerId);
        if (of) {
          await supabase
            .from("offers")
            .update({
              status: "Controproposta",
              unit_price: of.unitPrice,
              quantity: of.quantity,
              total_value: of.totalValue,
              history: of.history,
            })
            .eq("id", action.offerId);
          await notif(of.buyerId, "controproposta", "Controproposta ricevuta", "Il venditore ha rilanciato la tua offerta.", "/compratore/offerte", "buyer");
        }
        break;
      }

      case "SELLER_ACCEPT_OFFER":
      case "BUYER_ACCEPT_COUNTER": {
        const newOrder = state.orders[0];
        await supabase.from("offers").update({ status: "Accettata" }).eq("id", action.offerId);
        if (newOrder) {
          await supabase.from("orders").insert({ id: newOrder.id, ...orderToRow(newOrder) });
          await supabase.from("lots").update({ status: "Riservato" }).eq("id", newOrder.lotId);
          const forCompany = action.type === "SELLER_ACCEPT_OFFER" ? newOrder.buyerId : newOrder.sellerId;
          const href = action.type === "SELLER_ACCEPT_OFFER" ? "/compratore/ordini" : "/venditore/ordini";
          const audience = action.type === "SELLER_ACCEPT_OFFER" ? "buyer" : "seller";
          await notif(forCompany, "offerta_accettata", "Offerta accettata — ordine creato", `L'accordo su “${newOrder.lotTitle}” ha generato l'ordine ${newOrder.code}.`, href, audience);
        }
        break;
      }

      case "BUY_NOW":
      case "CHECKOUT_BUY": {
        const newOrder = state.orders[0];
        if (newOrder) {
          await supabase.from("orders").insert({ id: newOrder.id, ...orderToRow(newOrder) });
          await notif(newOrder.sellerId, "ordine_aggiornato", "Nuovo ordine ricevuto", `Nuovo acquisto: “${newOrder.lotTitle}” (ordine ${newOrder.code}).`, "/venditore/ordini", "seller");
        }
        break;
      }

      case "PAY_ORDER": {
        const o = state.orders.find((x) => x.id === action.orderId);
        if (o)
          await supabase
            .from("orders")
            .update({ paid: true, payment_method: o.paymentMethod, status: o.status, history: o.history })
            .eq("id", action.orderId);
        break;
      }

      case "UPDATE_ORDER_STATUS": {
        const o = state.orders.find((x) => x.id === action.orderId);
        if (o)
          await supabase
            .from("orders")
            .update({ status: o.status, history: o.history })
            .eq("id", action.orderId);
        break;
      }

      case "TOGGLE_FAVORITE": {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) break;
        const isFav = state.favorites.includes(action.lotId);
        if (isFav)
          await supabase.from("favorites").insert({ user_id: auth.user.id, lot_id: action.lotId });
        else
          await supabase
            .from("favorites")
            .delete()
            .eq("user_id", auth.user.id)
            .eq("lot_id", action.lotId);
        break;
      }

      case "ADD_SAVED_SEARCH": {
        const { data: auth } = await supabase.auth.getUser();
        if (auth.user)
          await supabase.from("saved_searches").insert({
            id: action.search.id,
            user_id: auth.user.id,
            label: action.search.label,
            query: action.search.query,
            alerts: action.search.alerts,
          });
        break;
      }

      case "REMOVE_SAVED_SEARCH":
        await supabase.from("saved_searches").delete().eq("id", action.id);
        break;

      case "TOGGLE_SEARCH_ALERT": {
        const s = state.savedSearches.find((x) => x.id === action.id);
        if (s) await supabase.from("saved_searches").update({ alerts: s.alerts }).eq("id", action.id);
        break;
      }

      case "MARK_NOTIFICATION_READ":
        await supabase.from("notifications").update({ read: true }).eq("id", action.id);
        break;

      case "MARK_ALL_READ":
        await supabase
          .from("notifications")
          .update({ read: true })
          .or(`company_id.eq.${companyId ?? "00000000-0000-0000-0000-000000000000"},company_id.is.null`);
        break;

      case "SET_VERIFICATION":
        await supabase
          .from("companies")
          .update({ verification: action.status })
          .eq("id", action.companyId);
        break;

      case "UPDATE_COMPANY": {
        const p = action.patch;
        const row: Record<string, unknown> = {};
        if (p.displayName !== undefined) row.display_name = p.displayName;
        if (p.ragioneSociale !== undefined) row.ragione_sociale = p.ragioneSociale;
        if (p.description !== undefined) row.description = p.description;
        if (p.sector !== undefined) row.sector = p.sector;
        if (p.address !== undefined) row.address = p.address;
        if (p.vatNumber !== undefined) row.vat_number = p.vatNumber;
        if (p.region !== undefined) row.region = p.region;
        if (p.province !== undefined) row.province = p.province;
        if (Object.keys(row).length) await supabase.from("companies").update(row).eq("id", action.companyId);
        break;
      }

      default:
        break;
    }
  } catch {
    /* best effort */
  }
}
