import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * MIDDLEWARE DE PROTECTION DES ROUTES
 * Sécurise l'accès aux pages selon l'état d'authentification et le rôle.
 * S'exécute côté serveur (Edge Runtime) avant chaque requête.
 */
export default function proxy(request: NextRequest) {
  const token = request.cookies.get("revenue_token")?.value;
  const role = request.cookies.get("revenue_role")?.value;
  const { pathname } = request.nextUrl;

  /**
   * CAS 1 : UTILISATEUR NON CONNECTÉ
   * On redirige systématiquement vers / si on tente d'accéder à autre chose.
   */
  if (!token && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  /**
   * CAS 2 : UTILISATEUR DÉJÀ CONNECTÉ SUR LA PAGE DE LOGIN
   * On le renvoie sur son tableau de bord respectif.
   */
  if (token && pathname === "/") {
    if (role === "agent") return NextResponse.redirect(new URL("/dashboard", request.url));
    if (role?.startsWith("admin")) return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (role === "superadmin") return NextResponse.redirect(new URL("/superadmin/dashboard", request.url));
  }

  /**
   * CAS 3 : CONTRÔLE D'ACCÈS PAR RÔLE
   * Vérifie que l'utilisateur a le droit d'accéder au préfixe de route demandé.
   */
  if (token && role) {
    // Routes Agent (racine, /paiements, /commercants, /taxes, /profil)
    const isAgentRoute = 
      pathname === "/dashboard" || 
      pathname.startsWith("/paiements") || 
      pathname.startsWith("/commercants") || 
      pathname.startsWith("/taxes") || 
      pathname.startsWith("/profil");

    const isAdminRoute = pathname.startsWith("/admin");
    const isSuperAdminRoute = pathname.startsWith("/superadmin");

    // L'agent n'a accès qu'à ses routes propres
    if (role === "agent" && (isAdminRoute || isSuperAdminRoute)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // L'admin n'a pas accès au superadmin et ne doit pas errer sur les routes agent racines
    if (role.startsWith("admin") && (isSuperAdminRoute || isAgentRoute && !isAdminRoute)) {
       return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // Le superadmin est souverain mais on le maintient dans son périmètre /superadmin
    if (role === "superadmin" && (isAdminRoute || isAgentRoute && !isAdminRoute && !isSuperAdminRoute)) {
       return NextResponse.redirect(new URL("/superadmin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

/**
 * CONFIGURATION DU MATCHER
 * Définit les chemins sur lesquels le middleware doit s'appliquer.
 * On exclut les fichiers statiques, les images, le favicon et les routes API internes.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
