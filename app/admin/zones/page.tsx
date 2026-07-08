"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Map as MapIcon, Users, Store, Settings, Trash2, Loader2, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CardGridSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { BlurFade } from "@/components/magicui/blur-fade";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminZonesPage() {
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nomZone, setNomZone] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["zones", page],
    queryFn: async () => {
      const res = await api.get(`/zones?page=${page}`);
      return res.data;
    },
  });

  const zones = responseData?.data?.data || [];
  const pagination = responseData?.data || null;

  const createMutation = useMutation({
    mutationFn: async (newZone: { nom_zone: string }) => {
      const res = await api.post('/zones', newZone);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Zone créée avec succès");
      setIsCreateModalOpen(false);
      setNomZone("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la création");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/zones/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Zone supprimée");
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Impossible de supprimer cette zone");
      setIsDeleteModalOpen(false);
    }
  });

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ nom_zone: nomZone });
  };

  const handleDeleteClick = (zone: any) => {
    setDeleteTarget(zone);
    setIsDeleteModalOpen(true);
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
                  <Card className="overflow-hidden h-full flex flex-col group hover:shadow-lg transition-shadow duration-200">
                    <div className="h-1.5 w-full bg-primary" />
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <MapIcon size={18} className="text-primary flex-shrink-0" />
                          {zone.nom}
                        </CardTitle>
                        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/zones/${zone.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Gérer la zone">
                              <Settings size={14} />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Supprimer la zone"
                            onClick={() => handleDeleteClick(zone)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      {/* Superviseur */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <UserCheck size={12} className={zone.superviseur ? "text-emerald-500" : "text-muted-foreground"} />
                        <span className={`text-xs ${zone.superviseur ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground italic"}`}>
                          {zone.superviseur ? zone.superviseur.nom : "Aucun superviseur"}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-foreground">{zone.agents_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                            <Users size={12} /> Agents
                          </p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-foreground">{zone.commercants_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                            <Store size={12} /> Commerçants
                          </p>
                        </div>
                      </div>
                      <Link href={`/admin/zones/${zone.id}`} className="block mt-4">
                        <Button variant="outline" className="w-full gap-2 text-sm h-9">
                          <Settings size={14} />
                          Gérer la zone
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>

            {pagination && (
              <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">
                  {pagination.from || 0} – {pagination.to || 0} sur {pagination.total || 0} zones
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || isLoading}>
                    Précédent
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={!pagination.next_page_url || isLoading}>
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </BlurFade>

      {/* Modal : Créer une zone */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle zone</DialogTitle>
            <DialogDescription>Entrez le nom de la zone à ajouter au système.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateZone} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom_zone">Nom de la Zone</Label>
              <Input
                id="nom_zone"
                placeholder="Ex: Pavillon A, Marché Central..."
                value={nomZone}
                onChange={e => setNomZone(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={createMutation.isPending || !nomZone.trim()}>
                {createMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création...</> : "Créer la zone"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal : Confirmer suppression */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer la zone</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la zone <strong>{deleteTarget?.nom}</strong> ? 
              Cette action est irréversible. La zone ne peut être supprimée que si elle ne contient aucun agent ni commerçant.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Annuler</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Suppression...</> : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
