"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  CURRENT_BUYER_ID,
  CURRENT_SELLER_ID,
  companies as seedCompanies,
  lots as seedLots,
  offers as seedOffers,
  orders as seedOrders,
  notifications as seedNotifications,
  reviews as seedReviews,
  savedSearches as seedSearches,
  savedLotIds as seedFavorites,
  companyById,
} from "./mock-data";
import {
  createOrder,
  makeNotification,
  offerTotal,
} from "./services";
import type {
  Company,
  Lot,
  LotStatus,
  Notification,
  Offer,
  Order,
  OrderStatus,
  Review,
  SavedSearch,
  VerificationStatus,
} from "./types";

const STORAGE_KEY = "scortvia:v2";

export interface StoreState {
  companies: Company[];
  lots: Lot[];
  offers: Offer[];
  orders: Order[];
  notifications: Notification[];
  reviews: Review[];
  favorites: string[];
  savedSearches: SavedSearch[];
}

function seedState(): StoreState {
  return {
    companies: seedCompanies.map((c) => ({ ...c })),
    lots: seedLots.map((l) => ({ ...l })),
    offers: seedOffers.map((o) => ({ ...o })),
    orders: seedOrders.map((o) => ({ ...o })),
    notifications: seedNotifications.map((n) => ({ ...n })),
    reviews: seedReviews.map((r) => ({ ...r })),
    favorites: [...seedFavorites],
    savedSearches: seedSearches.map((s) => ({ ...s })),
  };
}

type Action =
  | { type: "HYDRATE"; state: StoreState }
  | { type: "RESET" }
  | { type: "TOGGLE_FAVORITE"; lotId: string }
  | { type: "PUBLISH_LOT"; lot: Lot }
  | { type: "UPDATE_LOT_STATUS"; lotId: string; status: LotStatus }
  | { type: "EDIT_LOT"; lotId: string; patch: Partial<Lot> }
  | { type: "DUPLICATE_LOT"; lotId: string }
  | { type: "SEND_OFFER"; offer: Offer }
  | { type: "WITHDRAW_OFFER"; offerId: string }
  | { type: "MARK_OFFER_VIEWED"; offerId: string }
  | { type: "SELLER_ACCEPT_OFFER"; offerId: string }
  | { type: "SELLER_REJECT_OFFER"; offerId: string }
  | { type: "SELLER_COUNTER_OFFER"; offerId: string; unitPrice: number; quantity?: number; message?: string }
  | { type: "BUYER_ACCEPT_COUNTER"; offerId: string }
  | { type: "BUYER_REJECT_COUNTER"; offerId: string }
  | { type: "BUY_NOW"; lotId: string; quantity: number; buyerId: string }
  | { type: "UPDATE_ORDER_STATUS"; orderId: string; status: OrderStatus }
  | { type: "ADD_NOTIFICATION"; notification: Notification }
  | { type: "MARK_NOTIFICATION_READ"; id: string }
  | { type: "MARK_ALL_READ" }
  | { type: "ADD_SAVED_SEARCH"; search: SavedSearch }
  | { type: "REMOVE_SAVED_SEARCH"; id: string }
  | { type: "TOGGLE_SEARCH_ALERT"; id: string }
  | { type: "SET_VERIFICATION"; companyId: string; status: VerificationStatus };

