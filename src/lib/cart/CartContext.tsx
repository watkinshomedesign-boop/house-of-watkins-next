"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type CartItem = {
  slug: string;
  name: string;
  heated_sqft: number;
  license_type: "single" | "builder";
  addons: {
    sitePlan?: boolean;
    minorChanges?: boolean;
    smallAdjustments?: boolean;
    additions?: boolean;
    readableReverse?: boolean;
    cad?: boolean;
  };
  rush: boolean;
  paper_sets: number;
  qty: number;
};

type State = {
  items: CartItem[];
  plan_change_description?: string;
};

type Action =
  | { type: "add"; item: CartItem }
  | { type: "update"; slug: string; patch: Partial<CartItem> }
  | { type: "remove"; slug: string }
  | { type: "clear" }
  | { type: "set_plan_change_description"; value: string };

const STORAGE_KEY = "moss_cart_v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const nextItem: CartItem = { ...action.item, qty: 1 };
      return { ...state, items: [nextItem] };
    }
    case "update":
      return {
        ...state,
        items: state.items.map((i) =>
          i.slug === action.slug
            ? {
                ...i,
                ...action.patch,
                qty: 1,
              }
            : i
        ),
      };
    case "remove":
      return { ...state, items: state.items.filter((i) => i.slug !== action.slug) };
    case "clear":
      return { items: [], plan_change_description: "" };
    case "set_plan_change_description":
      return { ...state, plan_change_description: action.value };
    default:
      return state;
  }
}

type CartApi = {
  items: CartItem[];
  planChangeDescription: string;
  setPlanChangeDescription: (v: string) => void;
  addItem: (item: CartItem) => void;
  updateItem: (slug: string, patch: Partial<CartItem>) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartApi | null>(null);

export function CartProvider(props: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], plan_change_description: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as State;
      if (parsed?.items && Array.isArray(parsed.items)) {
        for (const item of parsed.items) {
          dispatch({ type: "add", item: item as CartItem });
        }
      }
      if (typeof (parsed as any)?.plan_change_description === "string") {
        dispatch({ type: "set_plan_change_description", value: String((parsed as any).plan_change_description) });
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const api = useMemo<CartApi>(
    () => ({
      items: state.items,
      planChangeDescription: String((state as any).plan_change_description ?? ""),
      setPlanChangeDescription: (v) => dispatch({ type: "set_plan_change_description", value: v }),
      addItem: (item) => dispatch({ type: "add", item }),
      updateItem: (slug, patch) => dispatch({ type: "update", slug, patch }),
      removeItem: (slug) => dispatch({ type: "remove", slug }),
      clearCart: () => dispatch({ type: "clear" }),
    }),
    [state.items]
  );

  return <CartContext.Provider value={api}>{props.children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
