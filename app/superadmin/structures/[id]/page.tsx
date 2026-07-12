"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function StructureDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Structure #{id}</h1>
        <p className="text-muted-foreground">
          Cette fonctionnalité est en cours de développement.
        </p>
      </div>

      <Link href="/superadmin/structures">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux structures
        </Button>
      </Link>
    </div>
  );
}
