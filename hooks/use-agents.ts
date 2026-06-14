import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { agentsService } from "@/services/agents";
import { User } from "@/types/auth";
import { toast } from "sonner";

export const useAgents = () => {
  return useQuery({
    queryKey: ["agents"],
    queryFn: agentsService.getAll,
  });
};

export const useAgent = (id: number | string) => {
  return useQuery({
    queryKey: ["agents", id],
    queryFn: () => agentsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: agentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent créé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de l'agent");
      console.error(error);
    },
  });
};

export const useUpdateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: agentsService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["agents", variables.id] });
      toast.success("Agent mis à jour");
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    },
  });
};

export const useDeleteAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: agentsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent supprimé");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    },
  });
};
