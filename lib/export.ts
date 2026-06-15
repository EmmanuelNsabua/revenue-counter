import * as XLSX from 'xlsx';

/**
 * UTILS D'EXPORTATION
 * Fournit des fonctions pour exporter les données de l'application en format Excel.
 */

/**
 * Exporte des données au format XLSX (Excel) avec protection contre l'injection.
 * 
 * @param data - Tableau d'objets à exporter
 * @param filename - Nom du fichier de sortie (sans extension)
 * @param mapping - Objet de configuration mappant les clés des données aux labels d'en-tête
 */
export function exportToExcel<T extends object>(
  data: T[],
  filename: string,
  mapping: Record<keyof T | string, string>
) {
  if (!data || data.length === 0) return;

  // 1. Préparation des données avec les en-têtes du mapping
  const keys = Object.keys(mapping);
  
  const formattedData = data.map(item => {
    const row: any = {};
    keys.forEach(key => {
      const header = mapping[key];
      let value = (item as any)[key] ?? '';
      
      // Conversion en string pour le nettoyage de sécurité
      let stringValue = String(value);

      // SÉCURITÉ : Protection contre l'injection de formules Excel
      const specialChars = ['=', '+', '-', '@'];
      if (specialChars.some(char => stringValue.startsWith(char))) {
        stringValue = `'${stringValue}`;
      }

      row[header] = stringValue;
    });
    return row;
  });

  // 2. Création de la feuille de calcul
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // 3. Création du classeur (workbook)
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Données");

  // 4. Génération du fichier et téléchargement
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${filename}_${dateStr}.xlsx`);
}
