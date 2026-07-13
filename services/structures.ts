import { api } from "@/lib/api";

export interface Structure {
  id: number;
  nom: string;
  cle_tenant: string;
  localisation: string | null;
  admins_count?: number;
  agents_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateStructureDTO {
  nom: string;
  cle_tenant: string;
  localisation?: string;
}

export interface UpdateStructureDTO {
  nom?: string;
  localisation?: string;
}

export const structuresService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: Structure[] }>("/structures");
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await api.get<{ success: boolean; data: Structure }>(`/structures/${id}`);
    return response.data.data;
  },

  create: async (data: CreateStructureDTO) => {
    const response = await api.post<{ success: boolean; data: Structure; message: string }>("/structures", data);
    return response.data;
  },

  update: async (id: number, data: UpdateStructureDTO) => {
    const response = await api.put<{ success: boolean; data: Structure; message: string }>(`/structures/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/structures/${id}`);
    return response.data;
  },
};
