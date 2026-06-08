export interface Paiement {
  id: string;
  commercantId: string;
  commercantNom: string;
  stand: string;
  taxeCode: string;
  taxeLibelle: string;
  montant: string;
  heure: string;
  date: string;
  statut: "Payé" | "En attente" | "Annulé";
  agent: string;
}
