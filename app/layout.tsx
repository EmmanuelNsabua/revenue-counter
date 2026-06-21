import type { Metadata } from "next";
import { Archivo, EB_Garamond } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Revenue Counter — Mairie de Lubumbashi",
    template: "%s | Revenue Counter",
  },
  description:
    "Application de gestion de recouvrement des taxes du marché de la Kenya, Lubumbashi, RDC.",
  keywords: ["taxes", "recouvrement", "Lubumbashi", "marché Kenya", "RDC"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Revenue Counter",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${archivo.variable} ${ebGaramond.variable} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

