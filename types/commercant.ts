export interface Commercant {
  id: number;
  nom: string;
  numero_document: string; // Le code commerçant
  emplacement: string;     // Stand / Zone
  telephone?: string;
  actif: boolean;
  activite?: string;
  type_activite?: string;
  created_at?: string;
  zone?: {
    id: number;
    nom: string;
  };
}
