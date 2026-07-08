"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, MoreVertical, Loader2, ShieldCheck, Crown, MapPin } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/ui/skeletons";
import { BlurFade } from "@/components/magicui/blur-fade";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { ZoneMultiSelect } from "@/components/ui/zone-multi-select";

type GradeNiveau = 2 | 3;

const GRADE_INFO: Record<GradeNiveau, { label: string; color: string; description: string; icon: React.ReactNode }> = {
  2: {
    label: "Administration",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    description: "Gestion des transactions, commerçants, agents. Ne peut pas modifier les taxes.",
    icon: <ShieldCheck size={14} />,
  },
  3: {
    label: "Superviseur Terrain",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    description: "Gestion des agents de sa zone uniquement.",
    icon: <MapPin size={14} />,
  },
};

export default function AdministrateursPage() {
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Form states
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [gradeNiveau, setGradeNiveau] = useState<GradeNiveau>(2);
  const [zoneIds, setZoneIds] = useState<number[]>([]);
  const [password, setPassword] = useState("");
  const [credentialsToShow, setCredentialsToShow] = useState<{ identifiant: string; password: string } | null>(null);

  const queryClient = useQueryClient();

  // Fetch admins
  const { data: responseData, isLoading } = useQuery({
    queryKey: ["admins", page],
    queryFn: async () => {
      const res = await api.get(`/admins?page=${page}`);
      return res.data;
    },
  });

  const admins = responseData?.data?.data || [];
  const pagination = responseData?.data || null;

  // Fetch zones
  const { data: zonesData } = useQuery({
    queryKey: ["zones", "all"],
    queryFn: async () => {
      const res = await api.get("/zones");
      return res.data;
    },
  });
  const zonesList = zonesData?.data?.data || zonesData?.data || [];

  const filteredAdmins = admins.filter((a: any) =>
    a.nom_complet?.toLowerCase().includes(search.toLowerCase()) ||
    a.identifiant?.toLowerCase().includes(search.toLowerCase())
  );

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/admins", payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsCreateModalOpen(false);

      if (data?.data?.password_provisoire) {
        setCredentialsToShow({
          identifiant: data.data.identifiant,
          password: data.data.password_provisoire,
        });
      } else {
        toast.success("Administrateur créé avec succès");
      }

      // Reset form
      setNom("");
      setTel("");
      setGradeNiveau(2);
      setZoneIds([]);
      setPassword("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la création");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      nom,
      tel: tel || undefined,
      grade_niveau: gradeNiveau,
      zones: gradeNiveau === 3 ? zoneIds : [],
      password: password || undefined,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papiers");
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Administrateurs</h1>
            <p className="text-sm text-muted-foreground">
              Gestion des comptes Administration (Grade 2) et Superviseurs Terrain (Grade 3).
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 w-full sm:w-auto">
            <UserPlus size={16} />
            Nouvel Administrateur
          </Button>
        </div>
      </BlurFade>

      {/* Grade Infocards */}
      <BlurFade delay={0.15}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([2, 3] as GradeNiveau[]).map((niveau) => (
            <div key={niveau} className={`rounded-xl border p-4 flex gap-3 items-start ${GRADE_INFO[niveau].color}`}>
              <div className="mt-0.5">{GRADE_INFO[niveau].icon}</div>
              <div>
                <p className="font-semibold text-sm">{GRADE_INFO[niveau].label}</p>
                <p className="text-xs opacity-80 mt-1">{GRADE_INFO[niveau].description}</p>
              </div>
            </div>
          ))}
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un administrateur..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : filteredAdmins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl">
            <Crown size={40} className="text-muted-foreground mb-4 opacity-30" />
            <p className="font-medium text-muted-foreground">Aucun administrateur enregistré</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Créez votre premier administrateur en cliquant sur le bouton ci-dessus.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Identifiant</th>
                      <th className="px-6 py-4 font-medium">Nom complet</th>
                      <th className="px-6 py-4 font-medium">Grade / Département</th>
                      <th className="px-6 py-4 font-medium">Zones</th>
                      <th className="px-6 py-4 font-medium">Statut</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredAdmins.map((admin: any) => {
                      const niveau = admin.grade_niveau as GradeNiveau;
                      const gradeInfo = GRADE_INFO[niveau] || GRADE_INFO[2];
                      return (
                        <tr key={admin.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs font-medium">{admin.identifiant}</td>
                          <td className="px-6 py-4 font-medium">{admin.nom_complet}</td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${gradeInfo.color}`}>
                              {gradeInfo.icon}
                              {gradeInfo.label}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {admin.zones && admin.zones.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {admin.zones.map((z: any) => (
                                  <Badge key={z.id} variant="secondary" className="text-[10px]">
                                    {z.nom}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic text-xs">
                                {niveau === 3 ? "Aucune zone" : "—"}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={admin.statut_actif ? "default" : "secondary"} className="text-[10px]">
                              {admin.statut_actif ? "Actif" : "Inactif"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none ml-auto">
                                <MoreVertical size={16} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Modifier les zones</DropdownMenuItem>
                                <DropdownMenuItem>Désactiver le compte</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Affichage de {pagination.from || 0} à {pagination.to || 0} sur {pagination.total || 0} résultats
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.next_page_url || isLoading}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </BlurFade>

      {/* Modal Création */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Créer un administrateur</DialogTitle>
            <DialogDescription>
              Ajoutez un compte Administration (Grade 2) ou un Superviseur Terrain (Grade 3).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-nom">Nom complet *</Label>
              <Input
                id="admin-nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Jean-Pierre Mukeba"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-tel">Téléphone</Label>
              <Input
                id="admin-tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                placeholder="Ex: +243 81 234 5678"
              />
            </div>

            {/* Grade / Département Selector */}
            <div className="space-y-2">
              <Label>Département *</Label>
              <div className="grid grid-cols-2 gap-3">
                {([2, 3] as GradeNiveau[]).map((niveau) => (
                  <button
                    key={niveau}
                    type="button"
                    onClick={() => {
                      setGradeNiveau(niveau);
                      if (niveau === 2) setZoneIds([]);
                    }}
                    className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all ${
                      gradeNiveau === niveau
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      {GRADE_INFO[niveau].icon}
                      Grade {niveau}
                    </div>
                    <span className="text-xs text-muted-foreground">{GRADE_INFO[niveau].label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Zones — only visible for Grade 3 (Superviseur) */}
            {gradeNiveau === 3 && (
              <div className="space-y-2">
                <Label>Zones supervisées *</Label>
                <ZoneMultiSelect
                  zones={zonesList}
                  selectedZoneIds={zoneIds}
                  onChange={setZoneIds}
                  placeholder="Choisir les zones du superviseur..."
                />
                {zoneIds.length === 0 && (
                  <p className="text-xs text-amber-500">⚠ Un Superviseur Terrain doit avoir au moins une zone.</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="admin-password">Mot de passe provisoire</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Auto-généré si vide"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || (gradeNiveau === 3 && zoneIds.length === 0)}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer l'administrateur"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Affichage des Identifiants */}
      <Dialog open={!!credentialsToShow} onOpenChange={() => setCredentialsToShow(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>✅ Administrateur créé avec succès</DialogTitle>
            <DialogDescription>
              Copiez et transmettez ces identifiants provisoires à la personne concernée.
              Ils ne seront plus affichés après la fermeture de cette fenêtre.
            </DialogDescription>
          </DialogHeader>
          {credentialsToShow && (
            <div className="space-y-3 py-2">
              <div
                className="flex items-center justify-between bg-muted rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => copyToClipboard(credentialsToShow.identifiant)}
              >
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Identifiant</p>
                  <p className="font-mono font-bold">{credentialsToShow.identifiant}</p>
                </div>
                <span className="text-xs text-muted-foreground">Copier</span>
              </div>
              <div
                className="flex items-center justify-between bg-muted rounded-lg px-4 py-3 cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => copyToClipboard(credentialsToShow.password)}
              >
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Mot de passe</p>
                  <p className="font-mono font-bold">{credentialsToShow.password}</p>
                </div>
                <span className="text-xs text-muted-foreground">Copier</span>
              </div>
              <Button className="w-full mt-2" onClick={() => setCredentialsToShow(null)}>
                J'ai bien noté les identifiants
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
