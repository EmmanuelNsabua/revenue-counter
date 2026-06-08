import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { User, MapPin, Mail, Shield, LogOut, Key } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Profil Agent" };

export default function ProfilPage() {
  const agent = {
    nom: "Agent 001",
    email: "agent001@mairie-lubumbashi.cd",
    role: "Agent de recouvrement",
    zone: "Marché Kenya - Secteur A",
    matricule: "AGT-2026-001",
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16 md:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
        <p className="text-sm text-muted-foreground">Vos informations personnelles</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground">
              <User size={32} />
            </div>
            <div>
              <CardTitle className="text-xl">{agent.nom}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 mt-1">
                <Shield size={14} className="text-primary" />
                {agent.role} — Matricule: {agent.matricule}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail size={14} /> Adresse Email
                </p>
                <p className="font-medium text-foreground">{agent.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin size={14} /> Zone d'affectation
                </p>
                <p className="font-medium text-foreground">{agent.zone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sécurité & Compte</CardTitle>
            <CardDescription>Gérez vos paramètres de connexion.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActionButton variant="outline" className="w-full sm:w-auto justify-start gap-2" toastMessage="Email de réinitialisation envoyé !">
              <Key size={16} />
              Modifier le mot de passe
            </ActionButton>
            <Link 
              href="/"
              className={cn(buttonVariants({ variant: "destructive" }), "w-full sm:w-auto justify-start gap-2 sm:ml-4")}
            >
              <LogOut size={16} />
              Se déconnecter
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
