import { api } from "@/lib/api";

export interface SupportTicketData {
  subject: string;
  message: string;
}

export const supportService = {
  submitTicket: async (data: SupportTicketData) => {
    const response = await api.post("/support", data);
    return response.data;
  },
};
