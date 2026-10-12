import React, { useState } from 'react';
import {
  Warehouse,
  Box,
  Truck,
  CheckCircle,
  AlertTriangle,
  Info,
  Route,
  Layers,
  ArrowRight
} from 'lucide-react';
import { WarehouseLocation, SlottingAssignment } from '../types';
import { getGoodsTypeInfo } from '../data/goodsTypes';

interface WarehouseFloorPlanProps {
  locations: WarehouseLocation[];
  assignments: SlottingAssignment[];
  travelReductionPct: number;
  theme?: 'dark' | 'light';
}

export const WarehouseFloorPlan: React.FC<WarehouseFloorPlanProps> = ({
  locations,
  assignments,
  travelReductionPct,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>('A01');
  const [showPathsMode, setShowPathsMode] = useState<'optimized' | 'baseline' | 'both'>('optimized');
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

  // Group locations by Zone
  const zoneA = locations.filter((l) => l.Zone.includes('Zone_A'));
  const zoneB = locations.filter((l) => l.Zone.includes('Zone_B'));
  const zoneC = locations.filter((l) => l.Zone.includes('Zone_C'));

  const overflowItems = assignments.filter((a) => a.Allocation_Status === 'OVERFLOW');

  const selectedLoc = locations.find((l) => l.Location_ID === selectedLocationId);
  const selectedAssignment = assignments.find((a) => a.Optimized_Location === selectedLocationId);

  const getZoneBadgeColor = (zone: string) => {
    if (zone.includes('Zone_A')) {
      return isDark
        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
        : 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]';
    }
    if (zone.includes('Zone_B')) {
      return isDark
        ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
        : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    }
    return isDark
      ? 'bg-purple-950/80 text-purple-300 border-purple-700/60'
      : 'bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]';
  };

  const getRackCardBg = (loc: WarehouseLocation, isSelected: boolean) => {
    if (isSelected) {
      return isDark
        ? 'bg-[#292942] border-indigo-400 ring-2 ring-indigo-400/40'
        : 'bg-white border-indigo-400 ring-2 ring-indigo-300/60 shadow-md';
    }
    if (loc.Zone.includes('Zone_A')) {
      return isDark
        ? 'bg-[#14261f] border-emerald-800/60 hover:border-emerald-600'
        : 'bg-[#F2FCF7] border-[#BBF7D0] hover:border-emerald-400';
    }
    if (loc.Zone.includes('Zone_B')) {
      return isDark
        ? 'bg-[#282114] border-amber-800/60 hover:border-amber-600'
        : 'bg-[#FFFDF5] border-[#FDE68A] hover:border-amber-400';
    }
    return isDark
      ? 'bg-[#221c33] border-purple-800/60 hover:border-purple-600'
      : 'bg-[#FAF8FF] border-[#E9D5FF] hover:border-purple-400';
  };

  const renderRackCard = (loc: WarehouseLocation) => {
    const assignment = assignments.find((a) => a.Optimized_Location === loc.Location_ID);
    const isSelected = selectedLocationId === loc.Location_ID;
    const volPct = Math.min(
      100,
      Math.round(((loc.Occupied_Volume_m3 || 0) / loc.Max_Volume_m3) * 100)
    );

    return (
      <div
        key={loc.Location_ID}
        onClick={() => setSelectedLocationId(loc.Location_ID)}
        onMouseEnter={() => setHoveredLocationId(loc.Location_ID)}
        onMouseLeave={() => setHoveredLocationId(null)}
        role="button"
        tabIndex={0}
        aria-label={`Storage rack ${loc.Location_ID}, distance ${loc.Distance_to_Dock_m} meters`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setSelectedLocationId(loc.Location_ID);
          }
        }}
        className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${getRackCardBg(
          loc,
          isSelected
        )}`}
      >
        {/* Rack Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className={`font-mono text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {loc.Location_ID}
            </span>
            <span className={`text-xs font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              ({loc.Distance_to_Dock_m}m)
            </span>
          </div>
          <span
            className={`text-[11px] uppercase font-bold px-2 py-0.5 rounded-md border ${getZoneBadgeColor(
              loc.Zone
            )}`}
          >
            {loc.Zone.replace('_Near_Dock', '').replace('_Mid_Aisle', '').replace('_Deep_Rack', '')}
          </span>
        </div>

        {/* Assigned Product / Empty */}
        {assignment ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div className={`text-xs font-bold truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {assignment.Product_Name}
              </div>
            </div>
            <div className={`flex items-center justify-between text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{assignment.Product_ID}</span>
              <span className="font-mono">
                {assignment.Pick_Frequency} picks/day
              </span>
            </div>

            {/* Volume Fill Bar */}
            <div className="pt-1">
              <div className={`flex justify-between text-[11px] font-mono mb-1 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>Vol: {volPct}%</span>
                <span>
                  {loc.Occupied_Volume_m3?.toFixed(3)} / {loc.Max_Volume_m3}m³
                </span>
              </div>
              <div
                className={`w-full h-2 rounded-full overflow-hidden border ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-white/80 border-slate-200'
                }`}
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    volPct > 80 ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                  }`}
                  style={{ width: `${Math.max(6, volPct)}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={`py-3 text-center text-xs italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Empty Slot
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 2D Digital Floor Plan Map (Col span 2) */}
      <div
        className={`lg:col-span-2 rounded-2xl p-5 space-y-5 border transition-colors ${
          isDark
            ? 'bg-[#1c1c2b] border-[#2f2f45] text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        {/* Floorplan Controls & Legend */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b ${
            isDark ? 'border-[#2f2f45]' : 'border-[#E5E9F2]'
          }`}
        >
          <div>
            <h2 className="text-base font-extrabold flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Facility Grid: DC-01 Ground Floor
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              High-velocity SKUs clustered adjacent to Shipping Docks (reduces walking by {travelReductionPct.toFixed(0)}%)
            </p>
          </div>

          {/* Path Mode Selector */}
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border text-xs font-semibold ${
              isDark ? 'bg-[#151522] border-[#2f2f45]' : 'bg-[#F5F7FC] border-[#E2E6F0]'
            }`}
          >
            <Route className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => setShowPathsMode('optimized')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                showPathsMode === 'optimized'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Optimized Flow
            </button>
            <button
              onClick={() => setShowPathsMode('baseline')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                showPathsMode === 'baseline'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Baseline Flow
            </button>
            <button
              onClick={() => setShowPathsMode('both')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                showPathsMode === 'both'
                  ? isDark
                    ? 'bg-indigo-950 text-indigo-300'
                    : 'bg-indigo-100 text-indigo-900 font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Both
            </button>
          </div>
        </div>

        {/* Spatial Floorplan Visualizer */}
        <div
          className={`rounded-2xl p-5 relative overflow-hidden border ${
            isDark
              ? 'bg-[#161624] border-[#2f2f45]'
              : 'bg-[#FAFBFD] border-[#E8ECF5]'
          }`}
        >
          {/* Zone C (Deep Rack: 45m - 55m) */}
          <div className="mb-6 relative">
            <div className="flex items-center justify-between text-xs font-bold mb-2.5 px-1">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#A78BFA]"></span>
                <span className={isDark ? 'text-purple-300' : 'text-purple-950'}>
                  Zone C — Deep Storage Aisles (45m – 55m)
                </span>
              </span>
              <span className={`text-[11px] font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Slow Movers & Bulk Racks
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {zoneC.map(renderRackCard)}
            </div>
          </div>

          {/* Central Transit Corridor */}
          <div
            className={`my-5 py-2.5 text-center text-xs font-mono font-bold tracking-widest uppercase border-y border-dashed ${
              isDark
                ? 'border-indigo-900/60 text-indigo-300/80 bg-indigo-950/20'
                : 'border-indigo-200 text-indigo-700 bg-[#F5F3FF]/50'
            }`}
          >
            ↕ Main Forklift Transit Corridor & Cross-Aisle ↕
          </div>

          {/* Zone B (Mid Aisle: 20m - 32m) */}
          <div className="mb-6 relative">
            <div className="flex items-center justify-between text-xs font-bold mb-2.5 px-1">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FB923C]"></span>
                <span className={isDark ? 'text-amber-300' : 'text-amber-950'}>
                  Zone B — Mid Aisles (20m – 32m)
                </span>
              </span>
              <span className={`text-[11px] font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Medium-Velocity SKUs
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {zoneB.map(renderRackCard)}
            </div>
          </div>

          {/* Zone A (Near Dock: 5m - 12m) */}
          <div className="mb-6 relative">
            <div className="flex items-center justify-between text-xs font-bold mb-2.5 px-1">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#34D399]"></span>
                <span className="text-emerald-800 dark:text-emerald-300">
                  Zone A — Dock-Adjacent Prime Slots (5m – 12m)
                </span>
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                High Velocity Pick Cluster
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {zoneA.map(renderRackCard)}
            </div>
          </div>

          {/* Dispatch Gate (Pastel Sky Blue) */}
          <div
            className={`mt-6 pt-4 p-3.5 rounded-xl border-t-2 border-sky-400 flex items-center justify-between ${
              isDark
                ? 'bg-gradient-to-t from-sky-950/30 to-[#1e1e30] text-slate-100'
                : 'bg-gradient-to-t from-[#E0F2FE] to-[#F0F9FF] text-sky-950 border border-sky-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-200/80 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider block">
                  Dispatch Dock & Shipping Gate (0.0 Meters)
                </span>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-sky-800/80'}`}>
                  Consolidation station & outbound conveyor
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-sky-800 dark:text-sky-300 block">
                Travel Origin Point
              </span>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-sky-700'}`}>
                Zero walking baseline
              </p>
            </div>
          </div>
        </div>

        {/* Overflow Staging Alert (Pastel Rose) */}
        {overflowItems.length > 0 && (
          <div
            className={`rounded-2xl p-4 flex items-start gap-3 border ${
              isDark
                ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                : 'bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]'
            }`}
          >
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold">
                {overflowItems.length} SKU(s) routed to Overflow Staging Bay:
              </span>
              <p className="font-mono">
                {overflowItems.map((o) => `${o.Product_ID} (${o.Product_Name})`).join(', ')}
              </p>
              <p className="text-[11px] opacity-80">
                Reason: Physical bounding dimensions exceed rack limits or volume capacity is depleted.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Rack & SKU Inspection Inspector Panel (Col span 1) */}
      <div
        className={`rounded-2xl p-5 flex flex-col justify-between space-y-4 border transition-colors ${
          isDark
            ? 'bg-[#1c1c2b] border-[#2f2f45] text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div>
          <div
            className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-[#2f2f45]' : 'border-[#E5E9F2]'
            }`}
          >
            <h3 className="text-sm font-extrabold flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Slot Details & Checks
            </h3>
            <span className={`text-xs font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {selectedLocationId ? `Rack ${selectedLocationId}` : 'Select a Slot'}
            </span>
          </div>

          {selectedLoc ? (
            <div className="mt-4 space-y-4">
              {/* Location Specification Card */}
              <div
                className={`p-3.5 rounded-2xl border space-y-2.5 ${
                  isDark
                    ? 'bg-[#151522] border-[#2f2f45]'
                    : 'bg-[#F9FAFD] border-[#E8ECF5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black">
                    {selectedLoc.Location_ID}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getZoneBadgeColor(
                      selectedLoc.Zone
                    )}`}
                  >
                    {selectedLoc.Zone}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    className={`p-2 rounded-xl border ${
                      isDark
                        ? 'bg-[#1f1f30] border-[#363650]'
                        : 'bg-white border-[#E2E6F0]'
                    }`}
                  >
                    <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Distance to Gate
                    </span>
                    <span className="font-mono font-black text-emerald-700 dark:text-emerald-300 text-sm">
                      {selectedLoc.Distance_to_Dock_m} meters
                    </span>
                  </div>
                  <div
                    className={`p-2 rounded-xl border ${
                      isDark
                        ? 'bg-[#1f1f30] border-[#363650]'
                        : 'bg-white border-[#E2E6F0]'
                    }`}
                  >
                    <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Max Bin Volume
                    </span>
                    <span className="font-mono font-black text-sky-700 dark:text-sky-300 text-sm">
                      {selectedLoc.Max_Volume_m3} m³
                    </span>
                  </div>
                </div>

                <div className="text-xs pt-1">
                  <span className={`block text-[11px] uppercase font-bold mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Physical Rack Dimensions (L × W × H)
                  </span>
                  <span className="font-mono font-bold">
                    {selectedLoc.Length_cm} cm × {selectedLoc.Width_cm} cm × {selectedLoc.Height_cm} cm
                  </span>
                </div>
              </div>

              {/* Assigned SKU Inspection Card */}
              {selectedAssignment ? (
                <div
                  className={`p-3.5 rounded-2xl border space-y-3 ${
                    isDark
                      ? 'bg-[#151522] border-[#2f2f45]'
                      : 'bg-[#F9FAFD] border-[#E8ECF5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Assigned Item
                    </span>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                      {selectedAssignment.Demand_Zone}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black">
                      {selectedAssignment.Product_Name}
                    </h4>
                    {(() => {
                      const typeInfo = getGoodsTypeInfo(selectedAssignment.Category);
                      return (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                            ID: {selectedAssignment.Product_ID}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeInfo.pastelBadge.bg} ${typeInfo.pastelBadge.text} ${typeInfo.pastelBadge.border}`}>
                            {selectedAssignment.Category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {typeInfo.handlingRequirement}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Pick Velocity & Distance Savings */}
                  <div
                    className={`p-2.5 rounded-xl border space-y-2 ${
                      isDark
                        ? 'bg-[#1f1f30] border-[#363650]'
                        : 'bg-white border-[#E2E6F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        Daily Pick Frequency:
                      </span>
                      <span className="font-mono font-bold">
                        {selectedAssignment.Pick_Frequency} picks/day
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        Relocation Path:
                      </span>
                      <div className="flex items-center gap-1 font-mono text-xs">
                        <span className="text-rose-500 line-through">
                          {selectedAssignment.Baseline_Location} ({selectedAssignment.Baseline_Distance_m}m)
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                          {selectedAssignment.Optimized_Location} ({selectedAssignment.Optimized_Distance_m}m)
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-between text-xs pt-1 border-t ${
                        isDark ? 'border-slate-800' : 'border-slate-100'
                      }`}
                    >
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                        Distance Saved per Pick:
                      </span>
                      <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-300">
                        +{selectedAssignment.Distance_Saved_m} meters
                      </span>
                    </div>
                  </div>

                  {/* 3D Bounding Box Feasibility Checklist */}
                  <div className="space-y-1.5 pt-1">
                    <span className={`text-[11px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      3D Physical Boundary Checks
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Length: {selectedAssignment.Dimensions.length} ≤ {selectedLoc.Length_cm}cm</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Width: {selectedAssignment.Dimensions.width} ≤ {selectedLoc.Width_cm}cm</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Height: {selectedAssignment.Dimensions.height} ≤ {selectedLoc.Height_cm}cm</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Vol: {selectedAssignment.Dimensions.volume} ≤ {selectedLoc.Max_Volume_m3}m³</span>
                      </div>
                    </div>
                  </div>

                  {/* Explainable Reasoning */}
                  <div
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      isDark
                        ? 'bg-[#1f1f30] border-[#363650] text-slate-300'
                        : 'bg-white border-[#E2E6F0] text-slate-700'
                    }`}
                  >
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                      Optimization Rationale:
                    </span>
                    {selectedAssignment.Reasoning}
                  </div>
                </div>
              ) : (
                <div
                  className={`p-6 text-center text-xs rounded-xl border ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  This storage slot is currently unassigned.
                </div>
              )}
            </div>
          ) : (
            <div className={`mt-12 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Click any rack slot on the facility floorplan to inspect dimensions and slotting rationale.
            </div>
          )}
        </div>

        {/* Strategy Note (Pastel Lavender) */}
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
            isDark
              ? 'bg-[#221c33] border-purple-800/40 text-purple-200'
              : 'bg-[#F5F3FF] border-[#DDD6FE] text-[#5B21B6]'
          }`}
        >
          <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Pick Path Logic:</strong> In conventional layouts, workers walk 10–15 miles/shift because fast movers are stuck in Zone C. Clustering them into Zone A turns 57% of travel time into productive pick cycles.
          </span>
        </div>
      </div>
    </div>
  );
};
