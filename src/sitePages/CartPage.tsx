"use client";

import React from "react";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { Footer } from "@/sections/Footer";
import { MD_UP_MEDIA_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import { CartPageMobile } from "@/sitePages/CartPageMobile";
import { CartPageDesktop } from "@/sitePages/CartPageDesktop";

export function CartPage() {
  const isDesktop = useMediaQuery(MD_UP_MEDIA_QUERY, { serverFallback: true });

  if (isDesktop) {
    return (
      <div className="text-zinc-800 font-gilroy">
        <InteriorHeader />
        <CartPageDesktop />
        <Footer />
      </div>
    );
  }

  return <CartPageMobile />;
}

export default CartPage;
