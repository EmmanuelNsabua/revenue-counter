"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { BottomNav } from "@/components/layout/BottomNav";
import {
  LayoutDashboard, Users, Receipt, Map, HelpCircle,
  Settings, Store, Shield, Banknote,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useGrade } from "@/hooks/use-grade";

const allAdminNavItems = [
  { label: "Vue d'ensemble", href: "/admin/dashboard", icon: LayoutDashboard, minGrade: 1 },
  { label: "Transactions",   href: "/admin/transactions", icon: Banknote,       minGrade: 1 },
  { label: "Agents",         href: "/admin/agents",       icon: Users,           minGrade: 1 },
  // Grade 3 does NOT see Administrateurs
  { label: "Administrateurs", href: "/admin/administrateurs", icon: Shield,      minGrade: 1, maxGrade: 2 },
  { label: "Commerçants",    href: "/admin/commercants",  icon: Store,           minGrade: 1 },
  { label: "Taxes",          href: "/admin/taxes",        icon: Receipt,         minGrade: 1 },
  // Grade 3 does NOT see Zones
  { label: "Zones",          href: "/admin/zones",        icon: Map,             minGrade: 1, maxGrade: 2 },
];

const adminBottomItems = [
  { label: "Support",     href: "/admin/support",     icon: HelpCircle },
  { label: "Paramètres",  href: "/admin/parametres",  icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { niveau, canManageStructure } = useGrade();

  const getRoleTitle = () => {
    if (!user) return "Chargement...";
    if (user.grade) return user.grade;
    if (user.institution) return `Administrateur ${user.institution}`;
    return "Administrateur";
  };

  // Filter nav items based on grade niveau
  const adminNavItems = allAdminNavItems.filter((item) => {
    const gradeNiveau = niveau ?? 1;
    if ((item as any).maxGrade && gradeNiveau > (item as any).maxGrade) return false;
    return true;
  }).map(({ minGrade, maxGrade, ...rest }: any) => rest);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      <div className="hidden md:block">
        <Sidebar navItems={adminNavItems} bottomItems={adminBottomItems} roleTitle={getRoleTitle()} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        <Topbar profilHref="/admin/profil" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      <BottomNav navItems={adminNavItems} />
    </div>
  );
}
