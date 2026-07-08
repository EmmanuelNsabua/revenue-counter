"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { useGrade } from "@/hooks/use-grade";
import { Search, Filter, Download, Banknote, AlarmClock, ClipboardCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/magicui/blur-fade";
import { TableSkeleton } from "@/components/ui/skeletons";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

/** Returns true if current RDC time (UTC+2) is past 16:30 */
function isPastCloture(): boolean {
  const now = new Date();
  // RDC is UTC+2
  const rdcHour = (now.getUTCHours() + 2) % 24;
  const rdcMinutes = now.getUTCMinutes();
  return rdcHour > 16 || (rdcHour === 16 && rdcMinutes >= 30);
}

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { isGrade3, canManageStructure } = useGrade();

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["transactions", page],
    queryFn: async () => {
      const res = await api.get(`/paiements?page=${page}`);
      return res.data;
    },
  });

  // Check if rapport already submitted today (Grade 3 only)
  const { data: todayRapport } = useQuery({
    queryKey: ["rapport-today"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const res = await api.get(`/rapports?date=${today}`);
      const items = res.data?.data?.data || [];
      return items.find((r: any) => r.superviseur_id === user?.id && r.statut === "soumis") ?? null;
    },
    enabled: isGrade3,
  });

  const transactions = responseData?.data?.data || [];
  const pagination = responseData?.data || null;

  const filteredTransactions = transactions.filter((t: any) =>
    t.reference?.toLowerCase().includes(search.toLowerCase()) ||
    t.commercant?.nom?.toLowerCase().includes(search.toLowerCase()) ||
    t.taxe?.libelle?.toLowerCase().includes(search.toLowerCase())
  );

  const showClotureBanner = isGrade3 && isPastCloture() && !todayRapport;

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
            <p className="text-sm text-muted-foreground">
              {isGrade3 ? "Suivi journalier de vos agents et de votre zone." : "Historique des paiements et perceptions fiscales."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Filter size={16} />
              Filtrer
            </Button>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Download size={16} />
              Exporter
            </Button>
          </div>
        </div>
      </BlurFade>

      {/* ── Bannière Clôture (Grade 3 seulement après 16h30) ────────── */}
      {showClotureBanner && (
        <BlurFade delay={0.15}>
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Animated pulse ring */}
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-amber-500 animate-ping opacity-75" />
            <div className="flex items-start gap-3 pl-4">
              <AlarmClock size={22} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-600 dark:text-amber-400 text-sm">
                  ⏰ Il est l&apos;heure de boucler votre journée !
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Il est passé 16h30 (heure RDC). Veuillez examiner et approuver les transactions du jour pour votre zone.
                </p>
              </div>
            </div>
            <Link href="/admin/transactions/cloture" className="flex-shrink-0 w-full sm:w-auto">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white gap-2">
                <ClipboardCheck size={16} />
                Boucler la journée
              </Button>
            </Link>
          </div>
        </BlurFade>
      )}

      {/* Rapport déjà soumis */}
      {isGrade3 && todayRapport && (
        <BlurFade delay={0.15}>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
            <ClipboardCheck size={20} className="text-emerald-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Rapport journalier soumis ✓</p>
              <p className="text-xs text-muted-foreground">Votre rapport du jour a été soumis et est en attente de révision.</p>
            </div>
            <Link href={`/admin/rapports/${todayRapport.id}`}>
              <Button size="sm" variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-400">
                Voir le rapport
              </Button>
            </Link>
          </div>
        </BlurFade>
      )}

      <BlurFade delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par référence, commerçant ou taxe..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        {isLoading ? (
          <TableSkeleton rows={7} cols={6} />
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl">
            <Banknote size={40} className="text-muted-foreground mb-4 opacity-30" />
            <p className="font-medium text-muted-foreground">Aucune transaction trouvée</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Les paiements enregistrés apparaîtront ici.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Référence</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Commerçant</th>
                      <th className="px-6 py-4 font-medium">Taxe</th>
                      {!isGrade3 && <th className="px-6 py-4 font-medium">Agent percepteur</th>}
                      <th className="px-6 py-4 font-medium">Statut</th>
                      <th className="px-6 py-4 font-medium text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTransactions.map((t: any) => (
                      <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-medium">{t.reference}</td>
                        <td className="px-6 py-4">
                          {new Date(t.created_at).toLocaleDateString("fr-CD", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4 font-medium">{t.commercant?.nom || "Inconnu"}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-[10px] bg-muted/50">
                            {t.taxe?.libelle || "Taxe"}
                          </Badge>
                        </td>
                        {!isGrade3 && (
                          <td className="px-6 py-4 text-muted-foreground text-xs">
                            {t.agent?.user?.nom_complet || t.agent?.user?.identifiant || "Agent"}
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              t.statut === "signe" ? "default"
                              : t.statut === "valide" ? "default"
                              : t.statut === "refuse" ? "destructive"
                              : "secondary"
                            }
                            className={`text-[10px] ${t.statut === "signe" ? "bg-emerald-500" : ""}`}
                          >
                            {t.statut === "signe" ? "Signé ✓" : t.statut}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600">
                          {formatCurrency(t.montant_paye ?? t.montant)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Affichage de {pagination.from || 0} à {pagination.to || 0} sur {pagination.total || 0} paiements
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isLoading}>
                    Précédent
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={!pagination.next_page_url || isLoading}>
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </BlurFade>
    </div>
  );
}
