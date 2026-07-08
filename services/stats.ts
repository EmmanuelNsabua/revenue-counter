import { api } from "@/lib/api";

export interface AgentStats {
  somme_collectee: number;
  nombre_transactions: number;
  commercants_non_regles: number;
  recent_transactions?: any[];
  zone_performance?: Array<{
    name: string;
    montant: number;
    progress: number;
  }>;
}

export const statsService = {
  /**
   * Récupère les statistiques de l'agent connecté pour aujourd'hui
   */
  getAgentStats: async () => {
    const response = await api.get<{ success: boolean; data: AgentStats }>("/stats");
    return response.data.data;
  },
};
