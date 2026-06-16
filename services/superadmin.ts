import { api } from "@/lib/api";

export interface SuperAdminStatItem {
  label: string;
  value: string | number;
  trend: string;
  color: string;
}

export interface StructurePerformance {
  name: string;
  amount: number;
  progress: number;
}

export interface AuditLog {
  id: number;
  type: string;
  target: string;
  time: string;
  severity: "high" | "medium" | "low";
}

export interface SuperAdminDashboardData {
  stats: SuperAdminStatItem[];
  structures: StructurePerformance[];
  auditLogs: AuditLog[];
}

export const superAdminService = {
  getDashboardStats: async (): Promise<SuperAdminDashboardData> => {
    const response = await api.get<{ success: boolean; data: SuperAdminDashboardData }>("/superadmin/stats");
    return response.data.data;
  },
};
