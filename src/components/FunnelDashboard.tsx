"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  ArrowDown, 
  Percent, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from "lucide-react";

export default function FunnelDashboard() {
  const [activeTab, setActiveTab] = useState<"BASELINE" | "PROJECTED">("PROJECTED");

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/70 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Funnel Economics & System Impact</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                Mathematical Modeling
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Comparison between The Date Crew's 30-day baseline data versus projected performance after deploying the Pre-Flight Match Auditor and Rejection Parser.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Preventable Rejection Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">35.0%</span>
            <span className="text-sm font-bold text-emerald-600">→ 2.5%</span>
          </div>
          <p className="text-[11px] text-slate-500">241 dead-on-arrival dispatches eliminated</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Profile Acceptance Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">31.0%</span>
            <span className="text-sm font-bold text-emerald-600">→ 43.5%</span>
          </div>
          <p className="text-[11px] text-slate-500">+125 additional accepted matches</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Matchmaker B Acceptance</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">21.0%</span>
            <span className="text-sm font-bold text-emerald-600">→ 38.0%</span>
          </div>
          <p className="text-[11px] text-slate-500">Closes the 2x human skill gap with A (44%)</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Search Time / Client Week</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">2.0 hrs</span>
            <span className="text-sm font-bold text-emerald-600">→ 0.4 hrs</span>
          </div>
          <p className="text-[11px] text-slate-500">Saves ~24 hours/week per operator</p>
        </div>
      </div>

      {/* Visual Funnel Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Matchmaking Funnel Progression (30 Days)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Top-of-funnel precision compounds through every downstream conversion step.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab("BASELINE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "BASELINE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Assessment Baseline
            </button>
            <button
              onClick={() => setActiveTab("PROJECTED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "PROJECTED" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Post-Auditor Projected (+81%)
            </button>
          </div>
        </div>

        {/* Funnel Visual Steps */}
        <div className="space-y-3">
          {/* Step 1 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
              <span>1. Profiles Shared to Clients</span>
              <span>1,000 profiles</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-slate-700 h-full w-full rounded-full" />
            </div>
          </div>

          {/* Step 2 */}
          <div className={`p-3.5 rounded-xl border ${
            activeTab === "PROJECTED" ? "bg-emerald-50/50 border-emerald-200" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
              <span className="flex items-center gap-2">
                2. Profiles Accepted
                {activeTab === "PROJECTED" && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                    +120 Accepted (Deal-breakers blocked)
                  </span>
                )}
              </span>
              <span className={activeTab === "PROJECTED" ? "text-emerald-700" : "text-slate-800"}>
                {activeTab === "PROJECTED" ? "430 profiles (43.0%)" : "310 profiles (31.0%)"}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeTab === "PROJECTED" ? "bg-emerald-600" : "bg-slate-500"
                }`}
                style={{ width: activeTab === "PROJECTED" ? "43%" : "31%" }}
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
              <span>3. Contact Details Shared</span>
              <span>{activeTab === "PROJECTED" ? "295 pairs (68.6%)" : "210 pairs (67.7%)"}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeTab === "PROJECTED" ? "bg-emerald-500" : "bg-slate-500"
                }`}
                style={{ width: activeTab === "PROJECTED" ? "29.5%" : "21%" }}
              />
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
              <span>4. Conversations Started</span>
              <span>{activeTab === "PROJECTED" ? "215 conversations (72.8%)" : "150 conversations (71.4%)"}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeTab === "PROJECTED" ? "bg-teal-500" : "bg-slate-500"
                }`}
                style={{ width: activeTab === "PROJECTED" ? "21.5%" : "15%" }}
              />
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
              <span>5. Meetings Fixed</span>
              <span>{activeTab === "PROJECTED" ? "120 meetings (55.8%)" : "75 meetings (50.0%)"}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeTab === "PROJECTED" ? "bg-cyan-600" : "bg-slate-500"
                }`}
                style={{ width: activeTab === "PROJECTED" ? "12%" : "7.5%" }}
              />
            </div>
          </div>

          {/* Step 6 */}
          <div className={`p-4 rounded-xl border ${
            activeTab === "PROJECTED" ? "bg-emerald-100/50 border-emerald-300" : "bg-slate-100 border-slate-200"
          }`}>
            <div className="flex justify-between text-xs font-extrabold text-slate-900 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                6. Meetings Completed (North Star Metric)
              </span>
              <span className={activeTab === "PROJECTED" ? "text-emerald-700 text-sm" : "text-slate-900 text-sm"}>
                {activeTab === "PROJECTED" ? "76 Completed Dates (+81%)" : "42 Completed Dates"}
              </span>
            </div>
            <div className="w-full bg-slate-300 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeTab === "PROJECTED" ? "bg-emerald-600" : "bg-slate-600"
                }`}
                style={{ width: activeTab === "PROJECTED" ? "7.6%" : "4.2%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Takeaway for Leadership */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 text-xs space-y-2">
        <h4 className="font-bold text-rose-400 uppercase tracking-wider text-[11px]">
          Product Engineer Insight for Leadership:
        </h4>
        <p className="text-slate-300 leading-relaxed">
          Completed meetings almost double from <strong>42 to 76</strong> without needing to hire more matchmakers or source more leads. Why? Because eliminating dead-on-arrival recommendations protects client trust early in the cycle, leading to higher conversation momentum and lower cancellation rates.
        </p>
      </div>
    </div>
  );
}
