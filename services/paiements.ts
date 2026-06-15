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
    let searchTerm = params?.search?.trim() || "";
    
    // Intelligence de recherche : Si on cherche "TXN-09" ou "txn-9", 
    // on extrait uniquement le chiffre pour que le backend puisse filtrer par ID.
    if (searchTerm.toLowerCase().startsWith("txn-")) {
      searchTerm = searchTerm.replace(/txn-/i, "");
    }

    const finalParams = {
      ...params,
      search: searchTerm,
    };
    
    const response = await api.get<PaiementsResponse>("/paiements", {
      params: finalParams,
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
