"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  CreditCard,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Settings,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useState } from "react";

const defaultNavItems = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Commerçants",
    href: "/commercants",
    icon: Store,
  },
  {
    label: "Paiements",
    href: "/paiements",
    icon: CreditCard,
  },
  {
    label: "Taxes",
    href: "/taxes",
    icon: Receipt,
  },
];

const defaultBottomItems = [
  { label: "Assistance", href: "/assistance", icon: HelpCircle },
  { label: "Paramètres", href: "/parametres", icon: Settings },
];

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  navItems?: NavItem[];
  bottomItems?: NavItem[];
  roleTitle?: string;
}

export default function Sidebar({
  navItems = defaultNavItems,
  bottomItems = defaultBottomItems,
  roleTitle = "Agent de recouvrement"
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        relative flex flex-col h-full
        bg-sidebar text-sidebar-foreground
        border-r border-sidebar-border
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Header */}
      <div className={`flex items-center py-5 border-b border-sidebar-border ${collapsed ? "justify-center" : "justify-between px-4"}`}>
        <Logo collapsed={collapsed} />
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="mx-4 mt-4 mb-2 px-3 py-2 rounded-md bg-sidebar-accent/60 flex items-center gap-2">
          <ShieldCheck size={14} className="text-sidebar-primary flex-shrink-0" />
          <span className="text-xs text-sidebar-foreground/70 truncate">
            {roleTitle}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <item.icon
                size={18}
                className={`flex-shrink-0 ${
                  isActive ? "text-sidebar-primary-foreground" : ""
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary-foreground/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 py-4 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-sm font-medium text-sidebar-foreground/70
              hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
              transition-all duration-150
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <item.icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3 top-20
          w-6 h-6 rounded-full
          bg-sidebar-primary text-sidebar-primary-foreground
          flex items-center justify-center
          shadow-md hover:scale-110
          transition-transform duration-150 z-10
        "
        title={collapsed ? "Développer" : "Réduire"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
