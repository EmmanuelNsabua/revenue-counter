import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export default function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-3 min-w-0 group ${className || ""}`.trim()}>
      {/* 1. Bloc-Armoiries */}
      <div className="relative flex-shrink-0 w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center p-1 ring-1 ring-border/50 group-hover:ring-primary/30 transition-all overflow-hidden">
        <Image
          src="/assets/logo-mairie-lubumbashi.png"
          alt="Mairie de Lubumbashi"
          width={40}
          height={40}
          className="object-contain"
          priority
        />
      </div>
      {!collapsed && (
        <>
          {/* 2. Intitulé Officiel */}
          <div className="min-w-0 overflow-hidden flex flex-col justify-center">
            <p className="text-current font-black text-[11px] tracking-tighter leading-none uppercase truncate font-sans">
              MAIRIE DE LUBUMBASHI
            </p>
            <p className="text-current opacity-70 font-medium text-[10px] leading-tight mt-1 truncate uppercase">
              REVENUE COUNTER
            </p>
          </div>
        </>
      )}
    </Link>
  );
}

