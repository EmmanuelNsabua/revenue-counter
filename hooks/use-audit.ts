import { useQuery } from "@tanstack/react-query";
import { auditService } from "@/services/audit";
import { AuditLogFilters } from "@/types/audit";

export const useAuditLogs = (filters: AuditLogFilters = {}) => {
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => auditService.getLogs(filters),
    placeholderData: (previousData) => previousData, // keep previous data while fetching next page
  });
};
