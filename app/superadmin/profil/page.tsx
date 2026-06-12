import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Mail, ShieldAlert, LogOut, Key } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Profil SuperAdmin" };

export default function SuperAdminProfilPage() {
  const superadmin = {
    nom: "Super Admin",
    email: "direction@mairie-lubumbashi.cd",
    role: "Direction Générale",
    zone: "Toutes les structures",
    matricule: "SUP-2026-001",
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16 md:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profil Direction</h1>
        <p className="text-sm text-muted-foreground">Vos accès globaux au système</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-t-4 border-t-primary">
          <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 text-background ring-4 ring-foreground/20">
              <ShieldAlert size={32} />
            </div>
            <div>
              <CardTitle className="text-xl">{superadmin.nom}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 mt-1 font-semibold">
                <ShieldAlert size={14} className="text-primary" />
                {superadmin.role} — Matricule: {superadmin.matricule}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail size={14} /> Adresse Email Officielle
                </p>
                <p className="font-medium text-foreground">{superadmin.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin size={14} /> Accès
                </p>
                <p className="font-medium text-foreground">{superadmin.zone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sécurité Renforcée</CardTitle>
            <CardDescription>Gérez votre authentification forte.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <button className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto justify-start gap-2")}>
              <Key size={16} />
              Changer la clé de sécurité
            </button>
            <Link 
              href="/"
              className={cn(buttonVariants({ variant: "destructive" }), "w-full sm:w-auto justify-start gap-2 sm:ml-4")}
            >
              <LogOut size={16} />
              Déconnexion Totale
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
