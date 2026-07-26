"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveUserAcademicRecord } from "@/lib/firebase";
import { AcademicTrackerState } from "@/types/academic";
import { Cloud, Save, CheckCircle2, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

interface SaveControlProps {
  state: AcademicTrackerState;
}

export function SaveControl({ state }: SaveControlProps) {
  const { user, signInGoogle } = useAuth();
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [autoSavedTime, setAutoSavedTime] = useState<string | null>(null);

  // Silent Background Auto-Save to LocalStorage draft
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("academic_tracker_draft", JSON.stringify(state));
        setAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.warn("LocalStorage auto-save failed:", err);
      }
    }, 1000); // 1 sec debounce

    return () => clearTimeout(timer);
  }, [state]);

  const handleCloudSave = async () => {
    if (!user) {
      setToastMessage("Please sign in with Google to save your records to the cloud.");
      setTimeout(() => setToastMessage(null), 4000);
      signInGoogle();
      return;
    }

    setSaving(true);
    const success = await saveUserAcademicRecord(user.uid, state);
    setSaving(false);

    if (success) {
      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
      });

      setToastMessage("Record saved successfully to your Google Account!");
    } else {
      setToastMessage("Saved to local browser storage draft!");
    }

    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="w-full space-y-4">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-md">
          <div className="bg-slate-900 text-white dark:bg-emerald-600 dark:text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-white shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Save Bar */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Cloud Firestore Synchronization
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" /> Auto-Synced
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {autoSavedTime ? `Draft auto-saved locally at ${autoSavedTime}` : "Real-time debounced draft saving enabled"}
            </p>
          </div>
        </div>

        {/* Primary Save Button */}
        <button
          onClick={handleCloudSave}
          disabled={saving}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 font-montserrat"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving Record..." : "💾 Save Complete Record to Cloud"}
        </button>
      </div>
    </div>
  );
}
