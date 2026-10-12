import React from 'react';
import {
  LayoutDashboard,
  Grid3X3,
  ListOrdered,
  Cpu,
  UploadCloud,
  Calculator,
  ShieldAlert,
  HelpCircle,
  Bot,
  Warehouse,
  ChevronLeft,
  ChevronRight,
  X,
  Sliders,
  Users,
  IndianRupee,
  MapPin,
  Sparkles
} from 'lucide-react';
import { INDIAN_LOGISTICS_HUBS } from '../utils/formatters';

export type NavigationTab =
  | 'dashboard'
  | 'floorplan'
  | 'slotting'
  | 'kmeans'
  | 'simulator'
  | 'ingestion'
  | 'roi'
  | 'testcases'
  | 'judgedefense'
  | 'chat';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  laborCostPerM: number;
  onChangeLaborCost: (val: number) => void;
  workerCount: number;
  onChangeWorkerCount: (val: number) => void;
  travelReductionPct: number;
  overflowCount: number;
  theme: 'dark' | 'light';
  activeHubId?: string;
  onSelectHub?: (hubId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  activeScenarioId,
  onSelectScenario,
  laborCostPerM,
  onChangeLaborCost,
  workerCount,
  onChangeWorkerCount,
  travelReductionPct,
  overflowCount,
  theme,
  activeHubId = 'BHIWANDI-01',
  onSelectHub
}) => {
  const isDark = theme === 'dark';

  const navSections = [
    {
      title: 'Core Engine',
      items: [
        {
          id: 'dashboard' as NavigationTab,
          label: 'Executive Overview',
          icon: LayoutDashboard,
          badge: `-${travelReductionPct.toFixed(0)}%`,
          badgeColor: isDark
            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
            : 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
        },
        {
          id: 'floorplan' as NavigationTab,
          label: 'Warehouse Floorplan',
          icon: Grid3X3,
          badge: '2D Layout',
          badgeColor: isDark
            ? 'bg-sky-950/60 text-sky-300 border-sky-800/60'
            : 'bg-[#F0F9FF] text-[#075985] border-[#BAE6FD]'
        },
        {
          id: 'slotting' as NavigationTab,
          label: 'Slotting Work Order',
          icon: ListOrdered,
          badge: overflowCount > 0 ? `${overflowCount} Overflow` : 'Optimized',
          badgeColor:
            overflowCount > 0
              ? isDark
                ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                : 'bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]'
              : isDark
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
              : 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
        },
        {
          id: 'kmeans' as NavigationTab,
          label: 'K-Means Stratifier',
          icon: Cpu,
          badge: 'ML ABC',
          badgeColor: isDark
            ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
            : 'bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]'
        }
      ]
    },
    {
      title: 'Data & Economics (INR)',
      items: [
        {
          id: 'ingestion' as NavigationTab,
          label: 'Data & Imputation',
          icon: UploadCloud,
          badge: 'CSV',
          badgeColor: isDark
            ? 'bg-slate-800/80 text-slate-300 border-slate-700'
            : 'bg-slate-100 text-slate-700 border-slate-200'
        },
        {
          id: 'roi' as NavigationTab,
          label: 'Labor Cost & ROI',
          icon: Calculator,
          badge: `₹${laborCostPerM.toFixed(1)}/m`,
          badgeColor: isDark
            ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
            : 'bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]'
        }
      ]
    },
    {
      title: 'Verification & AI',
      items: [
        {
          id: 'simulator' as NavigationTab,
          label: 'Greedy Simulator',
          icon: Sparkles,
          badge: 'Live Step',
          badgeColor: isDark
            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
            : 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
        },
        {
          id: 'testcases' as NavigationTab,
          label: 'Failure Test Matrix',
          icon: ShieldAlert,
          badge: 'TC-01..04',
          badgeColor: isDark
            ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60'
            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
        },
        {
          id: 'judgedefense' as NavigationTab,
          label: 'Judge Defense Q&A',
          icon: HelpCircle,
          badge: '10 Q&A',
          badgeColor: isDark
            ? 'bg-teal-950/60 text-teal-300 border-teal-800/60'
            : 'bg-teal-50 text-teal-800 border-teal-200'
        },
        {
          id: 'chat' as NavigationTab,
          label: 'Gemini Slotting AI',
          icon: Bot,
          badge: 'Gemini 3.8',
          badgeColor: isDark
            ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
            : 'bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]'
        }
      ]
    }
  ];

  const scenarios = [
    { id: 'benchmark', label: 'Standard Benchmark (Default)' },
    { id: 'flipkart', label: 'Flipkart Festive Rush (Bhiwandi)' },
    { id: 'blinkit', label: 'Blinkit 10-Min Dark Store (NCR)' },
    { id: 'delhivery', label: 'Delhivery Cross-Dock (BLR)' },
    { id: 'TC-01', label: 'TC-01: Oversized Physical SKU' },
    { id: 'TC-02', label: 'TC-02: Corrupted Data & Imputation' },
    { id: 'TC-03', label: 'TC-03: Total Volume Overcapacity' },
    { id: 'TC-04', label: 'TC-04: Length Overhang Boundary' }
  ];

  const activeHub = INDIAN_LOGISTICS_HUBS.find((h) => h.id === activeHubId) || INDIAN_LOGISTICS_HUBS[0];

  const sidebarContent = (
    <div
      className={`flex flex-col h-full border-r transition-colors duration-200 select-none ${
        isDark
          ? 'bg-[#181824] border-[#29293d] text-slate-200'
          : 'bg-white border-slate-200/90 text-slate-800'
      }`}
    >
      {/* Pastel Brand Header */}
      <div
        className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'border-[#29293d]' : 'border-slate-200/90'
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#A7F3D0] via-[#BAE6FD] to-[#DDD6FE] flex items-center justify-center shadow-xs flex-shrink-0 text-slate-800">
            <Warehouse className="w-5 h-5 text-emerald-800" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
                  OptiWare AI
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                  India Edition
                </span>
              </div>
              <p className="text-xs truncate text-slate-600 dark:text-slate-400 font-medium">
                Warehouse Space Optimizer
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className={`hidden md:flex min-h-[36px] min-w-[36px] items-center justify-center rounded-xl transition-colors ${
            isDark
              ? 'hover:bg-[#252538] text-slate-400 hover:text-white'
              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile close */}
        <button
          onClick={onCloseMobile}
          className={`md:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl ${
            isDark ? 'hover:bg-[#252538] text-slate-400' : 'hover:bg-slate-100 text-slate-600'
          }`}
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Indian Logistics Hub Selector */}
      {!isCollapsed && (
        <div
          className={`px-4 py-3 border-b space-y-2.5 ${
            isDark
              ? 'bg-[#14141f] border-[#29293d]'
              : 'bg-[#FAFAFC] border-slate-200/90'
          }`}
        >
          <div>
            <label
              htmlFor="hub-select"
              className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-slate-600 dark:text-slate-400 flex items-center gap-1"
            >
              <MapPin className="w-3 h-3 text-sky-600" /> Fulfillment Hub (India)
            </label>
            <select
              id="hub-select"
              value={activeHubId}
              onChange={(e) => onSelectHub && onSelectHub(e.target.value)}
              className={`w-full min-h-[38px] text-xs rounded-xl px-2.5 py-1.5 font-semibold border transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                isDark
                  ? 'bg-[#1f1f30] border-[#363650] text-slate-200'
                  : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
              }`}
            >
              {INDIAN_LOGISTICS_HUBS.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.name} ({hub.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="scenario-select"
              className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-slate-600 dark:text-slate-400"
            >
              Active Data Scenario
            </label>
            <select
              id="scenario-select"
              value={activeScenarioId}
              onChange={(e) => onSelectScenario(e.target.value)}
              className={`w-full min-h-[38px] text-xs rounded-xl px-2.5 py-1.5 font-semibold border transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                isDark
                  ? 'bg-[#1f1f30] border-[#363650] text-slate-200'
                  : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
              }`}
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <nav
        aria-label="Main navigation"
        className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin"
      >
        {navSections.map((sec) => (
          <div key={sec.title}>
            {!isCollapsed && (
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {sec.title}
              </div>
            )}
            <div className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    title={isCollapsed ? item.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full min-h-[42px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? isDark
                          ? 'bg-[#2a2a40] text-emerald-300 border border-emerald-500/40 font-bold shadow-xs'
                          : 'bg-[#ECFDF5] text-emerald-950 border border-[#A7F3D0] font-bold shadow-2xs'
                        : isDark
                        ? 'text-slate-300 hover:bg-[#202032] hover:text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    } ${isCollapsed ? 'justify-center px-2' : 'justify-between'}`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActive
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-white text-emerald-950 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700'
                            : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quick Parameters Card (Calibrated in INR) */}
        {!isCollapsed && (
          <div
            className={`p-3.5 rounded-2xl border space-y-3.5 ${
              isDark
                ? 'bg-[#1c1c2b] border-[#2f2f45] text-slate-200'
                : 'bg-[#FAFAFC] border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-200">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Operational Variables (INR)</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <label htmlFor="labor-cost-slider" className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Walking Cost
                </label>
                <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">
                  ₹{laborCostPerM.toFixed(2)} / m
                </span>
              </div>
              <input
                id="labor-cost-slider"
                type="range"
                min="1.0"
                max="15.0"
                step="0.5"
                value={laborCostPerM}
                onChange={(e) => onChangeLaborCost(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 h-2 rounded-lg cursor-pointer"
                aria-label="Labor cost per meter slider in Indian Rupees"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Indian 3PL avg: ₹3.00 - ₹5.00/meter
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <label htmlFor="workers-slider" className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                  <Users className="w-3.5 h-3.5 text-sky-600" /> Shift Pickers
                </label>
                <span className="font-mono font-bold text-sky-800 dark:text-sky-300">
                  {workerCount} pickers
                </span>
              </div>
              <input
                id="workers-slider"
                type="range"
                min="5"
                max="150"
                step="5"
                value={workerCount}
                onChange={(e) => onChangeWorkerCount(parseInt(e.target.value, 10))}
                className="w-full accent-sky-600 h-2 rounded-lg cursor-pointer"
                aria-label="Number of warehouse pickers slider"
              />
            </div>
          </div>
        )}
      </nav>

      {/* Footer Profile & Indian Context Badge */}
      <div
        className={`p-3.5 border-t ${
          isDark
            ? 'border-[#29293d] bg-[#141420] text-slate-300'
            : 'border-slate-200/90 bg-[#FAFAFC] text-slate-700'
        }`}
      >
        {!isCollapsed ? (
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-200 to-teal-200 text-teal-900 font-extrabold flex items-center justify-center text-xs">
                IN
              </div>
              <div className="truncate flex-1">
                <p className="font-bold truncate text-slate-900 dark:text-slate-100">{activeHub.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {activeHub.benchmarkCompany} Benchmark
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Pastel Studio Active</span>
              </span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">INR Mode</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Indian Logistics Ready">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden md:block transition-all duration-300 ease-in-out h-screen sticky top-0 flex-shrink-0 z-20 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-72 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
