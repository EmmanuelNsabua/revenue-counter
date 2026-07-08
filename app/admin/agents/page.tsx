"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, MoreVertical, Loader2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/ui/skeletons";
import { EmptyAgents } from "@/components/ui/empty-state";
import { BlurFade } from "@/components/magicui/blur-fade";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function AdminAgentsPage() {
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form states
  const [nom, setNom] = useState("");
  const [codeAgent, setCodeAgent] = useState("");
  const [role, setRole] = useState("agent");
  const [password, setPassword] = useState("");
  const [zoneId, setZoneId] = useState("");

  const queryClient = useQueryClient();

  // Fetch agents with pagination
  const { data: responseData, isLoading } = useQuery({
    queryKey: ["agents", page],
    queryFn: async () => {
      const res = await api.get(`/agents?page=${page}`);
      return res.data;
    },
  });

  // Get data from Laravel paginator structure
  const agents = responseData?.data?.data || [];
  const pagination = responseData?.data || null;

  // Fetch zones for the select input
  const { data: zonesData } = useQuery({
    queryKey: ["zones", "all"],
    queryFn: async () => {
      const res = await api.get("/zones");
      return res.data;
    },
  });
  const zonesList = zonesData?.data?.data || zonesData?.data || [];

  // Create agent mutation
  const createMutation = useMutation({
    mutationFn: async (newAgent: any) => {
      const res = await api.post('/agents', newAgent);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      setIsCreateModalOpen(false);
      
      if (data?.data?.password_provisoire) {
         // Show credentials to the admin
         alert(`Agent créé avec succès !\n\nMatricule: ${data.data.code_agent}\nMot de passe: ${data.data.password_provisoire}\n\nVeuillez copier et transmettre ces informations à l'agent.`);
      } else {
         toast.success("Agent créé avec succès");
      }
      
      // Reset form
      setNom("");
      setCodeAgent("");
      setRole("agent");
      setPassword("");
      setZoneId("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la création de l'agent");
    }
  });

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      nom,
      code_agent: codeAgent || undefined,
      role,
      password: password || undefined,
      zone_id: zoneId ? parseInt(zoneId) : null,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
            <p className="text-sm text-muted-foreground">Supervision de votre équipe de recouvrement.</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 w-full sm:w-auto">
            <UserPlus size={16} />
            Nouvel Agent
          </Button>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un agent..." className="pl-9" />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : agents.length === 0 ? (
          <EmptyAgents />
        ) : (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Code Agent</th>
                      <th className="px-6 py-4 font-medium">Nom complet</th>
                      <th className="px-6 py-4 font-medium">Rôle</th>
                      <th className="px-6 py-4 font-medium">Zone assignée</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {agents.map((agent: any) => (
                      <tr key={agent.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium">{agent.code_agent}</td>
                        <td className="px-6 py-4">{agent.nom}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="uppercase text-[10px]">
                            {agent.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">{agent.zone?.nom || "Non assigné"}</td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none ml-auto">
                              <MoreVertical size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                              <DropdownMenuItem>Historique</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {pagination && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Affichage de {pagination.from || 0} à {pagination.to || 0} sur {pagination.total || 0} résultats
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

      {/* Modal de création d'agent */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un nouvel agent</DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour ajouter un membre au système.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAgent} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom complet</Label>
              <Input 
                id="nom" 
                value={nom} 
                onChange={(e) => setNom(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code_agent">Code Agent (Matricule)</Label>
              <Input 
                id="code_agent" 
                placeholder="Auto-généré si vide (ex: AT3XXXXX)"
                value={codeAgent} 
                onChange={(e) => setCodeAgent(e.target.value)} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <select 
                  id="role" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                >
                  <option value="agent">Agent (Terrain)</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone_id">Zone affectée (Optionnel)</Label>
                <select 
                  id="zone_id" 
                  value={zoneId} 
                  onChange={(e) => setZoneId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Aucune zone</option>
                  {zonesList.map((z: any) => (
                    <option key={z.id} value={z.id}>{z.nom}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe provisoire</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Auto-généré si vide"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                minLength={6}
              />
            </div>
            <div className="pt-4 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement en cours...
                  </>
                ) : "Créer l'agent"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
