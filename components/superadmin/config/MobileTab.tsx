"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function MobileTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 mb-6">
        <h2 className="text-2xl font-bold">Application Terrain (Agents)</h2>
        <p className="text-sm text-muted-foreground">Comportement de l'application mobile utilisée pour le recouvrement.</p>
      </div>

      <BlurFade delay={0.1}>
        <Card className="shadow-sm border-t-[3px] border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Smartphone className="text-primary" /> Mode Hors-ligne
            </CardTitle>
            <CardDescription>Limites imposées aux agents lorsqu'ils n'ont pas de connexion internet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mode hors-ligne autorisé (jours)</label>
                <Input type="number" defaultValue={3} className="max-w-xs" />
                <p className="text-xs text-muted-foreground mt-1">Délai avant blocage de l'app si non synchronisée.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Limite encaissement sans sync (FC)</label>
                <Input type="number" defaultValue={500000} className="max-w-xs" />
                <p className="text-xs text-muted-foreground mt-1">Montant maximal cumulable avant obligation de synchronisation.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      <div className="flex justify-end pt-6 border-t mt-8">
        <Button className="gap-2 bg-primary h-11 px-8 text-base shadow-sm">
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
