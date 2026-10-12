/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  BENCHMARK_INVENTORY,
  BENCHMARK_LOCATIONS,
  TEST_CASES,
  FLIPKART_FESTIVE_INVENTORY,
  BLINKIT_DARKSTORE_INVENTORY,
  DELHIVERY_CROSSDOCK_INVENTORY
} from './data/benchmarkData';
import { runOptimizationEngine } from './engine/optimizer';
import { cleanAndValidateInventory } from './engine/cleaner';
import { RawInventoryItem, TestCase } from './types';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { WarehouseFloorPlan } from './components/WarehouseFloorPlan';
import { SlottingTable } from './components/SlottingTable';
import { KMeansVisualizer } from './components/KMeansVisualizer';
import { DataIngestionStudio } from './components/DataIngestionStudio';
import { ROICalculator } from './components/ROICalculator';
import { TestCaseRunner } from './components/TestCaseRunner';
import { JudgeDefenseGuide } from './components/JudgeDefenseGuide';
import { GeminiChatbot } from './components/GeminiChatbot';
import { StepByStepSimulator } from './components/StepByStepSimulator';
import { INDIAN_LOGISTICS_HUBS } from './utils/formatters';
import {
  TrendingDown,
  ArrowRight,
  Bot,
  Warehouse
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('benchmark');
  const [activeHubId, setActiveHubId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('optiware_active_hub');
      if (saved) return saved;
    } catch {}
    return 'BHIWANDI-01';
  });

  // Accessible Theme & Display States (Pastel Light White by default)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('optiware_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'light';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem('optiware_high_contrast') === 'true';
    } catch {}
    return false;
  });

  const [largeFont, setLargeFont] = useState<boolean>(() => {
    try {
      return localStorage.getItem('optiware_large_font') === 'true';
    } catch {}
    return false;
  });

  const [rawInventory, setRawInventory] = useState<RawInventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('optiware_inventory_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return BENCHMARK_INVENTORY;
  });

  const [locations] = useState(BENCHMARK_LOCATIONS);
  const [laborCostPerM, setLaborCostPerM] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('optiware_labor_cost');
      if (saved) {
        const val = parseFloat(saved);
        if (val >= 0.5) return val;
      }
    } catch {}
    // Default in Indian Rupees (₹4.00 / meter walked)
    return 4.0;
  });

  const [workerCount, setWorkerCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('optiware_worker_count');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 50;
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  // Sync Theme to localStorage & Document
  useEffect(() => {
    try {
      localStorage.setItem('optiware_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('optiware_high_contrast', next ? 'true' : 'false');
      } catch {}
      return next;
    });
  };

  const handleToggleLargeFont = () => {
    setLargeFont((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('optiware_large_font', next ? 'true' : 'false');
      } catch {}
      return next;
    });
  };

  // Sync data to localStorage
  const handleUpdateInventory = (items: RawInventoryItem[]) => {
    setRawInventory(items);
    try {
      localStorage.setItem('optiware_inventory_v2', JSON.stringify(items));
    } catch {}
  };

  const handleLaborCostChange = (val: number) => {
    setLaborCostPerM(val);
    try {
      localStorage.setItem('optiware_labor_cost', val.toString());
    } catch {}
  };

  const handleWorkerCountChange = (val: number) => {
    setWorkerCount(val);
    try {
      localStorage.setItem('optiware_worker_count', val.toString());
    } catch {}
  };

  const handleSelectHub = (hubId: string) => {
    setActiveHubId(hubId);
    try {
      localStorage.setItem('optiware_active_hub', hubId);
    } catch {}
    const hub = INDIAN_LOGISTICS_HUBS.find((h) => h.id === hubId);
    if (hub) {
      handleWorkerCountChange(hub.defaultPickers);
    }
  };

  // Run Optimization Engine
  const optimization = useMemo(() => {
    return runOptimizationEngine(rawInventory, locations, laborCostPerM, workerCount);
  }, [rawInventory, locations, laborCostPerM, workerCount]);

  // Clean data report
  const cleaning = useMemo(() => {
    return cleanAndValidateInventory(rawInventory);
  }, [rawInventory]);

  const currentHub = useMemo(() => {
    return INDIAN_LOGISTICS_HUBS.find((h) => h.id === activeHubId) || INDIAN_LOGISTICS_HUBS[0];
  }, [activeHubId]);

  // Active scenario name for header breadcrumb
  const activeScenarioName = useMemo(() => {
    if (activeScenarioId === 'benchmark') return 'Standard Benchmark';
    if (activeScenarioId === 'flipkart') return 'Flipkart Big Billion Days (Bhiwandi)';
    if (activeScenarioId === 'blinkit') return 'Blinkit 10-Min Dark Store (Gurugram)';
    if (activeScenarioId === 'delhivery') return 'Delhivery Cross-Dock Hub (Bengaluru)';
    const tc = TEST_CASES.find((t) => t.id === activeScenarioId);
    return tc ? `${tc.id}: ${tc.name}` : 'Custom Ingestion';
  }, [activeScenarioId]);

  const handleSelectScenario = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    if (scenarioId === 'benchmark') {
      handleUpdateInventory(BENCHMARK_INVENTORY);
    } else if (scenarioId === 'flipkart') {
      handleUpdateInventory(FLIPKART_FESTIVE_INVENTORY);
      handleSelectHub('BHIWANDI-01');
    } else if (scenarioId === 'blinkit') {
      handleUpdateInventory(BLINKIT_DARKSTORE_INVENTORY);
      handleSelectHub('BILASPUR-02');
    } else if (scenarioId === 'delhivery') {
      handleUpdateInventory(DELHIVERY_CROSSDOCK_INVENTORY);
      handleSelectHub('HOSKOTE-03');
    } else {
      const tc = TEST_CASES.find((t) => t.id === scenarioId);
      if (tc) {
        handleUpdateInventory(tc.inventoryOverride);
      }
    }
  };

  const handleLoadTestCase = (tc: TestCase) => {
    setActiveScenarioId(tc.id);
    handleUpdateInventory(tc.inventoryOverride);
  };

  const handleTriggerOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
    }, 400);
  };

  const handleResetBenchmark = () => {
    setActiveScenarioId('benchmark');
    handleUpdateInventory(BENCHMARK_INVENTORY);
  };

  // Export CSV Work Order
  const handleExportCSV = () => {
    const headers = [
      'Product_ID',
      'Product_Name',
      'Category',
      'Demand_Zone',
      'Pick_Frequency',
      'Daily_Demand',
      'Length_cm',
      'Width_cm',
      'Height_cm',
      'Unit_Volume_m3',
      'Baseline_Location',
      'Baseline_Distance_m',
      'Optimized_Location',
      'Optimized_Zone',
      'Optimized_Distance_m',
      'Distance_Saved_m',
      'Daily_Travel_Delta_m',
      'Daily_Cost_Savings_INR',
      'Allocation_Status',
      'Reasoning'
    ];

    const rows = optimization.assignments.map((a) => [
      `"${a.Product_ID}"`,
      `"${a.Product_Name}"`,
      `"${a.Category}"`,
      `"${a.Demand_Zone}"`,
      a.Pick_Frequency,
      a.Daily_Demand,
      a.Dimensions.length,
      a.Dimensions.width,
      a.Dimensions.height,
      a.Dimensions.volume,
      `"${a.Baseline_Location}"`,
      a.Baseline_Distance_m,
      `"${a.Optimized_Location}"`,
      `"${a.Optimized_Zone}"`,
      a.Optimized_Distance_m,
      a.Distance_Saved_m,
      a.Daily_Travel_Delta_m,
      Math.round(a.Daily_Travel_Delta_m * laborCostPerM),
      `"${a.Allocation_Status}"`,
      `"${a.Reasoning.replace(/"/g, '""')}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `OptiWare_India_Slotting_Plan_${activeScenarioId}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
        isDark ? 'theme-dark bg-[#13131e] text-slate-100' : 'theme-light bg-white text-slate-900'
      } ${highContrast ? 'contrast-high' : ''} ${largeFont ? 'text-base' : 'text-sm'}`}
    >
      {/* Responsive Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        activeScenarioId={activeScenarioId}
        onSelectScenario={handleSelectScenario}
        laborCostPerM={laborCostPerM}
        onChangeLaborCost={handleLaborCostChange}
        workerCount={workerCount}
        onChangeWorkerCount={handleWorkerCountChange}
        travelReductionPct={optimization.metrics.travelReductionPct}
        overflowCount={optimization.metrics.overflowSKUs}
        theme={theme}
        activeHubId={activeHubId}
        onSelectHub={handleSelectHub}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-[#FAFAFC] dark:bg-[#13131e]">
        {/* Top Header Bar */}
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onRunOptimization={handleTriggerOptimization}
          onResetBenchmark={handleResetBenchmark}
          onExportCSV={handleExportCSV}
          onOpenChat={() => setCurrentTab('chat')}
          isOptimizing={isOptimizing}
          travelReductionPct={optimization.metrics.travelReductionPct}
          dailySavingsINR={optimization.metrics.dailyLaborSavingsINR}
          activeScenarioName={activeScenarioName}
          activeHubName={currentHub.name}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          highContrast={highContrast}
          onToggleHighContrast={handleToggleHighContrast}
          largeFont={largeFont}
          onToggleLargeFont={handleToggleLargeFont}
        />

        {/* Scrollable Dashboard View */}
        <main
          role="main"
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 scrollbar-thin"
        >
          {/* View: Executive Dashboard */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Executive KPI Cards */}
              <KPICards metrics={optimization.metrics} theme={theme} />

              {/* Two-Column Overview: Floorplan Quick View + Top Relocations */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2D Floorplan Preview */}
                <div
                  className={`lg:col-span-2 rounded-2xl p-5 space-y-4 border transition-colors ${
                    isDark
                      ? 'bg-[#1c1c2b] border-[#2f2f45] text-slate-100'
                      : 'bg-white border-slate-200 text-slate-900 shadow-xs'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between pb-3 border-b ${
                      isDark ? 'border-[#2f2f45]' : 'border-slate-100'
                    }`}
                  >
                    <div>
                      <h2 className="text-base font-extrabold flex items-center gap-2">
                        <Warehouse className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Digital Floorplan & Layout Density ({currentHub.city})
                      </h2>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Dock-adjacent Zone A clustering eliminates 40% of picker walking across Indian fulfillment aisles
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentTab('floorplan')}
                      className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Interactive Full View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <WarehouseFloorPlan
                    locations={optimization.updatedLocations}
                    assignments={optimization.assignments}
                    travelReductionPct={optimization.metrics.travelReductionPct}
                    theme={theme}
                  />
                </div>

                {/* Priority Move Directives Card */}
                <div
                  className={`rounded-2xl p-5 space-y-4 flex flex-col justify-between border transition-colors ${
                    isDark
                      ? 'bg-[#1c1c2b] border-[#2f2f45] text-slate-100'
                      : 'bg-white border-slate-200 text-slate-900 shadow-xs'
                  }`}
                >
                  <div>
                    <div
                      className={`flex items-center justify-between pb-3 border-b ${
                        isDark ? 'border-[#2f2f45]' : 'border-slate-100'
                      }`}
                    >
                      <h3 className="text-sm font-extrabold flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Top Move Orders
                      </h3>
                      <button
                        onClick={() => setCurrentTab('slotting')}
                        className={`text-xs font-semibold hover:underline ${
                          isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        All ({optimization.assignments.length})
                      </button>
                    </div>

                    <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Immediate floor relocation directives prioritized by walking meters saved:
                    </p>

                    <div className="mt-4 space-y-2.5">
                      {optimization.assignments
                        .filter((a) => a.Distance_Saved_m > 0)
                        .slice(0, 4)
                        .map((a) => (
                          <div
                            key={a.Product_ID}
                            className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                              isDark
                                ? 'bg-[#141420] border-[#29293d]'
                                : 'bg-[#FAFAFC] border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white">{a.Product_Name}</span>
                              <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-300">
                                +{a.Distance_Saved_m}m/pick
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{a.Product_ID}</span>
                              <span>
                                <span className="line-through text-rose-500 font-medium">{a.Baseline_Location}</span>
                                {' → '}
                                <span className="text-emerald-700 dark:text-emerald-300 font-black">{a.Optimized_Location}</span>
                              </span>
                            </div>
                            <div className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Daily delta: -{a.Daily_Travel_Delta_m}m walked ({a.Pick_Frequency} picks)
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Ask AI Banner (Pastel Lavender) */}
                  <div
                    onClick={() => setCurrentTab('chat')}
                    role="button"
                    tabIndex={0}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isDark
                        ? 'bg-purple-950/30 border-purple-800/40 hover:border-purple-600'
                        : 'bg-[#F5F3FF] hover:bg-[#EDE9FE] border-[#DDD6FE] text-[#5B21B6] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-purple-200/80 dark:bg-purple-600/20 text-[#5B21B6] dark:text-purple-300">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block">
                          Ask Gemini AI Logistics Advisor
                        </span>
                        <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-purple-700'}`}>
                          Instant explanation of slotting math & Indian ROI
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Slotting Recommendation Summary Table */}
              <SlottingTable
                assignments={optimization.assignments}
                onExportCSV={handleExportCSV}
                theme={theme}
              />
            </div>
          )}

          {/* View: Floorplan */}
          {currentTab === 'floorplan' && (
            <WarehouseFloorPlan
              locations={optimization.updatedLocations}
              assignments={optimization.assignments}
              travelReductionPct={optimization.metrics.travelReductionPct}
              theme={theme}
            />
          )}

          {/* View: Slotting Recommendations & Work Order */}
          {currentTab === 'slotting' && (
            <SlottingTable
              assignments={optimization.assignments}
              onExportCSV={handleExportCSV}
              theme={theme}
            />
          )}

          {/* View: K-Means Demand Stratification */}
          {currentTab === 'kmeans' && (
            <KMeansVisualizer
              items={optimization.cleanInventory}
              clusters={optimization.kMeansResult.clusters}
              iterationsRun={optimization.kMeansResult.iterationsRun}
            />
          )}

          {/* View: Data Ingestion & Imputation Studio */}
          {currentTab === 'ingestion' && (
            <DataIngestionStudio
              rawInventory={rawInventory}
              cleanInventory={optimization.cleanInventory}
              cleaningReport={cleaning.report}
              onUpdateInventory={handleUpdateInventory}
              onLoadPreset={handleSelectScenario}
            />
          )}

          {/* View: Financial ROI Simulator */}
          {currentTab === 'roi' && (
            <ROICalculator
              metrics={optimization.metrics}
              laborCostPerM={laborCostPerM}
              onChangeLaborCost={handleLaborCostChange}
              workerCount={workerCount}
              onChangeWorkerCount={handleWorkerCountChange}
            />
          )}

          {/* View: Step-by-Step Greedy Allocation Simulator */}
          {currentTab === 'simulator' && (
            <StepByStepSimulator
              inventory={optimization.cleanInventory}
              locations={locations}
            />
          )}

          {/* View: Failure Test Cases Matrix */}
          {currentTab === 'testcases' && (
            <div className="space-y-6">
              <TestCaseRunner onLoadTestCase={handleLoadTestCase} />
              <StepByStepSimulator
                inventory={optimization.cleanInventory}
                locations={locations}
              />
            </div>
          )}

          {/* View: Judicial Defense Guide */}
          {currentTab === 'judgedefense' && <JudgeDefenseGuide />}

          {/* View: Gemini AI Logistics Chatbot */}
          {currentTab === 'chat' && (
            <GeminiChatbot
              metrics={optimization.metrics}
              assignments={optimization.assignments}
              hubName={currentHub.name}
            />
          )}
        </main>
      </div>
    </div>
  );
}
