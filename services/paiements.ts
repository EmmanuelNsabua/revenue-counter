import { api } from "@/lib/api";
import { Paiement, CreatePaiementDTO } from "@/types/paiement";

interface PaiementsResponse {
  success: boolean;
  data: Paiement[];
}

interface PaiementResponse {
  success: boolean;
  data: Paiement;
}

export const paiementsService = {
  /**
   * Récupère l'historique des paiements avec filtres optionnels
   */
  getAll: async (params?: { search?: string; mode_paiement?: string }) => {
    const response = await api.get<PaiementsResponse>("/paiements", {
      params,
    });
    return response.data.data;
  },

  /**
   * Enregistre un nouveau paiement
   */
  create: async (data: CreatePaiementDTO) => {
    const response = await api.post<PaiementResponse>("/paiements", data);
    return response.data.data;
  },
};
