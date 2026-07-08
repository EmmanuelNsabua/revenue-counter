"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Search, Filter, Download, CreditCard, Banknote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/magicui/blur-fade";
import { TableSkeleton } from "@/components/ui/skeletons";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["transactions", page],
    queryFn: async () => {
      const res = await api.get(`/paiements?page=${page}`);
      return res.data;
    }
  });

  const transactions = responseData?.data?.data || [];
  const pagination = responseData?.data || null;

  const filteredTransactions = transactions.filter((t: any) => 
    t.reference?.toLowerCase().includes(search.toLowerCase()) ||
    t.commercant?.nom?.toLowerCase().includes(search.toLowerCase()) ||
    t.taxe?.libelle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
            <p className="text-sm text-muted-foreground">Historique des paiements et perceptions fiscales.</p>
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
            <p className="text-sm text-muted-foreground/70 mt-1">Les paiements enregistrés par les agents apparaîtront ici.</p>
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
                      <th className="px-6 py-4 font-medium">Agent percepteur</th>
                      <th className="px-6 py-4 font-medium text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTransactions.map((t: any) => (
                      <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-medium">{t.reference}</td>
                        <td className="px-6 py-4">
                          {new Date(t.created_at).toLocaleDateString("fr-CD", {
                            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </td>
                        <td className="px-6 py-4 font-medium">{t.commercant?.nom || "Inconnu"}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-[10px] bg-muted/50">
                            {t.taxe?.libelle || "Taxe"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">
                          {t.agent?.user?.nom_complet || t.agent?.user?.identifiant || "Agent"}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600">
                          {formatCurrency(t.montant_paye)}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.next_page_url || isLoading}
                  >
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
