"use client";

import React from "react";
import { usePaiement } from "@/hooks/use-paiements";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function PaiementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: paiement, isLoading, isError } = usePaiement(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground mt-4">Chargement du reçu...</p>
      </div>
    );
  }

  if (isError || !paiement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold">Transaction introuvable</h3>
          <p className="text-muted-foreground">Le reçu demandé n&apos;existe pas ou vous n&apos;y avez pas accès.</p>
        </div>
        <Link href="/paiements">
          <Button variant="outline">Retour à l&apos;historique</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16 md:pb-0">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/paiements">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h2 className="text-xl font-semibold tracking-tight">Reçu de paiement</h2>
      </div>

      <div className="flex flex-col items-center justify-center py-6 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-1 uppercase text-primary">Transaction Validée</h3>
          <p className="text-muted-foreground text-sm">
            Référence: REF-{paiement.id}
          </p>
      </div>

      {/* Reçu Virtuel */}
      <Card className="bg-white border-2 border-dashed border-border rounded-xl shadow-sm font-mono text-sm relative text-black max-w-md mx-auto overflow-hidden">
        <div className="absolute top-4 right-4 w-12 h-12 border-4 border-primary/20 rounded-full flex items-center justify-center opacity-50 rotate-12">
          <span className="text-[10px] font-bold text-primary uppercase">Payé</span>
        </div>
        
        <CardContent className="p-6 space-y-4">
          <div className="text-center border-b border-border pb-4 mb-4">
            <h4 className="font-bold text-base">MAIRIE DE LUBUMBASHI</h4>
            <p className="text-muted-foreground text-xs mt-1 italic">Direction des Recettes</p>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID Transaction:</span>
            <span className="font-semibold">{paiement.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date & Heure:</span>
            <span>{formatDateTime(paiement.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Commerçant:</span>
            <span className="font-semibold text-right">{paiement.commercant?.nom || `Commerçant #${paiement.commercant_id}`}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Localisation:</span>
            <span className="text-right">{paiement.commercant?.emplacement || "N/A"}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type de Taxe:</span>
            <span className="font-medium text-right">{paiement.taxe?.libelle || `Taxe #${paiement.taxe_id}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mode de paiement:</span>
            <span className="uppercase font-medium">{paiement.mode_paiement}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Agent:</span>
            <span className="text-right">{paiement.agent?.nom || "Non spécifié"}</span>
          </div>
          
          <div className="flex justify-between border-t-2 border-black/10 pt-4 mt-4 text-lg font-bold">
            <span>TOTAL PERÇU:</span>
            <span>{formatCurrency(paiement.montant)}</span>
          </div>

          <div className="pt-8 text-[10px] text-center text-muted-foreground space-y-1">
             <p>Merci pour votre contribution au développement de la ville.</p>
             <p className="font-bold">Lubumbashi eza yetu.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
        <Button variant="outline" size="lg" className="w-full shadow-sm">
          <Printer size={18} />
          Imprimer
        </Button>
        <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white shadow-sm">
          <WhatsAppIcon size={18} />
          WhatsApp
        </Button>
      </div>

      <div className="flex justify-center pt-6 border-t border-border mt-8">
        <Link href="/paiements/nouveau">
          <Button variant="link" className="text-primary font-semibold">
            Effectuer un autre paiement
          </Button>
        </Link>
      </div>
    </div>
  );
}
