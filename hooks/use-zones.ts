import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zonesService, Zone } from "@/services/zones";
import { toast } from "sonner";

export const useZones = () => {
  return useQuery({
    queryKey: ["zones"],
    queryFn: zonesService.getAll,
  });
};

export const useZone = (id: number | string) => {
  return useQuery({
    queryKey: ["zones", id],
    queryFn: () => zonesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: zonesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Zone créée avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de la zone");
      console.error(error);
    },
  });
};

export const useUpdateZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: zonesService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["zones", variables.id] });
      toast.success("Zone mise à jour");
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    },
  });
};

export const useDeleteZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: zonesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Zone supprimée");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    },
  });
};
