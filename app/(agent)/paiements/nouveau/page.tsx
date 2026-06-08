import type { Metadata } from "next";
import { PaiementForm } from "@/components/paiements/paiement-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Nouveau Paiement" };

export default function NouveauPaiementPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/paiements">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Enregistrer un paiement</h2>
          <p className="text-sm text-muted-foreground">Saisissez les détails de la perception de taxe.</p>
        </div>
      </div>

      <PaiementForm />
    </div>
  );
}
