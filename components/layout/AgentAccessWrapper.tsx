"use client";

import React, { useEffect, useState } from "react";
import { useAccess } from "@/contexts/PermissionContext";
import { useAuth } from "@/providers/auth-provider";
import { Lock } from "lucide-react";
import { usePathname } from "next/navigation";

export function AgentAccessWrapper({ children }: { children: React.ReactNode }) {
  const { hasAccess, permissions } = useAccess();
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Attendre que le composant soit monté et l'auth chargée
  if (!mounted || authLoading) {
    return null;
  }

  // Vérifier l'accès au dashboard
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (isDashboard) {
    // Si l'utilisateur est un agent (par son rôle), il a accès — pas besoin de vérifier les permissions
    const role = user?.role?.toLowerCase() || "";
    const isAgent = role === "agent";

    // Les permissions peuvent être vides juste après la connexion (pas encore chargées depuis le localStorage).
    // On ne bloque QUE si les permissions sont chargées ET que la permission est absente ET que ce n'est pas un agent.
    const permissionsLoaded = Object.keys(permissions).length > 0;
    
    if (!isAgent && permissionsLoaded && !hasAccess("can_view_own_dashboard")) {
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
  }

  return <>{children}</>;
}
