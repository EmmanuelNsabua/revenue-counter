import { useQuery } from "@tanstack/react-query";
import { superAdminService, SuperAdminDashboardData } from "@/services/superadmin";

export function useSuperAdminStats() {
  return useQuery<SuperAdminDashboardData, Error>({
    queryKey: ["superadmin-stats"],
    queryFn: superAdminService.getDashboardStats,
  });
}
