import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AproposPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">À propos</h1>
          <p className="text-muted-foreground">
            Revenue Counter - Système de gestion des taxes
          </p>
        </div>
        
        <div className="bg-card border rounded-lg p-6 text-left space-y-4 shadow-sm">
          <p className="text-sm">
            <strong>Version:</strong> 1.0.0
          </p>
          <p className="text-sm">
            Cette application permet le suivi et la gestion des recouvrements journaliers.
          </p>
        </div>

        <Link href="/">
          <Button variant="outline" className="w-full mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        </Link>
      </div>
    </div>
  );
}
