import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Shield, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SuperAdminAdminsPage() {
  const admins = [
    { id: "ADM-001", name: "Jean-Pierre Tshimanga", structure: "Marché Kenya", role: "Superviseur Local", status: "Actif" },
    { id: "ADM-002", name: "Marie-Claire Kasonde", structure: "Marché Mzee", role: "Superviseur Local", status: "Actif" },
    { id: "ADM-003", name: "Patrick Ilunga", structure: "Commune de Kampemba", role: "Directeur des Recettes", status: "Suspendu" },
  ];

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Administrateurs</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestion des droits et accès des superviseurs.</p>
        </div>
        <ActionButton className="gap-2 w-full sm:w-auto h-12 px-6" toastMessage="Création d'un nouvel administrateur.">
          <UserPlus size={18} />
          Créer un accès Admin
        </ActionButton>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Rechercher par nom, matricule ou structure..." className="pl-10 h-12 text-base" />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-primary/5 text-foreground text-xs uppercase font-bold tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-5">Matricule</th>
                <th className="px-6 py-5">Administrateur</th>
                <th className="px-6 py-5">Structure assignée</th>
                <th className="px-6 py-5">Niveau de droit</th>
                <th className="px-6 py-5">Statut</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.map((admin, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-muted-foreground">{admin.id}</td>
                  <td className="px-6 py-5 font-bold text-foreground">{admin.name}</td>
                  <td className="px-6 py-5">{admin.structure}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-primary" />
                      {admin.role}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant={admin.status === "Actif" ? "default" : "destructive"}>
                      {admin.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none">
                        <MoreVertical size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>Modifier les droits</DropdownMenuItem>
                        <DropdownMenuItem>Réinitialiser le mot de passe</DropdownMenuItem>
                        <DropdownMenuItem className={admin.status === "Actif" ? "text-destructive" : "text-primary"}>
                          {admin.status === "Actif" ? "Suspendre l'accès" : "Réactiver l'accès"}
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
    </div>
  );
}
