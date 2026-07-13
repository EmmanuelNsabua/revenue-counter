"use client";

import { useState } from "react";
import { MoreVertical, Edit, AlertTriangle, KeyRound, Trash2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateAgent, useDeleteAgent } from "@/hooks/use-agents";
import { User } from "@/types/auth";
import { toast } from "sonner";

interface AgentActionsProps {
  agent: User;
}

export function AgentActions({ agent }: AgentActionsProps) {
  const updateMutation = useUpdateAgent();
  const deleteMutation = useDeleteAgent();

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [nom, setNom] = useState(agent.nom_complet);
  const [password, setPassword] = useState("");

  const handleUpdate = () => {
    updateMutation.mutate({
      id: agent.id,
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
      id: agent.id,
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
      id: agent.id,
      data: { actif: !agent.statut_actif }
    }, {
      onSuccess: () => setSuspendOpen(false)
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(agent.id, {
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
            <Edit className="mr-2 h-4 w-4" />
            Modifier le nom
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPasswordOpen(true)}>
            <KeyRound className="mr-2 h-4 w-4" />
            Réinitialiser mot de passe
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setSuspendOpen(true)}
            className={agent.statut_actif ? "text-destructive" : "text-green-600"}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            {agent.statut_actif ? "Suspendre l'accès" : "Réactiver l'accès"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive font-semibold">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer l'agent
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'agent</DialogTitle>
            <DialogDescription>Mettez à jour les informations de {agent.nom_complet}</DialogDescription>
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
            <DialogDescription>Entrez un nouveau mot de passe pour {agent.nom_complet}</DialogDescription>
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
            <DialogTitle>{agent.statut_actif ? "Suspendre l'accès" : "Réactiver l'accès"}</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir {agent.statut_actif ? "suspendre" : "réactiver"} le compte de {agent.nom_complet} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSuspendOpen(false)}>Annuler</Button>
            <Button 
              variant={agent.statut_actif ? "destructive" : "default"} 
              onClick={handleToggleStatus} 
              disabled={updateMutation.isPending}
            >
              {agent.statut_actif ? "Oui, Suspendre" : "Oui, Réactiver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Suppression d'un agent</DialogTitle>
            <DialogDescription>
              Êtes-vous absolument sûr de vouloir supprimer <strong>{agent.nom_complet}</strong> ? 
              Cette action est irréversible (sauf via base de données).
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
