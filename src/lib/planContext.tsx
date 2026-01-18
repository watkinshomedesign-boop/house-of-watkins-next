"use client";

import React, { createContext, useContext } from "react";
import type { Plan } from "@/lib/plans";

const PlanContext = createContext<Plan | null>(null);

export function PlanProvider(props: { plan: Plan; children: React.ReactNode }) {
  return <PlanContext.Provider value={props.plan}>{props.children}</PlanContext.Provider>;
}

export function usePlan() {
  const plan = useContext(PlanContext);
  if (!plan) {
    throw new Error("usePlan must be used within PlanProvider");
  }
  return plan;
}
