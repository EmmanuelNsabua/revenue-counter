"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar as CalendarIcon, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { usePaiements } from "@/hooks/use-paiements";
import { TableSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { BlurFade } from "@/components/magicui/blur-fade";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function SuperAdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState("tous");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const { data: paiements = [], isLoading } = usePaiements({
    search: searchTerm || undefined,
    mode_paiement: modeFilter !== "tous" ? modeFilter : undefined,
    date_debut: dateDebut || undefined,
    date_fin: dateFin || undefined
  });

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'valide':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 gap-1"><CheckCircle2 size={12}/> Validé</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-0 gap-1"><Clock size={12}/> En attente</Badge>;
      case 'echoue':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0 gap-1"><XCircle size={12}/> Échoué</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const getModeLabel = (mode: string) => {
    switch(mode) {
      case 'cash': return 'Cash';
      case 'mobile_money': return 'Mobile Money';
      case 'carte': return 'Carte Bancaire';
      default: return mode;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-black tracking-tight uppercase">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Historique global des paiements et recouvrements.</p>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Rechercher TXN, Commerçant..." 
              className="pl-10 h-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={modeFilter} onValueChange={(v) => setModeFilter(v || "tous")}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Mode de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les modes</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="date"
              className="pl-10 h-10" 
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              placeholder="Date de début"
            />
          </div>

          <div className="relative w-full">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="date"
              className="pl-10 h-10" 
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              placeholder="Date de fin"
            />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        {isLoading ? (
          <TableSkeleton rows={8} cols={8} />
        ) : paiements.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="Aucune transaction"
            description="Aucun paiement ne correspond à vos critères de recherche."
          />
        ) : (
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-primary/5 text-foreground text-xs uppercase font-bold tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-5">Référence</th>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-6 py-5">Structure</th>
                    <th className="px-6 py-5">Agent</th>
                    <th className="px-6 py-5">Commerçant</th>
                    <th className="px-6 py-5">Mode</th>
                    <th className="px-6 py-5 text-right">Montant</th>
                    <th className="px-6 py-5">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paiements.map((paiement) => (
                    <tr key={paiement.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{paiement.reference}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(paiement.date_paiement), "dd MMM yyyy HH:mm", { locale: fr })}
                      </td>
                      <td className="px-6 py-4">
                        {paiement.agent?.cle_tenant || "N/A"}
                      </td>
                      <td className="px-6 py-4 font-medium text-primary">
                        {paiement.agent?.nom_complet || "Agent inconnu"}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {paiement.commercant?.nom || "Commerçant inconnu"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground bg-muted px-2 py-1 rounded-md text-xs font-medium">
                          {getModeLabel(paiement.mode_paiement)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-foreground">
                        {new Intl.NumberFormat("fr-CD", { style: "currency", currency: "CDF" }).format(paiement.montant)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(paiement.statut)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </BlurFade>
    </div>
  );
}
