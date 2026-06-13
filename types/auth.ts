export type UserRole = "agent" | "admin" | "superadmin" | "super_admin";

export interface User {
  id: number;
  nom: string;
  code_agent: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  access_token: string;
  agent: User;
  error?: string;
}
