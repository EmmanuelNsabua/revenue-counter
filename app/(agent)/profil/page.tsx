"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ActionButton } from "@/components/ui/action-button";
import { User, MapPin, Shield, LogOut, Key } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { BlurFade } from "@/components/magicui/blur-fade";
import { RippleButton } from "@/components/magicui/ripple-button";

export default function ProfilPage() {
  const { user, logout } = useAuth();

  const displayUser = {
    nom: user?.nom || "Chargement...",
    role: user?.role === "agent" ? "Agent de recouvrement" : "Administrateur",
    zone: "Marché Kenya",
    code: user?.code_agent || "ATXXXXXX",
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
          <p className="text-sm text-muted-foreground">Vos informations personnelles</p>
        </div>
      </BlurFade>

      <div className="grid gap-6">
        <BlurFade delay={0.2}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground">
                <User size={32} />
              </div>
              <div>
                <CardTitle className="text-xl">{displayUser.nom}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1">
                  {/* <Shield size={14} className="text-primary" /> */}
                  {displayUser.role}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Shield size={14} /> Identifiant Système
                  </p>
                  <p className="font-medium text-foreground">#{user?.code_agent || "..."}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin size={14} /> Structure d&apos;affectation
                  </p>
                  <p className="font-medium text-foreground">{displayUser.zone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        <BlurFade delay={0.3}>
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
              <RippleButton 
                onClick={() => logout()}
                variant="destructive"
                className="w-full sm:w-auto justify-start gap-2 sm:ml-4 flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Se déconnecter
              </RippleButton>
            </CardContent>
          </Card>
        </BlurFade>
      </div>
    </div>
  );
}
