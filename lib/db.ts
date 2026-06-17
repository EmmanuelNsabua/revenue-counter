import Dexie, { type Table } from "dexie";
import { Commercant } from "@/types/commercant";

export interface OfflinePaiement {
  id?: number;
  montant: number;
  taxe_id: number;
  code_commercant: string;
  date_creation: string;
  synced: 0 | 1;
  mode_paiement?: string;
}

export class MairieTaxesDatabase extends Dexie {
  commercants!: Table<Commercant, number>;
  paiements_offline!: Table<OfflinePaiement, number>;

  constructor() {
    super("MairieTaxesDB");
    this.version(1).stores({
      commercants: "id, numero_document, nom",
      paiements_offline: "++id, taxe_id, code_commercant, synced",
    });
  }
}

export const db = new MairieTaxesDatabase();
