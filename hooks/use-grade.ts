import { useAuth } from "@/providers/auth-provider";

/**
 * Helper hook pour les restrictions basées sur le niveau de grade admin.
 *  Grade 1 (niveau_hierarchique = 1) : Maire / Directeur — accès complet
 *  Grade 2 (niveau_hierarchique = 2) : Chef de Marché — accès étendu
 *  Grade 3 (niveau_hierarchique = 3) : Superviseur Terrain — accès restreint
 */
export function useGrade() {
  const { user } = useAuth();

  const niveau = user?.grade_niveau ?? null;

  return {
    niveau,
    isGrade1: niveau === 1,
    isGrade2: niveau === 2,
    isGrade3: niveau === 3,
    /** Grade 1 ou 2 : peut gérer zones et administrateurs */
    canManageStructure: niveau !== null && niveau <= 2,
    /** Grade 1 seulement : peut voir toutes les données globales */
    isDirection: niveau === 1,
  };
}
