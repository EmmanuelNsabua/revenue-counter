"use client";

import { Bell, Search, User, Calendar, LogOut, Settings, UserCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";
import { useNotifications } from "@/hooks/use-notifications";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  profilHref?: string;
}

export default function Topbar({
  profilHref = "/profil",
}: TopbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { data: notifications = [], markAsRead, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read_at).length;

  const today = new Date().toLocaleDateString("fr-CD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displayUser = {
    name: user?.nom || "Utilisateur",
    role: user?.role === "agent" ? "Agent de recouvrement" : 
          user?.role === "admin" ? "Administrateur Marché" : 
          user?.role === "superadmin" ? "Direction Générale" : "Chargement...",
  };

  return (
    <header className="relative h-16 flex items-center justify-between px-6 bg-card border-b border-border flex-shrink-0 gap-4">
      {/* Left section: Logo (mobile) or Date (desktop) */}
      <div className="min-w-0 flex items-center">
        {/* Mobile Logo */}
        <Link href="/dashboard" className="md:hidden flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-border">
            <Image src="/assets/logo_rdc.webp" alt="Logo" fill className="w-full h-full object-contain p-0.5 sm:p-1" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold leading-tight truncate">Revenue Counter</span>
            <span className="text-xs text-muted-foreground leading-tight truncate">Mairie de Lubumbashi</span>
          </div>
        </Link>
        
        {/* Desktop Date */}
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-foreground">
          <Calendar size={16} className="text-muted-foreground" />
          <span className="capitalize" suppressHydrationWarning>{today}</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

        {/* Search */}
        <button 
          type="button"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none cursor-pointer"
        >
          <Search size={20} className="pointer-events-none" />
        </button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none cursor-pointer">
            <Bell size={20} className="pointer-events-none" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rdc-red rounded-full ring-2 ring-card" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <div className="flex items-center justify-between px-2 py-1.5">
                <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <button 
                    onClick={(e) => { e.preventDefault(); markAllAsRead.mutate(); }}
                    className="text-xs text-primary hover:underline cursor-pointer"
                  >
                    Tout marquer lu
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">Aucune notification</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id}>
                      <DropdownMenuItem 
                        className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notif.read_at ? 'bg-muted/50' : ''}`}
                        onClick={() => {
                          if (!notif.read_at) markAsRead.mutate(notif.id);
                        }}
                      >
                        <div className="flex justify-between w-full">
                          <span className="font-semibold text-sm">{notif.title}</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {new Date(notif.created_at).toLocaleDateString("fr-CD")}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground line-clamp-2">{notif.content}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 ml-1 pl-2 sm:pl-3 border-l border-border hover:opacity-80 transition-opacity cursor-pointer outline-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center ring-2 ring-primary/20">
              <User size={18} className="text-primary-foreground pointer-events-none" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-foreground leading-tight">
                {displayUser.name}
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                {displayUser.role}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href={profilHref} className="cursor-pointer flex items-center" />}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Mon Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/parametres" className="cursor-pointer flex items-center" />}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => logout()}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Deployed Search Bar */}
      {isSearchOpen && (
        <div className="absolute top-16 left-0 w-full bg-card border-b border-border p-3 px-6 z-50 shadow-md animate-in slide-in-from-top-2">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              autoFocus
              placeholder="Rechercher dans l'application..." 
              className="w-full h-10 pl-9 bg-background"
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
