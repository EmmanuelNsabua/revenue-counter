import { api } from "@/lib/api";
import { AppNotification } from "@/types/notification";

export const notificationService = {
  getAll: async (): Promise<AppNotification[]> => {
    const response = await api.get('/notifications');
    return response.data.data;
  },
  
  markAsRead: async (id: number): Promise<void> => {
    await api.put(`/notifications/${id}`, { read_at: new Date().toISOString() });
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post('/notifications/read-all');
  }
};
