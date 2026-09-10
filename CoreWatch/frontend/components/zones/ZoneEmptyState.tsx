import React from "react";
import { Shield, Plus } from "lucide-react";

interface ZoneEmptyStateProps {
  onCreateClick: () => void;
  canManage: boolean;
}

export default function ZoneEmptyState({ onCreateClick, canManage }: ZoneEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-card/40 backdrop-blur-xs space-y-5">
      <div className="w-16 h-16 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center">
        <Shield className="w-8 h-8" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h3 className="text-sm font-bold text-foreground">No Security Zones Configured</h3>
        <p className="text-xs text-muted-foreground leading-normal">
          Security zones define restricted areas, cash counters, or high-value locations on a camera feed. 
          CoreWatch monitors these regions and triggers real-time alerts if safety or security policies are breached.
        </p>
      </div>

      {canManage && (
        <button
          onClick={onCreateClick}
          className="px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-[#FAF6EE] font-semibold text-xs tracking-wider transition-all duration-200 cursor-pointer shadow-md flex items-center gap-2 transform active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Create Security Zone</span>
        </button>
      )}
    </div>
  );
}
