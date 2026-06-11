"use client";

import {
  TrendingUp, CreditCard, AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiSkeleton } from "@/components/ui/skeletons";
import { useAgentStats } from "@/hooks/use-stats";
import { formatCurrency } from "@/lib/utils";

export function KpiCards() {
  const { data: stats, isLoading, isError } = useAgentStats();

  if (isLoading) {
    return <KpiSkeleton count={3} cols={4} />;
  }

  if (isError || !stats) {
    return (
      <div className="text-center py-8 text-destructive text-sm bg-destructive/5 rounded-xl border border-destructive/20">
        Erreur lors de la récupération des statistiques.
      </div>
    );
  }

  const kpis = [
    {
      label: "Recette du jour",
      value: formatCurrency(stats.somme_collectee),
      icon: TrendingUp,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Transactions (Aujourd'hui)",
      value: stats.nombre_transactions.toString(),
      icon: CreditCard,
      color: "text-yellow-700 bg-rdc-yellow/20",
    },
    {
      label: "Contribuables non réglés",
      value: stats.commercants_non_regles.toString(),
      icon: AlertCircle,
      color: "text-rdc-red bg-rdc-red/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {kpis.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-xl sm:text-2xl font-bold mb-1 truncate">
              {stat.value}
            </CardTitle>
            <p className="text-xs text-muted-foreground leading-tight">
              {stat.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
