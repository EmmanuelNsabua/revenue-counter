import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Building2, TrendingUp, ShieldAlert, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";

export default function SuperAdminDashboardPage() {
  const stats = [
    { label: "Total Collecté Global (Jour)", value: "1 245 000 FC", icon: Globe, trend: "+8% vs hier", color: "text-primary" },
    { label: "Structures Connectées", value: "8 / 10", icon: Building2, trend: "2 inactives", color: "text-rdc-yellow" },
    { label: "Admins Connectés", value: "15", icon: Users, trend: "Stable", color: "text-primary" },
    { label: "Alertes Critiques", value: "3", icon: ShieldAlert, trend: "Nécessite attention", color: "text-destructive" },
  ];

  return (
    <div className="space-y-8 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Pilotage Global</h1>
          <p className="text-sm text-muted-foreground mt-1">Vision macroscopique des opérations de la Mairie.</p>
        </div>
        <div className="flex gap-2">
          <ActionButton variant="outline" toastMessage="Génération du rapport d'activité en cours...">Générer Rapport</ActionButton>
          <ActionButton toastMessage="Panneau d'actions globales ouvert.">Action Globale</ActionButton>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-t-4 border-t-transparent hover:border-t-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Comparaison des Structures */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              Comparaison des Structures (Mois)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Marché Kenya", amount: "12 500 000 FC", progress: 100 },
                { name: "Marché Mzee", amount: "8 200 000 FC", progress: 65 },
                { name: "Commune Kampemba", amount: "5 400 000 FC", progress: 40 },
                { name: "Commune Kamalondo", amount: "3 100 000 FC", progress: 25 },
              ].map((struct, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span>{struct.name}</span>
                    <span>{struct.amount}</span>
                  </div>
                  <div className="h-4 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${struct.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit Log / Sécurité */}
        <Card className="shadow-sm border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert size={18} />
              Journal des Alertes Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Connexion échouée", target: "Admin Kamalondo", time: "08:45", severity: "high" },
                { type: "Modification Taxe", target: "Marché Kenya - Taxe Moto", time: "Hier 14:20", severity: "medium" },
                { type: "Hors ligne prolongé", target: "Serveur local Mzee", time: "Depuis 2j", severity: "high" },
              ].map((log, i) => (
                <div key={i} className="flex items-start justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-foreground">{log.type}</p>
                    <p className="text-xs text-muted-foreground">{log.target}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${log.severity === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-rdc-yellow/10 text-rdc-yellow'}`}>
                      {log.time}
                    </span>
                  </div>
                </div>
              ))}
              <ActionButton variant="outline" className="w-full mt-2 text-xs" toastMessage="Ouverture des archives d'audit...">Voir tout le journal d'audit</ActionButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
