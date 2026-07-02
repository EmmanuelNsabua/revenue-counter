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
   * Récupère la liste des commerçants avec filtres optionnels
   */
  getAll: async (params?: { search?: string; zone?: string; status?: string }) => {
    // On nettoie mais on ne force plus la casse car le backend semble sensible à la casse
    // notamment pour les codes commerçants (CD-KEN-...)
    const cleanParams = {
      ...params,
      search: params?.search?.trim(),
    };
    const response = await api.get<CommercantsResponse>("/commercants", {
      params: cleanParams,
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

  /**
   * Crée un nouveau commerçant
   */
  create: async (data: Partial<Commercant>) => {
    const response = await api.post<CommercantResponse>("/commercants", data);
    return response.data.data;
  },

  /**
   * Met à jour un commerçant existant
   */
  update: async ({ id, data }: { id: string | number; data: Partial<Commercant> }) => {
    const response = await api.put<CommercantResponse>(`/commercants/${id}`, data);
    return response.data.data;
  },

  /**
   * Supprime un commerçant
   */
  delete: async (id: string | number) => {
    const response = await api.delete<{ success: boolean }>(`/commercants/${id}`);
    return response.data;
  },
};
