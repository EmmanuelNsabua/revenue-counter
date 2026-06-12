export interface AppNotification {
  id: number;
  agent_id: number;
  title: string;
  content: string;
  type: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}
