"use client";

import React from "react";

import { QueryClientProvider as InternalProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return <InternalProvider client={queryClient}>{children}</InternalProvider>;
}
