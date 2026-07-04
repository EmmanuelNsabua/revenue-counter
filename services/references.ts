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
        { id: 1, nom: "Superviseur Général" },
        { id: 2, nom: "Chef de Division" },
        { id: 3, nom: "Agent de Bureau" }
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
        { id: 1, nom: "Commune Annexe", cleTenant: "commune_annexe" },
        { id: 2, nom: "Commune Kamalondo", cleTenant: "commune_kamalondo" },
        { id: 3, nom: "Commune Kampemba", cleTenant: "commune_kampemba" },
        { id: 4, nom: "Commune Katuba", cleTenant: "commune_katuba" },
        { id: 5, nom: "Commune Kenya", cleTenant: "commune_kenya" },
        { id: 6, nom: "Commune Lubumbashi", cleTenant: "commune_lubumbashi" },
        { id: 7, nom: "Commune Rwashi", cleTenant: "commune_rwashi" },
        { id: 8, nom: "Mairie de Lubumbashi", cleTenant: "mairie_lubumbashi" }
      ];
    }
  }
};
