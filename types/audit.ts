export interface AuditLog {
  id: number;
  user_id: number;
  action: 'create' | 'update' | 'delete';
  model_type: string;
  model_id: number;
  details: {
    changes?: Record<string, any>;
    original?: Record<string, any>;
    attributes?: Record<string, any>;
  };
  ip_address: string;
  user_agent: string;
  created_at: string;
  user?: {
    id: number;
    nom_complet: string;
    identifiant: string;
    cle_tenant: string;
  };
}

export interface AuditLogFilters {
  action?: string;
  model_type?: string;
  user_id?: string | number;
  date_debut?: string;
  date_fin?: string;
  page?: number;
  per_page?: number;
}
