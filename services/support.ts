import { api } from "@/lib/api";

export interface Ticket {
  id: number;
  reference: string;
  requester_id: number;
  assignee_id: number | null;
  sujet: string;
  description: string;
  statut: string;
  priorite: string;
  categorie: string;
  created_at: string;
  updated_at: string;
  requester?: { id: number; nom: string; email: string };
  assignee?: { id: number; nom: string; email: string };
  messages_count?: number;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  is_internal: boolean;
  created_at: string;
  user?: { id: number; nom: string; email: string; role: string };
}

export const supportService = {
  getTickets: async () => {
    const response = await api.get<Ticket[]>("/tickets");
    return response.data;
  },

  getTicket: async (id: number) => {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  submitTicket: async (data: { sujet: string; description: string; categorie: string; priorite?: string }) => {
    const response = await api.post<Ticket>("/tickets", data);
    return response.data;
  },

  addMessage: async (id: number, data: { message: string; is_internal?: boolean }) => {
    const response = await api.post<TicketMessage>(`/tickets/${id}/messages`, data);
    return response.data;
  },

  updateStatus: async (id: number, data: { statut?: string; assignee_id?: number }) => {
    const response = await api.put<Ticket>(`/tickets/${id}/status`, data);
    return response.data;
  },
};
