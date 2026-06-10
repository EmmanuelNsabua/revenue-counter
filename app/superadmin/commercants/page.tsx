"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Store, Eye, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { mockSuperAdminCommercants } from "@/mocks/superadmin";
import { TableSkeleton } from "@/components/ui/skeletons";
import { EmptyCommercants } from "@/components/ui/empty-state";

export default function SuperAdminCommercantsPage() {
  // isLoading simulé — sera remplacé par useQuery en Phase 4
  const [isLoading] = useState(false);
  const commercants = mockSuperAdminCommercants;

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Registre Global</h1>
          <p className="text-sm text-muted-foreground mt-1">Audit et consultation de tous les commerçants du système.</p>
        </div>
        <ActionButton variant="outline" className="gap-2 w-full sm:w-auto h-11" toastMessage="Lancement de l'audit global...">
          <ShieldAlert size={16} />
          Lancer un audit
        </ActionButton>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher par ID ou Nom..." className="pl-9 h-11" />
        </div>
        <ActionButton variant="secondary" className="gap-2 w-full sm:w-auto h-11" toastMessage="Filtres avancés en développement.">
          <Filter size={16} />
          Filtre par Structure
        </ActionButton>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={6} />
      ) : commercants.length === 0 ? (
        <EmptyCommercants />
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-primary/5 text-foreground text-xs uppercase font-bold tracking-wider border-b border-border">
                <tr>
                  <th className="px-6 py-5">ID Commerçant</th>
                  <th className="px-6 py-5">Nom</th>
                  <th className="px-6 py-5">Structure</th>
                  <th className="px-6 py-5">Zone locale</th>
                  <th className="px-6 py-5">Statut</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {commercants.map((commercant, i) => (
                  <tr key={i} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-5 font-bold text-muted-foreground">{commercant.id}</td>
                    <td className="px-6 py-5 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <Store size={14} className="text-primary" />
                        {commercant.name}
                      </div>
                    </td>
                    <td className="px-6 py-5">{commercant.structure}</td>
                    <td className="px-6 py-5 text-muted-foreground">{commercant.zone}</td>
                    <td className="px-6 py-5">
                      <Badge variant={commercant.status === "Actif" ? "default" : "destructive"}>
                        {commercant.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link href={`/superadmin/commercants/${commercant.id}`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Eye size={14} /> Audit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
