import React from "react";
import { Plus, Power } from "lucide-react";
import { IZone } from "./types";

interface ZoneListProps {
  zones: IZone[];
  selectedZone: IZone | null;
  onSelectZone: (zone: IZone) => void;
  onToggleEnable: (zoneId: string, enabled: boolean) => void;
  onCreateClick: () => void;
  canManage: boolean;
}

const ZONE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  RESTRICTED: { label: "Restricted Area", color: "bg-red-500 text-red-500" },
  VALUABLE: { label: "Valuable Asset", color: "bg-blue-500 text-blue-500" },
  CASH_COUNTER: { label: "Cash Counter", color: "bg-amber-500 text-amber-500" },
  STORAGE: { label: "Storage Bay", color: "bg-purple-500 text-purple-500" },
  DOOR: { label: "Access Door", color: "bg-emerald-500 text-emerald-500" },
  CUSTOM: { label: "Custom Area", color: "bg-cyan-500 text-cyan-500" },
};

export default function ZoneList({
  zones,
  selectedZone,
  onSelectZone,
  onToggleEnable,
  onCreateClick,
  canManage,
}: ZoneListProps) {
  return (
    <div className="space-y-4 text-xs text-foreground flex flex-col h-full min-h-0">
      {/* Header with Draw button */}
      <div className="flex justify-between items-center pb-2 border-b border-border/40 shrink-0">
        <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
          Configured Zones ({zones.length})
        </span>
        {canManage && (
          <button
            onClick={onCreateClick}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-gold hover:bg-brand-gold-light text-[#FAF6EE] font-semibold tracking-wider text-[10px] transition-all cursor-pointer shadow-sm active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Draw Zone</span>
          </button>
        )}
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-1">
        {zones.map((zone) => {
          const isSelected = selectedZone?._id === zone._id;
          const typeStyle = ZONE_TYPE_LABELS[zone.type] || { label: zone.type, color: "bg-gray-500 text-gray-500" };
          
          return (
            <div
              key={zone._id}
              onClick={() => onSelectZone(zone)}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? "border-brand-gold bg-brand-gold/10 shadow-inner"
                  : "border-border bg-card/60 hover:bg-muted"
              } ${!zone.enabled ? "opacity-60" : ""}`}
            >
              {/* Left Color Pill & Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Visual Indicator Ring */}
                <div 
                  className={`w-2 h-2 rounded-full shrink-0 ${typeStyle.color.split(" ")[0]}`} 
                  title={typeStyle.label}
                />
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="font-bold text-foreground truncate uppercase">{zone.name}</div>
                  <div className="text-[9px] text-muted-foreground font-semibold flex items-center gap-1.5">
                    <span>{typeStyle.label}</span>
                    {zone.rules?.alertAfterSeconds && (
                      <>
                        <span className="text-border/40">•</span>
                        <span>{zone.rules.alertAfterSeconds}s Delay</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons (Toggles, rules details) */}
              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                {canManage ? (
                  <button
                    onClick={() => onToggleEnable(zone._id, !zone.enabled)}
                    title={zone.enabled ? "Deactivate Zone" : "Activate Zone"}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      zone.enabled
                        ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className={`px-2 py-0.5 rounded font-bold text-[8px] tracking-wide uppercase ${
                    zone.enabled ? "bg-emerald-500/15 text-emerald-500" : "bg-zinc-500/15 text-zinc-500"
                  }`}>
                    {zone.enabled ? "Active" : "Muted"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
