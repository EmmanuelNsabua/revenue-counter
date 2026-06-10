"use client";

import { useState } from "react";
import { Receipt, Calendar, CalendarDays, CalendarRange, Building } from "lucide-react";
import { mockTaxes } from "@/mocks/agent";
import { CardGridSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/empty-state";

const periodColors = {
  Journalière: "bg-primary/10 text-primary",
  Hebdomadaire: "bg-rdc-yellow/20 text-yellow-700",
  Mensuelle: "bg-purple-100 text-purple-700",
};

export default function TaxesPage() {
  // isLoading simulé — sera remplacé par useQuery en Phase 4
  const [isLoading] = useState(false);
  const taxes = mockTaxes;

  return (
    <div className="space-y-6 max-w-5xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Taxes</h1>
          <p className="text-sm text-muted-foreground">Barèmes et types de taxes</p>
        </div>
        {!isLoading && taxes.length > 0 && (
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
        )}
      </div>

      {isLoading ? (
        <CardGridSkeleton count={6} cols={2} />
      ) : taxes.length === 0 ? (
        <EmptyState
          title="Aucune taxe configurée"
          description="Aucun barème de taxe n'a été configuré pour votre zone. Contactez votre administrateur."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {taxes.map((tax) => {
            const Icon = tax.icon;
            return (
              <div
                key={tax.code}
                className={`bg-card border rounded-xl p-5 hover:shadow-md transition-all ${
                  tax.actif ? "border-border" : "border-dashed border-border opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${periodColors[tax.periodicite as keyof typeof periodColors]}`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm leading-tight truncate">{tax.libelle}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{tax.code}</p>
                    </div>
                  </div>
                  {!tax.actif && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full flex-shrink-0">
                      Inactif
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{tax.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${periodColors[tax.periodicite as keyof typeof periodColors]}`}>
                    {tax.periodicite}
                  </span>
                  <p className="text-lg font-bold text-foreground">{tax.montant}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
