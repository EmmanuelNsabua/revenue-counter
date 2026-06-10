// ============================================================
// MOCK DATA — Espace AGENT
// Source unique de vérité pour les données fictives de l'agent.
// À remplacer par des appels useQuery lors de la Phase 4.
// ============================================================

import { Calendar, CalendarDays, CalendarRange, Building } from "lucide-react";
import type { Commercant } from "@/types/commercant";
import type { Paiement } from "@/types/paiement";

// --- KPI Cards (Dashboard) ---
export const mockKpiStats = [
  {
    label: "Total collecté aujourd'hui",
    value: "487 500 FC",
    change: "+12.4%",
    trend: "up" as const,
    colorKey: "primary",
  },
  {
    label: "Commerçants actifs",
    value: "342",
    change: "+3",
    trend: "up" as const,
    colorKey: "yellow",
  },
  {
    label: "Paiements",
    value: "128",
    change: "+8.7%",
    trend: "up" as const,
    colorKey: "primary",
  },
  {
    label: "Impayés en attente",
    value: "47",
    change: "-5.2%",
    trend: "down" as const,
    colorKey: "red",
  },
];

// --- Recent Transactions (Dashboard) ---
export const mockRecentTransactions = [
  { id: "TXN-0091", commercant: "Mama Bea — Stand B12", montant: "3 500 FC", statut: "Payé", heure: "08:14" },
  { id: "TXN-0090", commercant: "Dépôt Weza — Allée C", montant: "7 000 FC", statut: "Payé", heure: "08:02" },
  { id: "TXN-0089", commercant: "Boucherie Kapolowe", montant: "5 500 FC", statut: "Payé", heure: "07:48" },
  { id: "TXN-0088", commercant: "Épicerie Lukusa", montant: "3 500 FC", statut: "En attente", heure: "07:30" },
  { id: "TXN-0087", commercant: "Salon Mbote", montant: "3 500 FC", statut: "Payé", heure: "07:15" },
];

// --- Commerçants ---
export const mockCommercants: Commercant[] = [
  { id: "C-0042", nom: "Mama Bea Mutombo", activite: "Alimentation", stand: "B-12", telephone: "+243 81 234 5678", statut: "Actif", zone: "Allée B" },
  { id: "C-0041", nom: "Weza Distributors", activite: "Boissons", stand: "C-03", telephone: "+243 97 987 6543", statut: "Actif", zone: "Allée C" },
  { id: "C-0040", nom: "Boucherie Kapolowe", activite: "Boucherie", stand: "A-07", telephone: "+243 82 456 7890", statut: "Actif", zone: "Allée A" },
  { id: "C-0039", nom: "Épicerie Lukusa", activite: "Épicerie", stand: "D-15", telephone: "+243 81 321 0987", statut: "Suspendu", zone: "Allée D" },
  { id: "C-0038", nom: "Salon Mbote Beauty", activite: "Coiffure", stand: "E-02", telephone: "+243 99 555 4321", statut: "Actif", zone: "Allée E" },
];

// --- Paiements ---
export const mockPaiements: Paiement[] = [
  { id: "TXN-0091", commercantId: "C-0042", commercantNom: "Mama Bea Mutombo", stand: "B-12", taxeCode: "TX-J01", taxeLibelle: "Taxe journalière", montant: "3 500 FC", heure: "08:14", date: "07/06/2026", statut: "Payé", agent: "Agent 001" },
  { id: "TXN-0090", commercantId: "C-0041", commercantNom: "Weza Distributors", stand: "C-03", taxeCode: "TX-H01", taxeLibelle: "Taxe hebdomadaire", montant: "7 000 FC", heure: "08:02", date: "07/06/2026", statut: "Payé", agent: "Agent 001" },
  { id: "TXN-0089", commercantId: "C-0040", commercantNom: "Boucherie Kapolowe", stand: "A-07", taxeCode: "TX-J02", taxeLibelle: "Taxe journalière", montant: "5 500 FC", heure: "07:48", date: "07/06/2026", statut: "Payé", agent: "Agent 002" },
  { id: "TXN-0088", commercantId: "C-0039", commercantNom: "Épicerie Lukusa", stand: "D-15", taxeCode: "TX-J01", taxeLibelle: "Taxe journalière", montant: "3 500 FC", heure: "07:30", date: "07/06/2026", statut: "En attente", agent: "Agent 001" },
  { id: "TXN-0087", commercantId: "C-0038", commercantNom: "Salon Mbote Beauty", stand: "E-02", taxeCode: "TX-J01", taxeLibelle: "Taxe journalière", montant: "3 500 FC", heure: "07:15", date: "07/06/2026", statut: "Payé", agent: "Agent 003" },
];

// --- Taxes ---
export const mockTaxes = [
  {
    code: "TX-J01",
    libelle: "Taxe journalière — Petite surface",
    description: "Stand ≤ 4 m² — Alimentation, articles divers",
    periodicite: "Journalière",
    montant: "3 500 FC",
    icon: Calendar,
    actif: true,
  },
  {
    code: "TX-J02",
    libelle: "Taxe journalière — Grande surface",
    description: "Stand > 4 m² — Boucherie, dépôts",
    periodicite: "Journalière",
    montant: "5 500 FC",
    icon: Calendar,
    actif: true,
  },
  {
    code: "TX-H01",
    libelle: "Taxe hebdomadaire — Standard",
    description: "Tout type de commerce — Tarif hebdo groupé",
    periodicite: "Hebdomadaire",
    montant: "7 000 FC",
    icon: CalendarDays,
    actif: true,
  },
  {
    code: "TX-H02",
    libelle: "Taxe hebdomadaire — Boissons",
    description: "Distributeurs de boissons et liqueurs",
    periodicite: "Hebdomadaire",
    montant: "10 500 FC",
    icon: CalendarDays,
    actif: true,
  },
  {
    code: "TX-M01",
    libelle: "Taxe mensuelle — Commerce général",
    description: "Épiceries, quincailleries, pharmacies",
    periodicite: "Mensuelle",
    montant: "45 000 FC",
    icon: CalendarRange,
    actif: true,
  },
  {
    code: "TX-M02",
    libelle: "Taxe mensuelle — Boutique textile",
    description: "Vente de tissus, vêtements, chaussures",
    periodicite: "Mensuelle",
    montant: "38 000 FC",
    icon: CalendarRange,
    actif: true,
  },
  {
    code: "TX-S01",
    libelle: "Taxe spéciale — Service",
    description: "Coiffure, pressing, réparations",
    periodicite: "Mensuelle",
    montant: "22 000 FC",
    icon: Building,
    actif: false,
  },
];
