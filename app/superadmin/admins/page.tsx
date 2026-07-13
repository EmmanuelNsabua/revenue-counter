"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Shield, MoreVertical } from "lucide-react";
import { AdminActions } from "@/components/superadmin/AdminActions";
import { useAdmins } from "@/hooks/use-admins";
import { TableSkeleton } from "@/components/ui/skeletons";
import { EmptyAgents } from "@/components/ui/empty-state";
import { BlurFade } from "@/components/magicui/blur-fade";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuperAdminAdminsPage() {
  const { data: admins = [], isLoading } = useAdmins();

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Administrateurs</h1>
            <p className="text-sm text-muted-foreground mt-1">Gestion des droits et accès des superviseurs.</p>
          </div>
          <Link href="/superadmin/admins/create" className="w-full sm:w-auto">
            <Button className="gap-2 w-full h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90">
              <UserPlus size={18} />
              Créer un accès Admin
            </Button>
          </Link>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Rechercher par nom, matricule ou structure..." className="pl-10 h-12 text-base" />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        {isLoading ? (
          <TableSkeleton rows={3} cols={6} />
        ) : admins.length === 0 ? (
          <EmptyAgents />
        ) : (
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-primary/5 text-foreground text-xs uppercase font-bold tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-5">Matricule</th>
                    <th className="px-6 py-5">Administrateur</th>
                    <th className="px-6 py-5">Structure assignée</th>
                    <th className="px-6 py-5">Dernière connexion</th>
                    <th className="px-6 py-5">Statut</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-5 font-bold text-muted-foreground">{admin.identifiant}</td>
                      <td className="px-6 py-5 font-bold text-foreground flex items-center gap-2">
                        <Shield size={14} className="text-primary" />
                        {admin.nom_complet}
                      </td>
                      <td className="px-6 py-5">{admin.institution || "Non assigné"}</td>
                      <td className="px-6 py-5 text-muted-foreground">-</td>
                      <td className="px-6 py-5">
                        {admin.statut_actif ? (
                          <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200 border-0">Actif</Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-0">Suspendu</Badge>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <AdminActions admin={admin} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </BlurFade>
    </div>
  );
}
