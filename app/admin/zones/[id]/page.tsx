"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Map as MapIcon, Users, Store, UserCheck, Edit3,
  Check, X, UserPlus, UserMinus, Loader2, Search,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { BlurFade } from "@/components/magicui/blur-fade";
import { toast } from "sonner";
import Link from "next/link";

type TabKey = "agents" | "commercants";

export default function ZoneDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TabKey>("agents");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [agentSearch, setAgentSearch] = useState("");
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [isChangeSuperviseurOpen, setIsChangeSuperviseurOpen] = useState(false);
  const [selectedSuperviseurId, setSelectedSuperviseurId] = useState<number | null>(null);
  const [removingAgentId, setRemovingAgentId] = useState<number | null>(null);

  // Fetch zone detail
  const { data: zoneData, isLoading } = useQuery({
    queryKey: ["zone", id],
    queryFn: async () => {
      const res = await api.get(`/zones/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  // Fetch all agents (for assignment picker)
  const { data: allAgentsData } = useQuery({
    queryKey: ["agents-all"],
    queryFn: async () => {
      const res = await api.get("/agents?page=1");
      return res.data?.data?.data || [];
    },
  });

  // Fetch all admins (for superviseur picker)
  const { data: allAdminsData } = useQuery({
    queryKey: ["admins-all"],
    queryFn: async () => {
      const res = await api.get("/admins");
      return res.data?.data?.data || [];
    },
  });

  const zone = zoneData;

  // Agents already in this zone
  const zoneAgentIds = new Set(
    (zone?.agents || []).map((a: any) => a.user_id ?? a.id)
  );

  // Agents not yet in this zone
  const availableAgents = (allAgentsData || []).filter(
    (a: any) => !zoneAgentIds.has(a.id) && a.role === "agent"
  );

  // Update zone name
  const updateNameMutation = useMutation({
    mutationFn: async (nom: string) => {
      const res = await api.put(`/zones/${id}`, { nom });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zone", id] });
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Nom de la zone mis à jour");
      setIsEditingName(false);
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  // Update superviseur
  const updateSuperviseurMutation = useMutation({
    mutationFn: async (superviseur_id: number | null) => {
      const res = await api.put(`/zones/${id}`, { superviseur_id });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zone", id] });
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Superviseur mis à jour");
      setIsChangeSuperviseurOpen(false);
    },
    onError: () => toast.error("Erreur lors de la mise à jour du superviseur"),
  });

  // Assign agent to zone
  const assignAgentMutation = useMutation({
    mutationFn: async (agentId: number) => {
      const res = await api.post(`/zones/${id}/agents/${agentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zone", id] });
      queryClient.invalidateQueries({ queryKey: ["agents-all"] });
      toast.success("Agent affecté à la zone");
      setIsAddAgentOpen(false);
    },
    onError: () => toast.error("Erreur lors de l'affectation"),
  });

  // Remove agent from zone
  const removeAgentMutation = useMutation({
    mutationFn: async (agentId: number) => {
      setRemovingAgentId(agentId);
      const res = await api.delete(`/zones/${id}/agents/${agentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zone", id] });
      queryClient.invalidateQueries({ queryKey: ["agents-all"] });
      toast.success("Agent retiré de la zone");
      setRemovingAgentId(null);
    },
    onError: () => {
      toast.error("Erreur lors du retrait");
      setRemovingAgentId(null);
    },
  });

  const handleSaveName = () => {
    if (editedName.trim()) updateNameMutation.mutate(editedName.trim());
  };

  const filteredZoneAgents = (zone?.agents || []).filter((a: any) =>
    (a.user?.nom_complet || "").toLowerCase().includes(agentSearch.toLowerCase()) ||
    (a.matricule_terrain || "").toLowerCase().includes(agentSearch.toLowerCase())
  );

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "agents", label: "Agents", icon: <Users size={16} />, count: zone?.agents?.length ?? 0 },
    { key: "commercants", label: "Commerçants", icon: <Store size={16} />, count: zone?.commercants?.length ?? 0 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!zone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Zone introuvable.</p>
        <Button variant="outline" onClick={() => router.back()}>Retour</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-16 md:pb-0">
      <BlurFade delay={0.05}>
        {/* Header / Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/zones">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin/zones" className="hover:text-foreground transition-colors">Zones</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{zone.nom}</span>
          </div>
        </div>
      </BlurFade>

      {/* Zone Info Card */}
      <BlurFade delay={0.1}>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="h-1.5 bg-primary" />
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
              {/* Zone Name */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapIcon size={22} className="text-primary" />
                </div>
                <div>
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editedName}
                        onChange={e => setEditedName(e.target.value)}
                        className="h-8 text-lg font-bold w-48"
                        autoFocus
                        onKeyDown={e => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setIsEditingName(false); }}
                      />
                      <Button size="icon" className="h-8 w-8" onClick={handleSaveName} disabled={updateNameMutation.isPending}>
                        <Check size={14} />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditingName(false)}>
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{zone.nom}</h1>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => { setEditedName(zone.nom); setIsEditingName(true); }}
                      >
                        <Edit3 size={13} />
                      </Button>
                    </div>
                  )}
                  {/* Superviseur */}
                  <div className="flex items-center gap-2 mt-1">
                    <UserCheck size={14} className={zone.superviseur ? "text-emerald-500" : "text-muted-foreground"} />
                    <span className={`text-sm ${zone.superviseur ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground italic"}`}>
                      {zone.superviseur ? `Superviseur : ${zone.superviseur.nom}` : "Aucun superviseur assigné"}
                    </span>
                    <Button
                      variant="ghost" size="sm" className="h-6 text-xs px-2 text-muted-foreground"
                      onClick={() => {
                        setSelectedSuperviseurId(zone.superviseur?.id ?? null);
                        setIsChangeSuperviseurOpen(true);
                      }}
                    >
                      {zone.superviseur ? "Changer" : "Assigner"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-3">
                <div className="text-center px-4 py-3 bg-muted/40 rounded-lg min-w-[80px]">
                  <p className="text-2xl font-bold">{zone.agents?.length ?? 0}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Agents</p>
                </div>
                <div className="text-center px-4 py-3 bg-muted/40 rounded-lg min-w-[80px]">
                  <p className="text-2xl font-bold">{zone.commercants?.length ?? 0}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Commerçants</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Tabs */}
      <BlurFade delay={0.15}>
        <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
              <Badge variant="secondary" className="text-[10px] h-4 px-1 min-w-[18px]">
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>
      </BlurFade>

      {/* Tab Content */}
      <BlurFade delay={0.2}>
        {activeTab === "agents" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un agent..."
                  className="pl-9"
                  value={agentSearch}
                  onChange={e => setAgentSearch(e.target.value)}
                />
              </div>
              <Button className="gap-2 w-full sm:w-auto flex-shrink-0" onClick={() => setIsAddAgentOpen(true)}>
                <UserPlus size={15} />
                Ajouter un agent
              </Button>
            </div>

            {filteredZoneAgents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl">
                <Users size={36} className="text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">Aucun agent dans cette zone</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Cliquez sur "Ajouter un agent" pour en affecter un.</p>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium">Matricule</th>
                      <th className="px-6 py-3 text-left font-medium">Nom complet</th>
                      <th className="px-6 py-3 text-left font-medium">Statut</th>
                      <th className="px-6 py-3 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredZoneAgents.map((agent: any) => (
                      <tr key={agent.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-3 font-mono text-xs font-medium">{agent.matricule_terrain}</td>
                        <td className="px-6 py-3 font-medium">{agent.user?.nom_complet ?? "—"}</td>
                        <td className="px-6 py-3">
                          <Badge variant={agent.user?.statut_actif ? "default" : "secondary"} className="text-[10px]">
                            {agent.user?.statut_actif ? "Actif" : "Inactif"}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={removingAgentId === (agent.user_id ?? agent.id)}
                            onClick={() => removeAgentMutation.mutate(agent.user_id ?? agent.id)}
                          >
                            {removingAgentId === (agent.user_id ?? agent.id)
                              ? <Loader2 size={12} className="animate-spin" />
                              : <UserMinus size={12} />}
                            Retirer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "commercants" && (
          <div className="space-y-4">
            {(zone.commercants || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl">
                <Store size={36} className="text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">Aucun commerçant dans cette zone</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Les commerçants sont affectés à une zone lors de leur création ou modification.</p>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium">Nom</th>
                      <th className="px-6 py-3 text-left font-medium">Type d'activité</th>
                      <th className="px-6 py-3 text-left font-medium">Emplacement</th>
                      <th className="px-6 py-3 text-left font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(zone.commercants || []).map((c: any) => (
                      <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-3 font-medium">{c.nom}</td>
                        <td className="px-6 py-3">
                          <Badge variant="outline" className="text-[10px]">{c.type_activite || "—"}</Badge>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground text-xs">{c.emplacement || "—"}</td>
                        <td className="px-6 py-3">
                          <Badge variant={c.actif ? "default" : "secondary"} className="text-[10px]">
                            {c.actif ? "Actif" : "Inactif"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </BlurFade>

      {/* Modal : Ajouter un agent à la zone */}
      <Dialog open={isAddAgentOpen} onOpenChange={setIsAddAgentOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un agent à {zone.nom}</DialogTitle>
            <DialogDescription>Sélectionnez un agent disponible à affecter à cette zone.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[360px] overflow-y-auto space-y-1 py-2">
            {availableAgents.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                Tous les agents sont déjà affectés à cette zone ou aucun agent disponible.
              </p>
            ) : availableAgents.map((agent: any) => (
              <button
                key={agent.id}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left group"
                onClick={() => assignAgentMutation.mutate(agent.id)}
                disabled={assignAgentMutation.isPending}
              >
                <div>
                  <p className="font-medium text-sm">{agent.nom}</p>
                  <p className="text-xs text-muted-foreground font-mono">{agent.code_agent}</p>
                </div>
                <UserPlus size={15} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAgentOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal : Changer le superviseur */}
      <Dialog open={isChangeSuperviseurOpen} onOpenChange={setIsChangeSuperviseurOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Superviseur de la zone</DialogTitle>
            <DialogDescription>Choisissez l'administrateur responsable de la zone {zone.nom}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="superviseur">Superviseur terrain</Label>
            <select
              id="superviseur"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={selectedSuperviseurId ?? ""}
              onChange={e => setSelectedSuperviseurId(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">— Aucun superviseur —</option>
              {(allAdminsData || []).map((admin: any) => (
                <option key={admin.id} value={admin.id}>{admin.nom_complet}</option>
              ))}
            </select>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsChangeSuperviseurOpen(false)}>Annuler</Button>
            <Button
              disabled={updateSuperviseurMutation.isPending}
              onClick={() => updateSuperviseurMutation.mutate(selectedSuperviseurId)}
            >
              {updateSuperviseurMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
