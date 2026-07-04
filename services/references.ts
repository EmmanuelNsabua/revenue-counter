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
        { id: 1, nom: "Administrateur Système", code: "admin_sys" },
        { id: 2, nom: "Chef de Zone", code: "admin_zone" },
        { id: 3, nom: "Superviseur", code: "admin_sup" }
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
        { id: 1, nom: "Grade A" },
        { id: 2, nom: "Grade B" },
        { id: 3, nom: "Grade C" }
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
        { id: 1, nom: "Direction Générale", cleTenant: "dir_gen" },
        { id: 2, nom: "Mairie Centrale", cleTenant: "mairie_centrale" },
        { id: 3, nom: "Commune Kenya", cleTenant: "com_kenya" }
      ];
    }
  }
};
