"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Building2, TrendingUp, ShieldAlert, Users } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { useSuperAdminStats } from "@/hooks/use-superadmin";
import { KpiSkeleton, ProgressSkeleton, ActivitySkeleton } from "@/components/ui/skeletons";
import { EmptyAlertes } from "@/components/ui/empty-state";

const statIcons = [Globe, Building2, Users, ShieldAlert];

export default function SuperAdminDashboardPage() {
  const { data, isLoading } = useSuperAdminStats();

  const stats = data?.stats || [];
  const structures = data?.structures || [];
  const auditLogs = data?.auditLogs || [];

  return (
    <div className="space-y-8 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Pilotage Global</h1>
          <p className="text-sm text-muted-foreground mt-1">Vision macroscopique des opérations de la Mairie.</p>
        </div>
        <div className="flex gap-2">
          <ActionButton variant="outline" toastMessage="Génération du rapport d'activité en cours...">Générer Rapport</ActionButton>
          <ActionButton toastMessage="Panneau d'actions globales ouvert.">Action Globale</ActionButton>
        </div>
      </div>

      {isLoading ? (
        <KpiSkeleton count={4} cols={4} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = statIcons[i];
            return (
              <Card key={i} className="border-t-4 border-t-transparent hover:border-t-primary transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold">{stat.label}</CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black tracking-tight">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">{stat.trend}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Comparaison des Structures */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              Comparaison des Structures (Mois)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ProgressSkeleton rows={4} />
            ) : structures.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune donnée de structure disponible.</p>
            ) : (
              <div className="space-y-6">
                {structures.map((struct, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <span>{struct.name}</span>
                      <span>{struct.amount}</span>
                    </div>
                    <div className="h-4 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${struct.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Log / Sécurité */}
        <Card className="shadow-sm border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert size={18} />
              Journal des Alertes Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ActivitySkeleton rows={3} />
            ) : auditLogs.length === 0 ? (
              <EmptyAlertes />
            ) : (
              <div className="space-y-4">
                {auditLogs.map((log, i) => (
                  <div key={i} className="flex items-start justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="text-sm font-bold text-foreground">{log.type}</p>
                      <p className="text-xs text-muted-foreground">{log.target}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${log.severity === "high" ? "bg-destructive/10 text-destructive" : "bg-rdc-yellow/10 text-rdc-yellow"}`}>
                        {log.time}
                      </span>
                    </div>
                  </div>
                ))}
                <ActionButton variant="outline" className="w-full mt-2 text-xs" toastMessage="Ouverture des archives d'audit...">
                  Voir tout le journal d&apos;audit
                </ActionButton>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
