"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, Moon, Sun, Info, HelpCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import Image from "next/image";
import { useTheme } from "next-themes";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface FloatingNavProps {
  navItems: NavItem[];
}

export default function FloatingNav({ navItems }: FloatingNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!isMounted) return null;

  const displayUser = {
    name: user?.nom_complet || "Utilisateur",
    role: user?.grade || (
      user?.role === "agent" ? "Agent de recouvrement" : 
      user?.role?.startsWith("admin") ? "Administrateur" : 
      user?.role === "superadmin" ? "Direction Générale" : "Chargement..."
    ),
  };

  const rolePrefix = user?.role === 'agent' ? '' : user?.role === 'superadmin' ? '/superadmin' : '/admin';
  const supportRoute = user?.role === 'agent' ? '/assistance' : `${rolePrefix}/support`;

  return (
    <>
      {/* Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-blue-600 flex flex-col items-center justify-start pt-12 pb-6 px-6 md:hidden overflow-y-auto"
          >
            {/* User Profile & Top Actions */}
            <div className="w-full flex justify-between items-center mb-4 px-2 mt-4">
              <Link href={`${rolePrefix}/parametres`} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Settings size={22} className="text-white" />
              </Link>

              <div className="relative w-24 h-24 rounded-full overflow-hidden border-[3px] border-white/50 bg-white/20 shrink-0">
                {user?.avatar_url && !imgError ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={user.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                    {displayUser.name.charAt(0)}
                  </div>
                )}
              </div>

              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                {theme === 'dark' ? <Sun size={22} className="text-white" /> : <Moon size={22} className="text-white" />}
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-white text-2xl font-bold text-center">Bonjour, {displayUser.name.split(' ')[0]} !</h2>
              <p className="text-blue-200 text-sm mt-1">{displayUser.role}</p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-sm mb-10 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-full bg-blue-700/50 border border-blue-500 rounded-full py-3 pl-11 pr-4 text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-3 gap-y-8 gap-x-4 w-full max-w-sm mb-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-yellow-400 text-blue-900' : 'bg-transparent text-white border border-white/20 group-hover:bg-white/10'}`}>
                      <item.icon size={24} />
                    </div>
                    <span className={`text-[10px] text-center font-medium ${isActive ? 'text-white font-bold' : 'text-blue-100'}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Links */}
            <div className="w-full max-w-sm flex justify-start gap-6 mt-8">
              <Link href={supportRoute} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <HelpCircle size={18} />
                <span className="text-sm font-medium">Support</span>
              </Link>
              <Link href="/apropos" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Info size={18} />
                <span className="text-sm font-medium">À propos</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Constraints area for the FAB */}
      <div className="fixed inset-0 pointer-events-none md:hidden z-50 overflow-hidden" ref={containerRef}>
        {/* Draggable FAB */}
        <motion.div
          drag={!isOpen} // Disable drag when menu is open
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragMomentum={false}
          className="absolute bottom-6 right-6 pointer-events-auto"
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors focus:outline-none focus:ring-4 ${isOpen ? 'bg-white text-blue-600 focus:ring-white/50' : 'bg-primary text-primary-foreground focus:ring-primary/30 hover:scale-105'}`}
            style={{ zIndex: 51 }} // Above the overlay (40)
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }} // Rotate Plus into Cross
              transition={{ duration: 0.2 }}
            >
              <Plus size={28} />
            </motion.div>
          </button>
        </motion.div>
      </div>
    </>
  );
}
