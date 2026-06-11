"use client";

import { PaiementTable } from "@/components/paiements/paiement-table";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { Download, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePaiements } from "@/hooks/use-paiements";
import { TableSkeleton } from "@/components/ui/skeletons";
import { EmptyPaiements } from "@/components/ui/empty-state";

export default function PaiementsPage() {
  const { data: paiements, isLoading, isError } = usePaiements();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">Impossible de récupérer l'historique des paiements.</p>
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
          <ActionButton variant="outline" className="gap-2 flex-1 sm:flex-none" toastMessage="Exportation CSV en cours...">
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
