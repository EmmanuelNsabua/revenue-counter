"use client";
import { useState } from "react";
import { CheckCircle2, Copy, Eye, EyeOff, User, MessageCircle, Building2, Phone, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdminSuccessViewProps {
  admin: {
    nom_complet?: string;
    tel?: string;
    identifiant?: string;
    matricule?: string;
    role?: string | null;
    grade?: string | null;
    institution?: string | null;
    password?: string;
    avatarPreview?: string | null;
  };
  onBack: () => void;
}

export function AdminSuccessView({ admin, onBack }: AdminSuccessViewProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPwd, setCopiedPwd] = useState(false);

  // Fallback au cas où le backend ne renvoie pas encore le matricule/password
  const displayId = admin.identifiant || admin.matricule || "Généré_par_le_serveur";
  const displayPassword = admin.password || "GénéréParLeServeur123!";
  const nomComplet = admin.nom_complet || "Utilisateur Inconnu";

  const copyToClipboard = (text: string, type: "id" | "pwd") => {
    navigator.clipboard.writeText(text);
    if (type === "id") {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPwd(true);
      setTimeout(() => setCopiedPwd(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    const text = `Bonjour ${nomComplet},\n\nVos accès administrateur pour Revenue Counter ont été créés avec succès.\n\n👤 *Nom* : ${nomComplet}\n📱 *Téléphone* : ${admin.tel || "Non renseigné"}\n🏢 *Structure* : ${admin.institution || "Non assigné"}\n🛡️ *Rôle* : ${admin.role || "Admin"} (${admin.grade || "Aucun grade"})\n\n🔑 *Identifiant* : ${displayId}\n🔒 *Mot de passe* : ${displayPassword}\n\nVeuillez vous connecter et modifier votre mot de passe dès votre première connexion.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Card className="border-green-200 dark:border-green-900/50 shadow-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Administrateur Créé !</CardTitle>
          <CardDescription className="text-base">
            Le compte de {nomComplet} a été configuré avec succès.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-2">
          
          {/* Informations Générales */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-border">
            {/* Avatar */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm bg-slate-200 flex items-center justify-center">
                {admin.avatarPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={admin.avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  </>
                ) : (
                  <User size={40} className="text-slate-400" />
                )}
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Actif</Badge>
            </div>
            
            {/* Détails de profil */}
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-muted-foreground flex items-center gap-2 mb-1"><User size={14}/> Nom Complet</p>
                  <p className="font-semibold text-base">{nomComplet}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-2 mb-1"><Phone size={14}/> Téléphone</p>
                  <p className="font-semibold text-base">{admin.tel || "Non spécifié"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-2 mb-1"><Shield size={14}/> Rôle & Grade</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{admin.role}</Badge>
                    <Badge variant="outline" className="bg-primary/5">{admin.grade}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-2 mb-1"><Building2 size={14}/> Structure</p>
                  <p className="font-semibold text-base">{admin.institution || "Non assigné"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Identifiants de connexion */}
          <div className="bg-muted/30 rounded-xl p-6 border border-border space-y-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               Accès système (À transmettre)
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Matricule (Identifiant)</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-mono font-medium text-lg">
                  {displayId}
                </div>
                <Button variant="outline" size="icon" className="h-12 w-12 shrink-0" onClick={() => copyToClipboard(displayId, "id")}>
                  {copiedId ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Mot de passe temporaire</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative flex items-center">
                  <div className="w-full bg-background border border-border rounded-lg pl-4 pr-12 py-3 font-mono font-medium text-lg tracking-wider">
                    {showPassword ? displayPassword : "••••••••••••"}
                  </div>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 p-1 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <Button variant="outline" size="icon" className="h-12 w-12 shrink-0" onClick={() => copyToClipboard(displayPassword, "pwd")}>
                  {copiedPwd ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </Button>
              </div>
            </div>
          </div>
          
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 bg-slate-50/50 dark:bg-slate-900/20 border-t border-border mt-4 rounded-b-xl p-6">
          <Button className="w-full sm:flex-1 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white h-12" onClick={shareOnWhatsApp}>
            <MessageCircle size={18} />
            Partager sur WhatsApp
          </Button>
          <Button variant="outline" className="w-full sm:flex-1 h-12" onClick={onBack}>
            Retour à la liste
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
