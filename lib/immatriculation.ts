/**
 * SERVICE D'IMMATRICULATION - REVENUE COUNTER
 * Définit les règles de formatage et de validation des matricules.
 */

export const MATRICULE_PATTERNS = {
  AGENT: /^\d{2}[A-Z]{2,3}\d{4}-AG$/,      // Ex: 26KNY1234-AG
  ADMIN: /^\d{2}[A-Z]{2,3}\d{3}-AD$/,      // Ex: 26KNY123-AD
  SUPERADMIN: /^\d{2}[A-Z]{2,3}\d{2}-SA$/, // Ex: 26DIR12-SA
};

export type RolePrefix = "AG" | "AD" | "SA";

/**
 * Valide si un matricule respecte l'un des formats autorisés
 */
export const validateMatricule = (matricule: string) => {
  const mat = matricule.trim().toUpperCase();
  if (MATRICULE_PATTERNS.AGENT.test(mat)) return { valid: true, role: "AGENT" as const };
  if (MATRICULE_PATTERNS.ADMIN.test(mat)) return { valid: true, role: "ADMIN" as const };
  if (MATRICULE_PATTERNS.SUPERADMIN.test(mat)) return { valid: true, role: "SUPERADMIN" as const };
  
  return { valid: false, role: null };
};

/**
 * Génère un exemple de matricule (utile pour les placeholders ou tests)
 */
export const generatePlaceholderMatricule = (role: "AGENT" | "ADMIN" | "SUPERADMIN") => {
  const year = new Date().getFullYear().toString().slice(-2);
  if (role === "AGENT") return `${year}KNY0001-AG`;
  if (role === "ADMIN") return `${year}KNY001-AD`;
  return `${year}DIR01-SA`;
};
