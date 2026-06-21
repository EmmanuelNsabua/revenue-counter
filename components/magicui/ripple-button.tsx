"use client"

import React, { MouseEvent, useEffect, useState } from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface RippleButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  rippleColor?: string
  duration?: string
}

export const RippleButton = React.forwardRef<
  HTMLButtonElement,
  RippleButtonProps
>(
  (
    {
      className,
      children,
      rippleColor = "rgba(255, 255, 255, 0.35)",
      duration = "600ms",
      onClick,
      variant = "default",
      size = "default",
      ...props
    },
    ref
  ) => {
    const [buttonRipples, setButtonRipples] = useState<
      Array<{ x: number; y: number; size: number; key: number }>
    >([])

    // Ajustons la couleur du ripple par défaut selon le variant
    // Si c'est un bouton outline ou ghost, un ripple noir ou primaire est plus esthétique qu'un ripple blanc invisible
    const finalRippleColor = rippleColor === "rgba(255, 255, 255, 0.35)" && (variant === "outline" || variant === "ghost" || variant === "secondary")
      ? "rgba(15, 23, 42, 0.15)" // Couleur sombre translucide
      : rippleColor;

    const handleClick = (event: any) => {
      createRipple(event)
      onClick?.(event)
    }

    const createRipple = (event: any) => {
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2

      const newRipple = { x, y, size, key: Date.now() }
      setButtonRipples((prevRipples) => [...prevRipples, newRipple])
    }

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null

      if (buttonRipples.length > 0) {
        const lastRipple = buttonRipples[buttonRipples.length - 1]
        timeout = setTimeout(() => {
          setButtonRipples((prevRipples) =>
            prevRipples.filter((ripple) => ripple.key !== lastRipple.key)
          )
        }, parseInt(duration))
      }

      return () => {
        if (timeout !== null) {
          clearTimeout(timeout)
        }
      }
    }, [buttonRipples, duration])

    return (
      <ButtonPrimitive
        className={cn(
          buttonVariants({ variant, size }),
          "relative overflow-hidden cursor-pointer",
          className
        )}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        <span className="pointer-events-none absolute inset-0 block">
          {buttonRipples.map((ripple) => (
            <span
              className="animate-rippling absolute rounded-full opacity-100"
              key={ripple.key}
              style={
                {
                  width: `${ripple.size}px`,
                  height: `${ripple.size}px`,
                  top: `${ripple.y}px`,
                  left: `${ripple.x}px`,
                  backgroundColor: finalRippleColor,
                  transform: `scale(0)`,
                  "--duration": duration,
                } as React.CSSProperties
              }
            />
          ))}
        </span>
      </ButtonPrimitive>
    )
  }
)

RippleButton.displayName = "RippleButton"
