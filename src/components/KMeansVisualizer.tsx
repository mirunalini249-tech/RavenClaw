import React from 'react';
import { Cpu, Layers, Sparkles, Activity, CheckCircle } from 'lucide-react';
import { CleanInventoryItem, KMeansClusterData } from '../types';

interface KMeansVisualizerProps {
  items: CleanInventoryItem[];
  clusters: KMeansClusterData[];
  iterationsRun: number;
}

export const KMeansVisualizer: React.FC<KMeansVisualizerProps> = ({
  items,
  clusters,
  iterationsRun
}) => {
  // Find ranges for plotting
  const maxDemand = Math.max(...items.map((i) => i.Daily_Demand_Units), 320);
  const maxPickFreq = Math.max(...items.map((i) => i.Daily_Pick_Frequency), 120);

  const plotWidth = 600;
  const plotHeight = 320;
  const padding = 55;

  const scaleX = (val: number) => padding + (val / maxDemand) * (plotWidth - padding * 2);
  const scaleY = (val: number) =>
    plotHeight - padding - (val / maxPickFreq) * (plotHeight - padding * 2);

  const getClusterColor = (zone?: string) => {
    switch (zone) {
      case 'Zone_A':
        return '#10B981'; // Pastel Mint
      case 'Zone_B':
        return '#F59E0B'; // Pastel Apricot
      default:
        return '#8B5CF6'; // Pastel Lavender
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-extrabold flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" /> K-Means Unsupervised Demand Stratification
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Dynamic clustering across Pick Frequency and Daily Demand dimensions. Stratifies inventory into ABC velocity tiers without arbitrary manual thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span className="text-slate-500 dark:text-slate-400 font-medium">Convergence:</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">{iterationsRun} iterations</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Tiers:</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">k=3 Clusters</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scatter Plot Visualizer (Col span 2) */}
        <div className="lg:col-span-2 rounded-2xl p-5 space-y-4 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" /> 2D Feature Space: Pick Frequency vs Demand Units
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              N = {items.length} SKUs plotted
            </span>
          </div>

          {/* SVG Plot */}
          <div className="rounded-xl p-4 overflow-x-auto border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <svg
              viewBox={`0 0 ${plotWidth} ${plotHeight}`}
              className="w-full h-auto min-w-[500px]"
              role="img"
              aria-label="K-Means scatter plot showing Pick Frequency on the Y axis and Daily Demand on the X axis"
            >
              {/* Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((pct) => (
                <g key={pct}>
                  <line
                    x1={padding}
                    y1={plotHeight - padding - pct * (plotHeight - padding * 2)}
                    x2={plotWidth - padding}
                    y2={plotHeight - padding - pct * (plotHeight - padding * 2)}
                    stroke="currentColor"
                    className="text-slate-300 dark:text-slate-800"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <line
                    x1={padding + pct * (plotWidth - padding * 2)}
                    y1={padding}
                    x2={padding + pct * (plotWidth - padding * 2)}
                    y2={plotHeight - padding}
                    stroke="currentColor"
                    className="text-slate-300 dark:text-slate-800"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                </g>
              ))}

              {/* Axes */}
              <line
                x1={padding}
                y1={plotHeight - padding}
                x2={plotWidth - padding}
                y2={plotHeight - padding}
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <line
                x1={padding}
                y1={padding}
                x2={padding}
                y2={plotHeight - padding}
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Axis Labels */}
              <text
                x={plotWidth / 2}
                y={plotHeight - 14}
                className="fill-slate-600 dark:fill-slate-400"
                fontSize="11"
                textAnchor="middle"
                fontWeight="bold"
              >
                Daily Demand (Units / Day) →
              </text>
              <text
                x={-plotHeight / 2}
                y={18}
                className="fill-slate-600 dark:fill-slate-400"
                fontSize="11"
                textAnchor="middle"
                fontWeight="bold"
                transform="rotate(-90)"
              >
                Pick Frequency (Picks / Shift) →
              </text>

              {/* Axis Tick values */}
              <text x={padding} y={plotHeight - padding + 18} fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="600">
                0
              </text>
              <text x={plotWidth - padding} y={plotHeight - padding + 18} fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="600">
                {maxDemand}
              </text>
              <text x={padding - 10} y={plotHeight - padding + 4} fill="#64748b" fontSize="10" textAnchor="end" fontWeight="600">
                0
              </text>
              <text x={padding - 10} y={padding + 6} fill="#64748b" fontSize="10" textAnchor="end" fontWeight="600">
                {maxPickFreq}
              </text>

              {/* Cluster Centroids */}
              {clusters.map((c) => {
                const cx = scaleX(c.centroidDemand);
                const cy = scaleY(c.centroidPickFreq);
                const color = getClusterColor(c.zone);
                return (
                  <g key={c.zone}>
                    <circle cx={cx} cy={cy} r="22" fill={color} fillOpacity="0.2" />
                    <circle cx={cx} cy={cy} r="8" fill={color} stroke="#ffffff" strokeWidth="2.5" />
                    <text
                      x={cx}
                      y={cy - 14}
                      fill={color}
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Centroid {c.zone.replace('Zone_', '')}
                    </text>
                  </g>
                );
              })}

              {/* Data Points */}
              {items.map((item) => {
                const px = scaleX(item.Daily_Demand_Units);
                const py = scaleY(item.Daily_Pick_Frequency);
                const color = getClusterColor(item.Demand_Zone);
                return (
                  <g key={item.Product_ID} className="cursor-pointer">
                    <circle
                      cx={px}
                      cy={py}
                      r="6.5"
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={px + 9}
                      y={py + 4}
                      className="fill-slate-800 dark:fill-slate-200"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {item.Product_ID}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600"></span>
              <span>Zone A (High Velocity)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-600"></span>
              <span>Zone B (Mid Velocity)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-indigo-600"></span>
              <span>Zone C (Slow Mover)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-700 dark:border-white bg-slate-300 dark:bg-slate-600"></span>
              <span className="text-slate-500">Centroid μ</span>
            </div>
          </div>
        </div>

        {/* Cluster Breakdown Cards (Col span 1) */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5 space-y-4 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs">
            <h3 className="text-sm font-extrabold flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" /> Velocity Tier Profiling
            </h3>

            <div className="space-y-3">
              {clusters.map((c) => {
                const isZoneA = c.zone === 'Zone_A';
                const isZoneB = c.zone === 'Zone_B';
                return (
                  <div
                    key={c.zone}
                    className="p-3.5 rounded-xl border space-y-2 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          isZoneA
                            ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30'
                            : isZoneB
                            ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30'
                            : 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/30'
                        }`}
                      >
                        {c.zone}
                      </span>
                      <span className="text-xs font-mono font-extrabold">
                        {c.skuCount} SKUs
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Mean Pick Freq</span>
                        <span className="font-mono font-bold">
                          {c.centroidPickFreq} / shift
                        </span>
                      </div>
                      <div className="p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Mean Demand</span>
                        <span className="font-mono font-bold">
                          {c.centroidDemand} units
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 block mb-0.5 font-bold uppercase text-[10px]">Allocated Racks:</span>
                      <span className="font-mono font-semibold">
                        {isZoneA
                          ? 'A01–A04 (Dock-Adjacent 5–12m)'
                          : isZoneB
                          ? 'B01–B04 (Mid Aisle 20–32m)'
                          : 'C01–C04 (Deep Storage 45–55m)'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 block mb-0.5 font-bold uppercase text-[10px]">Member SKUs:</span>
                      <span className="font-mono font-semibold">
                        {c.skus.join(', ') || 'None'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Advantage Note */}
            <div className="p-3.5 rounded-xl border text-xs bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-500/20 text-purple-900 dark:text-purple-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Why K-Means Beats Heuristics:
              </span>
              <p className="leading-relaxed opacity-90">
                Spreadsheet ABC analysis forces rigid manual cuts (e.g. top 20% = A). K-Means adapts dynamically to real multi-dimensional demand variance and order patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
