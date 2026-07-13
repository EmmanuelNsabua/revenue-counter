"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agentsService } from "@/services/agents";
import { useStructures } from "@/hooks/use-references";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, User, Loader2, Phone, Camera, Building2, UserPlus } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { toast } from "sonner";

export default function CreateAgentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: structures, isLoading: isLoadingStructures } = useStructures();

  const [formData, setFormData] = useState({
    nom_complet: "",
    institution: "",
    tel: "",
  });
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await agentsService.create(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent créé avec succès !");
      router.push("/superadmin/agents");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Erreur lors de la création de l'agent");
    }
  });

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom_complet || !formData.tel || !formData.institution) {
      toast.error("Veuillez remplir tous les champs obligatoires (avec astérisque)");
      return;
    }
    
    const submitData = new FormData();
    submitData.append("nom", formData.nom_complet);
    submitData.append("role", "agent");
    submitData.append("institution", formData.institution);
    submitData.append("tel", formData.tel);
    
    if (photo) {
      submitData.append("avatar", photo);
    }
    
    mutation.mutate(submitData);
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0 mx-auto px-4 sm:px-6 mt-4">
      <BlurFade delay={0.1}>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Nouvel Agent</h1>
            <p className="text-sm text-muted-foreground mt-1">Création d'un accès pour un agent terrain.</p>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center gap-4 pb-6 border-b border-border/50">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <User size={24} />
            </div>
            <div>
              <CardTitle className="text-xl">Informations du profil</CardTitle>
              <CardDescription className="text-base mt-1">Veuillez remplir tous les champs nécessaires à la création du compte.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="flex-1 space-y-6 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="nom_complet" className="font-semibold">Nom complet <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        <User size={18} />
                      </div>
                      <Input 
                        id="nom_complet" 
                        placeholder="Ex: Jean Dupont" 
                        className="pl-10 h-12"
                        value={formData.nom_complet}
                        onChange={(e) => setFormData({...formData, nom_complet: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tel" className="font-semibold">Contact (Téléphone) <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        <Phone size={18} />
                      </div>
                      <Input 
                        id="tel" 
                        placeholder="Ex: +243..." 
                        className="pl-10 h-12"
                        value={formData.tel}
                        onChange={(e) => setFormData({...formData, tel: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Zone Photo de profil à droite */}
                <div className="shrink-0 flex flex-col items-center justify-center space-y-3 p-6 bg-white border border-border border-dashed rounded-xl w-full md:w-[280px]">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoChange}
                  />
                  {photoPreview ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary relative group cursor-pointer" onClick={handlePhotoClick}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={16} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <Camera size={28} />
                    </div>
                  )}
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-sm">Importer une photo</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG (Max 2MB)</p>
                  </div>
                  <Button type="button" variant="outline" className="gap-2 h-9 px-3 mt-1 text-sm" onClick={handlePhotoClick}>
                    <Upload size={14} /> Choisir un fichier
                  </Button>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-border/50">
                <h3 className="text-lg font-bold">Affectation</h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label className="font-semibold">Structure d'affectation <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none">
                        <Building2 size={18} />
                      </div>
                      <Select 
                        value={formData.institution} 
                        onValueChange={(val) => setFormData({...formData, institution: val || ""})}
                        disabled={isLoadingStructures}
                      >
                        <SelectTrigger className="w-full pl-10 h-12">
                          <SelectValue placeholder="Sélectionner la structure d'affectation" />
                        </SelectTrigger>
                        <SelectContent>
                          {structures?.map((s) => (
                            <SelectItem key={s.cleTenant} value={s.cleTenant}>{s.nom}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-border/50">
                <Button type="button" variant="outline" className="h-12 px-6" onClick={() => router.back()} disabled={mutation.isPending}>
                  Annuler
                </Button>
                <Button type="submit" disabled={mutation.isPending} className="h-12 px-6 bg-[#C91C30] hover:bg-[#a61727] text-white gap-2">
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      Créer l'agent
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  );
}
