import type { Metadata } from "next";
import { CommercantFilters } from "@/components/commercants/commercant-filters";
import { CommercantTable } from "@/components/commercants/commercant-table";
import type { Commercant } from "@/types/commercant";
import { Badge } from "@/components/ui/badge";
import { Store, CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Commerçants" };

const mockCommercants: Commercant[] = [
  { id: "C-0042", nom: "Mama Bea Mutombo", activite: "Alimentation", stand: "B-12", telephone: "+243 81 234 5678", statut: "Actif", zone: "Allée B" },
  { id: "C-0041", nom: "Weza Distributors", activite: "Boissons", stand: "C-03", telephone: "+243 97 987 6543", statut: "Actif", zone: "Allée C" },
  { id: "C-0040", nom: "Boucherie Kapolowe", activite: "Boucherie", stand: "A-07", telephone: "+243 82 456 7890", statut: "Actif", zone: "Allée A" },
  { id: "C-0039", nom: "Épicerie Lukusa", activite: "Épicerie", stand: "D-15", telephone: "+243 81 321 0987", statut: "Suspendu", zone: "Allée D" },
  { id: "C-0038", nom: "Salon Mbote Beauty", activite: "Coiffure", stand: "E-02", telephone: "+243 99 555 4321", statut: "Actif", zone: "Allée E" },
];

export default function CommerciantsPage() {
  const actifs = mockCommercants.filter(c => c.statut === "Actif").length;
  const suspendus = mockCommercants.filter(c => c.statut === "Suspendu").length;

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 sm:mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Commerçants</h1>
          <p className="text-sm text-muted-foreground">Gestion des commerçants du marché Kenya</p>
        </div>
        <div className="flex gap-3 flex-wrap items-center">
        <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 text-primary border-primary/20 bg-primary/5">
          <Store size={14} />
          {mockCommercants.length} commerçants
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 text-green-700 border-green-200 bg-green-50">
          <CheckCircle size={14} />
          {actifs} actifs
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 text-destructive border-destructive/20 bg-destructive/5">
          <XCircle size={14} />
          {suspendus} suspendus
        </Badge>
      </div>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border">
        <CommercantFilters />
      </div>

      <CommercantTable commercants={mockCommercants} />
    </div>
  );
}
