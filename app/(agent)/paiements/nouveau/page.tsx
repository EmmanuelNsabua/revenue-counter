"use client";

import type { Metadata } from "next";
import { PaiementForm } from "@/components/paiements/paiement-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function NouveauPaiementPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-5xl">
      <BlurFade delay={0.1}>
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Enregistrer un paiement</h2>
            <p className="text-sm text-muted-foreground">Saisissez les détails de la perception de taxe.</p>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <PaiementForm />
      </BlurFade>
    </div>
  );
}
