// ============================================================
// MOCK DATA — Espace SUPERADMIN
// Source unique de vérité pour les données fictives superadmin.
// À remplacer par des appels useQuery lors de la Phase 4.
// ============================================================

// --- Stats Dashboard ---
export const mockSuperAdminStats = [
  { label: "Total Collecté Global (Jour)", value: "1 245 000 FC", trend: "+8% vs hier", color: "text-primary" },
  { label: "Structures Connectées", value: "8 / 10", trend: "2 inactives", color: "text-rdc-yellow" },
  { label: "Admins Connectés", value: "15", trend: "Stable", color: "text-primary" },
  { label: "Alertes Critiques", value: "3", trend: "Nécessite attention", color: "text-destructive" },
];

// --- Structure Performance Dashboard ---
export const mockStructurePerformance = [
  { name: "Marché Kenya", amount: "12 500 000 FC", progress: 100 },
  { name: "Marché Mzee", amount: "8 200 000 FC", progress: 65 },
  { name: "Commune Kampemba", amount: "5 400 000 FC", progress: 40 },
  { name: "Commune Kamalondo", amount: "3 100 000 FC", progress: 25 },
];

// --- Audit Logs Dashboard ---
export const mockAuditLogs = [
  { type: "Connexion échouée", target: "Admin Kamalondo", time: "08:45", severity: "high" },
  { type: "Modification Taxe", target: "Marché Kenya - Taxe Moto", time: "Hier 14:20", severity: "medium" },
  { type: "Hors ligne prolongé", target: "Serveur local Mzee", time: "Depuis 2j", severity: "high" },
];

// --- Structures ---
export const mockStructures = [
  { id: "STR-001", name: "Marché Kenya", location: "Lubumbashi Centre", agents: 28, communes: 1, status: "Actif" },
  { id: "STR-002", name: "Marché Mzee", location: "Kampemba", agents: 16, communes: 1, status: "Actif" },
  { id: "STR-003", name: "Marché Kamalondo", location: "Kamalondo", agents: 12, communes: 1, status: "Inactif" },
];

// --- Admins ---
export const mockAdmins = [
  { id: "ADM-001", name: "Jean-Paul Mwamba", structure: "Marché Kenya", status: "Actif", lastLogin: "Il y a 2h" },
  { id: "ADM-002", name: "Marie-Claire Kalala", structure: "Marché Mzee", status: "Actif", lastLogin: "Il y a 4h" },
  { id: "ADM-003", name: "Pierre Nduba", structure: "Marché Kamalondo", status: "Inactif", lastLogin: "Hier" },
];

// --- Commerçants SuperAdmin ---
export const mockSuperAdminCommercants = [
  { id: "COM-001", name: "Boutique Mama Nene", structure: "Marché Kenya", zone: "Allée A", status: "Actif" },
  { id: "COM-002", name: "Kiosk Airtel", structure: "Marché Kenya", zone: "Allée B", status: "Inactif" },
  { id: "COM-089", name: "Dépôt Pharmaceutique", structure: "Commune Kampemba", zone: "Secteur 4", status: "Actif" },
  { id: "COM-105", name: "Alimentation Centrale", structure: "Marché Mzee", zone: "Zone Nord", status: "Actif" },
];
