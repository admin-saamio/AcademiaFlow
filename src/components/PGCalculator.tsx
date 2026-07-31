"use client";

import React from "react";
import { PGRecord } from "@/types/academic";
import { BookOpen, Layers } from "lucide-react";

interface PGCalculatorProps {
  data: PGRecord;
  onChange: (updated: PGRecord) => void;
}

export function PGCalculator({ data, onChange }: PGCalculatorProps) {
  const handleInputChange = (field: keyof PGRecord, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleDurationChange = (years: number) => {
    const requiredSems = years * 2;
    let currentSems = [...data.semesters];

    if (currentSems.length < requiredSems) {
      for (let i = currentSems.length; i < requiredSems; i++) {
        currentSems.push({
          semNumber: i + 1,
          sgpa: 0,
        });
      }
    } else if (currentSems.length > requiredSems) {
      currentSems = currentSems.slice(0, requiredSems);
    }

    onChange({
      ...data,
      durationYears: years,
      semesters: currentSems,
    });
  };

  const handleSgpaChange = (semIndex: number, sgpaValue: number) => {
    const updatedSems = data.semesters.map((sem, idx) => {
      if (idx === semIndex) {
        return { ...sem, sgpa: sgpaValue };
      }
      return sem;
    });
    onChange({ ...data, semesters: updatedSems });
  };

  // Compute overall Master's CGPA
  const validSgpas = data.semesters.map((s) => Number(s.sgpa)).filter((v) => v > 0);
  const mastersCgpa =
    validSgpas.length > 0
      ? (validSgpas.reduce((a, b) => a + b, 0) / validSgpas.length).toFixed(2)
      : "0.00";

  return (
    <div className="space-y-6">
      {/* Form Details */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Master's Degree Name
            </label>
            <input
              type="text"
              value={data.degreeName}
              onChange={(e) => handleInputChange("degreeName", e.target.value)}
              placeholder="e.g. M.Tech in Artificial Intelligence"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              University Name
            </label>
            <input
              type="text"
              value={data.universityName}
              onChange={(e) => handleInputChange("universityName", e.target.value)}
              placeholder="e.g. Indian Institute of Science"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Program Duration Selector */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Master's Program Duration:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((yrs) => {
              const active = data.durationYears === yrs;
              return (
                <button
                  key={yrs}
                  onClick={() => handleDurationChange(yrs)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    active
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500/50"
                  }`}
                >
                  <span className="block font-extrabold text-sm">{yrs} Year{yrs > 1 ? "s" : ""}</span>
                  <span className={`text-xs ${active ? "text-emerald-100" : "text-slate-500"}`}>
                    Unlocks {yrs * 2} Semesters
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-600/20 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
            <BookOpen className="w-8 h-8 text-emerald-200" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
              Overall Master's CGPA
            </span>
            <h3 className="text-3xl font-black font-montserrat tracking-tight mt-0.5">
              {mastersCgpa} <span className="text-sm font-semibold text-emerald-200">/ 10</span>
            </h3>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-sm">
          <span className="block text-xs text-emerald-200">Recorded Semesters</span>
          <span className="text-lg font-bold">
            {validSgpas.length} of {data.semesters.length} Completed
          </span>
        </div>
      </div>

      {/* Semester SGPA Input Boxes */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4 overflow-x-auto max-w-full">
        <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-500" />
          Semester SGPA Entries ({data.semesters.length} Unlocked Boxes)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.semesters.map((sem, idx) => (
            <div
              key={sem.semNumber}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Semester {sem.semNumber}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                  SGPA
                </span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={sem.sgpa || ""}
                onChange={(e) => handleSgpaChange(idx, parseFloat(e.target.value) || 0)}
                placeholder="Enter SGPA (e.g. 9.30)"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
