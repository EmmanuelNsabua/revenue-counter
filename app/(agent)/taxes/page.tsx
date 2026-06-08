import type { Metadata } from "next";
import { Receipt, Calendar, CalendarDays, CalendarRange, Building } from "lucide-react";

export const metadata: Metadata = { title: "Taxes" };

const taxes = [
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

const periodColors = {
  Journalière: "bg-primary/10 text-primary",
  Hebdomadaire: "bg-rdc-yellow/20 text-yellow-700",
  Mensuelle: "bg-purple-100 text-purple-700",
};

export default function TaxesPage() {
  return (
    <div className="space-y-6 max-w-5xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Taxes</h1>
          <p className="text-sm text-muted-foreground">Barèmes et types de taxes</p>
        </div>
        {/* Summary badges */}
        <div className="flex gap-3 flex-wrap">
        {Object.entries({
          Journalière: taxes.filter((t) => t.periodicite === "Journalière").length,
          Hebdomadaire: taxes.filter((t) => t.periodicite === "Hebdomadaire").length,
          Mensuelle: taxes.filter((t) => t.periodicite === "Mensuelle").length,
        }).map(([label, count]) => (
          <span
            key={label}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
              periodColors[label as keyof typeof periodColors]
            }`}
          >
            <Receipt size={12} />
            {count} {label.toLowerCase()}s
          </span>
        ))}
      </div>
      </div>

      {/* Tax cards grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {taxes.map((tax) => (
          <div
            key={tax.code}
            className={`bg-card border rounded-xl p-5 hover:shadow-md transition-all ${
              tax.actif ? "border-border" : "border-dashed border-border opacity-60"
            }`}
          >
            <div className="flex items-start justify-between mb-3 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-lg flex-shrink-0 ${periodColors[tax.periodicite as keyof typeof periodColors]}`}>
                  <tax.icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm leading-tight truncate">
                    {tax.libelle}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {tax.code}
                  </p>
                </div>
              </div>
              {!tax.actif && (
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full flex-shrink-0">
                  Inactif
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {tax.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  periodColors[tax.periodicite as keyof typeof periodColors]
                }`}
              >
                {tax.periodicite}
              </span>
              <p className="text-lg font-bold text-foreground">{tax.montant}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
