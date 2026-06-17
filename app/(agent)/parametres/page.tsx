"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useUpdateProfile, useUpdatePassword } from "@/hooks/use-profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Bell, KeyRound } from "lucide-react";

export default function ParametresPage() {
  const { user } = useAuth();
  
  // Profile state
  const [nom, setNom] = useState(user?.nom || "");
  const updateProfile = useUpdateProfile();

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const updatePassword = useUpdatePassword();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;
    updateProfile.mutate({ nom });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      // handled by backend but good to prevent submit
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

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 md:pb-0">
      <div>
        <h1 className="text-3xl font-black tracking-tight uppercase">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez votre compte et vos préférences système.</p>
      </div>

      <Tabs defaultValue="compte" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
          <TabsTrigger 
            value="compte" 
            className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-6 py-3 font-semibold"
          >
            <User size={16} className="mr-2" />
            Mon Compte
          </TabsTrigger>
          <TabsTrigger 
            value="securite" 
            className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-6 py-3 font-semibold"
          >
            <Shield size={16} className="mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-6 py-3 font-semibold"
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
                    value={user.code_agent} 
                    disabled 
                    className="max-w-md bg-muted font-mono"
                  />
                  <p className="text-xs text-muted-foreground">Ce matricule est unique et ne peut pas être modifié.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Rôle système</Label>
                  <Input 
                    id="role" 
                    value={user.role.toUpperCase()} 
                    disabled 
                    className="max-w-md bg-muted"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={updateProfile.isPending || nom === user.nom || !nom.trim()}
                  className="mt-4"
                >
                  {updateProfile.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
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
                <Button 
                  type="submit" 
                  disabled={updatePassword.isPending || !currentPassword || !newPassword || newPassword !== confirmPassword}
                  className="mt-4 gap-2"
                >
                  <KeyRound size={16} />
                  {updatePassword.isPending ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                </Button>
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
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div className="space-y-0.5">
                  <Label className="text-base">Rapports par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Récapitulatif journalier des recouvrements.
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="pt-4 border-t max-w-md">
                <div className="grid gap-2">
                  <Label>Langue de l&apos;interface</Label>
                  <select disabled className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Français (RDC)</option>
                    <option>Swahili</option>
                  </select>
                  <p className="text-xs text-muted-foreground">La modification de langue n&apos;est pas encore supportée.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
