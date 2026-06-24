"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type PermissionContextType = {
  permissions: Record<string, boolean>;
  hasAccess: (featureName: string) => boolean;
  setPermissions: (permissions: Record<string, boolean>) => void;
};

const PermissionContext = createContext<PermissionContextType>({
  permissions: {},
  hasAccess: () => false,
  setPermissions: () => {},
});

export const useAccess = () => useContext(PermissionContext);

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const [permissions, setPermissionsState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialiser les permissions depuis le localStorage si elles existent
    const storedPermissions = localStorage.getItem("user_permissions");
    if (storedPermissions) {
      try {
        setPermissionsState(JSON.parse(storedPermissions));
      } catch (e) {
        console.error("Erreur de parsing des permissions", e);
      }
    }
  }, []);

  const setPermissions = (newPermissions: Record<string, boolean>) => {
    setPermissionsState(newPermissions);
    localStorage.setItem("user_permissions", JSON.stringify(newPermissions));
  };

  const hasAccess = (featureName: string): boolean => {
    return !!permissions[featureName];
  };

  return (
    <PermissionContext.Provider value={{ permissions, hasAccess, setPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
}
