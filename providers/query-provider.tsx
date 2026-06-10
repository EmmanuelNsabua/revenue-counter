"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Use state to ensure the QueryClient is only created once per component lifecycle
  // This is the recommended pattern for Next.js App Router
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1, // Limiter les retries pour éviter de spammer le réseau
            refetchOnWindowFocus: false, // Désactiver le refetch quand la fenêtre reprend le focus
            staleTime: 60 * 1000, // 1 minute de stale time par défaut
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
