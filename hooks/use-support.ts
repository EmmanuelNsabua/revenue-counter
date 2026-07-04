import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supportService } from "@/services/support";
import { toast } from "sonner";

export const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: supportService.getTickets,
  });
};

export const useTicket = (id: number | null) => {
  return useQuery({
    queryKey: ["tickets", id],
    queryFn: () => supportService.getTicket(id as number),
    enabled: !!id,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: supportService.submitTicket,
    onSuccess: () => {
      toast.success("Ticket créé avec succès.");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la création du ticket");
    },
  });
};

export const useAddTicketMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { message: string; is_internal?: boolean } }) =>
      supportService.addMessage(id, data),
    onSuccess: (_, variables) => {
      toast.success("Message envoyé.");
      queryClient.invalidateQueries({ queryKey: ["tickets", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { statut?: string; assignee_id?: number } }) =>
      supportService.updateStatus(id, data),
    onSuccess: (_, variables) => {
      toast.success("Ticket mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["tickets", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};
