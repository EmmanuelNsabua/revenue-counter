"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Shield, Key, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function RBACPage() {
  const queryClient = useQueryClient();

  // Fetch roles and permissions
  const { data, isLoading, isError } = useQuery({
    queryKey: ["rbac_roles"],
    queryFn: async () => {
      const res = await api.get("/superadmin/roles");
      return res.data.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground animate-pulse">Chargement de la configuration RBAC...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center text-destructive">
        Erreur lors du chargement des droits. Vérifiez vos permissions de Super Administrateur.
      </div>
    );
  }

  const roles = data?.roles || [];
  const availablePermissions = data?.available_permissions || [];

  return (
    <div className="space-y-6 max-w-6xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <Shield className="text-primary size-8" />
            Droits et Accès (RBAC)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les permissions globales accordées à chaque grade du système.
          </p>
        </div>
      </BlurFade>

      {roles.length === 0 ? (
        <Card><CardContent className="p-8 text-center">Aucun rôle trouvé dans le système.</CardContent></Card>
      ) : (
        <Tabs defaultValue={roles[0]?.nom?.toLowerCase()} className="w-full">
          <TabsList className="mb-6 bg-muted/50 p-1 w-full flex-wrap h-auto justify-start shadow-sm">
            {roles.map((role: any) => (
              <TabsTrigger 
                key={role.id} 
                value={role.nom.toLowerCase()} 
                className="capitalize px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                Rôle: {role.nom}
              </TabsTrigger>
            ))}
          </TabsList>

          {roles.map((role: any) => (
            <TabsContent key={role.id} value={role.nom.toLowerCase()} className="space-y-6 outline-none">
              {role.grades?.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Aucun grade configuré pour ce rôle.
                  </CardContent>
                </Card>
              ) : (
                role.grades?.map((grade: any) => (
                  <GradePermissionEditor 
                    key={grade.id} 
                    grade={grade} 
                    availablePermissions={availablePermissions} 
                  />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

function GradePermissionEditor({ grade, availablePermissions }: { grade: any, availablePermissions: any[] }) {
  const queryClient = useQueryClient();
  
  // Local state for checked permissions (array of permission names)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    grade.permissions?.map((p: any) => p.nom) || []
  );

  const togglePermission = (permName: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permName) 
        ? prev.filter(p => p !== permName)
        : [...prev, permName]
    );
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.put(`/superadmin/grades/${grade.id}/permissions`, {
        permissions: selectedPermissions
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success(`Permissions du grade "${grade.nom}" mises à jour !`);
      queryClient.invalidateQueries({ queryKey: ["rbac_roles"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour des permissions.";
      toast.error(message);
    }
  });

  return (
    <BlurFade delay={0.2}>
      <Card className="border-t-[3px] border-t-primary shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Key className="text-primary size-5" />
              Grade: <span className="font-bold tracking-tight">{grade.nom}</span>
            </CardTitle>
            <CardDescription className="mt-1">
              Cochez les actions que ce grade est autorisé à effectuer.
            </CardDescription>
          </div>
          <button 
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 py-2 gap-2 shadow-sm"
          >
            {mutation.isPending ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}
            {mutation.isPending ? "Sauvegarde..." : "Sauvegarder les accès"}
          </button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4 pt-4 border-t">
            {availablePermissions.map((perm) => (
              <label 
                key={perm.id} 
                className="flex flex-row items-center space-x-3 rounded-lg border p-3 shadow-sm hover:bg-accent/30 cursor-pointer transition-colors"
              >
                <Switch 
                  checked={selectedPermissions.includes(perm.nom)}
                  onCheckedChange={() => togglePermission(perm.nom)}
                />
                <div className="space-y-0.5 leading-none overflow-hidden">
                  <p className="font-semibold text-sm truncate" title={perm.nom}>
                    {perm.nom.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider truncate">
                    Système
                  </p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </BlurFade>
  );
}
