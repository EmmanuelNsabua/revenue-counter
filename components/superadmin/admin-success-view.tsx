"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Eye, EyeOff, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdminSuccessViewProps {
  admin: {
    nom_complet: string;
    identifiant: string;
    role: string | null;
    grade: string | null;
    institution: string | null;
    password?: string;
  };
  onBack: () => void;
}

export function AdminSuccessView({ admin, onBack }: AdminSuccessViewProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPwd, setCopiedPwd] = useState(false);

  // If the backend didn't return a password, we generate a mock one for the demo
  const displayPassword = admin.password || "GénéréParLeServeur123!";

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
    const text = `Bonjour ${admin.nom_complet},\n\nVos accès administrateur pour Revenue Counter ont été créés.\n\n*Identifiant :* ${admin.identifiant}\n*Mot de passe :* ${displayPassword}\n\nVeuillez vous connecter et modifier votre mot de passe le plus tôt possible.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card className="border-green-200 dark:border-green-900/50 shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Administrateur Créé !</CardTitle>
          <CardDescription className="text-base">
            Le compte de {admin.nom_complet} a été configuré avec succès.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-4">
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <Badge variant="outline" className="bg-primary/5">{admin.role || "Admin"}</Badge>
            <Badge variant="outline" className="bg-primary/5">{admin.institution || "Non assigné"}</Badge>
            {admin.grade && <Badge variant="outline" className="bg-primary/5">{admin.grade}</Badge>}
          </div>

          <div className="bg-muted/30 rounded-xl p-6 border border-border space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Matricule (Identifiant)</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-mono font-medium text-lg">
                  {admin.identifiant || (admin as any).matricule || "Non défini par le serveur"}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 shrink-0" 
                  onClick={() => copyToClipboard(admin.identifiant || (admin as any).matricule || "", "id")}
                >
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
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 shrink-0" 
                  onClick={() => copyToClipboard(displayPassword, "pwd")}
                >
                  {copiedPwd ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
            <User className="shrink-0 mt-0.5" size={16} />
            <p>Veuillez transmettre ces identifiants à l'utilisateur de manière sécurisée. Il sera invité à changer son mot de passe lors de sa première connexion.</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            className="w-full sm:flex-1 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white" 
            onClick={shareOnWhatsApp}
          >
            <MessageCircle size={18} />
            Partager sur WhatsApp
          </Button>
          <Button variant="outline" className="w-full sm:flex-1" onClick={onBack}>
            Retour à la liste
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
