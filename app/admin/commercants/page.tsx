"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Store, Plus, Search, MoreVertical, Loader2, MapPin } from "lucide-react";
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

export default function AdminCommercantsPage() {
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form states
  const [nom, setNom] = useState("");
  const [numeroDocument, setNumeroDocument] = useState("");
  const [typeActivite, setTypeActivite] = useState("");
  const [emplacement, setEmplacement] = useState("");
  const [zoneId, setZoneId] = useState("");

  const queryClient = useQueryClient();

  // Fetch commercants with pagination
  const { data: commercantsData, isLoading } = useQuery({
    queryKey: ["commercants", page],
    queryFn: async () => {
      const res = await api.get(`/commercants?page=${page}`);
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
  const commercants = commercantsData?.data?.data || [];
  const pagination = commercantsData?.data || null;
  const zonesList = zonesData?.data?.data || zonesData?.data || [];

  // Create commercant mutation
  const createMutation = useMutation({
    mutationFn: async (newCommercant: any) => {
      const res = await api.post('/commercants', newCommercant);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commercants"] });
      toast.success("Commerçant enregistré avec succès");
      setIsCreateModalOpen(false);
      // Reset form
      setNom("");
      setNumeroDocument("");
      setTypeActivite("");
      setEmplacement("");
      setZoneId("");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Erreur lors de la création du commerçant";
      toast.error(msg);
    }
  });

  const handleCreateCommercant = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      nom,
      numero_document: numeroDocument,
      type_activite: typeActivite,
      emplacement,
      zone_id: parseInt(zoneId),
      actif: true,
    });
  };

  const isFormValid = nom.trim() && numeroDocument.trim() && typeActivite.trim() && emplacement.trim() && zoneId;

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Commerçants</h1>
            <p className="text-sm text-muted-foreground">Annuaire et gestion de tous les contribuables.</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 w-full sm:w-auto">
            <Plus size={16} />
            Nouveau Commerçant
          </Button>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher (Nom, N°, etc.)..." className="pl-9" />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        {isLoading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : commercants.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8 bg-card rounded-xl border border-dashed border-border">
            <Store className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">Aucun commerçant trouvé</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
              Le répertoire est vide. Ajoutez votre premier commerçant.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Commerçant</th>
                      <th className="px-6 py-4 font-medium">N° Document</th>
                      <th className="px-6 py-4 font-medium">Activité</th>
                      <th className="px-6 py-4 font-medium">Emplacement</th>
                      <th className="px-6 py-4 font-medium">Statut</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {commercants.map((commercant: any) => (
                      <tr key={commercant.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {commercant.nom.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{commercant.nom}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">
                          {commercant.numero_document}
                        </td>
                        <td className="px-6 py-4">
                          {commercant.type_activite}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin size={14} />
                            <span className="truncate max-w-[150px]">{commercant.emplacement}</span>
                          </div>
                          <div className="text-xs text-primary mt-0.5">{commercant.zone?.nom}</div>
                        </td>
                        <td className="px-6 py-4">
                          {commercant.actif ? (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Actif</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Inactif</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none ml-auto">
                              <MoreVertical size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Désactiver</DropdownMenuItem>
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

      {/* Modal de création */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enregistrer un commerçant</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau commerçant à l'annuaire de taxation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCommercant} className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom complet ou Raison sociale</Label>
                <Input 
                  id="nom" 
                  placeholder="Ex: Supermarché du Centre"
                  value={nom} 
                  onChange={(e) => setNom(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroDocument">N° RCCM / Id Nat / Pièce</Label>
                <Input 
                  id="numeroDocument" 
                  placeholder="Ex: CD/LSH/RCCM/24-B-1234"
                  value={numeroDocument} 
                  onChange={(e) => setNumeroDocument(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="typeActivite">Type d'activité principale</Label>
                <Input 
                  id="typeActivite" 
                  placeholder="Ex: Alimentation, Quincaillerie..."
                  value={typeActivite} 
                  onChange={(e) => setTypeActivite(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone_id">Zone affectée</Label>
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
              <div className="space-y-2">
                <Label htmlFor="emplacement">Adresse / Emplacement</Label>
                <Input 
                  id="emplacement" 
                  placeholder="Avenue, Numéro, Quartier..."
                  value={emplacement} 
                  onChange={(e) => setEmplacement(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            <div className="pt-4 flex items-center justify-end gap-2 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending || !isFormValid}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : "Enregistrer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
