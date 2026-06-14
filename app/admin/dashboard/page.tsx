"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertCircle, Banknote, MapPin } from "lucide-react";

import { KpiSkeleton, ActivitySkeleton, ProgressSkeleton } from "@/components/ui/skeletons";
import { EmptyAlertes } from "@/components/ui/empty-state";

import { useAdminStats } from "@/hooks/use-stats";
import { formatCurrency } from "@/lib/utils";

const statIcons = [Banknote, Users, TrendingUp, AlertCircle];

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  const kpis = [
    { label: "Recette du jour", value: stats ? formatCurrency(stats.somme_collectee) : "0", trend: "Aujourd'hui" },
    { label: "Transactions", value: stats ? stats.nombre_transactions.toString() : "0", trend: "Aujourd'hui" },
    { label: "Contribuables non réglés", value: stats ? stats.commercants_non_regles.toString() : "0", trend: "Aujourd'hui" },
    { label: "Alertes", value: "0", trend: "Aujourd'hui" },
  ];

  // Les performances par zone ne sont pas encore dynamisées côté backend
  const zonePerf: any[] = []; 
  // On utilise les transactions récentes à la place des activités génériques
  const activities = stats?.recent_transactions || [];

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vue d&apos;ensemble</h1>
          <p className="text-sm text-muted-foreground">Performance journalière et suivi des agents.</p>
        </div>
      </div>

      {isLoading ? (
        <KpiSkeleton count={4} cols={4} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((stat, i) => {
            const Icon = statIcons[i];
            return (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Performance par Zone */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance par Allée</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ProgressSkeleton rows={3} />
            ) : zonePerf.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune donnée de zone disponible.</p>
            ) : (
              <div className="space-y-4">
                {zonePerf.map((zone, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium">{zone.name}</div>
                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${zone.progress > 80 ? "bg-primary" : zone.progress > 50 ? "bg-rdc-yellow" : "bg-rdc-red"}`}
                        style={{ width: `${zone.progress}%` }}
                      />
                    </div>
                    <div className="w-24 text-right text-sm font-bold">{zone.amount}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dernières activités */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ActivitySkeleton rows={4} />
            ) : activities.length === 0 ? (
              <EmptyAlertes />
            ) : (
              <div className="space-y-4">
                {activities.map((act: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 border-b border-border last:border-0 pb-3 last:pb-0">
                    <div className="p-1.5 rounded-full mt-0.5 bg-primary/20 text-primary">
                      <Banknote size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{act.commercant?.nom || `Commerçant #${act.commercant_id}`}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin size={10} /> {act.commercant?.emplacement || "Non définie"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(act.montant)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(act.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
