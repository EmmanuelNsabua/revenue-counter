"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Option {
  id: number;
  label: string;
}

interface MultiSelectFilterProps {
  options: Option[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectFilter({ 
  options, 
  selectedIds, 
  onChange, 
  placeholder = "Filtrer...",
  className
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleOption = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const displayText = selectedIds.length > 0 
    ? `${placeholder} (${selectedIds.length})` 
    : placeholder;

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-9 px-3 py-1 text-sm bg-background border border-input rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <span className={selectedIds.length > 0 ? "font-medium text-primary" : "text-muted-foreground"}>
          {displayText}
        </span>
        {selectedIds.length > 0 ? (
          <div 
            role="button"
            className="p-0.5 hover:bg-muted/50 rounded-full ml-2"
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
          >
            <X size={14} className="text-muted-foreground" />
          </div>
        ) : (
          <ChevronDown size={14} className="text-muted-foreground opacity-50 ml-2" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 min-w-[220px] mt-1 bg-popover text-popover-foreground border border-border rounded-md shadow-md z-50 overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto py-1">
            {options.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground text-center">Aucune option</div>
            ) : (
              options.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <div
                    key={option.id}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => toggleOption(option.id)}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-4 h-4 border rounded-sm",
                      isSelected ? "bg-primary border-primary text-primary-foreground" : "border-input bg-transparent"
                    )}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="truncate">{option.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
