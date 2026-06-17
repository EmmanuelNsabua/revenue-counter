import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, UpdateProfileData, UpdatePasswordData } from "@/services/profile";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

export const useUpdateProfile = () => {
  const { user, setUser } = useAuth();
  
  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (data) => {
      // Met à jour le contexte utilisateur avec le nouveau nom
      if (user && data.user) {
        setUser({ ...user, nom: data.user.nom });
      }
      toast.success("Profil mis à jour avec succès");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil");
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: profileService.updatePassword,
    onSuccess: () => {
      toast.success("Mot de passe modifié avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.errors?.current_password?.[0] 
                   || error.response?.data?.message 
                   || "Erreur lors du changement de mot de passe";
      toast.error(message);
    },
  });
};
