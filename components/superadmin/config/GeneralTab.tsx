"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Loader2, Building, DollarSign, Clock } from "lucide-react";
import { toast } from "sonner";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function GeneralTab() {
  const queryClient = useQueryClient();

  const { data: structuresData, isLoading: loadingStructures } = useQuery({
    queryKey: ["structures"],
    queryFn: async () => {
      const res = await api.get("/structures");
      return res.data.data;
    }
  });

  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data;
    }
  });

  const [formData, setFormData] = useState({
    structure_pilote_id: "",
    taux_change_usd_cdf: 2800,
    mode_saisie_strict: true,
    heure_debut_fiscale: "00:00",
    heure_fin_fiscale: "23:59",
    jours_fiscaux_autorises: [1, 2, 3, 4, 5, 6, 7]
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        structure_pilote_id: settings.structure_pilote_id?.toString() || "",
        taux_change_usd_cdf: settings.taux_change_usd_cdf || 2800,
        mode_saisie_strict: settings.mode_saisie_strict ?? true,
        heure_debut_fiscale: settings.heure_debut_fiscale || "00:00",
        heure_fin_fiscale: settings.heure_fin_fiscale || "23:59",
        jours_fiscaux_autorises: settings.jours_fiscaux_autorises || [1, 2, 3, 4, 5, 6, 7]
      });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put("/settings", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Paramètres généraux sauvegardés avec succès !");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la sauvegarde des paramètres.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      structure_pilote_id: formData.structure_pilote_id ? parseInt(formData.structure_pilote_id) : null,
      taux_change_usd_cdf: parseFloat(formData.taux_change_usd_cdf.toString())
    });
  };

  const toggleDay = (day: number) => {
    setFormData(prev => {
      const current = prev.jours_fiscaux_autorises;
      if (current.includes(day)) {
        return { ...prev, jours_fiscaux_autorises: current.filter(d => d !== day) };
      } else {
        return { ...prev, jours_fiscaux_autorises: [...current, day] };
      }
    });
  };

  if (loadingSettings || loadingStructures) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const structures = structuresData || [];

  const daysOfWeek = [
    { id: 1, label: "Lundi" },
    { id: 2, label: "Mardi" },
    { id: 3, label: "Mercredi" },
    { id: 4, label: "Jeudi" },
    { id: 5, label: "Vendredi" },
    { id: 6, label: "Samedi" },
    { id: 7, label: "Dimanche" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm sticky top-24 z-10">
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Paramètres Généraux</h2>
          <p className="text-sm text-muted-foreground">Règles fondamentales du système</p>
        </div>
        <Button type="submit" disabled={mutation.isPending} className="gap-2 bg-primary">
          {mutation.isPending ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}
          Enregistrer
        </Button>
      </div>

      <BlurFade delay={0.2}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Building className="text-primary size-5" /> Structure Pilote
            </CardTitle>
            <CardDescription>
              La structure principale qui détient l'autorité globale sur l'application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-w-md">
              <Label htmlFor="structure_pilote">Sélectionnez la structure maîtresse</Label>
              <select
                id="structure_pilote"
                value={formData.structure_pilote_id}
                onChange={(e) => setFormData({ ...formData, structure_pilote_id: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">-- Aucune structure pilote définie --</option>
                {structures.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.nom} ({s.cle_tenant})</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      <BlurFade delay={0.3}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="text-primary size-5" /> Politique Monétaire
            </CardTitle>
            <CardDescription>
              Gestion de la devise et du mode de saisie sur le terrain.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Devise Pivot</Label>
                <Input value="Franc Congolais (CDF)" disabled className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taux">Taux Interbancaire (1 USD = ... CDF)</Label>
                <Input
                  id="taux"
                  type="number"
                  min="1"
                  step="any"
                  value={formData.taux_change_usd_cdf}
                  onChange={(e) => setFormData({ ...formData, taux_change_usd_cdf: parseFloat(e.target.value) || 2800 })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Mode de Saisie Terrain</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className={`flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${formData.mode_saisie_strict ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                  <input 
                    type="radio" 
                    name="mode_saisie" 
                    value="strict" 
                    checked={formData.mode_saisie_strict}
                    onChange={() => setFormData({ ...formData, mode_saisie_strict: true })}
                    className="mt-1 accent-primary" 
                  />
                  <div className="space-y-1">
                    <span className="text-base font-semibold block cursor-pointer">Mode Strict (CDF Uniquement)</span>
                    <p className="text-sm text-muted-foreground leading-snug">
                      Force les agents à saisir tous les paiements exclusivement en Franc Congolais. Les paiements en USD sont rejetés.
                    </p>
                  </div>
                </label>
                <label className={`flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${!formData.mode_saisie_strict ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                  <input 
                    type="radio" 
                    name="mode_saisie" 
                    value="mixte" 
                    checked={!formData.mode_saisie_strict}
                    onChange={() => setFormData({ ...formData, mode_saisie_strict: false })}
                    className="mt-1 accent-primary" 
                  />
                  <div className="space-y-1">
                    <span className="text-base font-semibold block cursor-pointer">Mode Mixte Contrôlé (CDF/USD)</span>
                    <p className="text-sm text-muted-foreground leading-snug">
                      Autorise les paiements en USD, mais l'API les convertira ou validera strictement au taux configuré ci-dessus.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      <BlurFade delay={0.4}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock className="text-primary size-5" /> Journée Fiscale
            </CardTitle>
            <CardDescription>
              Définissez les heures et les jours autorisés pour l'encaissement des taxes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="h_debut">Heure d'ouverture</Label>
                <Input
                  id="h_debut"
                  type="time"
                  value={formData.heure_debut_fiscale}
                  onChange={(e) => setFormData({ ...formData, heure_debut_fiscale: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="h_fin">Heure de clôture</Label>
                <Input
                  id="h_fin"
                  type="time"
                  value={formData.heure_fin_fiscale}
                  onChange={(e) => setFormData({ ...formData, heure_fin_fiscale: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Jours autorisés pour l'encaissement</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {daysOfWeek.map(day => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.id}`}
                      checked={formData.jours_fiscaux_autorises.includes(day.id)}
                      onCheckedChange={() => toggleDay(day.id)}
                    />
                    <label
                      htmlFor={`day-${day.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>
    </form>
  );
}
