import { api } from "@/lib/api";
import { Taxe } from "@/types/taxe";

interface TaxesResponse {
  success: boolean;
  data: Taxe[];
}

export const taxesService = {
  /**
   * Récupère la liste de toutes les taxes
   */
  getAll: async () => {
    const response = await api.get<TaxesResponse>("/taxes");
    return response.data.data;
  },
};
