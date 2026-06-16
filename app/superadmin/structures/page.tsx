"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/action-button";
import { Plus, Building2, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useZones } from "@/hooks/use-zones";
import { CardGridSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/empty-state";

export default function SuperAdminStructuresPage() {
  const { data: zones = [], isLoading } = useZones();

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Structures</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestion des entités administratives de la ville.</p>
        </div>
        <ActionButton className="gap-2 w-full sm:w-auto h-12 px-6" toastMessage="Interface de création de structure (En développement)">
          <Plus size={18} />
          Ajouter une Structure
        </ActionButton>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={3} cols={3} />
      ) : zones.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Aucune structure enregistrée"
          description="Aucune entité administrative n'a encore été créée dans le système."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <Card key={zone.id} className="flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="default" className="uppercase text-[10px] tracking-wider">
                    Actif
                  </Badge>
                  <span className="text-xs font-bold text-muted-foreground">ID-{zone.id}</span>
                </div>
                <CardTitle className="text-xl font-bold flex items-start gap-2">
                  <Building2 size={24} className="text-primary flex-shrink-0 mt-0.5" />
                  {zone.nom}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1 text-sm">
                  <MapPin size={14} /> Localisation
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="bg-muted/50 rounded-lg p-4 grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Admins</p>
                    <p className="text-2xl font-black text-foreground">-</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Agents</p>
                    <p className="text-2xl font-black text-foreground">{zone.agents_count || 0}</p>
                  </div>
                </div>
                <ActionButton variant="outline" className="w-full gap-2" toastMessage={`Gérer la structure ${zone.nom}`}>
                  Gérer la structure <ExternalLink size={14} />
                </ActionButton>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
