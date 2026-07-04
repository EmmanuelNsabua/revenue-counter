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
import { ArrowLeft, Upload, User, Loader2 } from "lucide-react";
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
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
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
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Informations du profil</CardTitle>
            <CardDescription>Veuillez remplir tous les champs nécessaires à la création du compte.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="nom_complet">Nom complet</Label>
                    <Input 
                      id="nom_complet" 
                      placeholder="Ex: Jean Dupont" 
                      required 
                      value={formData.nom_complet}
                      onChange={(e) => setFormData({...formData, nom_complet: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tel">Contact (Téléphone)</Label>
                    <Input 
                      id="tel" 
                      placeholder="Ex: +243..." 
                      value={formData.tel}
                      onChange={(e) => setFormData({...formData, tel: e.target.value})}
                    />
                  </div>
                </div>
                
                {/* Zone Photo de profil à droite */}
                <div className="shrink-0 flex flex-col items-center justify-center space-y-3 p-4 bg-muted/20 border border-border border-dashed rounded-xl w-full sm:w-48 h-48 cursor-pointer hover:bg-muted/40 transition-colors" onClick={handlePhotoClick}>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoChange}
                  />
                  {photoPreview ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground border-2 border-transparent">
                      <User size={32} />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-sm font-medium text-primary flex items-center justify-center gap-1">
                      <Upload size={14} /> Importer photo
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG (Max 2MB)</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <Label>Rôle</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(val) => setFormData({...formData, role: val})}
                    disabled={isLoadingRoles}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles?.map((r) => (
                        <SelectItem key={r.code} value={r.code}>{r.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Select 
                    value={formData.grade} 
                    onValueChange={(val) => setFormData({...formData, grade: val})}
                    disabled={isLoadingGrades}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades?.map((g) => (
                        <SelectItem key={g.nom} value={g.nom}>{g.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label>Structure (Zone / Marché)</Label>
                  <Select 
                    value={formData.institution} 
                    onValueChange={(val) => setFormData({...formData, institution: val})}
                    disabled={isLoadingStructures}
                  >
                    <SelectTrigger>
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
              
              <div className="flex justify-end gap-4 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={mutation.isPending}>
                  Annuler
                </Button>
                <Button type="submit" disabled={mutation.isPending} className="min-w-[150px]">
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    "Créer l'administrateur"
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
