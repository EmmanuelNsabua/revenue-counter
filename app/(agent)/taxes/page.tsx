"use client";

import { Receipt, AlertCircle } from "lucide-react";
import { useTaxes } from "@/hooks/use-taxes";
import { CardGridSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";
import { BlurFade } from "@/components/magicui/blur-fade";

const periodConfig = {
  journalier: { label: "Journalière", color: "bg-primary/10 text-primary" },
  mensuel: { label: "Mensuelle", color: "bg-purple-100 text-purple-700" },
  annuel: { label: "Annuelle", color: "bg-rdc-yellow/20 text-yellow-700" },
};

export default function TaxesPage() {
  const { data: taxes, isLoading, isError } = useTaxes();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">Impossible de récupérer les barèmes de taxes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Taxes</h1>
            <p className="text-sm text-muted-foreground">Barèmes et types de taxes configurés</p>
          </div>
          {!isLoading && taxes && taxes.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {Object.entries({
                journalier: taxes.filter((t) => t.frequence === "journalier").length,
                mensuel: taxes.filter((t) => t.frequence === "mensuel").length,
                annuel: taxes.filter((t) => t.frequence === "annuel").length,
              }).filter(([, count]) => count > 0).map(([key, count]) => (
                <span
                  key={key}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
                    periodConfig[key as keyof typeof periodConfig].color
                  }`}
                >
                  <Receipt size={12} />
                  {count} {periodConfig[key as keyof typeof periodConfig].label.toLowerCase()}s
                </span>
              ))}
            </div>
          )}
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        {isLoading ? (
          <CardGridSkeleton count={6} cols={2} />
        ) : !taxes || taxes.length === 0 ? (
          <EmptyState
            title="Aucune taxe configurée"
            description="Aucun barème de taxe n'a été configuré pour votre zone. Contactez votre administrateur."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {taxes.map((tax, index) => {
              const config = periodConfig[tax.frequence as keyof typeof periodConfig];
              return (
                <BlurFade key={tax.id} delay={0.2 + index * 0.05}>
                  <div
                    className={`bg-card border rounded-xl p-5 hover:shadow-md transition-all ${
                      tax.actif !== false ? "border-border" : "border-dashed border-border opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${config.color}`}>
                          <Receipt size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-sm leading-tight truncate">{tax.libelle}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">#{tax.id}</p>
                        </div>
                      </div>
                      {tax.actif === false && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full flex-shrink-0">
                          Inactif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      {tax.description || "Cette taxe s'applique selon les barèmes en vigueur."}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}>
                        {config.label}
                      </span>
                      <p className="text-lg font-bold text-foreground">
                        {formatCurrency(tax.montant)}
                      </p>
                    </div>
                  </div>
                </BlurFade>
              );
            })}
          </div>
        )}
      </BlurFade>
    </div>
  );
}
