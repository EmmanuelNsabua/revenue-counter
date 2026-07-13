import { api } from "@/lib/api";
import { AuditLog, AuditLogFilters } from "@/types/audit";
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const auditService = {
  getLogs: async (filters: AuditLogFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.action && filters.action !== 'tous') params.append('action', filters.action);
    if (filters.model_type && filters.model_type !== 'tous') params.append('model_type', filters.model_type);
    if (filters.user_id) params.append('user_id', filters.user_id.toString());
    if (filters.date_debut) params.append('date_debut', filters.date_debut);
    if (filters.date_fin) params.append('date_fin', filters.date_fin);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    const response = await api.get<PaginatedResponse<AuditLog>>(`/superadmin/audit-logs?${params.toString()}`);
    return response.data;
  }
};
