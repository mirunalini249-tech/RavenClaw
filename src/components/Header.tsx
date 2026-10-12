import React, { useState } from 'react';
import {
  Menu,
  Play,
  Download,
  RotateCcw,
  Sparkles,
  TrendingDown,
  Warehouse,
  Sun,
  Moon,
  Eye,
  Type,
  Check,
  IndianRupee,
  MapPin
} from 'lucide-react';
import { NavigationTab } from './Sidebar';
import { formatINR } from '../utils/formatters';

interface HeaderProps {
  currentTab: NavigationTab;
  onOpenMobileMenu: () => void;
  onRunOptimization: () => void;
  onResetBenchmark: () => void;
  onExportCSV: () => void;
  onOpenChat: () => void;
  isOptimizing: boolean;
  travelReductionPct: number;
  dailySavingsINR: number;
  dailySavingsUSD?: number;
  activeScenarioName: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  largeFont: boolean;
  onToggleLargeFont: () => void;
  activeHubName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onRunOptimization,
  onResetBenchmark,
  onExportCSV,
  onOpenChat,
  isOptimizing,
  travelReductionPct,
  dailySavingsINR,
  dailySavingsUSD,
  activeScenarioName,
  theme,
  onToggleTheme,
  highContrast,
  onToggleHighContrast,
  largeFont,
  onToggleLargeFont,
  activeHubName = 'DC-01 Bhiwandi (Mumbai MMR)'
}) => {
  const [showA11yMenu, setShowA11yMenu] = useState(false);

  const getTabTitle = (tab: NavigationTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Executive Overview';
      case 'floorplan':
        return 'Warehouse Floorplan & Pick Paths';
      case 'slotting':
        return 'Slotting Work Orders & Recommendations';
      case 'kmeans':
        return 'K-Means Velocity Stratification (ABC)';
      case 'ingestion':
        return 'Data Ingestion & Median Imputation';
      case 'roi':
        return 'Labor Savings & Capital ROI (India)';
      case 'testcases':
        return 'Failure Modes & Robustness Matrix';
      case 'judgedefense':
        return 'Judicial Defense & Architecture Review';
      case 'chat':
        return 'Gemini AI Slotting Advisor';
      default:
        return 'Warehouse Optimization';
    }
  };

  const isDark = theme === 'dark';
  const effectiveSavings = dailySavingsINR || dailySavingsUSD || 0;

  return (
    <header
      role="banner"
      className={`sticky top-0 z-20 transition-colors duration-200 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 border-b ${
        isDark
          ? 'bg-[#181824]/95 backdrop-blur-md border-[#29293d] text-slate-100'
          : 'bg-white/95 backdrop-blur-md border-slate-200/90 text-slate-900 shadow-2xs'
      }`}
    >
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className={`md:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            isDark
              ? 'bg-[#222236] text-slate-200 hover:text-white hover:bg-[#2c2c44]'
              : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
          }`}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
              <Warehouse className="w-3.5 h-3.5 text-emerald-600" /> OptiWare AI
            </span>
            <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>/</span>
            <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 truncate">
              <MapPin className="w-3 h-3 text-sky-600" /> {activeHubName}
            </span>
            <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>/</span>
            <span
              className={`truncate font-medium hidden sm:inline ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {activeScenarioName}
            </span>
          </div>
          <h1
            className={`font-black tracking-tight truncate ${
              largeFont ? 'text-lg md:text-xl' : 'text-base md:text-lg'
            } ${isDark ? 'text-white' : 'text-slate-900'}`}
          >
            {getTabTitle(currentTab)}
          </h1>
        </div>
      </div>

      {/* Center: Live Performance Badge in INR (Pastel Mint & Sky Chip) */}
      <div
        className={`hidden xl:flex items-center gap-3.5 px-4 py-1.5 rounded-full border transition-colors ${
          isDark
            ? 'bg-[#151522] border-[#29293d] text-slate-200'
            : 'bg-gradient-to-r from-[#ECFDF5] via-[#F0FDF4] to-[#F0F9FF] border-[#A7F3D0] text-slate-900 shadow-2xs'
        }`}
        role="status"
        aria-label={`Picker travel reduced by ${travelReductionPct.toFixed(1)} percent with daily savings of ${formatINR(effectiveSavings)}`}
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-slate-600 dark:text-slate-400">Travel Delta:</span>
          <span className="font-extrabold font-mono text-emerald-800 dark:text-emerald-300">
            -{travelReductionPct.toFixed(1)}%
          </span>
        </div>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <div className="flex items-center gap-1 text-xs font-semibold">
          <IndianRupee className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span className="text-slate-600 dark:text-slate-400">Daily Savings:</span>
          <span className="font-extrabold font-mono text-sky-800 dark:text-sky-300">
            {formatINR(effectiveSavings)}
          </span>
        </div>
      </div>

      {/* Right: Pastel Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Display & A11y Menu */}
        <div className="relative">
          <button
            onClick={() => setShowA11yMenu(!showA11yMenu)}
            title="Display & Accessibility options"
            aria-expanded={showA11yMenu}
            aria-label="Display and accessibility options"
            className={`min-h-[40px] px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-colors ${
              isDark
                ? 'bg-[#222236] hover:bg-[#2c2c44] border-[#363650] text-slate-200'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Theme & A11y</span>
          </button>

          {showA11yMenu && (
            <div
              className={`absolute right-0 mt-2 w-64 rounded-2xl p-3 border shadow-xl z-50 text-xs space-y-2.5 transition-all ${
                isDark
                  ? 'bg-[#1b1b2a] border-[#363650] text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="font-bold pb-1.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span>Display & Palette</span>
                <span className="text-[10px] uppercase font-bold text-emerald-600">Pastel White</span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={onToggleTheme}
                className={`w-full flex items-center justify-between p-2 rounded-xl border transition-colors ${
                  isDark
                    ? 'hover:bg-[#252538] border-[#29293d]'
                    : 'hover:bg-[#F8F9FC] border-[#E8EBF2]'
                }`}
              >
                <div className="flex items-center gap-2 font-medium">
                  {isDark ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-indigo-500" />
                  )}
                  <span>{isDark ? 'Light Theme (Pastel White)' : 'Dark Theme'}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {isDark ? 'Dark' : 'Light'}
                </span>
              </button>

              {/* High Contrast Toggle */}
              <button
                onClick={onToggleHighContrast}
                className={`w-full flex items-center justify-between p-2 rounded-xl border transition-colors ${
                  highContrast
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-300 font-bold'
                    : isDark
                    ? 'hover:bg-[#252538] border-[#29293d]'
                    : 'hover:bg-[#F8F9FC] border-[#E8EBF2]'
                }`}
              >
                <div className="flex items-center gap-2 font-medium">
                  <Eye className="w-4 h-4 text-emerald-500" />
                  <span>High Contrast (WCAG)</span>
                </div>
                {highContrast && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              {/* Large Font Mode */}
              <button
                onClick={onToggleLargeFont}
                className={`w-full flex items-center justify-between p-2 rounded-xl border transition-colors ${
                  largeFont
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 text-sky-900 dark:text-sky-300 font-bold'
                    : isDark
                    ? 'hover:bg-[#252538] border-[#29293d]'
                    : 'hover:bg-[#F8F9FC] border-[#E8EBF2]'
                }`}
              >
                <div className="flex items-center gap-2 font-medium">
                  <Type className="w-4 h-4 text-sky-500" />
                  <span>Enlarged Typography</span>
                </div>
                {largeFont && <Check className="w-4 h-4 text-sky-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Reset to Benchmark */}
        <button
          onClick={onResetBenchmark}
          title="Reset to Benchmark baseline"
          aria-label="Reset to Benchmark baseline"
          className={`min-h-[40px] px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            isDark
              ? 'bg-[#222236] hover:bg-[#2c2c44] border-[#363650] text-slate-300'
              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden lg:inline">Reset</span>
        </button>

        {/* Export Work Order CSV */}
        <button
          onClick={onExportCSV}
          title="Export Slotting Relocation Work Order (CSV)"
          aria-label="Export Slotting Relocation Work Order as CSV"
          className={`min-h-[40px] px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            isDark
              ? 'bg-[#222236] hover:bg-[#2c2c44] border-[#363650] text-slate-200'
              : 'bg-[#F0FDF4] hover:bg-[#DCFCE7] border-[#BBF7D0] text-[#065F46] shadow-2xs'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        {/* Ask Gemini Advisor button */}
        <button
          onClick={onOpenChat}
          title="Ask Gemini AI Advisor"
          aria-label="Ask Gemini AI Advisor"
          className={`min-h-[40px] px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs ${
            isDark
              ? 'bg-purple-950/60 hover:bg-purple-900/60 border-purple-700 text-purple-200'
              : 'bg-[#F5F3FF] hover:bg-[#EDE9FE] border-[#DDD6FE] text-[#5B21B6]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span className="hidden md:inline">Gemini AI</span>
        </button>

        {/* Run Optimization Engine (Primary CTA - Pastel Mint) */}
        <button
          onClick={onRunOptimization}
          disabled={isOptimizing}
          title="Run Greedy 3D Constraint Engine"
          aria-label="Run Greedy 3D Constraint Optimization Engine"
          className="min-h-[40px] px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
        >
          <Play className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Optimizing...' : 'Run Optimization'}</span>
        </button>
      </div>
    </header>
  );
};
