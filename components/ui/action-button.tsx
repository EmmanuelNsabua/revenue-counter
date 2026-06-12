"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import React from "react";

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  toastMessage?: string;
  toastDescription?: string;
  children?: React.ReactNode;
}

export function ActionButton({ toastMessage, toastDescription, onClick, ...props }: ActionButtonProps) {
  return (
    <Button 
      onClick={(e) => {
        if (toastMessage) {
          toast(toastMessage, { description: toastDescription });
        }
        if (onClick) {
          onClick(e);
        }
      }} 
      {...props} 
    />
  );
}
