"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import FloatingNav from "@/components/layout/FloatingNav";
import { LayoutDashboard, Building2, Shield, Sliders, HelpCircle, Settings, Store, Banknote, Users } from "lucide-react";

const superAdminNavItems = [
  { label: "Pilotage Global", href: "/superadmin/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/superadmin/transactions", icon: Banknote },
  { label: "Agents", href: "/superadmin/agents", icon: Users },
  { label: "Structures", href: "/superadmin/structures", icon: Building2 },
  { label: "Commerçants", href: "/superadmin/commercants", icon: Store },
  { label: "Administrateurs", href: "/superadmin/admins", icon: Shield },
  { label: "Configuration", href: "/superadmin/configuration", icon: Sliders },
];

const superAdminBottomItems = [
  { label: "Support", href: "/superadmin/support", icon: HelpCircle },
  { label: "Paramètres", href: "/superadmin/parametres", icon: Settings },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      <div className="hidden md:block">
        <Sidebar navItems={superAdminNavItems} bottomItems={superAdminBottomItems} roleTitle="Direction Générale" />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:pb-0">
        <Topbar 
          profilHref="/superadmin/profil" 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      <FloatingNav navItems={superAdminNavItems} />
    </div>
  );
}
