"use client";

import { useState } from "react";
import { PaiementTable } from "@/components/paiements/paiement-table";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Download, Plus, AlertCircle, Search, Filter } from "lucide-react";
import Link from "next/link";
import { usePaiements } from "@/hooks/use-paiements";
import { TableSkeleton } from "@/components/ui/skeletons";
import { EmptyPaiements } from "@/components/ui/empty-state";
import { exportToExcel } from "@/lib/export";
import { formatDateTime } from "@/lib/utils";

export default function PaiementsPage() {
  const [search, setSearch] = useState("");
  const [modePaiement, setModePaiement] = useState("tous");

  const { data: paiements, isLoading, isError } = usePaiements({
    search: search || undefined,
    mode_paiement: modePaiement !== "tous" ? modePaiement : undefined,
  });

  const handleExport = () => {
    if (!paiements || paiements.length === 0) return;

    const formattedData = paiements.map(p => ({
      id: `TXN-${p.id}`,
      commercant: p.commercant?.nom || `ID: ${p.commercant_id}`,
      taxe: p.taxe?.libelle || `ID: ${p.taxe_id}`,
      montant: p.montant,
      mode_paiement: p.mode_paiement.toUpperCase(),
      created_at: formatDateTime(p.created_at)
    }));

    exportToExcel(
      formattedData,
      "export_paiements",
      {
        id: "Réf. Transaction",
        commercant: "Commerçant",
        taxe: "Type de Taxe",
        montant: "Montant (CDF)",
        mode_paiement: "Mode de Paiement",
        created_at: "Date & Heure"
      }
    );
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">Impossible de récupérer l&apos;historique des paiements.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paiements</h1>
          <p className="text-sm text-muted-foreground">Historique de vos collectes</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <ActionButton 
            variant="outline" 
            className="gap-2 flex-1 sm:flex-none" 
            toastMessage="Génération du fichier Excel (.xlsx)..."
            onClick={handleExport}
            disabled={isLoading || !paiements || paiements.length === 0}
          >
            <Download size={16} />
            Exporter
          </ActionButton>
          <Link href="/paiements/nouveau" className="flex-1 sm:flex-none">
            <Button className="w-full gap-2">
              <Plus size={16} />
              Nouveau paiement
            </Button>
          </Link>
        </div>
      </div>

      {/* Barre de Filtres */}
      <div className="bg-card p-4 rounded-xl border border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par commerçant ou TXN..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Select value={modePaiement} onValueChange={(val) => setModePaiement(val || "tous")}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Mode de paiement" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les modes</SelectItem>
              <SelectItem value="cash">Espèces (Cash)</SelectItem>
              <SelectItem value="mpesa">M-Pesa</SelectItem>
              <SelectItem value="airtel">Airtel Money</SelectItem>
              <SelectItem value="orange">Orange Money</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : !paiements || paiements.length === 0 ? (
        <EmptyPaiements />
      ) : (
        <PaiementTable paiements={paiements} />
      )}
    </div>
  );
}
