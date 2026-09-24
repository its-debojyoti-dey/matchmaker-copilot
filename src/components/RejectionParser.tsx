"use client";

import React, { useState } from "react";
import { MOCK_REJECTION_PRESETS } from "../data/mockData";
import { RejectionAnalysis } from "../types";
import { 
  Sparkles, 
  AlertOctagon, 
  Compass, 
  Camera, 
  HelpCircle, 
  ArrowRight, 
  Tag, 
  CheckCircle,
  RefreshCw
} from "lucide-react";

interface RejectionParserProps {
  apiKey: string;
}

export default function RejectionParser({ apiKey }: RejectionParserProps) {
  const [feedbackText, setFeedbackText] = useState<string>(MOCK_REJECTION_PRESETS[0].sampleText);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<RejectionAnalysis | null>(null);

  const handleRunAnalysis = async (textToAnalyze?: string) => {
    const text = textToAnalyze || feedbackText;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackText: text,
          apiKey: apiKey || undefined,
          provider: apiKey ? "gemini" : "local",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      }
    } catch (err) {
      console.error("Classification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (sampleText: string) => {
    setFeedbackText(sampleText);
    handleRunAnalysis(sampleText);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/70 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Rejection Feedback Intelligence Engine</h2>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
                Transforms Unstructured Text into Structured Tags
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Matchmakers receive subjective, emotional emails from clients. This NLP module parses the raw text into structured root-cause categories, isolates <strong>human matchmaker error</strong> from <strong>newly revealed client preferences</strong>, and updates client records automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          One-Click Test Presets from Real Matchmaking Scenarios:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MOCK_REJECTION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.sampleText)}
              className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition text-xs space-y-1.5"
            >
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>{preset.label.split(":")[0]}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{preset.hint}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Raw Inbound Client Rejection Email
          </label>
          <span className="text-xs text-slate-400">Paste any feedback email from a client</span>
        </div>

        <textarea
          rows={4}
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Paste client email text here..."
          className="w-full p-3.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-500">
            {apiKey ? "Using Gemini Flash Live Model" : "Using High-Speed Heuristic Classifier (Zero latency)"}
          </span>
          <button
            onClick={() => handleRunAnalysis()}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Classify Rejection Feedback
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Classified Root Cause</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{analysis.categoryLabel}</h3>
            </div>

            <div>
              {analysis.isOperationalError ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-800 font-bold text-xs rounded-xl border border-rose-300">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  OPERATIONAL ERROR (MISSED PREFERENCE)
                </div>
              ) : analysis.category === "REVEALED_PREFERENCE" ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-300">
                  <Compass className="w-4 h-4 text-blue-600" />
                  REVEALED CLIENT PREFERENCE
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 font-bold text-xs rounded-xl border border-purple-300">
                  <Camera className="w-4 h-4 text-purple-600" />
                  AESTHETIC / VIBE CALIBRATION
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                Underlying Reason Extracted:
              </span>
              <p className="text-slate-600 leading-relaxed">{analysis.extractedReason}</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                Stated Preference vs. Reality:
              </span>
              <p className="text-slate-600 leading-relaxed">{analysis.clientStatedPreferenceVsReality}</p>
            </div>
          </div>

          {/* Action & Profile Update */}
          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-bold">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              Automated System Actions & Profile Calibration:
            </div>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Operator Guidance:</strong> {analysis.recommendedAction}
              </p>
              <p>
                <strong>Dynamic Profile Update:</strong> {analysis.impactOnClientProfile}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
