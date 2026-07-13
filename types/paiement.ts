import { User } from "./auth";
import { Commercant } from "./commercant";
import { Taxe } from "./taxe";

export type ModePaiement = "cash" | "mpesa" | "airtel" | "orange";

export interface Paiement {
  id: number;
  commercant_id: number;
  taxe_id: number;
  montant: number;
  mode_paiement: ModePaiement;
  created_at: string;
  agent_id: number;
  reference?: string;
  date_paiement: string;
  statut: string;
  
  // Champs inclus lors des jointures (GET)
  agent?: User;
  commercant?: Commercant;
  taxe?: Taxe;
}

export interface CreatePaiementDTO {
  commercant_id: number;
  taxe_id: number;
  montant: number;
  mode_paiement: ModePaiement;
}
