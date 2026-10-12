import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle,
  XCircle,
  Sparkles
} from 'lucide-react';
import { CleanInventoryItem, WarehouseLocation } from '../types';

interface StepByStepSimulatorProps {
  inventory: CleanInventoryItem[];
  locations: WarehouseLocation[];
}

interface StepLog {
  sku: CleanInventoryItem;
  testedSlot: WarehouseLocation;
  lengthFits: boolean;
  widthFits: boolean;
  heightFits: boolean;
  volumeFits: boolean;
  isAvailable: boolean;
  accepted: boolean;
  reason: string;
}

export const StepByStepSimulator: React.FC<StepByStepSimulatorProps> = ({
  inventory,
  locations
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepLogs, setStepLogs] = useState<StepLog[]>([]);

  // Pre-generate steps
  useEffect(() => {
    const logs: StepLog[] = [];
    const locsCopy = locations.map((l) => ({
      ...l,
      Is_Occupied: false,
      Occupied_Volume_m3: 0
    }));

    const sortedInv = [...inventory].sort(
      (a, b) => b.Daily_Pick_Frequency - a.Daily_Pick_Frequency
    );
    const sortedLocs = [...locsCopy].sort(
      (a, b) => a.Distance_to_Dock_m - b.Distance_to_Dock_m
    );

    for (const prod of sortedInv) {
      let assigned = false;
      for (const slot of sortedLocs) {
        const lengthFits = prod.Length_cm <= slot.Length_cm;
        const widthFits = prod.Width_cm <= slot.Width_cm;
        const heightFits = prod.Height_cm <= slot.Height_cm;
        const remainingVol = slot.Max_Volume_m3 - (slot.Occupied_Volume_m3 || 0);
        const volumeFits = remainingVol >= prod.Unit_Volume_m3;
        const isAvailable = !slot.Is_Occupied;

        const accepted = lengthFits && widthFits && heightFits && volumeFits && isAvailable;

        logs.push({
          sku: prod,
          testedSlot: { ...slot },
          lengthFits,
          widthFits,
          heightFits,
          volumeFits,
          isAvailable,
          accepted,
          reason: accepted
            ? `Successfully assigned to ${slot.Location_ID} (${slot.Distance_to_Dock_m}m to gate).`
            : !isAvailable
            ? `Slot ${slot.Location_ID} already occupied by higher-velocity SKU.`
            : !lengthFits
            ? `Length overhang (${prod.Length_cm}cm > ${slot.Length_cm}cm).`
            : !widthFits
            ? `Width overhang (${prod.Width_cm}cm > ${slot.Width_cm}cm).`
            : !heightFits
            ? `Height overhang (${prod.Height_cm}cm > ${slot.Height_cm}cm).`
            : `Volume capacity exceeded (${prod.Unit_Volume_m3}m³ > ${remainingVol.toFixed(3)}m³).`
        });

        if (accepted) {
          slot.Is_Occupied = true;
          slot.Occupied_Volume_m3 = (slot.Occupied_Volume_m3 || 0) + prod.Unit_Volume_m3;
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        logs.push({
          sku: prod,
          testedSlot: {
            Location_ID: 'OVERFLOW',
            Zone: 'Holding Bay',
            Length_cm: 0,
            Width_cm: 0,
            Height_cm: 0,
            Max_Volume_m3: 0,
            Distance_to_Dock_m: 45,
            Accessibility_Score: 0
          },
          lengthFits: false,
          widthFits: false,
          heightFits: false,
          volumeFits: false,
          isAvailable: false,
          accepted: false,
          reason: 'No remaining rack met physical bounding dimensions or volumetric capacity. Routed to overflow staging.'
        });
      }
    }

    setStepLogs(logs);
    setCurrentStepIndex(0);
  }, [inventory, locations]);

  // Autoplay timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= stepLogs.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, stepLogs.length]);

  const activeLog = stepLogs[currentStepIndex];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-extrabold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" /> Step-by-Step Constraint Allocation Simulator
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Watch the greedy allocation algorithm evaluate SKUs against candidate rack bins in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl border bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
            title="Reset to beginning"
            aria-label="Reset simulation to first step"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play Simulation'}</span>
          </button>

          <button
            onClick={() =>
              setCurrentStepIndex((prev) => Math.min(stepLogs.length - 1, prev + 1))
            }
            disabled={currentStepIndex >= stepLogs.length - 1}
            className="min-h-[38px] flex items-center gap-1 px-3 py-1.5 rounded-xl border bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-800 dark:text-slate-200 text-xs font-bold border-slate-300 dark:border-slate-700"
          >
            <span>Next Step</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 ml-2">
            {currentStepIndex + 1} / {stepLogs.length}
          </span>
        </div>
      </div>

      {activeLog && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active SKU being placed */}
          <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Candidate SKU Under Test
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                {activeLog.sku.Demand_Zone}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-extrabold">
                    {activeLog.sku.Product_Name}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    ID: {activeLog.sku.Product_ID} • {activeLog.sku.Category}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {activeLog.sku.Daily_Pick_Frequency} picks/day
                  </div>
                  <div className="text-[11px] text-slate-500">Pick rank priority</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block font-medium">3D Dimensions</span>
                  <span className="font-mono font-black">
                    {activeLog.sku.Length_cm} × {activeLog.sku.Width_cm} × {activeLog.sku.Height_cm} cm
                  </span>
                </div>
                <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block font-medium">Unit Volume</span>
                  <span className="font-mono font-black text-teal-600 dark:text-cyan-400">
                    {activeLog.sku.Unit_Volume_m3.toFixed(4)} m³
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Slot & 5 Constraint Gates */}
          <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. Target Storage Slot: {activeLog.testedSlot.Location_ID}
              </span>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                {activeLog.testedSlot.Distance_to_Dock_m}m to gate
              </span>
            </div>

            {/* 5 Physical Inequality Gates */}
            <div className="space-y-2 text-xs font-medium">
              <div className="flex items-center justify-between p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">1. Length Bound (L_sku ≤ L_rack)</span>
                <span
                  className={`flex items-center gap-1 font-mono font-bold ${
                    activeLog.lengthFits ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                  }`}
                >
                  {activeLog.lengthFits ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {activeLog.sku.Length_cm}cm ≤ {activeLog.testedSlot.Length_cm}cm
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">2. Width Bound (W_sku ≤ W_rack)</span>
                <span
                  className={`flex items-center gap-1 font-mono font-bold ${
                    activeLog.widthFits ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                  }`}
                >
                  {activeLog.widthFits ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {activeLog.sku.Width_cm}cm ≤ {activeLog.testedSlot.Width_cm}cm
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">3. Height Bound (H_sku ≤ H_rack)</span>
                <span
                  className={`flex items-center gap-1 font-mono font-bold ${
                    activeLog.heightFits ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                  }`}
                >
                  {activeLog.heightFits ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {activeLog.sku.Height_cm}cm ≤ {activeLog.testedSlot.Height_cm}cm
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">4. Volumetric Capacity (V_rem ≥ V_sku)</span>
                <span
                  className={`flex items-center gap-1 font-mono font-bold ${
                    activeLog.volumeFits ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                  }`}
                >
                  {activeLog.volumeFits ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {activeLog.sku.Unit_Volume_m3}m³ ≤ {activeLog.testedSlot.Max_Volume_m3}m³
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">5. Slot Availability Check</span>
                <span
                  className={`flex items-center gap-1 font-mono font-bold ${
                    activeLog.isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                  }`}
                >
                  {activeLog.isAvailable ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {activeLog.isAvailable ? 'Empty / Available' : 'Occupied'}
                </span>
              </div>
            </div>

            {/* Verdict */}
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                activeLog.accepted
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/30 text-rose-900 dark:text-rose-300'
              }`}
            >
              <span className="font-extrabold block mb-0.5">
                {activeLog.accepted ? 'PLACEMENT APPROVED ✓' : 'REJECTED — TRY NEXT SLOT ✗'}
              </span>
              {activeLog.reason}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
