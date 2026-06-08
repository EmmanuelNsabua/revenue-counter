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
import { CheckCircle2, Printer, MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const mockCommercants: Record<string, string> = {
  "C-0042": "Mama Bea Mutombo (Stand B-12)",
  "C-0041": "Weza Distributors (Stand C-03)",
  "C-0040": "Boucherie Kapolowe (Stand A-07)",
  "C-0039": "Épicerie Lukusa (Stand D-15)",
  "C-0038": "Salon Mbote Beauty (Stand E-02)",
};

function FormContent() {
  const searchParams = useSearchParams();
  const defaultCommercantId = searchParams.get("commercantId") || "";

  const [isSuccess, setIsSuccess] = useState(false);
  const [commercantId, setCommercantId] = useState(defaultCommercantId);
  const [commercantNom, setCommercantNom] = useState<string | null>(null);
  
  const [taxeCode, setTaxeCode] = useState("");
  const [montant, setMontant] = useState("");
  const [modePaiement, setModePaiement] = useState("cash");

  // Lookup effect for Commerçant
  useEffect(() => {
    if (commercantId && mockCommercants[commercantId.toUpperCase()]) {
      setCommercantNom(mockCommercants[commercantId.toUpperCase()]);
    } else {
      setCommercantNom(null);
    }
  }, [commercantId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commercantNom || !taxeCode || !montant) return;
    setIsSuccess(true);
  }

  if (isSuccess) {
    const today = new Date().toLocaleDateString("fr-FR");
    const now = new Date().toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
    
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Paiement enregistré avec succès !</h3>
          <p className="text-muted-foreground text-sm">
            La transaction a été ajoutée à l'historique et le reçu a été généré.
          </p>
        </div>

        {/* Reçu virtuel */}
        <div className="bg-white border-2 border-dashed border-border rounded-xl p-6 shadow-sm space-y-4 font-mono text-sm relative">
          <div className="absolute top-4 right-4 w-12 h-12 border-4 border-primary/20 rounded-full flex items-center justify-center opacity-50 rotate-12">
            <span className="text-[10px] font-bold text-primary uppercase">Payé</span>
          </div>
          
          <div className="text-center border-b border-border pb-4 mb-4">
            <h4 className="font-bold text-base">MAIRIE DE LUBUMBASHI</h4>
            <p className="text-muted-foreground text-xs mt-1">Reçu de paiement de taxe</p>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Réf:</span>
            <span className="font-semibold">TXN-{Math.floor(Math.random() * 10000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span>{today} à {now}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Commerçant:</span>
            <span className="font-semibold text-right">{commercantNom}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxe:</span>
            <span className="text-right">{taxeCode === "TX-J01" ? "Taxe journalière" : "Taxe hebdomadaire"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mode:</span>
            <span className="uppercase">{modePaiement}</span>
          </div>
          
          <div className="flex justify-between border-t border-border pt-4 mt-4 text-base font-bold">
            <span>TOTAL PAYÉ:</span>
            <span>{montant} FC</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="outline" className="w-full gap-2">
            <Printer size={16} />
            Imprimer le reçu
          </Button>
          <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white">
            <MessageCircle size={16} />
            Envoyer par WhatsApp
          </Button>
        </div>

        <div className="flex gap-4 pt-4 border-t border-border mt-8">
          <Button onClick={() => {
            setIsSuccess(false);
            setTaxeCode("");
            setMontant("");
            setCommercantId("");
          }} variant="outline" className="flex-1">
            Nouveau paiement
          </Button>
          <Link href="/paiements" className="flex-1">
            <Button className="w-full">Retour à l'historique</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border border-border max-w-2xl">
      <div className="space-y-6">
        
        {/* Commerçant - Saisie Manuelle */}
        <div className="space-y-2">
          <Label htmlFor="commercant">ID du Commerçant</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="commercant"
              type="text"
              placeholder="Ex: C-0042"
              className="pl-9 w-full uppercase"
              value={commercantId}
              onChange={(e) => setCommercantId(e.target.value)}
              required
            />
          </div>
          <div className="min-h-[24px] flex items-center">
            {commercantId ? (
              commercantNom ? (
                <span className="text-sm font-medium text-primary flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-md border border-primary/20">
                  <CheckCircle2 size={14} />
                  {commercantNom}
                </span>
              ) : (
                <span className="text-sm text-destructive font-medium px-1">
                  Aucun commerçant trouvé pour l'ID "{commercantId.toUpperCase()}"
                </span>
              )
            ) : (
              <span className="text-[0.8rem] text-muted-foreground px-1">
                Saisissez l'identifiant pour rechercher.
              </span>
            )}
          </div>
        </div>

        {/* Type de Taxe */}
        <div className="space-y-2">
          <Label htmlFor="taxe">Type de taxe</Label>
          <Select
            value={taxeCode}
            onValueChange={(val) => {
              setTaxeCode(val);
              if (val === "TX-J01") setMontant("3500");
              if (val === "TX-H01") setMontant("7000");
            }}
            required
          >
            <SelectTrigger id="taxe" className="w-full">
              <SelectValue placeholder="Sélectionnez une taxe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TX-J01">Taxe journalière (3 500 FC)</SelectItem>
              <SelectItem value="TX-H01">Taxe hebdomadaire (7 000 FC)</SelectItem>
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
          <p className="text-[0.8rem] text-muted-foreground px-1">Le montant est rempli automatiquement selon le barème.</p>
        </div>

        {/* Mode de paiement */}
        <div className="space-y-3 pt-2">
          <Label>Mode de paiement</Label>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-3 p-3 border border-primary/20 bg-primary/5 rounded-lg cursor-pointer flex-1">
              <input 
                type="radio" 
                name="mode" 
                value="cash" 
                checked={modePaiement === "cash"}
                onChange={(e) => setModePaiement(e.target.value)}
                className="w-4 h-4 text-primary accent-primary"
              />
              <span className="font-medium text-sm text-primary">Espèces (Cash)</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-border bg-muted/30 rounded-lg cursor-not-allowed opacity-70 flex-1">
              <input 
                type="radio" 
                name="mode" 
                value="mobile_money" 
                disabled
                className="w-4 h-4"
              />
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Mobile Money</span>
                <span className="text-[10px] uppercase font-bold text-rdc-yellow bg-rdc-yellow/10 px-1.5 py-0.5 rounded w-fit mt-0.5">Bientôt</span>
              </div>
            </label>
          </div>
        </div>

      </div>

      <div className="pt-6 mt-6 border-t border-border flex justify-end gap-3">
        <Link href="/paiements">
          <Button variant="outline" type="button">Annuler</Button>
        </Link>
        <Button type="submit" disabled={!commercantNom}>Valider le paiement</Button>
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
