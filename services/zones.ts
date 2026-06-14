import { api } from "@/lib/api";

export interface Zone {
  id: number;
  nom: string;
  agents_count?: number;
  commercants_count?: number;
}

export const zonesService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: Zone[] }>("/zones");
    return response.data.data;
  },
  
  getById: async (id: number | string) => {
    const response = await api.get<{ success: boolean; data: Zone }>(`/zones/${id}`);
    return response.data.data;
  },
  
  create: async (data: Partial<Zone>) => {
    const response = await api.post<{ success: boolean; data: Zone }>("/zones", data);
    return response.data.data;
  },
  
  update: async ({ id, data }: { id: number | string; data: Partial<Zone> }) => {
    const response = await api.put<{ success: boolean; data: Zone }>(`/zones/${id}`, data);
    return response.data.data;
  },
  
  delete: async (id: number | string) => {
    const response = await api.delete<{ success: boolean }>(`/zones/${id}`);
    return response.data;
  },
};
