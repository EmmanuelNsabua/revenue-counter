import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Store, Eye, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function SuperAdminCommercantsPage() {
  const commercants = [
    { id: "COM-001", name: "Boutique Mama Nene", structure: "Marché Kenya", zone: "Allée A", status: "Actif" },
    { id: "COM-002", name: "Kiosk Airtel", structure: "Marché Kenya", zone: "Allée B", status: "Inactif" },
    { id: "COM-089", name: "Dépôt Pharmaceutique", structure: "Commune Kampemba", zone: "Secteur 4", status: "Actif" },
    { id: "COM-105", name: "Alimentation Centrale", structure: "Marché Mzee", zone: "Zone Nord", status: "Actif" },
  ];

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Registre Global</h1>
          <p className="text-sm text-muted-foreground mt-1">Audit et consultation de tous les commerçants du système.</p>
        </div>
        <Button variant="outline" className="gap-2 w-full sm:w-auto h-11">
          <ShieldAlert size={16} />
          Lancer un audit
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher par ID ou Nom..." className="pl-9 h-11" />
        </div>
        <Button variant="secondary" className="gap-2 w-full sm:w-auto h-11">
          <Filter size={16} />
          Filtre par Structure
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-primary/5 text-foreground text-xs uppercase font-bold tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-5">ID Commerçant</th>
                <th className="px-6 py-5">Nom</th>
                <th className="px-6 py-5">Structure</th>
                <th className="px-6 py-5">Zone locale</th>
                <th className="px-6 py-5">Statut</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {commercants.map((commercant, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-muted-foreground">{commercant.id}</td>
                  <td className="px-6 py-5 font-bold text-foreground flex items-center gap-2">
                    <Store size={14} className="text-primary" />
                    {commercant.name}
                  </td>
                  <td className="px-6 py-5">{commercant.structure}</td>
                  <td className="px-6 py-5 text-muted-foreground">{commercant.zone}</td>
                  <td className="px-6 py-5">
                    <Badge variant={commercant.status === "Actif" ? "default" : "destructive"}>
                      {commercant.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link href={`/superadmin/commercants/${commercant.id}`}>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Eye size={14} /> Audit
                      </Button>
                    </Link>
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
