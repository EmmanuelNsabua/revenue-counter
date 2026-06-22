"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Map as MapIcon, Users, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { CardGridSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { BlurFade } from "@/components/magicui/blur-fade";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function AdminZonesPage() {
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nomZone, setNomZone] = useState("");

  const queryClient = useQueryClient();

  // Fetch zones with pagination
  const { data: responseData, isLoading } = useQuery({
    queryKey: ["zones", page],
    queryFn: async () => {
      const res = await api.get(`/zones?page=${page}`);
      return res.data;
    },
  });

  // Extract data from Laravel paginator
  const zones = responseData?.data?.data || [];
  const pagination = responseData?.data || null;

  // Create zone mutation
  const createMutation = useMutation({
    mutationFn: async (newZone: { nom_zone: string }) => {
      const res = await api.post('/zones', newZone);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Zone créée avec succès");
      setIsCreateModalOpen(false);
      setNomZone(""); // reset form
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la création de la zone");
    }
  });

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ nom_zone: nomZone });
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Zones</h1>
            <p className="text-sm text-muted-foreground">Gestion du découpage territorial de votre secteur.</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 w-full sm:w-auto">
            <Plus size={16} />
            Nouvelle Zone
          </Button>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        {isLoading ? (
          <CardGridSkeleton count={4} cols={2} />
        ) : zones.length === 0 ? (
          <EmptyState
            title="Aucune zone définie"
            description="Aucune zone n'a encore été créée. Définissez un premier découpage territorial."
          />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {zones.map((zone: any, index: number) => (
                <BlurFade key={zone.id} delay={0.2 + index * 0.05}>
                  <Card className="overflow-hidden h-full flex flex-col">
                    <div className="h-2 w-full bg-primary" />
                    <CardHeader className="pb-2 flex-grow">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapIcon size={18} className="text-primary" />
                        {zone.nom}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-foreground">{zone.agents_count || 0}</p>
                          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                            <Users size={12} /> Agents
                          </p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-foreground">{zone.commercants_count || 0}</p>
                          <p className="text-xs text-muted-foreground mt-1">Commerçants</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && (
              <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
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

      {/* Modal de création de Zone */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle zone</DialogTitle>
            <DialogDescription>
              Entrez le nom de la zone à ajouter au système.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateZone} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom_zone">Nom de la Zone</Label>
              <Input 
                id="nom_zone" 
                placeholder="Ex: Commune de Lubumbashi"
                value={nomZone} 
                onChange={(e) => setNomZone(e.target.value)} 
                required 
              />
            </div>
            <div className="pt-4 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending || !nomZone.trim()}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement en cours...
                  </>
                ) : "Créer la zone"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
