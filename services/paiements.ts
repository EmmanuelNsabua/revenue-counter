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
  getAll: async (filters?: { search?: string; mode_paiement?: string; commercant_id?: string | number; date_debut?: string; date_fin?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.mode_paiement) params.append("mode_paiement", filters.mode_paiement);
    if (filters?.commercant_id) params.append("commercant_id", filters.commercant_id.toString());
    if (filters?.date_debut) params.append("date_debut", filters.date_debut);
    if (filters?.date_fin) params.append("date_fin", filters.date_fin);

    const response = await api.get<{ success: boolean; data: Paiement[] }>(`/paiements?${params.toString()}`);
    const data = response.data.data;
    return (Array.isArray(data) ? data : ((data as any)?.data || [])) as Paiement[];
  },

  /**
   * Enregistre un nouveau paiement
   */
  create: async (data: CreatePaiementDTO) => {
    const response = await api.post<PaiementResponse>("/paiements", data);
    return response.data.data;
  },
};
