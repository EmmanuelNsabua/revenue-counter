"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Lock, User, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { api } from "@/lib/api";
import { AuthResponse } from "@/types/auth";
import axios from "axios";
import Logo from "@/components/ui/Logo";
import { BlurFade } from "@/components/magicui/blur-fade";
import { RippleButton } from "@/components/magicui/ripple-button";

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
        case "super_admin":
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
    } catch (err: unknown) {
      console.error("Login error details:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Code Agent ou mot de passe incorrect.");
        } else if (err.response?.data?.error) {
          setError(err.response.data.error as string);
        } else if (err.response?.data?.message) {
          setError(err.response.data.message as string);
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
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CE1021]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* Left Column - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-[#1c4294] relative flex-col justify-between p-12 overflow-hidden text-white"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      >
        <div className="relative z-10">
          <BlurFade delay={0.1}>
            <div className="bg-white/10 w-fit p-1 rounded-full backdrop-blur-sm border border-white/20 mb-16">
              <Logo />
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6 text-white">
              Le Gouvernement <br />
              <span className="text-[#F7D618]">au service du peuple.</span>
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.3}>
            <p className="text-lg text-white/80 max-w-md mb-12">
              Gérez les paiements, les commerçants et les rapports financiers avec une plateforme centralisée conçue pour la performance et la transparence.
            </p>
          </BlurFade>

          <div className="space-y-4">
            <BlurFade delay={0.4}>
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 size={20} className="text-[#F7D618]" />
                <span>Synchronisation en temps réel</span>
              </div>
            </BlurFade>
            <BlurFade delay={0.5}>
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 size={20} className="text-[#F7D618]" />
                <span>Suivi détaillé des recouvrements</span>
              </div>
            </BlurFade>
            <BlurFade delay={0.6}>
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 size={20} className="text-[#F7D618]" />
                <span>Interface adaptée à chaque rôle</span>
              </div>
            </BlurFade>
          </div>
        </div>

        <BlurFade delay={0.7}>
          <div className="relative z-10 text-sm text-white/50 mt-12">
            &quot;Faciliter le quotidien des agents, une transaction à la fois.&quot;
          </div>
        </BlurFade>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white/50">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <BlurFade delay={0.1}>
              <div className="bg-white shadow-sm border border-slate-200 w-fit p-1 rounded-full">
                <Logo />
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={0.2}>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Connexion</h2>
              <p className="text-slate-500">Veuillez saisir vos accès pour continuer.</p>
            </div>
          </BlurFade>

          {error && (
            <BlurFade delay={0.3}>
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 text-red-600 text-sm border border-red-500/20">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </BlurFade>
          )}

          <BlurFade delay={0.4}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="matricule" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Code Agent
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    id="matricule"
                    type="text"
                    placeholder="ATXXXXXX"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    className="pl-10 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    maxLength={8}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Mot de passe
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <RippleButton 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-[#CE1021] hover:bg-[#A30C1A] text-white border-none"
                disabled={isLoading}
                rippleColor="#ffffff"
              >
                {isLoading ? "Vérification..." : "Connexion"}
              </RippleButton>
            </form>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
