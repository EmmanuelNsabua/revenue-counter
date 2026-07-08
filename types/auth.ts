export type UserRole = "agent" | "admin" | "superadmin" | string;

export interface UserPermissions {
  [key: string]: boolean;
}

export interface User {
  id: number;
  nom_complet: string;
  identifiant: string;
  role: UserRole | null;
  grade: string | null;
  grade_niveau?: number | null;
  institution: string | null;
  avatar_url: string | null;
  preferences?: Record<string, any>;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    access_token: string;
    token_type: string;
    user: User;
    permissions: UserPermissions;
  };
}
