"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "checked" | "defaultChecked"> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onCheckedChange, disabled, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(event.target.checked)
      onChange?.(event)
    }

    return (
      <label className={cn("relative inline-flex items-center", disabled && "cursor-not-allowed opacity-50")}> 
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          className="peer sr-only"
          {...props}
        />
        <span
          className={cn(
            "flex h-4.5 w-4.5 items-center justify-center rounded-sm border border-input bg-background transition-colors",
            "peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            className
          )}
        >
          <Check className={cn("h-3.5 w-3.5 text-primary-foreground transition-opacity", checked ? "opacity-100" : "opacity-0")} />
        </span>
      </label>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
