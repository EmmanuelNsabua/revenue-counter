"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { LayoutDashboard, Users, Receipt, Map, HelpCircle, Settings, Store, Shield, Banknote } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

const adminNavItems = [
  { label: "Vue d'ensemble", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/admin/transactions", icon: Banknote },
  { label: "Agents", href: "/admin/agents", icon: Users },
  { label: "Administrateurs", href: "/admin/administrateurs", icon: Shield },
  { label: "Commerçants", href: "/admin/commercants", icon: Store },
  { label: "Taxes", href: "/admin/taxes", icon: Receipt },
  { label: "Zones", href: "/admin/zones", icon: Map },
];

const adminBottomItems = [
  { label: "Support", href: "/admin/support", icon: HelpCircle },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const getRoleTitle = () => {
    if (!user) return "Chargement...";
    if (user.grade) return user.grade;
    if (user.institution) return `Administrateur ${user.institution}`;
    return "Administrateur";
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      <div className="hidden md:block">
        <Sidebar navItems={adminNavItems} bottomItems={adminBottomItems} roleTitle={getRoleTitle()} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        <Topbar 
          profilHref="/admin/profil" 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      <BottomNav navItems={adminNavItems} />
    </div>
  );
}
