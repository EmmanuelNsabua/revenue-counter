"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function SecurityTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 mb-6">
        <h2 className="text-2xl font-bold">Sécurité et Accès</h2>
        <p className="text-sm text-muted-foreground">Politique de mots de passe et sessions.</p>
      </div>

      <BlurFade delay={0.1}>
        <Card className="border-t-[3px] border-t-primary shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="text-primary" /> Sécurité des Sessions
            </CardTitle>
            <CardDescription>Configurez la durée de vie des sessions et la politique de mot de passe globale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Expiration de session (heures)</label>
                <Input type="number" defaultValue={8} className="max-w-xs" />
                <p className="text-xs text-muted-foreground mt-1">Les agents seront déconnectés après ce délai d'inactivité.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Longueur min. mot de passe</label>
                <Input type="number" defaultValue={12} className="max-w-xs" />
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
