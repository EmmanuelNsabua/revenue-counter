"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useUpdateProfile, useUpdatePassword } from "@/hooks/use-profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Bell, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BlurFade } from "@/components/magicui/blur-fade";
import { RippleButton } from "@/components/magicui/ripple-button";
import { useTheme } from "next-themes";

export default function ParametresPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Profile state
  const [nom, setNom] = useState(user?.nom_complet || "");
  const updateProfile = useUpdateProfile();

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const updatePassword = useUpdatePassword();

  // System preferences state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailReports, setEmailReports] = useState(false);
  const [lang, setLang] = useState("fr");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPush = localStorage.getItem("pref_push_notifications");
      if (savedPush !== null) setPushNotifications(JSON.parse(savedPush));

      const savedEmail = localStorage.getItem("pref_email_reports");
      if (savedEmail !== null) setEmailReports(JSON.parse(savedEmail));

      const savedLang = localStorage.getItem("pref_lang");
      if (savedLang !== null) setLang(savedLang);
    }
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;
    updateProfile.mutate({ nom });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return;
    }
    updatePassword.mutate({
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    }, {
      onSuccess: () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  };

  const handlePushToggle = (checked: boolean) => {
    setPushNotifications(checked);
    localStorage.setItem("pref_push_notifications", JSON.stringify(checked));
    toast.success("Préférence de notification push mise à jour");
  };

  const handleEmailToggle = (checked: boolean) => {
    setEmailReports(checked);
    localStorage.setItem("pref_email_reports", JSON.stringify(checked));
    toast.success("Préférence de rapport par email mise à jour");
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLang(val);
    localStorage.setItem("pref_lang", val);
    if (val === "sw") {
      toast.info("La langue Swahili sera bientôt disponible");
    } else {
      toast.success("Langue de l'interface mise à jour en Français");
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-sm text-muted-foreground mt-1">Gérez votre compte et vos préférences système.</p>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <Tabs defaultValue="compte" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 flex overflow-x-auto flex-nowrap scrollbar-none">
            <TabsTrigger 
              value="compte" 
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-6 py-3 font-semibold flex-shrink-0"
            >
              <User size={16} className="mr-2" />
              Mon Compte
            </TabsTrigger>
            <TabsTrigger 
              value="securite" 
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-6 py-3 font-semibold flex-shrink-0"
            >
              <Shield size={16} className="mr-2" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger 
              value="preferences" 
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-6 py-3 font-semibold flex-shrink-0"
            >
              <Bell size={16} className="mr-2" />
              Préférences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compte" className="space-y-6 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
                <CardDescription>Mettez à jour les informations de votre profil public.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nom">Nom complet</Label>
                    <Input 
                      id="nom" 
                      value={nom} 
                      onChange={(e) => setNom(e.target.value)} 
                      placeholder="Votre nom complet" 
                      className="max-w-md"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Code Agent / Matricule</Label>
                    <Input 
                      id="code" 
                      value={user.identifiant} 
                      disabled 
                      className="max-w-md bg-muted font-mono"
                    />
                    <p className="text-xs text-muted-foreground">Ce matricule est unique et ne peut pas être modifié.</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Rôle système</Label>
                    <Input 
                      id="role" 
                      value={user.role?.toUpperCase() || "NON ASSIGNÉ"} 
                      disabled 
                      className="max-w-md bg-muted"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={updateProfile.isPending || nom === user.nom_complet || !nom.trim()}
                    className="mt-4"
                  >
                    {updateProfile.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : "Enregistrer les modifications"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="securite" className="space-y-6 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>Assurez-vous d&apos;utiliser un mot de passe long et complexe pour sécuriser votre accès.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current_password">Mot de passe actuel</Label>
                    <Input 
                      id="current_password" 
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="max-w-md"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new_password">Nouveau mot de passe</Label>
                    <Input 
                      id="new_password" 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="max-w-md"
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm_password">Confirmer le nouveau mot de passe</Label>
                    <Input 
                      id="confirm_password" 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="max-w-md"
                      required
                      minLength={8}
                    />
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-sm text-destructive mt-1">Les mots de passe ne correspondent pas.</p>
                    )}
                  </div>
                  <RippleButton 
                    type="submit" 
                    disabled={updatePassword.isPending || !currentPassword || !newPassword || newPassword !== confirmPassword}
                    className="mt-4 gap-2 flex items-center"
                  >
                    <KeyRound size={16} className="mr-2" />
                    {updatePassword.isPending ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                  </RippleButton>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de l&apos;application</CardTitle>
                <CardDescription>Personnalisez votre expérience sur Revenue Counter.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between max-w-md">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications push</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des alertes sur cet appareil.
                    </p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={handlePushToggle} />
                </div>
                <div className="flex items-center justify-between max-w-md">
                  <div className="space-y-0.5">
                    <Label className="text-base">Rapports par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Récapitulatif journalier des recouvrements.
                    </p>
                  </div>
                  <Switch checked={emailReports} onCheckedChange={handleEmailToggle} />
                </div>
                
                <div className="pt-4 border-t max-w-md">
                  <div className="grid gap-2">
                    <Label htmlFor="theme">Thème de l&apos;interface</Label>
                    <select 
                      id="theme"
                      value={theme || "system"} 
                      onChange={(e) => setTheme(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus:border-primary"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="system">Système (Auto)</option>
                    </select>
                    <p className="text-xs text-muted-foreground">Choisissez l&apos;apparence visuelle de l&apos;application.</p>
                  </div>
                </div>

                <div className="pt-4 border-t max-w-md">
                  <div className="grid gap-2">
                    <Label htmlFor="langue">Langue de l&apos;interface</Label>
                    <select 
                      id="langue"
                      value={lang} 
                      onChange={handleLangChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus:border-primary"
                    >
                      <option value="fr">Français (RDC)</option>
                      <option value="sw">Swahili</option>
                    </select>
                    <p className="text-xs text-muted-foreground">Certains éléments textuels peuvent rester en français pendant le déploiement de la traduction.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </BlurFade>
    </div>
  );
}
