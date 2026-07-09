"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import FloatingNav from "@/components/layout/FloatingNav";
import {
  LayoutDashboard, Users, Receipt, Map, HelpCircle,
  Settings, Store, Shield, Banknote,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useAccess } from "@/contexts/PermissionContext";
import { useGrade } from "@/hooks/use-grade";

const allAdminNavItems = [
  { label: "Vue d'ensemble", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Transactions",   href: "/admin/transactions", icon: Banknote },
  { label: "Agents",         href: "/admin/agents",       icon: Users },
  { label: "Administrateurs", href: "/admin/administrateurs", icon: Shield, requirePermission: "can_modify_admins" },
  { label: "Commerçants",    href: "/admin/commercants",  icon: Store },
  { label: "Taxes",          href: "/admin/taxes",        icon: Receipt },
  { label: "Zones",          href: "/admin/zones",        icon: Map, requirePermission: "can_modify_areas" },
];

const adminBottomItems = [
  { label: "Support",     href: "/admin/support",     icon: HelpCircle },
  { label: "Paramètres",  href: "/admin/parametres",  icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { niveau, canManageStructure } = useGrade();
  const { hasAccess } = useAccess();

  const getRoleTitle = () => {
    if (!user) return "Chargement...";
    if (user.grade) return user.grade;
    if (user.institution) return `Administrateur ${user.institution}`;
    return "Administrateur";
  };

  // Filter nav items based on permissions
  const adminNavItems = allAdminNavItems.filter((item) => {
    if ((item as any).requirePermission) {
      // Pour être sûr, pendant le chargement initial si les perms ne sont pas là on cache, ou si le user est grade 1 (niveau 1) il a tout.
      if (niveau === 1) return true; 
      return hasAccess((item as any).requirePermission);
    }
    return true;
  }).map(({ requirePermission, ...rest }: any) => rest);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      <div className="hidden md:block">
        <Sidebar navItems={adminNavItems} bottomItems={adminBottomItems} roleTitle={getRoleTitle()} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:pb-0">
        <Topbar profilHref="/admin/profil" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      <FloatingNav navItems={adminNavItems} />
    </div>
  );
}
