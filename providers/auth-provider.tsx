"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/auth";
import { getSession, setSession, clearSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * PROVIDER D'AUTHENTIFICATION GLOBAL
 * Responsable de la gestion de l'état utilisateur, de la validation du token
 * au démarrage et des redirections post-connexion.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    /**
     * VÉRIFICATION DE LA SESSION AU MONTAGE
     * On ne fait pas confiance au localStorage seul. 
     * On appelle le backend (/user) pour confirmer la validité du token.
     */
    const verifySession = async () => {
      const { token } = getSession();
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Validation réelle du token auprès du backend
        const response = await api.get<User>("/user");
        setUser(response.data);
      } catch {
        // En cas d'échec (401), le token est invalidé
        setUser(null);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  /**
   * MÉTHODE LOGIN
   * Appelé après le succès du POST /login. Stocke les infos et redirige par rôle.
   */
  const login = (token: string, user: User) => {
    setSession(token, user);
    setUser(user);
    
    // Redirection basée sur le rôle (minuscules depuis le backend)
    switch (user.role) {
      case "agent":
        router.push("/dashboard");
        break;
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "superadmin":
        router.push("/superadmin/dashboard");
        break;
      default:
        router.push("/");
    }
  };

  /**
   * MÉTHODE LOGOUT
   * Nettoie tout le stockage et vide le cache React Query avant redirection.
   */
  const logout = () => {
    clearSession();
    setUser(null);
    queryClient.clear(); // Important : vide les données métiers du cache
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * HOOK useAuth
 * Utilisé par les composants pour accéder à l'utilisateur courant et aux méthodes d'auth.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
