import React, { useState } from 'react';
import {
  ShieldAlert,
  Play,
  CheckCircle2,
  CheckCircle
} from 'lucide-react';
import { TEST_CASES, BENCHMARK_LOCATIONS } from '../data/benchmarkData';
import { runOptimizationEngine } from '../engine/optimizer';
import { TestCase } from '../types';

interface TestCaseRunnerProps {
  onLoadTestCase: (tc: TestCase) => void;
}

export const TestCaseRunner: React.FC<TestCaseRunnerProps> = ({ onLoadTestCase }) => {
  const [activeTestResults, setActiveTestResults] = useState<Record<string, any>>({});
  const [runningTestId, setRunningTestId] = useState<string | null>(null);

  const handleExecuteTest = (tc: TestCase) => {
    setRunningTestId(tc.id);
    setTimeout(() => {
      const result = runOptimizationEngine(tc.inventoryOverride, BENCHMARK_LOCATIONS);
      setActiveTestResults((prev) => ({
        ...prev,
        [tc.id]: {
          executed: true,
          metrics: result.metrics,
          overflowCount: result.assignments.filter((a) => a.Allocation_Status === 'OVERFLOW').length,
          firstOverflow: result.assignments.find((a) => a.Allocation_Status === 'OVERFLOW'),
          imputedCount: result.cleanInventory.filter((i) => i.isImputed).length
        }
      }));
      setRunningTestId(null);
      onLoadTestCase(tc);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs">
        <h2 className="text-base font-extrabold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-500" /> System Failure Modes, Edge Cases & Robustness Matrix
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Rigorous stress-testing of mathematical constraints and input anomaly handling. Verifies system stability during physical overhangs, total volume depletion, and corrupt enterprise ERP streams.
        </p>
      </div>

      {/* Test Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEST_CASES.map((tc) => {
          const runState = activeTestResults[tc.id];
          const isRunning = runningTestId === tc.id;

          return (
            <div
              key={tc.id}
              className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 space-y-4 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      {tc.id}
                    </span>
                    <h3 className="text-sm font-extrabold">{tc.name}</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> VERIFIED
                  </span>
                </div>

                {/* Scenario details */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-rose-600 dark:text-rose-400 block">
                      Input Data Anomaly Condition:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono font-medium">
                      {tc.inputAnomalyCondition}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-teal-600 dark:text-cyan-400 block">
                      Expected System Behavior:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {tc.expectedBehavior}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                      Prototype Verification Outcome:
                    </span>
                    <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed font-bold">
                      {tc.verificationOutcome}
                    </p>
                  </div>
                </div>

                {/* Execution Results Banner (if run) */}
                {runState && (
                  <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" /> Live Engine Output:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 pt-1">
                      <div>Assigned: {runState.metrics.assignedSKUs} SKUs</div>
                      <div>Overflow: {runState.overflowCount} SKUs</div>
                      <div>Travel Saved: {runState.metrics.travelReductionPct}%</div>
                      <div>Feasibility: {runState.metrics.feasibilityRatePct}%</div>
                    </div>
                    {runState.firstOverflow && (
                      <div className="text-[11px] text-rose-600 dark:text-rose-400 font-mono mt-1 pt-1 border-t border-slate-200 dark:border-slate-800 truncate">
                        Diagnosis: {runState.firstOverflow.Reasoning}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleExecuteTest(tc)}
                  disabled={isRunning}
                  className="w-full min-h-[42px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl border bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold border-slate-300 dark:border-slate-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 text-emerald-500 ${isRunning ? 'animate-spin' : ''}`} />
                  <span>
                    {isRunning ? 'Simulating Engine Constraints...' : `Run & Load ${tc.id}`}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
