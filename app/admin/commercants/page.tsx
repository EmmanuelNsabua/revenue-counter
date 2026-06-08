import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, MoreVertical, Store, Eye, Edit3 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminCommercantsPage() {
  const commercants = [
    { id: "COM-001", name: "Boutique Mama Nene", activity: "Alimentation", zone: "Allée A", status: "Actif" },
    { id: "COM-002", name: "Kiosk Airtel", activity: "Services", zone: "Allée B", status: "Inactif" },
    { id: "COM-003", name: "Papa Pharmacie", activity: "Pharmacie", zone: "Allée C", status: "Actif" },
    { id: "COM-004", name: "Dépôt Boissons", activity: "Alimentation", zone: "Allée A", status: "Actif" },
    { id: "COM-005", name: "Salon de Coiffure Beauté", activity: "Services", zone: "Allée B", status: "Actif" },
  ];

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Commerçants</h1>
          <p className="text-sm text-muted-foreground">Registre de tous les commerçants de votre zone de supervision.</p>
        </div>
        <Link href="/admin/commercants/create">
          <Button className="gap-2 w-full sm:w-auto">
            <Plus size={16} />
            Créer un commerçant
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un nom ou ID..." className="pl-9" />
        </div>
        <ActionButton variant="outline" className="gap-2 w-full sm:w-auto" toastMessage="Filtres avancés en développement.">
          <Filter size={16} />
          Filtrer
        </ActionButton>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">ID Commerçant</th>
                <th className="px-6 py-4 font-medium">Nom</th>
                <th className="px-6 py-4 font-medium">Secteur d'activité</th>
                <th className="px-6 py-4 font-medium">Zone</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {commercants.map((commercant, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-muted-foreground">{commercant.id}</td>
                  <td className="px-6 py-4 font-semibold flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                      <Store size={14} />
                    </div>
                    {commercant.name}
                  </td>
                  <td className="px-6 py-4">{commercant.activity}</td>
                  <td className="px-6 py-4">{commercant.zone}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={commercant.status === "Actif" ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
                      {commercant.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none ml-auto">
                        <MoreVertical size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/admin/commercants/${commercant.id}`}>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Eye size={14} /> Voir les détails
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Edit3 size={14} /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className={commercant.status === "Actif" ? "text-destructive" : "text-primary"}>
                          {commercant.status === "Actif" ? "Désactiver" : "Activer"}
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
