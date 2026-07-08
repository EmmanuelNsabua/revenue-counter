"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, TrendingUp, AlertCircle, Banknote, MapPin,
  BarChart2, PieChart as PieChartIcon, List, ChevronRight,
  ClipboardCheck, Eye, Bell,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, XAxis, YAxis,
} from "recharts";

import { KpiSkeleton, ActivitySkeleton, ProgressSkeleton } from "@/components/ui/skeletons";
import { EmptyAlertes } from "@/components/ui/empty-state";

import { useAdminStats } from "@/hooks/use-stats";
import { formatCurrency } from "@/lib/utils";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useGrade } from "@/hooks/use-grade";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";

// ─── Zone performance view types ──────────────────────────────────────────────
type ZoneView = "bars" | "pie" | "list";

const ZONE_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

const ZONE_LIMIT = 5;

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold text-foreground">{label || payload[0].name}</p>
        <p className="text-primary">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const statIcons = [Banknote, Users, TrendingUp, AlertCircle];

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();
  const { isGrade3, canManageStructure } = useGrade();
  const [zoneView, setZoneView] = useState<ZoneView>("list");
  const [showAllZones, setShowAllZones] = useState(false);
  const queryClient = useQueryClient();

  // Fetch unread rapports (Grade 1 & 2)
  const { data: rapportsData } = useQuery({
    queryKey: ["rapports-non-vus"],
    queryFn: async () => {
      const res = await api.get("/rapports?statut=soumis");
      return res.data?.data?.data || [];
    },
    enabled: canManageStructure,
  });
  const rapportsNonVus: any[] = rapportsData || [];

  const markVuMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.put(`/rapports/${id}/vu`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rapports-non-vus"] }),
  });

  const kpis = [
    {
      label: "Recette du jour",
      numericValue: stats ? stats.somme_collectee : 0,
      formatter: formatCurrency,
      trend: "Aujourd'hui",
    },
    {
      label: "Transactions",
      numericValue: stats ? stats.nombre_transactions : 0,
      trend: "Aujourd'hui",
    },
    {
      label: "Contribuables non réglés",
      numericValue: stats ? stats.commercants_non_regles : 0,
      trend: "Aujourd'hui",
    },
    {
      label: canManageStructure ? "Rapports en attente" : "Alertes",
      numericValue: canManageStructure ? rapportsNonVus.length : 0,
      trend: "Non vus",
    },
  ];

  const activities = stats?.recent_transactions || [];

  // Zone performance data (mock structure, replaced by real API data when available)
  const rawZonePerf: { name: string; montant: number; progress: number }[] =
    stats?.zone_performance || [];

  const totalZoneAmount = rawZonePerf.reduce((s, z) => s + z.montant, 0);
  const visibleZones = showAllZones ? rawZonePerf : rawZonePerf.slice(0, ZONE_LIMIT);
  const hiddenCount = rawZonePerf.length - ZONE_LIMIT;

  const pieData = rawZonePerf.map((z, i) => ({
    name: z.name,
    value: z.montant,
    color: ZONE_COLORS[i % ZONE_COLORS.length],
  }));

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vue d&apos;ensemble</h1>
            <p className="text-sm text-muted-foreground">Performance journalière et suivi des agents.</p>
          </div>
        </div>
      </BlurFade>

      {/* ── KPI Cards ─────────────────────────────────────────────── */}
      {isLoading ? (
        <KpiSkeleton count={4} cols={4} />
      ) : (
        <BlurFade delay={0.2}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((stat, i) => {
              const Icon = statIcons[i];
              const isAlert = i === 3 && stat.numericValue > 0;
              return (
                <Card key={i} className={isAlert ? "border-amber-400/60 bg-amber-50/5" : ""}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    <Icon className={`h-4 w-4 ${isAlert ? "text-amber-500" : "text-muted-foreground"}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${isAlert ? "text-amber-500" : ""}`}>
                      <NumberTicker value={stat.numericValue} formatter={stat.formatter} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </BlurFade>
      )}

      <BlurFade delay={0.3}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* ── Performance par Zone (multi-view) ─────────────────── */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Performance par Zone</CardTitle>
                {/* View toggles */}
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  {([
                    { key: "list", icon: List, label: "Liste" },
                    { key: "bars", icon: BarChart2, label: "Barres" },
                    { key: "pie",  icon: PieChartIcon, label: "Camembert" },
                  ] as { key: ZoneView; icon: any; label: string }[]).map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setZoneView(key)}
                      title={label}
                      className={`p-1.5 rounded-md transition-all ${
                        zoneView === key
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon size={15} />
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ProgressSkeleton rows={4} />
              ) : rawZonePerf.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucune donnée de zone disponible.
                </p>
              ) : (
                <>
                  {/* ── LIST VIEW ─────────────────────────────────── */}
                  {zoneView === "list" && (
                    <div className="space-y-3">
                      {visibleZones.map((zone, i) => {
                        const pct = totalZoneAmount > 0
                          ? Math.round((zone.montant / totalZoneAmount) * 100)
                          : 0;
                        const color = pct > 66 ? "bg-emerald-500" : pct > 33 ? "bg-amber-400" : "bg-rose-500";
                        return (
                          <div key={i} className="group">
                            <div className="flex items-center justify-between mb-1 gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: ZONE_COLORS[i % ZONE_COLORS.length] }}
                                />
                                <span className="text-sm font-medium truncate">{zone.name}</span>
                              </div>
                              <span className="text-sm font-bold text-foreground flex-shrink-0">
                                {formatCurrency(zone.montant)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${color}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground w-9 text-right flex-shrink-0">
                                {pct}%
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {/* "Show more" toggle */}
                      {rawZonePerf.length > ZONE_LIMIT && (
                        <button
                          onClick={() => setShowAllZones(!showAllZones)}
                          className="text-xs text-primary hover:underline mt-1 flex items-center gap-1"
                        >
                          {showAllZones
                            ? "Voir moins"
                            : `+${hiddenCount} zone${hiddenCount > 1 ? "s" : ""} supplémentaire${hiddenCount > 1 ? "s" : ""}... Voir tout`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* ── BAR CHART VIEW ────────────────────────────── */}
                  {zoneView === "bars" && (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={rawZonePerf} barSize={32}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="montant" radius={[4, 4, 0, 0]}>
                          {rawZonePerf.map((_, i) => (
                            <Cell key={i} fill={ZONE_COLORS[i % ZONE_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                  {/* ── PIE CHART VIEW ────────────────────────────── */}
                  {zoneView === "pie" && (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <ResponsiveContainer width={180} height={180}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {pieData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Legend */}
                      <div className="flex-1 space-y-2 min-w-0">
                        {pieData.map((entry, i) => {
                          const pct = totalZoneAmount > 0
                            ? Math.round((entry.value / totalZoneAmount) * 100) : 0;
                          return (
                            <div key={i} className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-sm flex-shrink-0"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-xs truncate flex-1">{entry.name}</span>
                              <span className="text-xs font-semibold text-foreground flex-shrink-0">{pct}%</span>
                              <span className="text-xs text-muted-foreground flex-shrink-0 hidden sm:block">
                                {formatCurrency(entry.value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* ── Activités Récentes (Grade 3) / Alertes Rapports (Grade 1&2) ── */}
          <Card className="col-span-1">
            {canManageStructure ? (
              /* Grade 1 & 2: Rapports non vus */
              <>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Alertes — Rapports</CardTitle>
                  {rapportsNonVus.length > 0 && (
                    <Badge className="bg-amber-500 text-white border-0 text-[10px]">
                      {rapportsNonVus.length} nouveau{rapportsNonVus.length > 1 ? "x" : ""}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  {rapportsNonVus.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                      <ClipboardCheck size={32} className="text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">Aucun rapport en attente.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {rapportsNonVus.slice(0, 5).map((r: any) => (
                        <div
                          key={r.id}
                          className="flex items-start gap-3 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 transition-colors"
                        >
                          <div className="p-1.5 rounded-full bg-amber-500/20 text-amber-600 flex-shrink-0 mt-0.5">
                            <Bell size={12} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">
                              {r.superviseur?.nom_complet ?? "Superviseur"}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {r.zone?.nom ?? "Zone"} • {new Date(r.date_rapport).toLocaleDateString("fr-CD")}
                            </p>
                            <p className="text-xs font-bold text-emerald-600 mt-0.5">
                              {formatCurrency(r.montant_total)} — {r.nb_transactions} tx
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Link href={`/admin/rapports/${r.id}`}>
                              <Button size="icon" variant="ghost" className="h-6 w-6" title="Voir">
                                <Eye size={12} />
                              </Button>
                            </Link>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-muted-foreground"
                              title="Marquer vu"
                              onClick={() => markVuMutation.mutate(r.id)}
                            >
                              <ChevronRight size={12} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {rapportsNonVus.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          +{rapportsNonVus.length - 5} rapport{rapportsNonVus.length - 5 > 1 ? "s" : ""} supplémentaire{rapportsNonVus.length - 5 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              /* Grade 3: Dernières activités */
              <>
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
              </>
            )}
          </Card>
        </div>
      </BlurFade>
    </div>
  );
}
