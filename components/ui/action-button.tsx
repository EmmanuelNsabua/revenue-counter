"use client";

import { RippleButton } from "@/components/magicui/ripple-button";
import { toast } from "sonner";
import React from "react";

interface ActionButtonProps extends React.ComponentProps<typeof RippleButton> {
  toastMessage?: string;
  toastDescription?: string;
  children?: React.ReactNode;
}

export function ActionButton({ toastMessage, toastDescription, onClick, ...props }: ActionButtonProps) {
  return (
    <RippleButton 
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

