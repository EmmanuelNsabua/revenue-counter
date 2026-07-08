"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit3, ShieldAlert, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CardGridSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";

import { useTaxes } from "@/hooks/use-taxes";
import { Taxe } from "@/types/taxe";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { api } from "@/lib/api";

export default function AdminTaxesPage() {
  const { user } = useAuth();
  const { data: taxes = [], isLoading } = useTaxes();
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTaxe, setEditingTaxe] = useState<Taxe | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states
  const [libelle, setLibelle] = useState("");
  const [montant, setMontant] = useState("");
  const [frequence, setFrequence] = useState<"journalier" | "mensuel" | "annuel">("journalier");
  const [description, setDescription] = useState("");

  const isDirection = user?.role === "admin" && user?.grade_niveau === 1;

  // Create Taxe Mutation
  const createMutation = useMutation({
    mutationFn: async (newTaxe: any) => {
      const res = await api.post("/taxes", newTaxe);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      toast.success("Taxe créée avec succès");
      setIsCreateModalOpen(false);
      resetCreateForm();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.error || error?.response?.data?.message || "Erreur lors de la création";
      toast.error(msg);
    }
  });

  // Update Taxe Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await api.put(`/taxes/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      toast.success("Montant de la taxe mis à jour");
      setIsEditModalOpen(false);
      setEditingTaxe(null);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.error || error?.response?.data?.message || "Erreur lors de la mise à jour";
      toast.error(msg);
    }
  });

  const resetCreateForm = () => {
    setLibelle("");
    setMontant("");
    setFrequence("journalier");
    setDescription("");
  };

  const handleCreateTaxe = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      libelle,
      montant: parseFloat(montant),
      frequence,
      description,
      actif: true
    });
  };

  const handleUpdateTaxe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTaxe) return;
    updateMutation.mutate({
      id: editingTaxe.id,
      data: {
        libelle: editingTaxe.libelle,
        frequence: editingTaxe.frequence,
        description: editingTaxe.description,
        montant: parseFloat(montant),
        actif: editingTaxe.actif ?? true
      }
    });
  };

  const handleStartEdit = (taxe: Taxe) => {
    setEditingTaxe(taxe);
    setMontant(taxe.montant.toString());
    setIsEditModalOpen(true);
  };

  const isFormValid = libelle.trim() && montant && parseFloat(montant) > 0;

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Taxes</h1>
          <p className="text-sm text-muted-foreground">Configuration locale des montants et des types de taxes.</p>
        </div>
        {isDirection ? (
          <Button onClick={() => { resetCreateForm(); setIsCreateModalOpen(true); }} className="gap-2 w-full sm:w-auto">
            <Plus size={16} />
            Nouvelle Taxe
          </Button>
        ) : (
          <Button 
            disabled 
            variant="outline" 
            className="gap-2 w-full sm:w-auto cursor-not-allowed opacity-60"
            title="Seul le Super Administrateur peut créer des taxes"
          >
            <Plus size={16} />
            Nouvelle Taxe (Restreint)
          </Button>
        )}
      </div>

      <div className="bg-rdc-yellow/10 border border-rdc-yellow/20 rounded-lg p-4 flex gap-3 items-start text-rdc-yellow mb-6">
        <ShieldAlert size={20} className="mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-semibold">{isDirection ? "Mode Direction" : "Mode restreint"}</p>
          <p className="text-rdc-yellow/80">
            {isDirection 
              ? "Vous avez un accès total pour créer de nouvelles taxes fiscales et ajuster tous les montants." 
              : "En tant qu'administrateur local, vous ne pouvez que modifier les montants des taxes existantes."}
          </p>
        </div>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={3} cols={3} />
      ) : taxes.length === 0 ? (
        <EmptyState
          title="Aucune taxe configurée"
          description="Aucune taxe n'a été assignée à cette structure. Contactez la Direction Générale."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taxes.map((tax: Taxe) => (
            <div key={tax.id} className="bg-card rounded-xl border border-border p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {tax.actif !== false ? "Active" : "Inactive"}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleStartEdit(tax)}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                >
                  <Edit3 size={16} />
                </Button>
              </div>
              <h3 className="font-semibold text-lg mb-1">{tax.libelle}</h3>
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">TAXE-{tax.id}</p>
              <div className="flex items-end justify-between mt-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Montant</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(tax.montant)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Fréquence</p>
                  <p className="text-sm font-medium capitalize">{tax.frequence}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de création de taxe */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle taxe</DialogTitle>
            <DialogDescription>
              Ajoutez une taxe fiscale applicable au marché de la Kenya.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTaxe} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="libelle">Nom / Libellé de la taxe</Label>
              <Input 
                id="libelle" 
                placeholder="Ex: Taxe sur étalage journalier"
                value={libelle} 
                onChange={(e) => setLibelle(e.target.value)} 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="montant">Montant (CDF)</Label>
                <Input 
                  id="montant" 
                  type="number"
                  placeholder="Ex: 1500"
                  value={montant} 
                  onChange={(e) => setMontant(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequence">Fréquence</Label>
                <select 
                  id="frequence" 
                  value={frequence} 
                  onChange={(e) => setFrequence(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                >
                  <option value="journalier">Journalier</option>
                  <option value="mensuel">Mensuel</option>
                  <option value="annuel">Annuel</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                placeholder="Description sommaire de la taxe..."
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            <div className="pt-4 flex items-center justify-end gap-2 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending || !isFormValid}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de modification de montant */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le montant</DialogTitle>
            <DialogDescription>
              Ajustez le montant applicable pour la taxe "{editingTaxe?.libelle}".
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTaxe} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-montant">Nouveau Montant (CDF)</Label>
              <Input 
                id="edit-montant" 
                type="number"
                value={montant} 
                onChange={(e) => setMontant(e.target.value)} 
                required 
              />
            </div>
            <div className="pt-4 flex items-center justify-end gap-2 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => { setIsEditModalOpen(false); setEditingTaxe(null); }}>
                Annuler
              </Button>
              <Button type="submit" disabled={updateMutation.isPending || !montant || parseFloat(montant) <= 0}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : "Sauvegarder"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
