import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paiementsService } from "@/services/paiements";
import { CreatePaiementDTO, Paiement } from "@/types/paiement";
import { toast } from "sonner";
import { api } from "@/lib/api";
import axios from "axios";

export const usePaiements = (filters?: { search?: string; mode_paiement?: string }) => {
  return useQuery({
    queryKey: ["paiements", filters],
    queryFn: () => paiementsService.getAll(filters),
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["paiements"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["commercants"] });
      toast.success("Paiement enregistré avec succès");
      return data;
    },
    onError: (error: unknown) => {
      let message = "Une erreur est survenue lors de l'enregistrement";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      toast.error(message);
    },
  });
};
