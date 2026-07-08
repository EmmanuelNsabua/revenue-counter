"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BlurFade } from "@/components/magicui/blur-fade";
import {
  ArrowLeft, ClipboardCheck, Banknote, CheckSquare,
  Square, Loader2, Send,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CloturePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [commentaire, setCommentaire] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Fetch today's transactions for this superviseur's agents
  const { data: txData, isLoading } = useQuery({
    queryKey: ["transactions-today-cloture"],
    queryFn: async () => {
      const res = await api.get(`/paiements?page=1&per_page=100`);
      const all = res.data?.data?.data || [];
      // Filter: only today's + only unsigned ones
      return all.filter((t: any) => {
        const d = new Date(t.date_paiement || t.created_at).toISOString().split("T")[0];
        return d === today && t.statut !== "signe";
      });
    },
  });

  const transactions: any[] = txData || [];
  const totalSelected = transactions
    .filter((t) => selectedIds.has(t.id))
    .reduce((s, t) => s + parseFloat(t.montant_paye ?? t.montant ?? 0), 0);

  const toggleAll = () => {
    if (selectedIds.size === transactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map((t) => t.id)));
    }
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/rapports", {
        commentaire,
        paiement_ids: Array.from(selectedIds),
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Rapport soumis ! Les admins ont été notifiés.");
      router.push("/admin/transactions");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Erreur lors de la soumission");
    },
  });

  return (
    <div className="max-w-5xl pb-16 md:pb-0">
      <BlurFade delay={0.05}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/transactions">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin/transactions" className="hover:text-foreground transition-colors">Transactions</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Clôture journalière</span>
          </div>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT: Transaction list ──────────────────────────────── */}
        <BlurFade delay={0.1} className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-base">Transactions du jour</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date().toLocaleDateString("fr-CD", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={toggleAll}
              >
                {selectedIds.size === transactions.length && transactions.length > 0
                  ? <><CheckSquare size={14} /> Tout désélectionner</>
                  : <><Square size={14} /> Tout sélectionner</>}
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <Banknote size={36} className="text-muted-foreground/30" />
                <p className="text-muted-foreground font-medium">Aucune transaction non signée aujourd&apos;hui</p>
                <p className="text-xs text-muted-foreground/70">Toutes les transactions ont déjà été traitées.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {transactions.map((t: any) => {
                  const isSelected = selectedIds.has(t.id);
                  return (
                    <div
                      key={t.id}
                      className={`flex items-center gap-4 px-6 py-3.5 cursor-pointer transition-colors ${
                        isSelected ? "bg-primary/5" : "hover:bg-muted/30"
                      }`}
                      onClick={() => toggleOne(t.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleOne(t.id)}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {t.commercant?.nom || `Commerçant #${t.commercant_id}`}
                          </p>
                          <Badge variant="outline" className="text-[10px] flex-shrink-0">
                            {t.taxe?.libelle || "Taxe"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-xs text-muted-foreground font-mono">{t.reference}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.agent?.user?.nom_complet || "Agent"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-emerald-600">
                          {formatCurrency(t.montant_paye ?? t.montant)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(t.date_paiement || t.created_at).toLocaleTimeString("fr-CD", {
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </BlurFade>

        {/* ── RIGHT: Summary & Submit ─────────────────────────────── */}
        <BlurFade delay={0.15} className="lg:col-span-1">
          <div className="space-y-4 lg:sticky lg:top-6">
            {/* Summary card */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck size={18} className="text-primary" />
                <h3 className="font-semibold text-base">Récapitulatif</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total transactions</span>
                  <span className="font-semibold">{transactions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sélectionnées</span>
                  <span className="font-semibold text-primary">{selectedIds.size}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Montant signé</span>
                  <span className="font-bold text-emerald-600 text-base">
                    {formatCurrency(totalSelected)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              {transactions.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Taux de signature</span>
                    <span>{Math.round((selectedIds.size / transactions.length) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((selectedIds.size / transactions.length) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Comment box */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <label className="text-sm font-medium">Commentaire du superviseur</label>
              <textarea
                className="w-full h-28 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Observations, remarques sur la journée de collecte..."
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
              />
            </div>

            {/* Submit button */}
            <Button
              className="w-full gap-2 h-11"
              disabled={transactions.length === 0 || submitMutation.isPending}
              onClick={() => setIsConfirmOpen(true)}
            >
              {submitMutation.isPending
                ? <><Loader2 size={16} className="animate-spin" /> Soumission en cours...</>
                : <><Send size={16} /> Approuver et soumettre</>}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              Les admins Grade 1 et 2 seront notifiés à la soumission.
            </p>
          </div>
        </BlurFade>
      </div>

      {/* Confirmation modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la clôture</DialogTitle>
            <DialogDescription>
              Vous vous apprêtez à soumettre votre rapport journalier avec{" "}
              <strong>{selectedIds.size}</strong> transaction(s) signée(s) pour un total de{" "}
              <strong>{formatCurrency(totalSelected)}</strong>.
              <br /><br />
              Cette action notifiera les administrateurs Grade 1 et 2. Continuer ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Annuler</Button>
            <Button
              disabled={submitMutation.isPending}
              onClick={() => { setIsConfirmOpen(false); submitMutation.mutate(); }}
            >
              {submitMutation.isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
