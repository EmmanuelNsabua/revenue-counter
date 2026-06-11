import { api } from "@/lib/api";
import { Commercant } from "@/types/commercant";

interface CommercantsResponse {
  success: boolean;
  data: Commercant[];
}

interface CommercantResponse {
  success: boolean;
  data: Commercant;
}

export const commercantsService = {
  /**
   * Récupère la liste des commerçants avec recherche optionnelle
   */
  getAll: async (search?: string) => {
    const response = await api.get<CommercantsResponse>("/commercants", {
      params: search ? { search } : {},
    });
    return response.data.data;
  },

  /**
   * Récupère un commerçant par son ID
   */
  getById: async (id: string | number) => {
    const response = await api.get<CommercantResponse>(`/commercants/${id}`);
    return response.data.data;
  },
};
