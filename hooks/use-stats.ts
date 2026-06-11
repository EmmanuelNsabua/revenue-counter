import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/services/stats";

export const useAgentStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: statsService.getAgentStats,
  });
};
