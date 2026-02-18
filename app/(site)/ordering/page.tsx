"use client";

import { OrderingPage } from "@/sitePages/OrderingPage";
import { InteriorHeader } from "@/sections/InteriorHeader";

export default function OrderingRoutePage() {
  return (
    <>
      <div className="hidden md:block">
        <InteriorHeader />
      </div>
      <OrderingPage />
    </>
  );
}
