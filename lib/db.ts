import Dexie, { type EntityTable } from 'dexie';

export interface Commercant {
  id: number;
  code_commercant: string;
  nom: string;
  prenom?: string;
  activite?: string;
  // Other fields can be added as needed
}

export interface PaiementOffline {
  id?: number;
  montant: number;
  taxe_id: number;
  code_commercant: string;
  date_creation: string;
  synced: number; // 0 for not synced, 1 for synced
}

const db = new Dexie('MairieTaxesDB') as Dexie & {
  commercants: EntityTable<
    Commercant,
    'id' // primary key "id"
  >;
  paiements_offline: EntityTable<
    PaiementOffline,
    'id' // primary key "id"
  >;
};

db.version(1).stores({
  commercants: 'id, code_commercant', // Primary key and indexed props
  paiements_offline: '++id, code_commercant, synced, date_creation' // Primary key and indexed props
});

export { db };
