export interface Taxe {
  code: string;
  libelle: string;
  description: string;
  periodicite: "Journalière" | "Hebdomadaire" | "Mensuelle";
  montant: string;
  actif: boolean;
}
