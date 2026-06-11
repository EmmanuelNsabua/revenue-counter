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
   * Récupère l'historique des paiements (filtré par agent côté backend)
   */
  getAll: async () => {
    const response = await api.get<PaiementsResponse>("/paiements");
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
