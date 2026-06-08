"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulation of network delay
    setTimeout(() => {
      setIsLoading(false);

      if (password !== "testAuth123") {
        setError("Mot de passe incorrect.");
        return;
      }

      const mat = matricule.trim().toUpperCase();

      // Regex validation based on role
      const agentRegex = /^\d{2}[A-Z]{2}\d{4}-AG$/;
      const adminRegex = /^\d{2}[A-Z]{2}\d{3}-AD$/;
      const superAdminRegex = /^\d{2}[A-Z]{2}\d{2}-SA$/;

      if (agentRegex.test(mat)) {
        router.push("/dashboard");
      } else if (adminRegex.test(mat)) {
        router.push("/admin/dashboard");
      } else if (superAdminRegex.test(mat)) {
        router.push("/superadmin/dashboard");
      } else {
        setError(
          "Matricule non reconnu ou format invalide. Ex: 00AB1234-AG, 00AB123-AD, 00AB12-SA"
        );
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Column - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col justify-between p-12 overflow-hidden text-primary-foreground"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 mb-16">
            <div className="w-8 h-8 relative rounded-full overflow-hidden bg-white flex-shrink-0">
              <Image 
                src="/assets/logo.png" 
                alt="Logo Mairie de Lubumbashi" 
                fill 
                className="object-contain p-1"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight text-white">Revenue Counter</span>
              <span className="text-[10px] uppercase tracking-wider text-white/70">Mairie de Lubumbashi</span>
            </div>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6 text-white">
            Le Gouvernement <br />
            <span className="text-rdc-yellow">au service du peuple.</span>
          </h1>
          
          <p className="text-lg text-white/80 max-w-md mb-12">
            Gérez les paiements, les commerçants et les rapports financiers avec une plateforme centralisée conçue pour la performance et la transparence.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 size={20} className="text-rdc-yellow" />
              <span>Synchronisation en temps réel</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 size={20} className="text-rdc-yellow" />
              <span>Suivi détaillé des recouvrements</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 size={20} className="text-rdc-yellow" />
              <span>Interface adaptée à chaque rôle</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/50 mt-12">
          "Faciliter le quotidien des agents, une transaction à la fois."
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-card/50">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 relative rounded-full overflow-hidden bg-white ring-2 ring-primary/20">
              <Image 
                src="/assets/logo.png" 
                alt="Logo Mairie de Lubumbashi" 
                fill 
                className="object-contain p-1"
              />
            </div>
            <div>
              <span className="font-bold text-lg block text-foreground">Revenue Counter</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Mairie de Lubumbashi</span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Connexion</h2>
            <p className="text-muted-foreground">Veuillez saisir vos accès pour continuer.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="matricule" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Matricule
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="matricule"
                  type="text"
                  placeholder="Ex: 00AB1234-AG"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  className="pl-10 h-12 bg-background border-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-background border-input"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Vérification..." : "Connexion"}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border/50">
            <div className="bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">Aide pour les tests :</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Agent : <code className="bg-background px-1 rounded">00AA0000-AG</code></li>
                <li>Admin : <code className="bg-background px-1 rounded">00AA000-AD</code></li>
                <li>Super Admin : <code className="bg-background px-1 rounded">00AA00-SA</code></li>
              </ul>
              <p className="pt-2">Mot de passe pour tous : <code className="bg-background px-1 rounded">testAuth123</code></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
