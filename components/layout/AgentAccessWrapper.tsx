"use client";

import React, { useEffect, useState } from "react";
import { useAccess } from "@/contexts/PermissionContext";
import { Lock } from "lucide-react";
import { usePathname } from "next/navigation";

export function AgentAccessWrapper({ children }: { children: React.ReactNode }) {
  const { hasAccess, permissions } = useAccess();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // ou un loader global
  }

  // Vérifier l'accès au dashboard
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (isDashboard && !hasAccess("can_view_own_dashboard")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
          <Lock size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Accès restreint</h2>
        <p className="text-muted-foreground max-w-md">
          Votre profil ne vous autorise pas à accéder au tableau de bord. Veuillez contacter votre administrateur.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
