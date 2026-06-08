import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  collapsed?: boolean;
}

export default function Logo({ collapsed = false }: LogoProps) {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
      <div className="relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-white ring-2 ring-sidebar-primary/30">
        <Image
          src="/assets/logo.png"
          alt="Logo Mairie de Lubumbashi"
          fill
          sizes="40px"
          className="object-contain p-1"
          priority
        />
      </div>
      {!collapsed && (
        <div className="min-w-0 overflow-hidden">
          <p className="text-sidebar-primary font-bold text-sm leading-tight truncate">
            Revenue Counter
          </p>
          <p className="text-sidebar-foreground/60 text-xs leading-tight truncate">
            Mairie de Lubumbashi
          </p>
        </div>
      )}
    </Link>
  );
}
