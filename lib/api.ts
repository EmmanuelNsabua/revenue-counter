import axios from "axios";
import { getSession, clearSession } from "./auth";

/**
 * CONFIGURATION AXIOS GLOBALE
 * Centralise les appels API vers le backend Laravel sur Render.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://revenue-counter-api.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json", // Impératif pour que Laravel renvoie du JSON au lieu de redirections HTML
  },
});

/**
 * INTERCEPTEUR DE REQUÊTE
 * Injecte automatiquement le Bearer Token dans le header Authorization 
 * si une session est active.
 */
api.interceptors.request.use(
  (config) => {
    const { token } = getSession();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * INTERCEPTEUR DE RÉPONSE
 * Gère les erreurs globales, notamment la perte de session (401).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le serveur renvoie 401 Unauthorized
    // IMPORTANT : On ignore l'erreur 401 si elle vient de la page /login elle-même
    // pour permettre l'affichage du message d'erreur "Identifiants incorrects"
    const isLoginRequest = error.config?.url?.endsWith("/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      // Token expiré, falsifié ou inexistant sur le serveur
      clearSession();
      if (typeof window !== "undefined") {
        // Force le retour à la racine sans recharger tout l'état React si possible
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
