import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/services/stats";

export const useAgentStats = () => {
  return useQuery({
    queryKey: ["stats", "agent"],
    queryFn: statsService.getAgentStats,
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["stats", "admin"],
    queryFn: statsService.getAgentStats,
  });
};
