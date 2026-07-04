"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useUpdateProfile, useUpdatePassword } from "@/hooks/use-profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Bell, KeyRound, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { BlurFade } from "@/components/magicui/blur-fade";
import { RippleButton } from "@/components/magicui/ripple-button";
import { useTheme } from "next-themes";
import Image from "next/image";

export function ParametresModule() {
  const { user, setUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile state
  const [nom, setNom] = useState(user?.nom_complet || "");
  const updateProfile = useUpdateProfile();

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const updatePassword = useUpdatePassword();

  // System preferences state
  const preferences = user?.preferences || {};
  const [pushNotifications, setPushNotifications] = useState(preferences.push_notifications ?? true);
  const [emailReports, setEmailReports] = useState(preferences.email_reports ?? false);
  const [lang, setLang] = useState(preferences.lang ?? "fr");

  const updatePreferencesMutation = useMutation({
    mutationFn: async (prefs: any) => {
      const res = await api.put("/user/preferences", prefs);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
      }
    }
  });

  const updateAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.post("/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Photo de profil mise à jour avec succès.");
      if (data.user) {
        setUser(data.user);
      }
    },
    onError: () => {
      toast.error("Erreur lors de l'upload de la photo.");
    }
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatarMutation.mutate(file);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;
    updateProfile.mutate({ nom }, {
      onSuccess: (data: any) => {
        if (data?.user) {
           setUser(data.user);
        }
      }
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
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
    updatePreferencesMutation.mutate({ push_notifications: checked });
    toast.success("Préférence de notification push mise à jour");
  };

  const handleEmailToggle = (checked: boolean) => {
    setEmailReports(checked);
    updatePreferencesMutation.mutate({ email_reports: checked });
    toast.success("Préférence de rapport par email mise à jour");
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLang(val);
    updatePreferencesMutation.mutate({ lang: val });
    if (val === "sw") {
      toast.info("La langue Swahili sera bientôt disponible");
    } else {
      toast.success("Langue de l'interface mise à jour en Français");
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTheme(val);
    updatePreferencesMutation.mutate({ theme: val });
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paramètres du profil</h1>
          <p className="text-sm text-muted-foreground mt-1">Personnalisez votre expérience et sécurisez votre compte.</p>
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
                <CardDescription>Mettez à jour les informations de votre profil public et votre photo.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-8 items-start mb-6">
                  <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-background shadow-md bg-muted flex items-center justify-center relative">
                      {user.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.avatar_url} alt={user.nom_complet} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-muted-foreground" />
                      )}
                      {updateAvatarMutation.isPending && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                          <Loader2 className="animate-spin text-primary" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={24} />
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/jpeg,image/png,image/jpg" 
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div className="flex-1 w-full space-y-4">
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
                      </div>
                      <Button 
                        type="submit" 
                        disabled={updateProfile.isPending || nom === user.nom_complet || !nom.trim()}
                        className="mt-2"
                      >
                        {updateProfile.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enregistrer le nom"}
                      </Button>
                    </form>
                  </div>
                </div>
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
                <CardDescription>Ces préférences sont synchronisées sur tous vos appareils.</CardDescription>
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
                      value={theme || preferences.theme || "system"} 
                      onChange={handleThemeChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus:border-primary"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="system">Système (Auto)</option>
                    </select>
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
