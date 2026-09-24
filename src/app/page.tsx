"use client";

import React, { useState } from "react";
import PreFlightAuditor from "@/components/PreFlightAuditor";
import RejectionParser from "@/components/RejectionParser";
import FunnelDashboard from "@/components/FunnelDashboard";
import ApiKeyModal from "@/components/ApiKeyModal";
import { 
  ShieldCheck, 
  Compass, 
  TrendingUp, 
  Heart, 
  Settings, 
  Github, 
  ExternalLink 
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"AUDITOR" | "REJECTION" | "FUNNEL">("AUDITOR");
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">The Date Crew</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Matchmaker Copilot
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Product Engineer Assessment Prototype</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{apiKey ? "Gemini Key Configured" : "AI Settings"}</span>
            </button>

            <a
              href="https://github.com/debojyoti/matchmaker-copilot"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap sm:flex-nowrap gap-1">
          <button
            onClick={() => setActiveTab("AUDITOR")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition ${
              activeTab === "AUDITOR"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>1. Pre-Flight Match Auditor</span>
          </button>

          <button
            onClick={() => setActiveTab("REJECTION")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition ${
              activeTab === "REJECTION"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>2. Rejection Intelligence Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("FUNNEL")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition ${
              activeTab === "FUNNEL"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>3. Funnel & Impact Model</span>
          </button>
        </div>

        {/* View Content */}
        {activeTab === "AUDITOR" && <PreFlightAuditor />}
        {activeTab === "REJECTION" && <RejectionParser apiKey={apiKey} />}
        {activeTab === "FUNNEL" && <FunnelDashboard />}

        {/* Assessment Context Footer Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs text-slate-500 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-800">
              The Date Crew — Product Engineer Assessment Submission
            </p>
            <p className="mt-0.5">
              Built by Debojyoti Dey. Targets the 35% preventable rejection rate and closes the Matchmaker A (44%) vs B (21%) variance.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
              Next.js 14 • TypeScript • Tailwind
            </span>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={(k) => setApiKey(k)}
      />
    </main>
  );
}
