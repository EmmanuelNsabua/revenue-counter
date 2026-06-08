"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";

interface ActionButtonProps extends ButtonProps {
  toastMessage?: string;
  toastDescription?: string;
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
