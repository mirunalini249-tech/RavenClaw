import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Award,
  Layers
} from 'lucide-react';
import { JUDGE_DEFENSE_QUESTIONS, ARCHITECTURAL_EVALUATION } from '../data/benchmarkData';

export const JudgeDefenseGuide: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const filteredQAs = JUDGE_DEFENSE_QUESTIONS.filter((qa) => {
    const matchesSearch =
      qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qa.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qa.keyTakeaway.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || qa.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-extrabold flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-500" /> Hackathon Judicial Defense & Technical Rationale Guide
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            10 rigorous Q&A defenses addressing mathematical validation, irregular geometries, human trust, and commercial WMS integration.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="font-bold">Judicial Defense Ready</span>
        </div>
      </div>

      {/* Architectural Evaluation Matrix */}
      <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 space-y-4 shadow-2xs">
        <h3 className="text-sm font-extrabold flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-500" /> Solution Space Exploration: 5 Architectural Concepts
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Evaluated against 3-hour feasibility, operational impact, and zero-hardware-dependency execution certainty.
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wider font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <th scope="col" className="py-3 px-3.5">Architectural Concept</th>
                <th scope="col" className="py-3 px-3.5 text-center">Innovation</th>
                <th scope="col" className="py-3 px-3.5 text-center">3-Hour Feasibility</th>
                <th scope="col" className="py-3 px-3.5 text-center">Impact</th>
                <th scope="col" className="py-3 px-3.5 text-center">Dev Time</th>
                <th scope="col" className="py-3 px-3.5">External Risk</th>
                <th scope="col" className="py-3 px-3.5 text-center">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {ARCHITECTURAL_EVALUATION.map((arch) => (
                <tr
                  key={arch.concept}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors ${
                    arch.decision.includes('SELECTED') ? 'bg-emerald-50/50 dark:bg-emerald-950/20 font-medium' : ''
                  }`}
                >
                  <td className="py-3 px-3.5 font-bold">
                    {arch.concept}
                  </td>
                  <td className="py-3 px-3.5 text-center font-medium">{arch.innovation}</td>
                  <td className="py-3 px-3.5 text-center font-medium">{arch.feasibility}</td>
                  <td className="py-3 px-3.5 text-center font-medium">{arch.impact}</td>
                  <td className="py-3 px-3.5 text-center font-mono font-medium">
                    {arch.devTime}
                  </td>
                  <td className="py-3 px-3.5 text-slate-500 dark:text-slate-400">{arch.risk}</td>
                  <td className="py-3 px-3.5 text-center">
                    {arch.decision.includes('SELECTED') ? (
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                        {arch.decision}
                      </span>
                    ) : arch.decision.includes('Backup') ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                        {arch.decision}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">{arch.decision}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Q&A Accordion Controls */}
      <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search defense questions or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search judicial questions and answers"
              className="w-full min-h-[38px] pl-9 pr-3 py-1.5 text-xs rounded-xl border font-medium bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by defense category"
              className="min-h-[38px] px-3 py-1.5 text-xs rounded-xl border font-bold bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">All Categories (10)</option>
              <option value="AI & Math">AI & Math</option>
              <option value="Physics & Geometry">Physics & Geometry</option>
              <option value="Operational & Human">Operational & Human</option>
              <option value="Strategy & WMS">Strategy & WMS</option>
            </select>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredQAs.map((qa) => {
            const isExpanded = expandedId === qa.questionNumber;
            return (
              <div
                key={qa.questionNumber}
                className="rounded-xl border overflow-hidden bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 transition-all"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : qa.questionNumber)}
                  aria-expanded={isExpanded}
                  className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-mono font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      Q{qa.questionNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {qa.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold leading-snug">{qa.question}</h4>
                    </div>
                  </div>

                  <div className="text-slate-500 p-1 flex-shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="p-3 rounded-xl border text-xs bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                      <span className="font-extrabold block mb-0.5 text-emerald-800 dark:text-emerald-400">
                        Key Takeaway for Judges:
                      </span>
                      {qa.keyTakeaway}
                    </div>

                    <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-2 font-medium">
                      <p>{qa.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
