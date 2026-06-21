"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Building2, TrendingUp, ShieldAlert, Users } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { useSuperAdminStats } from "@/hooks/use-superadmin";
import { KpiSkeleton, ProgressSkeleton, ActivitySkeleton } from "@/components/ui/skeletons";
import { EmptyAlertes } from "@/components/ui/empty-state";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BlurFade } from "@/components/magicui/blur-fade";

const statIcons = [Globe, Building2, Users, ShieldAlert];

// Extrait la valeur numérique brute d'une chaîne (ex: "12 500 000 FC" -> 12500000)
function parseRawNumber(value: string | number): number {
  if (typeof value === "number") return value;
  const cleaned = value.replace(/[^0-9.-]+/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Formate intelligemment la valeur animée en conservant le format d'origine (devises)
function getStatFormatter(originalValue: string | number) {
  if (typeof originalValue === "number") {
    return (val: number) => val.toString();
  }
  
  const hasFC = originalValue.includes("FC") || originalValue.includes("CDF");
  
  return (val: number) => {
    const formatted = new Intl.NumberFormat("fr-CD", {
      maximumFractionDigits: 0,
    }).format(val);
    
    if (hasFC) {
      return `${formatted} FC`;
    }
    return formatted;
  };
}

export default function SuperAdminDashboardPage() {
  const { data, isLoading } = useSuperAdminStats();

  const stats = data?.stats || [];
  const structures = data?.structures || [];
  const auditLogs = data?.auditLogs || [];

  return (
    <div className="space-y-8 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
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
      </BlurFade>

      {isLoading ? (
        <KpiSkeleton count={4} cols={4} />
      ) : (
        <BlurFade delay={0.2}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = statIcons[i];
              const rawVal = parseRawNumber(stat.value);
              const formatter = getStatFormatter(stat.value);
              return (
                <Card key={i} className="border-t-4 border-t-transparent hover:border-t-primary transition-all">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold">{stat.label}</CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black tracking-tight">
                      <NumberTicker value={rawVal} formatter={formatter} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">{stat.trend}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </BlurFade>
      )}

      <BlurFade delay={0.3}>
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
      </BlurFade>
    </div>
  );
}

