import { api } from "@/lib/api";
import { User } from "@/types/auth";

export const adminsService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: any }>("/admins");
    const data = response.data.data;
    return (Array.isArray(data) ? data : (data?.data || [])) as User[];
  },
  
  create: async (data: Partial<User>) => {
    const response = await api.post<{ success: boolean; data: User }>("/admins", data);
    return response.data.data;
  },
  
  update: async ({ id, data }: { id: number | string; data: Partial<User> }) => {
    const response = await api.put<{ success: boolean; data: User }>(`/admins/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/admins/${id}`);
    return response.data;
  },
};
