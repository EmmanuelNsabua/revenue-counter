import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paiementsService } from "@/services/paiements";
import { CreatePaiementDTO, Paiement } from "@/types/paiement";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const usePaiements = () => {
  return useQuery({
    queryKey: ["paiements"],
    queryFn: paiementsService.getAll,
  });
};

export const usePaiement = (id: string | number) => {
  return useQuery({
    queryKey: ["paiement", id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Paiement }>(`/paiements/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreatePaiement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaiementDTO) => paiementsService.create(data),
    onSuccess: () => {
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
