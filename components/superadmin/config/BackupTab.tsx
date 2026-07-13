"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function BackupTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 mb-6">
        <h2 className="text-2xl font-bold">Sauvegardes & Archivage</h2>
        <p className="text-sm text-muted-foreground">Politique de sauvegarde des données du système.</p>
      </div>

      <BlurFade delay={0.1}>
        <Card className="shadow-sm border-t-[3px] border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Database className="text-primary" /> Base de données
            </CardTitle>
            <CardDescription>Configuration des sauvegardes automatiques pour prévenir la perte de données.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fréquence Backup Automatique</label>
                <select defaultValue="Quotidien (Minuit)" className="flex h-10 w-full max-w-xs items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <option value="6h">Toutes les 6 heures</option>
                  <option value="Quotidien (Minuit)">Quotidien (Minuit)</option>
                  <option value="Hebdomadaire">Hebdomadaire</option>
                </select>
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