function notify(
  state: StoreState,
  n: Omit<Notification, "id" | "date" | "read">,
): Notification[] {
  return [makeNotification(n), ...state.notifications];
}

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "RESET":
      return seedState();

    case "TOGGLE_FAVORITE": {
      const has = state.favorites.includes(action.lotId);
      return {
        ...state,
        favorites: has
          ? state.favorites.filter((id) => id !== action.lotId)
          : [action.lotId, ...state.favorites],
      };
    }

    case "PUBLISH_LOT": {
      return {
        ...state,
        lots: [action.lot, ...state.lots],
        notifications: notify(state, {
          type: "sistema",
          title: "Lotto inviato in revisione",
          detail: `“${action.lot.title}” è stato inviato alla revisione della piattaforma.`,
          href: "/venditore/lotti",
          audience: "seller",
        }),
      };
    }

    case "UPDATE_LOT_STATUS":
      return {
        ...state,
        lots: state.lots.map((l) =>
          l.id === action.lotId ? { ...l, status: action.status } : l,
        ),
      };

    case "EDIT_LOT":
      return {
        ...state,
        lots: state.lots.map((l) =>
          l.id === action.lotId ? { ...l, ...action.patch } : l,
        ),
      };

    case "DUPLICATE_LOT": {
      const src = state.lots.find((l) => l.id === action.lotId);
      if (!src) return state;
      const copy: Lot = {
        ...src,
        id: `lot-${Math.random().toString(36).slice(2, 8)}`,
        code: `SCV-${Math.floor(2000 + Math.random() * 7000)}`,
        title: `${src.title} (copia)`,
        status: "Bozza",
        views: 0,
        offersCount: 0,
        publishedAt: new Date().toISOString().slice(0, 10),
      };
      return { ...state, lots: [copy, ...state.lots] };
    }

    case "SEND_OFFER": {
      const lot = state.lots.find((l) => l.id === action.offer.lotId);
      return {
        ...state,
        offers: [action.offer, ...state.offers],
        lots: state.lots.map((l) =>
          l.id === action.offer.lotId ? { ...l, offersCount: l.offersCount + 1 } : l,
        ),
        notifications: notify(state, {
          type: "offerta_ricevuta",
          title: "Nuova offerta ricevuta",
          detail: `${companyById(action.offer.buyerId)?.displayName ?? "Un compratore"} ha proposto un'offerta su “${lot?.title ?? "un lotto"}”.`,
          href: "/venditore/offerte",
          audience: "seller",
        }),
      };
    }

    case "WITHDRAW_OFFER":
      return {
        ...state,
        offers: state.offers.map((o) =>
          o.id === action.offerId ? { ...o, status: "Ritirata" } : o,
        ),
      };

    case "MARK_OFFER_VIEWED":
      return {
        ...state,
        offers: state.offers.map((o) =>
          o.id === action.offerId && o.status === "Inviata"
            ? { ...o, status: "Visualizzata" }
            : o,
        ),
      };

    case "SELLER_REJECT_OFFER":
      return {
        ...state,
        offers: state.offers.map((o) =>
          o.id === action.offerId ? { ...o, status: "Rifiutata" } : o,
        ),
        notifications: (() => {
          const of = state.offers.find((o) => o.id === action.offerId);
          if (!of) return state.notifications;
          return notify(state, {
            type: "sistema",
            title: "Offerta rifiutata",
            detail: `La tua offerta è stata rifiutata dal venditore.`,
            href: "/compratore/offerte",
            audience: "buyer",
          });
        })(),
      };

    case "SELLER_COUNTER_OFFER": {
      const of = state.offers.find((o) => o.id === action.offerId);
      if (!of) return state;
      const quantity = action.quantity ?? of.quantity;
      const entry = {
        by: "seller" as const,
        unitPrice: action.unitPrice,
        quantity,
        message: action.message,
        date: new Date().toISOString().slice(0, 10),
      };
      return {
        ...state,
        offers: state.offers.map((o) =>
          o.id === action.offerId
            ? {
                ...o,
                status: "Controproposta",
                unitPrice: action.unitPrice,
                quantity,
                totalValue: offerTotal(action.unitPrice, quantity),
                history: [...o.history, entry],
              }
            : o,
        ),
        notifications: notify(state, {
          type: "controproposta",
          title: "Controproposta ricevuta",
          detail: `Il venditore ha rilanciato la tua offerta.`,
          href: "/compratore/offerte",
          audience: "buyer",
        }),
      };
    }

    case "SELLER_ACCEPT_OFFER":
    case "BUYER_ACCEPT_COUNTER": {
      const of = state.offers.find((o) => o.id === action.offerId);
      if (!of) return state;
      const lot = state.lots.find((l) => l.id === of.lotId);
      if (!lot) return state;
      const order = createOrder({
        lot,
        buyerId: of.buyerId,
        quantity: of.quantity,
        unitPrice: of.unitPrice,
      });
      const audience = action.type === "SELLER_ACCEPT_OFFER" ? "buyer" : "seller";
      return {
        ...state,
        offers: state.offers.map((o) =>
          o.id === action.offerId ? { ...o, status: "Accettata" } : o,
        ),
        orders: [order, ...state.orders],
        lots: state.lots.map((l) =>
          l.id === lot.id ? { ...l, status: "Riservato" } : l,
        ),
        notifications: notify(state, {
          type: "offerta_accettata",
          title: "Offerta accettata — ordine creato",
          detail: `L'accordo su “${lot.title}” ha generato l'ordine ${order.code}.`,
          href: audience === "buyer" ? "/compratore/ordini" : "/venditore/ordini",
          audience,
        }),
      };
    }

    case "BUYER_REJECT_COUNTER":
      return {
        ...state,
        offers: state.offers.map((o) =>
          o.id === action.offerId ? { ...o, status: "Rifiutata" } : o,
        ),
      };

    case "BUY_NOW": {
      const lot = state.lots.find((l) => l.id === action.lotId);
      if (!lot) return state;
      const order = createOrder({
        lot,
        buyerId: action.buyerId,
        quantity: action.quantity,
        unitPrice: lot.unitPrice,
      });
      return {
        ...state,
        orders: [order, ...state.orders],
        notifications: notify(state, {
          type: "ordine_aggiornato",
          title: "Nuovo ordine ricevuto",
          detail: `${companyById(action.buyerId)?.displayName ?? "Un compratore"} ha acquistato “${lot.title}”. Ordine ${order.code}.`,
          href: "/venditore/ordini",
          audience: "seller",
        }),
      };
    }

    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.orderId
            ? {
                ...o,
                status: action.status,
                history: [
                  ...o.history,
                  { status: action.status, date: new Date().toISOString().slice(0, 10) },
                ],
              }
            : o,
        ),
      };

    case "ADD_NOTIFICATION":
      return { ...state, notifications: [action.notification, ...state.notifications] };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n,
        ),
      };

    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case "ADD_SAVED_SEARCH":
      return { ...state, savedSearches: [action.search, ...state.savedSearches] };

    case "REMOVE_SAVED_SEARCH":
      return {
        ...state,
        savedSearches: state.savedSearches.filter((s) => s.id !== action.id),
      };

    case "TOGGLE_SEARCH_ALERT":
      return {
        ...state,
        savedSearches: state.savedSearches.map((s) =>
          s.id === action.id ? { ...s, alerts: !s.alerts } : s,
        ),
      };

    case "SET_VERIFICATION":
      return {
        ...state,
        companies: state.companies.map((c) =>
          c.id === action.companyId ? { ...c, verification: action.status } : c,
        ),
      };

    default:
      return state;
  }
}

