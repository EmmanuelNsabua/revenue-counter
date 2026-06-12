import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, Shield, Database, Smartphone } from "lucide-react";

export default function SuperAdminConfigPage() {
  return (
    <div className="space-y-6 max-w-5xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Configuration Globale</h1>
          <p className="text-sm text-muted-foreground mt-1">Règles métier, sécurité et paramètres du système central.</p>
        </div>
        <ActionButton className="gap-2 w-full sm:w-auto h-12 px-8 font-bold" toastMessage="Configuration système sauvegardée avec succès.">
          <Save size={18} />
          Enregistrer les modifications
        </ActionButton>
      </div>

      <div className="grid gap-8">
        {/* Paramètres de Sécurité */}
        <Card className="border-t-4 border-t-primary shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="text-primary" /> Sécurité et Accès
            </CardTitle>
            <CardDescription>Politique de mots de passe et sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Expiration de session (heures)</label>
                <Input type="number" defaultValue={8} className="max-w-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Longueur min. mot de passe</label>
                <Input type="number" defaultValue={12} className="max-w-xs" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres App Mobile */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Smartphone className="text-primary" /> Application Terrain (Agents)
            </CardTitle>
            <CardDescription>Comportement de l&apos;application mobile utilisée pour le recouvrement.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mode hors-ligne autorisé (jours)</label>
                <Input type="number" defaultValue={3} className="max-w-xs" />
                <p className="text-xs text-muted-foreground mt-1">Délai avant blocage de l&apos;app si non synchronisée.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Limite encaissement sans sync (FC)</label>
                <Input type="number" defaultValue={500000} className="max-w-xs" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres Base de données */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Database className="text-primary" /> Sauvegardes & Archivage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fréquence Backup Automatique</label>
                <select defaultValue="Quotidien (Minuit)" className="flex h-10 w-full max-w-xs items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>Toutes les 6 heures</option>
                  <option value="Quotidien (Minuit)">Quotidien (Minuit)</option>
                  <option>Hebdomadaire</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
