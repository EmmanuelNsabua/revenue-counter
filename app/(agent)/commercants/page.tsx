"use client";

import { useState } from "react";
import { CommercantFilters } from "@/components/commercants/commercant-filters";
import { CommercantTable } from "@/components/commercants/commercant-table";
import { Badge } from "@/components/ui/badge";
import { Store, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useCommercants } from "@/hooks/use-commercants";
import { TableSkeleton } from "@/components/ui/skeletons";
import { EmptyCommercants } from "@/components/ui/empty-state";

export default function CommerciantsPage() {
  const [search, setSearch] = useState("");
  const { data: commercants, isLoading, isError } = useCommercants(search);

  const actifs = commercants?.filter((c) => c.actif).length || 0;
  const suspendus = commercants?.filter((c) => !c.actif).length || 0;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">Impossible de récupérer la liste des commerçants.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 sm:mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Commerçants</h1>
          <p className="text-sm text-muted-foreground">Gestion des commerçants du marché Kenya</p>
        </div>
        <div className="flex gap-3 flex-wrap items-center">
          {!isLoading && commercants && (
            <>
              <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 text-primary border-primary/20 bg-primary/5">
                <Store size={14} />
                {commercants.length} commerçants
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 text-green-700 border-green-200 bg-green-50">
                <CheckCircle size={14} />
                {actifs} actifs
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 text-destructive border-destructive/20 bg-destructive/5">
                <XCircle size={14} />
                {suspendus} suspendus
              </Badge>
            </>
          )}
        </div>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border">
        <CommercantFilters search={search} onSearchChange={setSearch} />
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : !commercants || commercants.length === 0 ? (
        <EmptyCommercants />
      ) : (
        <CommercantTable commercants={commercants} />
      )}
    </div>
  );
}
