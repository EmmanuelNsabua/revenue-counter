"use client";

import { useState } from "react";
import { MoreVertical, Shield, AlertTriangle, KeyRound, Trash2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateAdmin, useDeleteAdmin } from "@/hooks/use-admins";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminActionsProps {
  admin: User;
}

export function AdminActions({ admin }: AdminActionsProps) {
  const updateMutation = useUpdateAdmin();
  const deleteMutation = useDeleteAdmin();

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [nom, setNom] = useState(admin.nom_complet);
  const [password, setPassword] = useState("");

  const handleUpdate = () => {
    updateMutation.mutate({
      id: admin.id,
      data: { nom }
    }, {
      onSuccess: () => setEditOpen(false)
    });
  };

  const handlePassword = () => {
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    updateMutation.mutate({
      id: admin.id,
      data: { password }
    }, {
      onSuccess: () => {
        setPasswordOpen(false);
        setPassword("");
        toast.success("Mot de passe réinitialisé");
      }
    });
  };

  const handleToggleStatus = () => {
    updateMutation.mutate({
      id: admin.id,
      data: { actif: !admin.statut_actif }
    }, {
      onSuccess: () => setSuspendOpen(false)
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(admin.id, {
      onSuccess: () => setDeleteOpen(false)
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none ml-auto">
          <MoreVertical size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Shield className="mr-2 h-4 w-4" />
            Modifier les informations
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPasswordOpen(true)}>
            <KeyRound className="mr-2 h-4 w-4" />
            Réinitialiser mot de passe
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setSuspendOpen(true)}
            className={admin.statut_actif ? "text-destructive" : "text-green-600"}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            {admin.statut_actif ? "Suspendre l'accès" : "Réactiver l'accès"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive font-semibold">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer l'administrateur
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'administrateur</DialogTitle>
            <DialogDescription>Mettez à jour les informations et droits de {admin.nom_complet}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom complet</label>
              <Input value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Modal */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
            <DialogDescription>Entrez un nouveau mot de passe pour {admin.nom_complet}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nouveau mot de passe</label>
              <Input type="password" placeholder="Au moins 6 caractères" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordOpen(false)}>Annuler</Button>
            <Button onClick={handlePassword} disabled={updateMutation.isPending}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Modal */}
      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{admin.statut_actif ? "Suspendre l'accès" : "Réactiver l'accès"}</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir {admin.statut_actif ? "suspendre" : "réactiver"} le compte de {admin.nom_complet} ?
              {admin.statut_actif && " L'utilisateur sera déconnecté et ne pourra plus accéder au système."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSuspendOpen(false)}>Annuler</Button>
            <Button 
              variant={admin.statut_actif ? "destructive" : "default"} 
              onClick={handleToggleStatus} 
              disabled={updateMutation.isPending}
            >
              {admin.statut_actif ? "Oui, Suspendre" : "Oui, Réactiver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Suppression d'un administrateur</DialogTitle>
            <DialogDescription>
              Êtes-vous absolument sûr de vouloir supprimer <strong>{admin.nom_complet}</strong> ? 
              Cette action retirera ses droits définitivement.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>Oui, Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
