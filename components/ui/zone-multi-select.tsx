"use client";

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface Zone {
  id: number;
  nom: string;
}

interface ZoneMultiSelectProps {
  zones: Zone[];
  selectedZoneIds: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
}

export function ZoneMultiSelect({ zones, selectedZoneIds, onChange, placeholder = "Sélectionner une zone..." }: ZoneMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedZones = zones.filter((z) => selectedZoneIds.includes(z.id));
  const availableZones = zones.filter((z) => !selectedZoneIds.includes(z.id));

  const toggleZone = (zoneId: number) => {
    if (selectedZoneIds.includes(zoneId)) {
      onChange(selectedZoneIds.filter((id) => id !== zoneId));
    } else {
      onChange([...selectedZoneIds, zoneId]);
    }
  };

  const removeZone = (e: React.MouseEvent, zoneId: number) => {
    e.stopPropagation();
    onChange(selectedZoneIds.filter((id) => id !== zoneId));
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input / Badge Display Area */}
      <div
        className="min-h-[42px] p-2 border border-border bg-background rounded-md cursor-pointer flex flex-wrap gap-2 items-center shadow-sm hover:border-primary/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedZones.length === 0 && (
          <span className="text-muted-foreground text-sm px-1">{placeholder}</span>
        )}
        
        {selectedZones.map((z) => (
          <div
            key={z.id}
            className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium border border-primary/20"
          >
            {z.nom}
            <button
              type="button"
              onClick={(e) => removeZone(e, z.id)}
              className="text-primary/70 hover:text-primary hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {availableZones.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">Aucune zone disponible</div>
          ) : (
            availableZones.map((z) => (
              <div
                key={z.id}
                className="px-3 py-2 text-sm hover:bg-muted cursor-pointer transition-colors"
                onClick={() => toggleZone(z.id)}
              >
                {z.nom}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
