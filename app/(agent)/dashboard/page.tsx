"use client";

import { KpiCards } from "@/components/dashboard/kpi-cards";
import { RecentPaiements } from "@/components/dashboard/recent-paiements";
import { RippleButton } from "@/components/magicui/ripple-button";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Plus, Store } from "lucide-react";
import Link from "next/link";
import { useAccess } from "@/contexts/PermissionContext";

export default function DashboardPage() {
  const { hasAccess } = useAccess();
  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="text-sm text-muted-foreground">Vue d&apos;ensemble des recettes</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link href="/commercants" className="flex-1 sm:flex-none">
              <RippleButton variant="outline" className="w-full gap-2">
                <Store size={16} />
                Voir commerçants
              </RippleButton>
            </Link>
            {hasAccess("can_create_payment") && (
              <Link href="/paiements/nouveau" className="flex-1 sm:flex-none">
                <RippleButton className="w-full gap-2">
                  <Plus size={16} />
                  Nouveau paiement
                </RippleButton>
              </Link>
            )}
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <KpiCards />
      </BlurFade>
      
      <BlurFade delay={0.3}>
        <div className="mt-8">
          <RecentPaiements />
        </div>
      </BlurFade>
    </div>
  );
}