interface StoreContextValue {
  state: StoreState;
  dispatch: React.Dispatch<Action>;
  currentSellerId: string;
  currentBuyerId: string;
  currentSeller: Company;
  currentBuyer: Company;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, seedState);

  // Idratazione da localStorage al primo mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoreState;
        if (parsed && parsed.lots && parsed.offers) {
          dispatch({ type: "HYDRATE", state: parsed });
        }
      }
    } catch {
      /* ignora dati corrotti */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persistenza ad ogni cambiamento.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota superata: ignora */
    }
  }, [state]);

  const value = useMemo<StoreContextValue>(() => {
    const currentSeller =
      state.companies.find((c) => c.id === CURRENT_SELLER_ID) ?? state.companies[0];
    const currentBuyer =
      state.companies.find((c) => c.id === CURRENT_BUYER_ID) ?? state.companies[0];
    return {
      state,
      dispatch,
      currentSellerId: CURRENT_SELLER_ID,
      currentBuyerId: CURRENT_BUYER_ID,
      currentSeller,
      currentBuyer,
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve essere usato dentro <StoreProvider>");
  return ctx;
}

// Selettori di comodo -------------------------------------------------------

export function useLot(id: string): Lot | undefined {
  return useStore().state.lots.find((l) => l.id === id);
}

export function useFavorites() {
  const { state, dispatch } = useStore();
  return {
    favorites: state.favorites,
    isFavorite: (id: string) => state.favorites.includes(id),
    toggle: (id: string) => dispatch({ type: "TOGGLE_FAVORITE", lotId: id }),
  };
}

export function useUnreadCount(audience: "seller" | "buyer"): number {
  const { state } = useStore();
  return state.notifications.filter(
    (n) => !n.read && (n.audience === audience || n.audience === "both"),
  ).length;
}
