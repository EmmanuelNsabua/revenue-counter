export interface Commercant {
  id: string;
  nom: string;
  activite: string;
  stand: string;
  telephone: string;
  statut: "Actif" | "Suspendu";
  zone: string;
}
