import React, { useState } from 'react';
import {
  TrendingDown,
  Users,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  IndianRupee,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { OptimizationMetrics } from '../types';
import { formatINR, formatIndianNumber } from '../utils/formatters';

interface ROICalculatorProps {
  metrics: OptimizationMetrics;
  laborCostPerM: number;
  onChangeLaborCost: (val: number) => void;
  workerCount: number;
  onChangeWorkerCount: (val: number) => void;
}

export const ROICalculator: React.FC<ROICalculatorProps> = ({
  metrics,
  laborCostPerM,
  onChangeLaborCost,
  workerCount,
  onChangeWorkerCount
}) => {
  const [workingDaysPerYear, setWorkingDaysPerYear] = useState(300);

  // Travel meters saved per day across active warehouse workers
  const metersSavedPerDay = metrics.travelDistanceSavedMeters;
  const dailySavingsINR = metersSavedPerDay * laborCostPerM * (workerCount / 50 || 1);
  const annualSavingsINR = dailySavingsINR * workingDaysPerYear;
  const threeYearSavingsINR = annualSavingsINR * 3;

  // Walking time saved: assuming average walking speed is 1.2 m/sec
  const walkingSpeedMps = 1.2;
  const secondsSavedPerDay = metersSavedPerDay / walkingSpeedMps;
  const hoursSavedPerDay = (secondsSavedPerDay / 3600) * (workerCount / 50 || 1);
  const hoursSavedPerYear = hoursSavedPerDay * workingDaysPerYear;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-2xl p-5 border bg-white border-slate-200 text-slate-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" /> Operational Labor Savings & Capital ROI Model (India)
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Calculates financial gains for Indian distribution centers (Delhivery, Flipkart, Reliance, Blinkit, Amazon IN) derived from 40% picker travel reduction. Evaluates direct wage cost recovery in Indian Rupees (₹) and capital expenditure avoidance.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-bold self-start md:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>₹4.00/m Industrial Constant</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Slider 1: Labor Walking Cost */}
        <div className="rounded-2xl p-4.5 border bg-white border-slate-200 space-y-2.5 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="roi-labor-cost" className="font-bold flex items-center gap-1.5 text-slate-800">
              <IndianRupee className="w-4 h-4 text-emerald-600" /> Walking Movement Cost
            </label>
            <span className="font-mono font-black text-emerald-700 text-sm">
              ₹{laborCostPerM.toFixed(2)} / m
            </span>
          </div>
          <input
            id="roi-labor-cost"
            type="range"
            min="1.0"
            max="15.0"
            step="0.5"
            value={laborCostPerM}
            onChange={(e) => onChangeLaborCost(parseFloat(e.target.value))}
            className="w-full accent-emerald-600 h-2 rounded-lg cursor-pointer"
            aria-label="Labor movement cost slider in Indian Rupees"
          />
          <p className="text-[11px] text-slate-500">
            Typical Indian 3PL rate: ₹3.00 – ₹5.00 / meter walked (including picker wages & floor equipment)
          </p>
        </div>

        {/* Slider 2: Shift Pickers */}
        <div className="rounded-2xl p-4.5 border bg-white border-slate-200 space-y-2.5 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="roi-workers" className="font-bold flex items-center gap-1.5 text-slate-800">
              <Users className="w-4 h-4 text-sky-600" /> Active Floor Pickers
            </label>
            <span className="font-mono font-black text-sky-700 text-sm">
              {workerCount} workers
            </span>
          </div>
          <input
            id="roi-workers"
            type="range"
            min="5"
            max="150"
            step="5"
            value={workerCount}
            onChange={(e) => onChangeWorkerCount(parseInt(e.target.value, 10))}
            className="w-full accent-sky-600 h-2 rounded-lg cursor-pointer"
            aria-label="Active floor pickers slider"
          />
          <p className="text-[11px] text-slate-500">
            Fulfillment floor staff across active shifts (averaging ~₹20,000/month/picker)
          </p>
        </div>

        {/* Slider 3: Working Days */}
        <div className="rounded-2xl p-4.5 border bg-white border-slate-200 space-y-2.5 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="roi-days" className="font-bold flex items-center gap-1.5 text-slate-800">
              <Calendar className="w-4 h-4 text-amber-600" /> Operating Days / Year
            </label>
            <span className="font-mono font-black text-amber-700 text-sm">
              {workingDaysPerYear} days
            </span>
          </div>
          <input
            id="roi-days"
            type="range"
            min="200"
            max="365"
            step="5"
            value={workingDaysPerYear}
            onChange={(e) => setWorkingDaysPerYear(parseInt(e.target.value, 10))}
            className="w-full accent-amber-600 h-2 rounded-lg cursor-pointer"
            aria-label="Operating days per year slider"
          />
          <p className="text-[11px] text-slate-500">Standard Indian retail (300) or 24/7 e-commerce (365)</p>
        </div>
      </div>

      {/* Financial Impact Cards in INR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Direct Savings */}
        <div className="rounded-2xl p-4.5 border bg-[#F0FDF4] border-[#BBF7D0] space-y-1 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800 block">
            Daily Direct Savings
          </span>
          <div className="text-2xl font-black font-mono text-emerald-900">
            {formatINR(dailySavingsINR)}
          </div>
          <span className="text-xs text-emerald-800 font-mono block">
            {formatIndianNumber(metersSavedPerDay * (workerCount / 50 || 1))} meters eliminated/day
          </span>
        </div>

        {/* Annual Labor Savings */}
        <div className="rounded-2xl p-4.5 border bg-[#F0F9FF] border-[#BAE6FD] space-y-1 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-bold text-sky-800 block">
            Annual Labor Savings
          </span>
          <div className="text-2xl font-black font-mono text-sky-950 flex items-baseline gap-1.5">
            {formatINR(annualSavingsINR)}
            <span className="text-xs font-semibold text-sky-700">
              ({formatINR(annualSavingsINR, true)})
            </span>
          </div>
          <span className="text-xs text-sky-800 font-medium block">
            Based on {workingDaysPerYear} operational shift days
          </span>
        </div>

        {/* 3-Year Cumulative Savings */}
        <div className="rounded-2xl p-4.5 border bg-[#F5F3FF] border-[#DDD6FE] space-y-1 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-bold text-purple-900 block">
            3-Year Cumulative Savings
          </span>
          <div className="text-2xl font-black font-mono text-purple-950 flex items-baseline gap-1.5">
            {formatINR(threeYearSavingsINR)}
            <span className="text-xs font-semibold text-purple-700">
              ({formatINR(threeYearSavingsINR, true)})
            </span>
          </div>
          <span className="text-xs text-purple-800 font-medium block">Zero ongoing license overhead</span>
        </div>

        {/* Productive Hours Recovered */}
        <div className="rounded-2xl p-4.5 border bg-[#FEFCE8] border-[#FEF08A] space-y-1 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-bold text-amber-900 block">
            Productive Hours Recovered
          </span>
          <div className="text-2xl font-black font-mono text-amber-950">
            {formatIndianNumber(hoursSavedPerYear)}{' '}
            <span className="text-xs font-normal text-amber-800">hrs/yr</span>
          </div>
          <span className="text-xs text-amber-800 font-medium block">
            {hoursSavedPerDay.toFixed(1)} walking hours saved per shift
          </span>
        </div>
      </div>

      {/* Strategic Capital Expenditure Comparison (Rupees) */}
      <div className="rounded-2xl p-5 border bg-white border-slate-200 text-slate-900 space-y-4 shadow-xs">
        <h3 className="text-sm font-extrabold flex items-center gap-2">
          <Building className="w-4 h-4 text-emerald-600" /> Capital Strategy Comparison: Software Re-Slotting vs Facility Expansion (India)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Strategy A: OptiWare */}
          <div className="p-4 rounded-xl border bg-[#ECFDF5] border-[#A7F3D0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-950 text-sm">
                Strategy A: OptiWare AI Re-Slotting
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-xs font-bold">
                ₹0 CAP-EX
              </span>
            </div>

            <ul className="space-y-2 text-emerald-950 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>+29.0% Density Increase:</strong> Recovers cubic dead zones (52% → 81% rack utilization) within existing physical footprint.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>-40.0% Picker Travel:</strong> Cuts daily walking from 4,850m to 2,910m immediately on day 1 across Bhiwandi/Gurugram aisles.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Instant Implementation:</strong> Deployed in minutes without warehouse municipal approvals, civil construction, or downtime.
                </span>
              </li>
            </ul>
          </div>

          {/* Strategy B: Physical Racks */}
          <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-800 text-sm">
                Strategy B: Purchasing Additional Racks
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono text-xs font-bold">
                ~₹15,00,000 CAP-EX (₹15 Lakhs)
              </span>
            </div>

            <ul className="space-y-2 text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>6–12 Month Lead Times:</strong> Heavy steel rack fabrication, seismic floor bolting, safety clearances, and supply delays.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingDown className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Worsens Picker Fatigue:</strong> Adding distant aisles forces pickers to walk even further without intelligence.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Higher Ongoing Overhead:</strong> Inflates industrial real estate leasing in Tier-1 logistics corridors (Bhiwandi, Bilaspur, Hoskote).
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
