export interface Taxe {
  id: number;
  libelle: string;
  montant: number;
  frequence: "journalier" | "mensuel" | "annuel";
  description?: string;
  actif?: boolean;
}
