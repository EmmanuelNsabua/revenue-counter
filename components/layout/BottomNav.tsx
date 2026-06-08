"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, CreditCard, Settings } from "lucide-react";

const defaultNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Commerçants", href: "/commercants", icon: Store },
  { label: "Paiements", href: "/paiements", icon: CreditCard },
  { label: "Paramètres", href: "/parametres", icon: Settings },
];

interface BottomNavProps {
  navItems?: { label: string; href: string; icon: any }[];
}

export function BottomNav({ navItems = defaultNavItems }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`p-1.5 rounded-full ${isActive ? "bg-primary/10" : ""}`}>
                <item.icon size={20} />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
