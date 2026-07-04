import { api } from "@/lib/api";

export interface Role {
  id: number | string;
  nom: string;
  code: string;
}

export interface Grade {
  id: number | string;
  nom: string;
}

export interface Structure {
  id: number | string;
  nom: string;
  cleTenant: string;
}

export const referencesService = {
  getRoles: async () => {
    try {
      const response = await api.get("/roles");
      const data = response.data?.data || response.data;
      return (Array.isArray(data) ? data : ((data as any)?.data || [])) as Role[];
    } catch (e) {
      return [
        { id: 1, nom: "Super Admin", code: "superadmin" },
        { id: 2, nom: "Admin", code: "admin" }
      ];
    }
  },

  getGrades: async () => {
    try {
      const response = await api.get("/grades");
      const data = response.data?.data || response.data;
      return (Array.isArray(data) ? data : ((data as any)?.data || [])) as Grade[];
    } catch (e) {
      return [
        { id: 1, nom: "Super Administrateur" },
        { id: 2, nom: "Maire" },
        { id: 3, nom: "Bourgmestre" },
        { id: 4, nom: "Chef de Marché" }
      ];
    }
  },

  getStructures: async () => {
    try {
      const response = await api.get("/structures");
      const data = response.data?.data || response.data;
      return (Array.isArray(data) ? data : ((data as any)?.data || [])) as Structure[];
    } catch (e) {
      return [
        { id: 1, nom: "Commune", cleTenant: "COMMUNE" },
        { id: 2, nom: "Mairie", cleTenant: "MAIRIE" }
      ];
    }
  }
};
