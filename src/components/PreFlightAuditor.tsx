"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { MOCK_CLIENTS, MOCK_CANDIDATES } from "../data/mockData";
import { auditMatch } from "../lib/dealBreakerEngine";
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Send, 
  Copy, 
  Sparkles, 
  UserCheck, 
  Info,
  Check
} from "lucide-react";

export default function PreFlightAuditor() {
  const [selectedClientId, setSelectedClientId] = useState<string>(MOCK_CLIENTS[0].id);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(MOCK_CANDIDATES[0].id);
  const [copied, setCopied] = useState<boolean>(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState<boolean>(false);

  const selectedClient = useMemo(
    () => MOCK_CLIENTS.find((c) => c.id === selectedClientId) || MOCK_CLIENTS[0],
    [selectedClientId]
  );

  const selectedCandidate = useMemo(
    () => MOCK_CANDIDATES.find((c) => c.id === selectedCandidateId) || MOCK_CANDIDATES[0],
    [selectedCandidateId]
  );

  const auditResult = useMemo(
    () => auditMatch(selectedClient, selectedCandidate),
    [selectedClient, selectedCandidate]
  );

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(auditResult.pitchBlurb);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatch = () => {
    if (auditResult.overallStatus === "BLOCKED") return;
    setDispatchedSuccess(true);
    setTimeout(() => setDispatchedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner explaining the role of Pre-Flight Auditor */}
      <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border border-rose-200/70 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-md shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Pre-Flight Deal-Breaker Auditor</h2>
              <span className="text-xs bg-rose-100 text-rose-800 font-semibold px-2.5 py-0.5 rounded-full border border-rose-200">
                Solves 35% Preventable Rejections
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              In The Date Crew's 30-day assessment data, <strong>241 of 690 rejections (~35%)</strong> violated preferences already stated by the client (smoking, children, age). This gatekeeper performs deterministic verification before any profile recommendation email is dispatched.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Selection & Comparator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Client Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Client</span>
            <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-md">
              Assigned: {selectedClient.assignedMatchmaker}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
            >
              {MOCK_CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.age} yrs, {c.city} ({c.profession})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-4 pt-2">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
              <Image
                src={selectedClient.avatarUrl}
                alt={selectedClient.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1 text-sm">
              <h3 className="font-bold text-slate-900">{selectedClient.name}</h3>
              <p className="text-xs text-slate-500">{selectedClient.education} • {selectedClient.profession}</p>
              <p className="text-xs text-slate-600 line-clamp-2 italic">&ldquo;{selectedClient.bioSummary}&rdquo;</p>
            </div>
          </div>

          {/* Stated Deal-Breakers Grid */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              Stated Deal-Breakers on Intake File:
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Smoking</span>
                <span className="font-semibold text-slate-800">
                  {selectedClient.dealBreakers.smoking === "NON_SMOKER" ? "Strict Non-Smoker" : "Open"}
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Children</span>
                <span className="font-semibold text-slate-800">
                  {selectedClient.dealBreakers.children === "MUST_WANT_CHILDREN" ? "Must Want Children" : "Open"}
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Age Range</span>
                <span className="font-semibold text-slate-800">
                  {selectedClient.dealBreakers.ageRange[0]} – {selectedClient.dealBreakers.ageRange[1]} years
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                <span className="font-semibold text-slate-800">
                  {selectedClient.dealBreakers.allowedCities.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Candidate Selector */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Candidate Recommendation</span>
            <span className="text-xs text-slate-500 font-medium">Select candidate to evaluate</span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
            >
              {MOCK_CANDIDATES.map((cand) => (
                <option key={cand.id} value={cand.id}>
                  {cand.name} — {cand.age} yrs, {cand.city} ({cand.profession})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-4 pt-2">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
              <Image
                src={selectedCandidate.avatarUrl}
                alt={selectedCandidate.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">{selectedCandidate.name}</h3>
                <span className="text-xs text-slate-500">({selectedCandidate.age} yrs)</span>
              </div>
              <p className="text-xs text-slate-500">{selectedCandidate.company} • {selectedCandidate.education}</p>
              <p className="text-xs text-slate-600 line-clamp-2">&ldquo;{selectedCandidate.bio}&rdquo;</p>
            </div>
          </div>

          {/* Quick Scenario Preset Chips */}
          <div className="pt-1">
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
              Quick Test Scenarios for Reviewers:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {MOCK_CANDIDATES.map((cand) => {
                let badgeLabel = "Match";
                let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                if (cand.id === "cand-1") {
                  badgeLabel = "Test: Smoking Fail";
                  badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
                } else if (cand.id === "cand-2") {
                  badgeLabel = "Test: Child-free Fail";
                  badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
                } else if (cand.id === "cand-3") {
                  badgeLabel = "Test: Age Bound Fail";
                  badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                } else if (cand.id === "cand-4") {
                  badgeLabel = "Test: 100% Clean Pass";
                  badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                }

                return (
                  <button
                    key={cand.id}
                    onClick={() => setSelectedCandidateId(cand.id)}
                    className={`px-2.5 py-1 rounded-lg border font-medium text-xs transition ${
                      selectedCandidateId === cand.id ? "ring-2 ring-slate-800 font-bold" : "hover:opacity-80"
                    } ${badgeClass}`}
                  >
                    {badgeLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Live Audit Evaluation Result */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Deterministic Rule Verification Matrix</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                {auditResult.checks.length} rules checked
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluates Candidate attributes strictly against Client Deal-Breaker rules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Compatibility</span>
              <span className={`text-xl font-extrabold ${auditResult.compatibilityScore >= 75 ? "text-emerald-600" : "text-rose-600"}`}>
                {auditResult.compatibilityScore}%
              </span>
            </div>

            {auditResult.overallStatus === "BLOCKED" ? (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-100 text-rose-800 border border-rose-300 font-bold text-sm rounded-xl">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                DISPATCH BLOCKED
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-sm rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                DISPATCH APPROVED
              </div>
            )}
          </div>
        </div>

        {/* Breakdown of Checks */}
        <div className="space-y-2.5">
          {auditResult.checks.map((check) => (
            <div
              key={check.id}
              className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                check.status === "HARD_FAIL"
                  ? "bg-rose-50/70 border-rose-200"
                  : check.status === "WARNING"
                  ? "bg-amber-50/70 border-amber-200"
                  : "bg-emerald-50/40 border-emerald-100"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {check.status === "HARD_FAIL" ? (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : check.status === "WARNING" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{check.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      (Client: {check.clientRequirement} vs. Candidate: {check.candidateValue})
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{check.message}</p>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                {check.status === "HARD_FAIL" && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-rose-200 text-rose-900 rounded-md">
                    Hard Fail
                  </span>
                )}
                {check.status === "WARNING" && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-900 rounded-md">
                    Warning
                  </span>
                )}
                {check.status === "PASS" && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-200 text-emerald-900 rounded-md">
                    Pass
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pitch Blurb / Hard Failure Warning */}
        <div className={`p-4 rounded-xl border ${
          auditResult.overallStatus === "BLOCKED" 
            ? "bg-rose-50 border-rose-200 text-rose-900" 
            : "bg-slate-50 border-slate-200 text-slate-800"
        }`}>
          <div className="flex items-center justify-between pb-2">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              {auditResult.overallStatus === "BLOCKED" ? "Audit Intervention Notice" : "AI Suggested Matchmaker Pitch Email"}
            </span>
            {auditResult.overallStatus === "APPROVED" && (
              <button
                onClick={handleCopyPitch}
                className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Pitch"}
              </button>
            )}
          </div>
          <p className="text-xs leading-relaxed font-sans">{auditResult.pitchBlurb}</p>
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500">
            {auditResult.overallStatus === "BLOCKED" ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Dispatch blocked to protect client trust and prevent 35% rejection waste.
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Candidate is safe to share with client.
              </span>
            )}
          </div>

          <button
            onClick={handleDispatch}
            disabled={auditResult.overallStatus === "BLOCKED"}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition ${
              auditResult.overallStatus === "BLOCKED"
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-rose-600 hover:bg-rose-700 text-white hover:shadow-lg"
            }`}
          >
            <Send className="w-4 h-4" />
            {dispatchedSuccess ? "Dispatched Successfully!" : "Dispatch Profile to Client"}
          </button>
        </div>
      </div>
    </div>
  );
}
