"use client";

import { CartProvider } from "@/lib/cart/CartContext";

export function Providers(props: { children: React.ReactNode }) {
  return <CartProvider>{props.children}</CartProvider>;
}
