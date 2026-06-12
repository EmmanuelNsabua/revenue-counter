"use client";

import { useState, Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Printer, Search, Loader2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTaxes } from "@/hooks/use-taxes";
import { useCommercants } from "@/hooks/use-commercants";
import { useCreatePaiement } from "@/hooks/use-paiements";
import { formatCurrency, cn } from "@/lib/utils";
import { Commercant } from "@/types/commercant";
import { ModePaiement } from "@/types/paiement";

function FormContent() {
  const searchParams = useSearchParams();
  const defaultCommercantDoc = searchParams.get("commercantDoc") || "";

  const [isSuccess, setIsSuccess] = useState(false);
  const [lastTxn, setLastTxn] = useState<any>(null);
  
  const [searchTerm, setSearchTerm] = useState(defaultCommercantDoc);
  const [selectedCommercant, setSelectedCommercant] = useState<Commercant | null>(null);
  
  const [taxeId, setTaxeId] = useState<string>("");
  const [montant, setMontant] = useState<string>("");
  const [modePaiement, setModePaiement] = useState<ModePaiement>("cash");

  const { data: taxes, isLoading: taxesLoading } = useTaxes();
  const { data: searchResults, isLoading: searchLoading } = useCommercants(searchTerm);
  const createMutation = useCreatePaiement();

  // Effet pour auto-sélectionner si on trouve une correspondance exacte sur le numéro_document
  useEffect(() => {
    if (searchResults && searchTerm.length >= 4) {
      const match = searchResults.find(
        c => c.numero_document.toUpperCase() === searchTerm.toUpperCase()
      );
      if (match) setSelectedCommercant(match);
      else setSelectedCommercant(null);
    } else {
      setSelectedCommercant(null);
    }
  }, [searchResults, searchTerm]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCommercant || !taxeId || !montant) return;

    createMutation.mutate({
      commercant_id: selectedCommercant.id,
      taxe_id: parseInt(taxeId),
      montant: parseFloat(montant),
      mode_paiement: modePaiement
    }, {
      onSuccess: (data) => {
        setLastTxn(data);
        setIsSuccess(true);
      }
    });
  }

  if (isSuccess) {
    const today = new Date().toLocaleDateString("fr-CD");
    const now = new Date().toLocaleTimeString("fr-CD", { hour: '2-digit', minute: '2-digit' });
    
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Paiement enregistré !</h3>
          <p className="text-muted-foreground text-sm">
            La transaction a été validée par le système.
          </p>
        </div>

        {/* Reçu virtuel */}
        <div className="bg-white border-2 border-dashed border-border rounded-xl p-6 shadow-sm space-y-4 font-mono text-sm relative text-black">
          <div className="absolute top-4 right-4 w-12 h-12 border-4 border-primary/20 rounded-full flex items-center justify-center opacity-50 rotate-12">
            <span className="text-[10px] font-bold text-primary uppercase">Payé</span>
          </div>
          
          <div className="text-center border-b border-border pb-4 mb-4">
            <h4 className="font-bold text-base">MAIRIE DE LUBUMBASHI</h4>
            <p className="text-muted-foreground text-xs mt-1">Reçu de paiement — Marché Kenya</p>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Réf:</span>
            <span className="font-semibold">TXN-{lastTxn?.id || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span>{today} à {now}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Commerçant:</span>
            <span className="font-semibold text-right">{selectedCommercant?.nom}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Emplacement:</span>
            <span className="text-right">{selectedCommercant?.emplacement}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxe:</span>
            <span className="text-right">{taxes?.find(t => t.id.toString() === taxeId)?.libelle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mode:</span>
            <span className="uppercase">{modePaiement}</span>
          </div>
          
          <div className="flex justify-between border-t border-border pt-4 mt-4 text-base font-bold">
            <span>TOTAL PAYÉ:</span>
            <span>{formatCurrency(montant)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="outline" className="w-full gap-2">
            <Printer size={16} />
            Imprimer
          </Button>
          <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white">
            <WhatsAppIcon size={16} />
            WhatsApp
          </Button>
        </div>

        <div className="flex gap-4 pt-4 border-t border-border mt-8">
          <Button onClick={() => {
            setIsSuccess(false);
            setTaxeId("");
            setMontant("");
            setSearchTerm("");
            setSelectedCommercant(null);
          }} variant="outline" className="flex-1">
            Nouveau paiement
          </Button>
          <Link href="/paiements" className="flex-1">
            <Button className="w-full">Historique</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border border-border max-w-2xl">
      <div className="space-y-6">
        
        {/* Commerçant - Recherche dynamique */}
        <div className="space-y-2">
          <Label htmlFor="commercant">Code ou Nom du Commerçant</Label>
          <div className="relative">
            {searchLoading ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <Input
              id="commercant"
              type="text"
              placeholder="Ex: AT123456"
              className="pl-9 w-full uppercase"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
            />
          </div>
          <div className="min-h-[24px] flex items-center">
            {selectedCommercant ? (
              <span className="text-sm font-medium text-primary flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-md border border-primary/20">
                <CheckCircle2 size={14} />
                {selectedCommercant.nom} — {selectedCommercant.emplacement}
              </span>
            ) : searchTerm.length >= 3 && !searchLoading ? (
              <span className="text-sm text-destructive font-medium px-1">
                Aucun commerçant trouvé pour "{searchTerm}"
              </span>
            ) : null}
          </div>
        </div>

        {/* Type de Taxe */}
        <div className="space-y-2">
          <Label htmlFor="taxe">Type de taxe</Label>
          <Select
            value={taxeId}
            onValueChange={(val) => {
              setTaxeId(val || "");
              const selectedTaxe = taxes?.find(t => t.id.toString() === val);
              if (selectedTaxe) setMontant(selectedTaxe.montant.toString());
            }}
            disabled={taxesLoading}
            required
          >
            <SelectTrigger id="taxe" className="w-full">
              <SelectValue placeholder={taxesLoading ? "Chargement..." : "Sélectionnez une taxe"} />
            </SelectTrigger>
            <SelectContent>
              {taxes?.map(tax => (
                <SelectItem key={tax.id} value={tax.id.toString()}>
                  {tax.libelle} ({formatCurrency(tax.montant)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Montant perçu */}
        <div className="space-y-2">
          <Label htmlFor="montant">Montant perçu (FC)</Label>
          <Input
            id="montant"
            type="number"
            placeholder="0"
            className="w-full"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
          />
          <p className="text-[0.8rem] text-muted-foreground px-1">
            Le montant est pré-rempli selon le barème mais reste modifiable si nécessaire.
          </p>
        </div>

        {/* Mode de paiement */}
        <div className="space-y-3 pt-2">
          <Label>Mode de paiement</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["cash", "mpesa", "airtel", "orange"] as ModePaiement[]).map((mode) => (
              <label 
                key={mode}
                className={cn(
                  "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all",
                  modePaiement === mode 
                    ? "border-primary bg-primary/5 text-primary shadow-sm" 
                    : "border-border hover:bg-muted/50"
                )}
              >
                <input 
                  type="radio" 
                  name="mode" 
                  value={mode} 
                  checked={modePaiement === mode}
                  onChange={(e) => setModePaiement(e.target.value as ModePaiement)}
                  className="w-4 h-4 text-primary accent-primary"
                />
                <span className="font-medium text-sm capitalize">{mode === 'cash' ? 'Espèces (Cash)' : mode}</span>
              </label>
            ))}
          </div>
        </div>

      </div>

      <div className="pt-6 mt-6 border-t border-border flex justify-end gap-3">
        <Link href="/paiements">
          <Button variant="outline" type="button">Annuler</Button>
        </Link>
        <Button 
          type="submit" 
          disabled={!selectedCommercant || createMutation.isPending}
          className="min-w-[150px]"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : "Valider le paiement"}
        </Button>
      </div>
    </form>
  );
}

export function PaiementForm() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Chargement du formulaire...</div>}>
      <FormContent />
    </Suspense>
  );
}
