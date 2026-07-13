"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, Save, Trash2, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { useStructure, useUpdateStructure, useDeleteStructure } from "@/hooks/use-structures";
import { toast } from "sonner";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditStructurePage() {
  const router = useRouter();
  const { id } = useParams();
  const structureId = Number(id);

  const { data: structure, isLoading } = useStructure(structureId);
  const { mutate: updateStructure, isPending: isUpdating } = useUpdateStructure();
  const { mutate: deleteStructure, isPending: isDeleting } = useDeleteStructure();

  const [formData, setFormData] = useState({
    nom: "",
    localisation: "",
  });

  useEffect(() => {
    if (structure) {
      setFormData({
        nom: structure.nom || "",
        localisation: structure.localisation || "",
      });
    }
  }, [structure]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom.trim()) {
      toast.error("Le nom de la structure est requis.");
      return;
    }

    updateStructure(
      {
        id: structureId,
        data: {
          nom: formData.nom,
          localisation: formData.localisation || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Structure mise à jour avec succès");
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Une erreur s'est produite lors de la mise à jour."
          );
        },
      }
    );
  };

  const handleDelete = () => {
    deleteStructure(structureId, {
      onSuccess: () => {
        toast.success("Structure supprimée avec succès");
        router.push("/superadmin/structures");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Impossible de supprimer la structure."
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto pt-8 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!structure) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <h1 className="text-2xl font-bold">Structure introuvable</h1>
        <Link href="/superadmin/structures">
          <Button variant="outline">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  const hasUsers = (structure.admins_count || 0) > 0 || (structure.agents_count || 0) > 0;

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
            <h1 className="text-3xl font-black tracking-tight uppercase">Éditer Structure</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérer les informations et paramètres de l'entité.
            </p>
          </div>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <BlurFade delay={0.2}>
            <Card className="shadow-sm">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 size={20} className="text-primary" />
                    Informations Générales
                  </CardTitle>
                  <CardDescription>
                    Mettez à jour les informations de la structure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom de la structure <span className="text-destructive">*</span></Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Clé Tenant</Label>
                    <Input
                      value={structure.cle_tenant}
                      disabled
                      className="bg-muted/50 cursor-not-allowed font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">La clé tenant est immuable pour garantir l'intégrité des données.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="localisation">Localisation (Google Maps Embed URL)</Label>
                    <Input
                      id="localisation"
                      value={formData.localisation}
                      onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-4 border-t pt-6 bg-muted/10">
                  <Button type="submit" disabled={isUpdating} className="gap-2 bg-primary">
                    {isUpdating ? "Sauvegarde..." : <><Save size={16} /> Sauvegarder les modifications</>}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </BlurFade>
        </div>

        <div className="space-y-6">
          <BlurFade delay={0.3}>
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-md">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Administrateurs</p>
                      <p className="text-xs text-muted-foreground">Superviseurs rattachés</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold">{structure.admins_count || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-md">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Agents</p>
                      <p className="text-xs text-muted-foreground">Sur le terrain</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold">{structure.agents_count || 0}</span>
                </div>
              </CardContent>
            </Card>
          </BlurFade>

          <BlurFade delay={0.4}>
            <Card className="shadow-sm border-destructive/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-destructive">Zone Dangereuse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  La suppression d'une structure est définitive. Vous ne pouvez supprimer une structure que si aucun utilisateur n'y est rattaché.
                </p>
                <Button 
                  variant="destructive" 
                  className="w-full gap-2" 
                  disabled={hasUsers || isDeleting}
                  onClick={() => {
                    if (window.confirm(`Êtes-vous absolument sûr de vouloir supprimer la structure ${structure.nom} ? Cette action est irréversible.`)) {
                      handleDelete();
                    }
                  }}
                >
                  <Trash2 size={16} /> 
                  {hasUsers ? "Suppression impossible (Utilisateurs liés)" : "Supprimer la structure"}
                </Button>
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
