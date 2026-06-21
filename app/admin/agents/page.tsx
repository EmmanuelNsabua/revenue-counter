"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Filter, MoreVertical } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAgents } from "@/hooks/use-agents";
import { User } from "@/types/auth";
import { TableSkeleton } from "@/components/ui/skeletons";
import { EmptyAgents } from "@/components/ui/empty-state";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function AdminAgentsPage() {
  const { data: agents = [], isLoading } = useAgents();

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
            <p className="text-sm text-muted-foreground">Supervision de votre équipe de recouvrement.</p>
          </div>
          <ActionButton className="gap-2 w-full sm:w-auto" toastMessage="Formulaire de création d'agent ouvert.">
            <UserPlus size={16} />
            Nouvel Agent
          </ActionButton>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un agent..." className="pl-9" />
          </div>
          <ActionButton variant="outline" className="gap-2 w-full sm:w-auto" toastMessage="Filtres avancés indisponibles en mode démo.">
            <Filter size={16} />
            Filtrer par Zone
          </ActionButton>
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        {isLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : agents.length === 0 ? (
          <EmptyAgents />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">Matricule</th>
                    <th className="px-6 py-4 font-medium">Nom complet</th>
                    <th className="px-6 py-4 font-medium">Zone d&apos;affectation</th>
                    <th className="px-6 py-4 font-medium">Performance</th>
                    <th className="px-6 py-4 font-medium">Statut</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {agents.map((agent: User) => (
                    <tr key={agent.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{agent.code_agent}</td>
                      <td className="px-6 py-4">{agent.nom}</td>
                      <td className="px-6 py-4">{agent.zone?.nom || "Non assigné"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-secondary rounded-full w-16">
                            <div
                              className="h-full rounded-full bg-rdc-yellow"
                              style={{ width: "50%" }}
                            />
                          </div>
                          <span className="text-xs font-medium">N/A</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={agent.actif ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
                          {agent.actif ? "Actif" : "Inactif"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none">
                            <MoreVertical size={16} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                            <DropdownMenuItem>Historique des collectes</DropdownMenuItem>
                            <DropdownMenuItem className={agent.actif ? "text-destructive" : "text-primary"}>
                              {agent.actif ? "Désactiver l'agent" : "Activer l'agent"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
