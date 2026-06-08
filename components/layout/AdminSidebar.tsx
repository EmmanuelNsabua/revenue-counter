"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Map,
  Settings,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import Logo from "@/components/ui/Logo";

const navItems = [
  { label: "Vue Globale", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Gestion Agents", href: "/admin/agents", icon: Users },
  { label: "Configuration Taxes", href: "/admin/taxes", icon: Receipt },
  { label: "Zonage & Secteurs", href: "/admin/zones", icon: Map },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
        <Logo />
      </div>

      <div className="mx-4 mt-4 mb-2 px-3 py-2 rounded-md bg-rdc-yellow/10 border border-rdc-yellow/20 flex items-center gap-2">
        <ShieldAlert size={14} className="text-yellow-600 flex-shrink-0" />
        <span className="text-xs font-semibold text-yellow-700 truncate">
          Espace Administrateur
        </span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }
              `}
            >
              <item.icon
                size={18}
                className={`flex-shrink-0 ${
                  isActive ? "text-sidebar-primary-foreground" : ""
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-4 border-t border-sidebar-border space-y-1">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent transition-all"
        >
          <Settings size={18} />
          <span>Paramètres Système</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rdc-red/80 hover:bg-rdc-red/10 hover:text-rdc-red transition-all">
          <LogOut size={18} />
          <span>Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
}
