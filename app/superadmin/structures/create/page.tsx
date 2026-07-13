"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, Save } from "lucide-react";
import Link from "next/link";
import { useCreateStructure } from "@/hooks/use-structures";
import { toast } from "sonner";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function CreateStructurePage() {
  const router = useRouter();
  const { mutate: createStructure, isPending } = useCreateStructure();

  const [formData, setFormData] = useState({
    nom: "",
    cle_tenant: "",
    localisation: "",
  });

  const [errors, setErrors] = useState<{ nom?: string; cle_tenant?: string }>({});

  const validate = () => {
    const newErrors: { nom?: string; cle_tenant?: string } = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom de la structure est requis.";
    if (!formData.cle_tenant.trim()) newErrors.cle_tenant = "La clé tenant est requise.";
    
    // Check if cle_tenant contains spaces or special characters
    if (formData.cle_tenant && !/^[A-Z0-9_]+$/.test(formData.cle_tenant.toUpperCase())) {
      newErrors.cle_tenant = "La clé tenant ne doit contenir que des lettres, chiffres et tirets du bas (_).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    createStructure(
      {
        nom: formData.nom,
        cle_tenant: formData.cle_tenant.toUpperCase(),
        localisation: formData.localisation || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Structure créée avec succès");
          router.push("/superadmin/structures");
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Une erreur s'est produite lors de la création de la structure."
          );
        },
      }
    );
  };

  const generateCleTenant = (nom: string) => {
    // Generate a basic key from the name: remove accents, spaces, special chars
    return nom
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
  };

  const handleNomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNom = e.target.value;
    setFormData((prev) => {
      // Si la clé tenant est vide ou correspondait exactement à l'ancien nom généré, on la met à jour
      const oldGenerated = generateCleTenant(prev.nom);
      if (prev.cle_tenant === "" || prev.cle_tenant === oldGenerated) {
        return { ...prev, nom: newNom, cle_tenant: generateCleTenant(newNom) };
      }
      return { ...prev, nom: newNom };
    });
    if (errors.nom) setErrors((prev) => ({ ...prev, nom: undefined }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex items-center gap-4 mb-8">
          <Link href="/superadmin/structures">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Nouvelle Structure</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Créer une nouvelle entité pour le système multi-tenant.
            </p>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <Card className="shadow-sm border-t-4 border-t-primary">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 size={20} className="text-primary" />
                Informations de base
              </CardTitle>
              <CardDescription>
                Les informations saisies ici définissent l'identité de l'institution sur la plateforme.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom de la structure <span className="text-destructive">*</span></Label>
                <Input
                  id="nom"
                  placeholder="Ex: Mairie de Lubumbashi"
                  value={formData.nom}
                  onChange={handleNomChange}
                  className={errors.nom ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.nom && <p className="text-sm text-destructive font-medium">{errors.nom}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cle_tenant">Clé Tenant <span className="text-destructive">*</span></Label>
                <Input
                  id="cle_tenant"
                  placeholder="Ex: MAIRIE_LUBUMBASHI"
                  value={formData.cle_tenant}
                  onChange={(e) => {
                    setFormData({ ...formData, cle_tenant: e.target.value.toUpperCase() });
                    if (errors.cle_tenant) setErrors((prev) => ({ ...prev, cle_tenant: undefined }));
                  }}
                  className={`uppercase ${errors.cle_tenant ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                <p className="text-xs text-muted-foreground">
                  Identifiant unique utilisé pour rattacher les utilisateurs et les données. <strong>Immuable après création.</strong>
                </p>
                {errors.cle_tenant && <p className="text-sm text-destructive font-medium">{errors.cle_tenant}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="localisation">Localisation (Google Maps Embed URL)</Label>
                <Input
                  id="localisation"
                  placeholder="Ex: https://www.google.com/maps/embed?pb=..."
                  value={formData.localisation}
                  onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  URL d'intégration ("embed") fournie par Google Maps pour afficher la carte. Optionnel.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4 border-t pt-6 bg-muted/20">
              <Link href="/superadmin/structures">
                <Button variant="outline" type="button">Annuler</Button>
              </Link>
              <Button type="submit" disabled={isPending} className="gap-2 bg-primary">
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Création...
                  </span>
                ) : (
                  <>
                    <Save size={16} /> Créer la structure
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </BlurFade>
    </div>
  );
}
