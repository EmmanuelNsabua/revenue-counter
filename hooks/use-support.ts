import { useMutation } from "@tanstack/react-query";
import { supportService, SupportTicketData } from "@/services/support";
import { toast } from "sonner";

export const useSendSupportMessage = () => {
  return useMutation({
    mutationFn: supportService.submitTicket,
    onSuccess: () => {
      toast.success("Votre demande d'assistance a été envoyée avec succès.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi de la demande");
    },
  });
};
