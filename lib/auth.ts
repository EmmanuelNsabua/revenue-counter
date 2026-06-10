import { User } from "@/types/auth";

/**
 * CLÉS DE STOCKAGE
 * Utilisées pour la persistance locale.
 */
const TOKEN_KEY = "revenue_token";
const USER_KEY = "revenue_user";

/**
 * SET SESSION
 * Stocke le token et l'utilisateur dans le localStorage pour la persistance client
 * et dans les cookies pour l'accessibilité côté serveur (Middleware).
 */
export const setSession = (token: string, user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Cookies accessibles par le client et le serveur (max-age: 24h)
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `revenue_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
  }
};

/**
 * GET SESSION
 * Récupère les informations de session stockées localement.
 */
export const getSession = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    return {
      token,
      user: userJson ? (JSON.parse(userJson) as User) : null,
    };
  }
  return { token: null, user: null };
};

/**
 * CLEAR SESSION
 * Supprime toutes les traces de la session courante (localStorage + cookies).
 * Utilisé lors du logout ou en cas de token invalide (401).
 */
export const clearSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // On expire les cookies
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `revenue_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};
