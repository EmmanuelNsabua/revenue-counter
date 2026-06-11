import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paiementsService } from "@/services/paiements";
import { CreatePaiementDTO } from "@/types/paiement";
import { toast } from "sonner";

export const usePaiements = () => {
  return useQuery({
    queryKey: ["paiements"],
    queryFn: paiementsService.getAll,
  });
};

export const useCreatePaiement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaiementDTO) => paiementsService.create(data),
    onSuccess: () => {
      // Invalider les requêtes liées pour forcer le rafraîchissement
      queryClient.invalidateQueries({ queryKey: ["paiements"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["commercants"] });
      toast.success("Paiement enregistré avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Une erreur est survenue lors de l'enregistrement";
      toast.error(message);
    },
  });
};
