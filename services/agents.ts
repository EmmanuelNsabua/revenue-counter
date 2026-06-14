import { api } from "@/lib/api";
import { User } from "@/types/auth";

export const agentsService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: User[] }>("/agents");
    return response.data.data;
  },
  
  getById: async (id: number | string) => {
    const response = await api.get<{ success: boolean; data: User }>(`/agents/${id}`);
    return response.data.data;
  },
  
  create: async (data: Partial<User>) => {
    const response = await api.post<{ success: boolean; data: User }>("/agents", data);
    return response.data.data;
  },
  
  update: async ({ id, data }: { id: number | string; data: Partial<User> }) => {
    const response = await api.put<{ success: boolean; data: User }>(`/agents/${id}`, data);
    return response.data.data;
  },
  
  delete: async (id: number | string) => {
    const response = await api.delete<{ success: boolean }>(`/agents/${id}`);
    return response.data;
  },
};
