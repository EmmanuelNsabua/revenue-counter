import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminsService } from "@/services/admins";
import { User } from "@/types/auth";
import { toast } from "sonner";

export const useAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: adminsService.getAll,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Administrateur créé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de l'administrateur");
      console.error(error);
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminsService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Administrateur mis à jour");
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    },
  });
};
