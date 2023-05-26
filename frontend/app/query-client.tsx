"use client";

import React from "react";

import { QueryClientProvider as InternalProvider, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data !== undefined) {
        toast.error(
          `Something went wrong: ${error instanceof Error ? error.message : "Unknown server error"}`,
        );
      }
    },
  }),
});

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return <InternalProvider client={queryClient}>{children}</InternalProvider>;
}
