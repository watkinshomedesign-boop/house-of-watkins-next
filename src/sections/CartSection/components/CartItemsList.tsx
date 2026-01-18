"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

export function CartItemsList() {
  const { items, removeItem, updateItem } = useCart();

  return (
    <div className="w-full">
      {items.map((it) => (
        <div key={it.slug} className="border-b border-stone-200 py-3">
          <div className="flex items-center justify-between">
            <Link href={`/house/${it.slug}`} className="text-sm font-semibold underline">
              {it.name}
            </Link>
            <button className="text-xs underline" onClick={() => removeItem(it.slug)}>
              Remove
            </button>
          </div>
          <div className="mt-1 text-xs text-stone-500">{it.heated_sqft.toLocaleString()} heated sq ft</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs">Qty</span>
            <input
              className="border rounded px-2 py-1 w-20 text-xs"
              type="number"
              min={1}
              value={it.qty}
              onChange={(e) => updateItem(it.slug, { qty: Math.max(1, parseInt(e.target.value || "1", 10)) })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
