"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { api } from "@/lib/api";
import { AuthResponse } from "@/types/auth";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case "agent":
          router.push("/dashboard");
          break;
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "superadmin":
          router.push("/superadmin/dashboard");
          break;
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post<AuthResponse>("/login", {
        code_agent: matricule.trim().toUpperCase(),
        password,
      });

      const { access_token, agent: userData } = response.data;
      login(access_token, userData);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Code Agent ou mot de passe incorrect.");
        } else if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
        }
      } else {
        setError("Impossible de contacter le serveur.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                Code Agent
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="matricule"
                  type="text"
                  placeholder="ATXXXXXX"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  className="pl-10 h-12 bg-background border-input"
                  maxLength={8}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-background border-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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

        </div>
      </div>
    </div>
  );
}
