import type { Metadata } from "next";
import { PaiementTable } from "@/components/paiements/paiement-table";
import type { Paiement } from "@/types/paiement";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { Download, Plus } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Paiements" };

const mockPaiements: Paiement[] = [
  { id: "TXN-0091", commercantId: "C-0042", commercantNom: "Mama Bea Mutombo", stand: "B-12", taxeCode: "TX-J01", taxeLibelle: "Taxe journalière", montant: "3 500 FC", heure: "08:14", date: "07/06/2026", statut: "Payé", agent: "Agent 001" },
  { id: "TXN-0090", commercantId: "C-0041", commercantNom: "Weza Distributors", stand: "C-03", taxeCode: "TX-H01", taxeLibelle: "Taxe hebdomadaire", montant: "7 000 FC", heure: "08:02", date: "07/06/2026", statut: "Payé", agent: "Agent 001" },
  { id: "TXN-0089", commercantId: "C-0040", commercantNom: "Boucherie Kapolowe", stand: "A-07", taxeCode: "TX-J02", taxeLibelle: "Taxe journalière", montant: "5 500 FC", heure: "07:48", date: "07/06/2026", statut: "Payé", agent: "Agent 002" },
  { id: "TXN-0088", commercantId: "C-0039", commercantNom: "Épicerie Lukusa", stand: "D-15", taxeCode: "TX-J01", taxeLibelle: "Taxe journalière", montant: "3 500 FC", heure: "07:30", date: "07/06/2026", statut: "En attente", agent: "Agent 001" },
  { id: "TXN-0087", commercantId: "C-0038", commercantNom: "Salon Mbote Beauty", stand: "E-02", taxeCode: "TX-J01", taxeLibelle: "Taxe journalière", montant: "3 500 FC", heure: "07:15", date: "07/06/2026", statut: "Payé", agent: "Agent 003" },
];

export default function PaiementsPage() {
  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paiements</h1>
          <p className="text-sm text-muted-foreground">Historique des transactions</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <ActionButton variant="outline" className="gap-2 flex-1 sm:flex-none" toastMessage="Exportation CSV en cours...">
            <Download size={16} />
            Exporter
          </ActionButton>
          <Link href="/paiements/nouveau" className="flex-1 sm:flex-none">
            <Button className="w-full gap-2">
              <Plus size={16} />
              Nouveau paiement
            </Button>
          </Link>
        </div>
      </div>

      <PaiementTable paiements={mockPaiements} />
    </div>
  );
}
