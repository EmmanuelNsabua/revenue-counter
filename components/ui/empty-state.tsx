import { LucideIcon, PackageOpen, Users, Store, CreditCard, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

// ─── Presets ──────────────────────────────────────────────────

export function EmptyCommercants({ actionHref }: { actionHref?: string }) {
  return (
    <EmptyState
      icon={Store}
      title="Aucun commerçant trouvé"
      description="Il n'y a pas encore de commerçant enregistré dans cette zone, ou aucun ne correspond à vos critères de recherche."
      actionLabel={actionHref ? "Créer un commerçant" : undefined}
      actionHref={actionHref}
    />
  );
}

export function EmptyPaiements() {
  return (
    <EmptyState
      icon={CreditCard}
      title="Aucune transaction"
      description="Aucun paiement n'a encore été enregistré pour la période sélectionnée."
      actionLabel="Enregistrer un paiement"
      actionHref="/paiements/nouveau"
    />
  );
}

export function EmptyAgents({ actionHref }: { actionHref?: string }) {
  return (
    <EmptyState
      icon={Users}
      title="Aucun agent"
      description="Aucun agent de recouvrement n'est encore associé à votre structure. Créez un premier compte agent pour commencer."
      actionLabel={actionHref ? "Créer un agent" : undefined}
      actionHref={actionHref}
    />
  );
}

export function EmptyAlertes() {
  return (
    <EmptyState
      icon={ShieldAlert}
      title="Aucune alerte active"
      description="Tout est en ordre. Le système ne signale aucun incident en cours."
    />
  );
}

export function EmptySearchResult() {
  return (
    <EmptyState
      icon={PackageOpen}
      title="Aucun résultat"
      description="Votre recherche n'a retourné aucun résultat. Essayez avec des termes différents ou supprimez les filtres actifs."
    />
  );
}
