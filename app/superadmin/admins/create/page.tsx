"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agentsService } from "@/services/agents";
import { useRoles, useGrades, useStructures } from "@/hooks/use-references";
import { AdminSuccessView } from "@/components/superadmin/admin-success-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, User, Loader2, Phone, Camera, Shield, Star, Building2, UserPlus } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function CreateAdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const { data: grades, isLoading: isLoadingGrades } = useGrades();
  const { data: structures, isLoading: isLoadingStructures } = useStructures();

  const [createdAdmin, setCreatedAdmin] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    nom_complet: "",
    role: "",
    grade: "",
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
      // On affiche la vue de succès avec les données retournées
      setCreatedAdmin(data);
    },
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
    
    // Si l'API attend du JSON plutôt que du FormData, il faudrait adapter.
    // Ici on prépare un FormData car il y a une photo.
    const submitData = new FormData();
    submitData.append("nom_complet", formData.nom_complet);
    submitData.append("role", formData.role);
    submitData.append("grade", formData.grade);
    submitData.append("institution", formData.institution);
    submitData.append("tel", formData.tel);
    
    if (photo) {
      submitData.append("avatar", photo);
    }
    
    mutation.mutate(submitData);
  };

  if (createdAdmin) {
    return (
      <div className="max-w-7xl pb-16 md:pb-0">
        <BlurFade delay={0.1}>
          <div className="mb-6">
            <Button variant="ghost" className="gap-2 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => router.push("/superadmin/admins")}>
              <ArrowLeft size={16} />
              Retour aux administrateurs
            </Button>
          </div>
          <AdminSuccessView admin={createdAdmin} onBack={() => router.push("/superadmin/admins")} />
        </BlurFade>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0 mx-auto px-4 sm:px-6 mt-4">
      <BlurFade delay={0.1}>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Nouvel Administrateur</h1>
            <p className="text-sm text-muted-foreground mt-1">Création d'un accès pour un superviseur ou chef de zone.</p>
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
                        required 
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
                        required
                        className="pl-10 h-12"
                        value={formData.tel}
                        onChange={(e) => setFormData({...formData, tel: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Zone Photo de profil à droite */}
                <div className="shrink-0 flex flex-col items-center justify-center space-y-4 p-8 bg-white border border-border border-dashed rounded-xl w-full md:w-[320px] h-[280px]">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoChange}
                  />
                  {photoPreview ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary relative group cursor-pointer" onClick={handlePhotoClick}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={20} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <Camera size={32} />
                    </div>
                  )}
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-base">Importer une photo</p>
                    <p className="text-sm text-muted-foreground">JPG, PNG (Max 2MB)</p>
                  </div>
                  <Button type="button" variant="outline" className="gap-2 h-10 px-4 mt-2" onClick={handlePhotoClick}>
                    <Upload size={16} /> Choisir un fichier
                  </Button>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-border/50">
                <h3 className="text-lg font-bold">Détails professionnels</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-semibold">Rôle <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none">
                        <Shield size={18} />
                      </div>
                      <Select 
                        value={formData.role} 
                        onValueChange={(val) => setFormData({...formData, role: val || ""})}
                        disabled={isLoadingRoles}
                        required
                      >
                        <SelectTrigger className="pl-10 h-12">
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles?.map((r) => (
                            <SelectItem key={r.code} value={r.code}>{r.nom}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="font-semibold">Grade <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none">
                        <Star size={18} />
                      </div>
                      <Select 
                        value={formData.grade} 
                        onValueChange={(val) => setFormData({...formData, grade: val || ""})}
                        disabled={isLoadingGrades}
                        required
                      >
                        <SelectTrigger className="pl-10 h-12">
                          <SelectValue placeholder="Sélectionner un grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {grades?.map((g) => (
                            <SelectItem key={g.nom} value={g.nom}>{g.nom}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="font-semibold">Structure (Zone / Marché) <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none">
                        <Building2 size={18} />
                      </div>
                      <Select 
                        value={formData.institution} 
                        onValueChange={(val) => setFormData({...formData, institution: val || ""})}
                        disabled={isLoadingStructures}
                        required
                      >
                        <SelectTrigger className="pl-10 h-12">
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
                      Créer l'administrateur
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
