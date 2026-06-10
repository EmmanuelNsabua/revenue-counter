// ============================================================
// MOCK DATA — Espace ADMIN
// Source unique de vérité pour les données fictives admin.
// À remplacer par des appels useQuery lors de la Phase 4.
// ============================================================

// --- Stats Dashboard ---
export const mockAdminStats = [
  { label: "Collecte du Jour", value: "245 000 FC", trend: "+12%" },
  { label: "Agents Actifs", value: "14 / 16", trend: "-1 ce matin" },
  { label: "Taux de Recouvrement", value: "85%", trend: "+5% vs hier" },
  { label: "Alertes Zones", value: "2", trend: "Zone B en retard" },
];

// --- Recent Activities Dashboard ---
export const mockAdminActivities = [
  { agent: "Agent 001", zone: "Marché Kenya - Allée A", amount: "15 000 FC", time: "Il y a 10 min", status: "success" },
  { agent: "Agent 004", zone: "Marché Kenya - Allée C", amount: "5 000 FC", time: "Il y a 25 min", status: "success" },
  { agent: "Agent 002", zone: "Marché Kenya - Allée B", amount: "---", time: "Inactif depuis 3h", status: "warning" },
  { agent: "Agent 007", zone: "Marché Kenya - Allée A", amount: "25 000 FC", time: "Il y a 1h", status: "success" },
];

// --- Zone Performance Dashboard ---
export const mockZonePerformance = [
  { name: "Allée A", progress: 90, amount: "150 000 FC" },
  { name: "Allée B", progress: 65, amount: "65 000 FC" },
  { name: "Allée C", progress: 40, amount: "30 000 FC" },
];

// --- Agents ---
export const mockAgents = [
  { id: "AGT-001", name: "Mukendi Mulumba", zone: "Allée A", perf: "95%", status: "Actif" },
  { id: "AGT-002", name: "Kapinga Kazadi", zone: "Allée B", perf: "60%", status: "Actif" },
  { id: "AGT-003", name: "Ilunga Numbi", zone: "Allée C", perf: "30%", status: "Inactif" },
  { id: "AGT-004", name: "Kasongo Mwamba", zone: "Allée A", perf: "88%", status: "Actif" },
  { id: "AGT-005", name: "Ndaya Kabongo", zone: "Allée B", perf: "75%", status: "Actif" },
];

// --- Commerçants Admin ---
export const mockAdminCommercants = [
  { id: "COM-001", name: "Boutique Mama Nene", activity: "Alimentation", zone: "Allée A", status: "Actif" },
  { id: "COM-002", name: "Kiosk Airtel", activity: "Services", zone: "Allée B", status: "Inactif" },
  { id: "COM-003", name: "Papa Pharmacie", activity: "Pharmacie", zone: "Allée C", status: "Actif" },
  { id: "COM-004", name: "Dépôt Boissons", activity: "Alimentation", zone: "Allée A", status: "Actif" },
  { id: "COM-005", name: "Salon de Coiffure Beauté", activity: "Services", zone: "Allée B", status: "Actif" },
];

// --- Taxes Admin ---
export const mockAdminTaxes = [
  { id: "TAX-001", name: "Taxe Journalière Marché", amount: "5 000 FC", type: "Journalière", status: "Active" },
  { id: "TAX-002", name: "Taxe Hebdomadaire", amount: "25 000 FC", type: "Hebdomadaire", status: "Active" },
  { id: "TAX-003", name: "Taxe Mensuelle Commerce", amount: "45 000 FC", type: "Mensuelle", status: "Active" },
];

// --- Zones ---
export const mockZones = [
  { id: "Z-1", name: "Allée A (Alimentation)", agentsCount: 4, shopsCount: 120, collectRate: "92%" },
  { id: "Z-2", name: "Allée B (Vêtements)", agentsCount: 6, shopsCount: 200, collectRate: "78%" },
  { id: "Z-3", name: "Allée C (Électronique)", agentsCount: 3, shopsCount: 85, collectRate: "85%" },
  { id: "Z-4", name: "Zone Extérieure Nord", agentsCount: 2, shopsCount: 50, collectRate: "60%" },
];
