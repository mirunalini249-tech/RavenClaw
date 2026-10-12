import React from 'react';
import {
  TrendingDown,
  Maximize2,
  CheckCircle2,
  Gauge,
  Navigation,
  IndianRupee
} from 'lucide-react';
import { OptimizationMetrics } from '../types';
import { formatINR, formatIndianNumber } from '../utils/formatters';

interface KPICardsProps {
  metrics: OptimizationMetrics;
  theme?: 'dark' | 'light';
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics, theme = 'light' }) => {
  const isDark = theme === 'dark';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* Card 1: Baseline Travel - Soft Slate/Pearl Pastel */}
      <div
        className={`rounded-2xl p-4.5 flex flex-col justify-between border transition-all ${
          isDark
            ? 'bg-[#1b1c2b] border-[#2d2e46] text-slate-100 hover:border-slate-600'
            : 'bg-white border-slate-200/90 text-slate-900 shadow-xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Baseline Travel
          </span>
          <div
            className={`p-2 rounded-xl ${
              isDark ? 'bg-[#27283d] text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
            aria-hidden="true"
          >
            <Navigation className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {formatIndianNumber(metrics.baselineDailyTravelMeters)}{' '}
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              m/day
            </span>
          </div>
          <div
            className={`text-xs mt-1.5 flex items-center justify-between font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <span>Avg pick path:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {metrics.baselineAveragePickDistanceM}m
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Optimized Daily Travel - Pastel Mint */}
      <div
        className={`rounded-2xl p-4.5 flex flex-col justify-between border transition-all relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-br from-[#122b22] to-[#14231d] border-emerald-500/40 text-emerald-200 shadow-sm'
            : 'bg-[#ECFDF5] border-[#A7F3D0] text-emerald-950 shadow-xs hover:border-[#6EE7B7]'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            Optimized Travel
          </span>
          <div
            className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60"
            aria-hidden="true"
          >
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black font-mono tracking-tight text-emerald-900 dark:text-emerald-300 flex items-baseline gap-1.5">
            {formatIndianNumber(metrics.optimizedDailyTravelMeters)}{' '}
            <span className="text-xs font-semibold">m/day</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-emerald-400/90' : 'text-emerald-800'}>Walking delta:</span>
            <span className="font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs shadow-xs">
              -{metrics.travelReductionPct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Labor Savings - Pastel Sky Blue (in Indian Rupees) */}
      <div
        className={`rounded-2xl p-4.5 flex flex-col justify-between border transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#0e2738] to-[#121f2d] border-sky-500/40 text-sky-200 shadow-sm'
            : 'bg-[#F0F9FF] border-[#BAE6FD] text-sky-950 shadow-xs hover:border-[#7DD3FC]'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
            Labor Savings (INR)
          </span>
          <div
            className="p-2 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300/60"
            aria-hidden="true"
          >
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black font-mono text-sky-900 dark:text-sky-300 tracking-tight flex items-baseline gap-1">
            {formatINR(metrics.dailyLaborSavingsINR)}
            <span className={`text-xs font-semibold ${isDark ? 'text-sky-300/80' : 'text-sky-700'}`}>
              /day
            </span>
          </div>
          <div
            className={`text-xs mt-1.5 flex items-center justify-between font-medium ${
              isDark ? 'text-sky-400/80' : 'text-sky-800'
            }`}
          >
            <span>Annual ({metrics.workerCount} pickers):</span>
            <span className="font-mono font-bold text-sky-950 dark:text-sky-200">
              {formatINR(metrics.annualLaborSavingsINR, true)}
            </span>
          </div>
        </div>
      </div>

      {/* Card 4: Usable Rack Volume Density - Pastel Buttercream */}
      <div
        className={`rounded-2xl p-4.5 flex flex-col justify-between border transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#2b2413] to-[#241c10] border-amber-500/40 text-amber-200 shadow-sm'
            : 'bg-[#FEFCE8] border-[#FEF08A] text-amber-950 shadow-xs hover:border-[#FDE047]'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
            Rack Density
          </span>
          <div
            className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300/60"
            aria-hidden="true"
          >
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black font-mono text-amber-950 dark:text-amber-300 tracking-tight flex items-baseline gap-1.5">
            {metrics.rackVolumeUtilizationPct.toFixed(1)}%
            <span className={`text-xs font-semibold ${isDark ? 'text-amber-300/80' : 'text-amber-800'}`}>
              occupied
            </span>
          </div>
          <div
            className={`text-xs mt-1.5 flex items-center justify-between font-medium ${
              isDark ? 'text-amber-400/80' : 'text-amber-800'
            }`}
          >
            <span>Vs 52% baseline:</span>
            <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">
              +{(metrics.rackVolumeUtilizationPct - metrics.baselineVolumeUtilizationPct).toFixed(1)}% density
            </span>
          </div>
        </div>
      </div>

      {/* Card 5: Picking Throughput - Pastel Lavender */}
      <div
        className={`rounded-2xl p-4.5 flex flex-col justify-between border transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#241a38] to-[#1c142e] border-purple-500/40 text-purple-200 shadow-sm'
            : 'bg-[#F5F3FF] border-[#DDD6FE] text-purple-950 shadow-xs hover:border-[#C4B5FD]'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
            Pick Rate Speed
          </span>
          <div
            className="p-2 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300/60"
            aria-hidden="true"
          >
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black font-mono text-purple-950 dark:text-purple-300 tracking-tight">
            {metrics.optimizedPPH}{' '}
            <span className={`text-xs font-semibold ${isDark ? 'text-purple-300/80' : 'text-purple-700'}`}>
              PPH
            </span>
          </div>
          <div
            className={`text-xs mt-1.5 flex items-center justify-between font-medium ${
              isDark ? 'text-purple-400/80' : 'text-purple-800'
            }`}
          >
            <span>Vs 71 PPH base:</span>
            <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">
              +{metrics.pphIncreasePct.toFixed(0)}% speed
            </span>
          </div>
        </div>
      </div>

      {/* Card 6: Feasibility Pass - Pastel Seafoam / Mint */}
      <div
        className={`rounded-2xl p-4.5 flex flex-col justify-between border transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#122b22] to-[#14231d] border-teal-500/40 text-teal-200 shadow-sm'
            : 'bg-[#F0FDF4] border-[#BBF7D0] text-teal-950 shadow-xs hover:border-[#86EFAC]'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300">
            Feasibility Pass
          </span>
          <div
            className="p-2 rounded-xl bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-300/60"
            aria-hidden="true"
          >
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black font-mono text-teal-950 dark:text-teal-300 tracking-tight">
            {metrics.feasibilityRatePct.toFixed(1)}%
          </div>
          <div
            className={`text-xs mt-1.5 flex items-center justify-between font-medium ${
              isDark ? 'text-teal-400/80' : 'text-teal-800'
            }`}
          >
            <span>Assigned:</span>
            <span className="font-mono font-bold">
              {metrics.assignedSKUs} / {metrics.totalSKUs}
              {metrics.overflowSKUs > 0 && (
                <span className="text-rose-600 font-bold ml-1">({metrics.overflowSKUs} overflow)</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
