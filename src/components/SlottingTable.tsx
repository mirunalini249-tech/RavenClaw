import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Download,
  CheckCircle,
  AlertOctagon,
  FileSpreadsheet,
  Filter
} from 'lucide-react';
import { SlottingAssignment } from '../types';
import { GOODS_TYPES_CATALOG, getGoodsTypeInfo } from '../data/goodsTypes';

interface SlottingTableProps {
  assignments: SlottingAssignment[];
  onExportCSV: () => void;
  theme?: 'dark' | 'light';
}

export const SlottingTable: React.FC<SlottingTableProps> = ({
  assignments,
  onExportCSV,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ASSIGNED' | 'OVERFLOW'>('ALL');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [goodsTypeFilter, setGoodsTypeFilter] = useState<string>('ALL');

  const filtered = assignments.filter((item) => {
    const matchesSearch =
      item.Product_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Product_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Optimized_Location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Baseline_Location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.Allocation_Status === statusFilter;
    const matchesZone = zoneFilter === 'ALL' || item.Demand_Zone === zoneFilter;
    const matchesGoodsType =
      goodsTypeFilter === 'ALL' ||
      item.Category.toLowerCase() === goodsTypeFilter.toLowerCase() ||
      getGoodsTypeInfo(item.Category).id === goodsTypeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesZone && matchesGoodsType;
  });

  const getZoneBadge = (zone: string) => {
    switch (zone) {
      case 'Zone_A':
        return isDark
          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/60'
          : 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]';
      case 'Zone_B':
        return isDark
          ? 'bg-amber-950/70 text-amber-300 border border-amber-700/60'
          : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]';
      default:
        return isDark
          ? 'bg-purple-950/70 text-purple-300 border border-purple-700/60'
          : 'bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE]';
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 space-y-4 border transition-colors ${
        isDark
          ? 'bg-[#1c1c2b] border-[#2f2f45] text-slate-100'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Automated Re-Slotting Recommendations
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Physical 3D bounding-box and volumetric constraint verification with explainable AI rationale.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKU, name, rack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Filter items by SKU ID, product name, or location"
              className={`w-full min-h-[38px] pl-9 pr-3 py-1.5 text-xs rounded-xl border font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter by allocation status"
            className={`min-h-[38px] px-3 py-1.5 text-xs rounded-xl border font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <option value="ALL">All Status ({assignments.length})</option>
            <option value="ASSIGNED">
              Assigned ({assignments.filter((a) => a.Allocation_Status === 'ASSIGNED').length})
            </option>
            <option value="OVERFLOW">
              Overflow ({assignments.filter((a) => a.Allocation_Status === 'OVERFLOW').length})
            </option>
          </select>

          {/* Zone Filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            aria-label="Filter by demand velocity zone"
            className={`min-h-[38px] px-3 py-1.5 text-xs rounded-xl border font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <option value="ALL">All Velocity Zones</option>
            <option value="Zone_A">Zone A (Fast Mover)</option>
            <option value="Zone_B">Zone B (Mid Aisle)</option>
            <option value="Zone_C">Zone C (Deep Rack)</option>
          </select>

          {/* Goods Type Filter */}
          <select
            value={goodsTypeFilter}
            onChange={(e) => setGoodsTypeFilter(e.target.value)}
            aria-label="Filter by Goods Type"
            className={`min-h-[38px] px-3 py-1.5 text-xs rounded-xl border font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <option value="ALL">All Goods Types</option>
            {GOODS_TYPES_CATALOG.map((gt) => (
              <option key={gt.id} value={gt.name}>
                {gt.name}
              </option>
            ))}
          </select>

          <button
            onClick={onExportCSV}
            className={`min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className={`overflow-x-auto rounded-xl border ${
          isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white'
        }`}
      >
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              className={`border-b text-[11px] uppercase tracking-wider font-bold ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <th scope="col" className="py-3 px-3.5">SKU ID</th>
              <th scope="col" className="py-3 px-3.5">Product Name & Goods Type</th>
              <th scope="col" className="py-3 px-3.5">3D Dims (L×W×H)</th>
              <th scope="col" className="py-3 px-3.5 text-center">Velocity Tier</th>
              <th scope="col" className="py-3 px-3.5 text-right">Pick Freq</th>
              <th scope="col" className="py-3 px-3.5 text-center">Baseline → Optimized Location</th>
              <th scope="col" className="py-3 px-3.5 text-right">Dist Saved</th>
              <th scope="col" className="py-3 px-3.5 text-center">Status</th>
              <th scope="col" className="py-3 px-4 min-w-[260px]">Optimization Reasoning</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDark ? 'divide-slate-800/80' : 'divide-slate-200'
            }`}
          >
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const typeInfo = getGoodsTypeInfo(item.Category);
                return (
                  <tr
                    key={item.Product_ID}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-slate-900/80' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3.5 font-mono font-bold whitespace-nowrap">
                      {item.Product_ID}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-bold">{item.Product_Name}</div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeInfo.pastelBadge.bg} ${typeInfo.pastelBadge.text} ${typeInfo.pastelBadge.border}`}>
                          {item.Category}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          {typeInfo.handlingRequirement}
                        </span>
                      </div>
                    </td>
                  <td className="py-3 px-3.5 font-mono text-[11px] whitespace-nowrap font-medium">
                    <div>
                      {item.Dimensions.length}×{item.Dimensions.width}×{item.Dimensions.height} cm
                    </div>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      Vol: {item.Dimensions.volume.toFixed(4)} m³
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getZoneBadge(
                        item.Demand_Zone
                      )}`}
                    >
                      {item.Demand_Zone}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono font-bold whitespace-nowrap">
                    {item.Pick_Frequency}{' '}
                    <span className={`text-[10px] font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      picks/day
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-center whitespace-nowrap font-mono">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
                        isDark
                          ? 'bg-slate-900 border-slate-800'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="text-rose-500 font-semibold line-through">
                        {item.Baseline_Location} ({item.Baseline_Distance_m}m)
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span
                        className={`font-black ${
                          item.Allocation_Status === 'ASSIGNED'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600'
                        }`}
                      >
                        {item.Optimized_Location} ({item.Optimized_Distance_m}m)
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono whitespace-nowrap">
                    {item.Distance_Saved_m > 0 ? (
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        +{item.Distance_Saved_m}m
                      </span>
                    ) : (
                      <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>0m</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    {item.Allocation_Status === 'ASSIGNED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> ASSIGNED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-500" /> OVERFLOW
                      </span>
                    )}
                  </td>
                  <td className={`py-3 px-4 text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {item.Reasoning}
                  </td>
                </tr>
              );
            })
          ) : (
              <tr>
                <td
                  colSpan={9}
                  className={`py-8 text-center text-xs italic ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  No SKUs match the selected search or filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
