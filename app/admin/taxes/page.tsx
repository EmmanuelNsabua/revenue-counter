import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { Plus, Edit3, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminTaxesPage() {
  const taxes = [
    { id: "TAX-001", name: "Taxe Journalière Marché", amount: "5 000 FC", frequency: "Quotidienne", status: "Active" },
    { id: "TAX-002", name: "Taxe d'Hygiène Globale", amount: "10 000 FC", frequency: "Hebdomadaire", status: "Active" },
    { id: "TAX-003", name: "Taxe Stationnement Moto", amount: "1 500 FC", frequency: "Quotidienne", status: "Active" },
    { id: "TAX-004", name: "Redevance Kiosque Fixe", amount: "25 000 FC", frequency: "Mensuelle", status: "En révision" },
  ];

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Taxes</h1>
          <p className="text-sm text-muted-foreground">Configuration locale des montants et des types de taxes.</p>
        </div>
        <ActionButton className="gap-2 w-full sm:w-auto" toastMessage="Non autorisé" toastDescription="Seule la Direction Générale peut créer de nouvelles taxes.">
          <Plus size={16} />
          Nouvelle Taxe
        </ActionButton>
      </div>

      <div className="bg-rdc-yellow/10 border border-rdc-yellow/20 rounded-lg p-4 flex gap-3 items-start text-rdc-yellow mb-6">
        <ShieldAlert size={20} className="mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-semibold">Mode restreint</p>
          <p className="text-rdc-yellow/80">En tant qu'administrateur local, vous ne pouvez que modifier les montants dans les limites autorisées par la Direction Générale. Pour créer de nouvelles catégories, contactez le Superviseur.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {taxes.map((tax, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <Badge variant="outline" className={tax.status === "Active" ? "bg-primary/10 text-primary border-primary/20" : "bg-rdc-yellow/10 text-rdc-yellow border-rdc-yellow/20"}>
                {tax.status}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 size={16} className="text-muted-foreground" />
              </Button>
            </div>
            
            <h3 className="font-semibold text-lg mb-1">{tax.name}</h3>
            <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">{tax.id}</p>
            
            <div className="flex items-end justify-between mt-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Montant par défaut</p>
                <p className="text-2xl font-bold text-foreground">{tax.amount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Fréquence</p>
                <p className="text-sm font-medium">{tax.frequency}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
