"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Search, MoreVertical, Loader2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/ui/skeletons";
import { BlurFade } from "@/components/magicui/blur-fade";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function AdminStructuresPage() {
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form states
  const [nomStructure, setNomStructure] = useState("");
  const [zoneId, setZoneId] = useState("");

  const queryClient = useQueryClient();

  // Fetch structures with pagination
  const { data: structuresData, isLoading } = useQuery({
    queryKey: ["structures", page],
    queryFn: async () => {
      const res = await api.get(`/structures?page=${page}`);
      return res.data;
    },
  });

  // Fetch zones for the select input
  const { data: zonesData } = useQuery({
    queryKey: ["zones", "all"],
    queryFn: async () => {
      const res = await api.get("/zones");
      return res.data;
    },
  });

  // Extract data from Laravel paginator
  const structures = structuresData?.data?.data || [];
  const pagination = structuresData?.data || null;
  const zonesList = zonesData?.data?.data || zonesData?.data || [];

  // Create structure mutation
  const createMutation = useMutation({
    mutationFn: async (newStructure: { nom_structure: string; zone_id: number }) => {
      const res = await api.post('/structures', newStructure);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["structures"] });
      toast.success("Structure créée avec succès");
      setIsCreateModalOpen(false);
      // Reset form
      setNomStructure("");
      setZoneId("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la création de la structure");
    }
  });

  const handleCreateStructure = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      nom_structure: nomStructure,
      zone_id: parseInt(zoneId),
    });
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Structures de Taxation</h1>
            <p className="text-sm text-muted-foreground">Gestion des marchés, parkings et autres structures.</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 w-full sm:w-auto">
            <Plus size={16} />
            Nouvelle Structure
          </Button>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher une structure..." className="pl-9" />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        {isLoading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : structures.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8 bg-card rounded-xl border border-dashed border-border">
            <Building2 className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">Aucune structure trouvée</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
              Vous n'avez pas encore configuré de structure de taxation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Nom de la Structure</th>
                      <th className="px-6 py-4 font-medium">Zone Associée</th>
                      <th className="px-6 py-4 font-medium">Statut</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {structures.map((structure: any) => (
                      <tr key={structure.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                          <Building2 size={16} className="text-primary" />
                          {structure.nom_structure}
                        </td>
                        <td className="px-6 py-4">
                          {structure.zone?.nom || "Zone inconnue"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Actif
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none ml-auto">
                              <MoreVertical size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
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

      {/* Modal de création de structure */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle structure</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau point de collecte au système.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateStructure} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom_structure">Nom de la structure</Label>
              <Input 
                id="nom_structure" 
                placeholder="Ex: Marché Central"
                value={nomStructure} 
                onChange={(e) => setNomStructure(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zone_id">Zone associée</Label>
              <select 
                id="zone_id" 
                value={zoneId} 
                onChange={(e) => setZoneId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              >
                <option value="">Sélectionnez une zone</option>
                {zonesList.map((z: any) => (
                  <option key={z.id} value={z.id}>{z.nom}</option>
                ))}
              </select>
            </div>
            <div className="pt-4 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending || !nomStructure.trim() || !zoneId}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement en cours...
                  </>
                ) : "Créer la structure"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
