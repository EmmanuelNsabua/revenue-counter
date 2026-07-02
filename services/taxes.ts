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

  /**
   * Crée une nouvelle taxe
   */
  create: async (data: Partial<Taxe>) => {
    const response = await api.post<{ success: boolean; data: Taxe }>("/taxes", data);
    return response.data.data;
  },

  /**
   * Met à jour une taxe existante
   */
  update: async ({ id, data }: { id: string | number; data: Partial<Taxe> }) => {
    const response = await api.put<{ success: boolean; data: Taxe }>(`/taxes/${id}`, data);
    return response.data.data;
  },
};
