import { api } from "@/lib/api";

export interface UpdateProfileData {
  nom: string;
}

export interface UpdatePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export const profileService = {
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put("/user/profile", data);
    return response.data;
  },

  updatePassword: async (data: UpdatePasswordData) => {
    const response = await api.put("/user/password", data);
    return response.data;
  },
};
