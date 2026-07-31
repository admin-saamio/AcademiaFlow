"use client";

import React, { useState } from "react";
import { PGRecord } from "@/types/academic";
import { BookOpen, Layers, Plus, Trash2, Save } from "lucide-react";

interface PGCalculatorProps {
  data: PGRecord[];
  onChange: (updated: PGRecord[]) => void;
}

export function PGCalculator({ data, onChange }: PGCalculatorProps) {
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleAddDegree = () => {
    const newDegree: PGRecord = {
      id: `pg-${Date.now()}`,
      degreeName: `Postgraduate Degree ${data.length + 1}`,
      universityName: "",
      durationYears: 2,
      semesters: Array.from({ length: 4 }, (_, i) => ({
        semNumber: i + 1,
        sgpa: 0,
      })),
    };
    onChange([...data, newDegree]);
  };

  const handleRemoveDegree = (id: string) => {
    onChange(data.filter((d) => d.id !== id));
  };

  const updateDegree = (id: string, updated: PGRecord) => {
    onChange(data.map((d) => (d.id === id ? updated : d)));
  };

  const handleInputChange = (id: string, field: keyof PGRecord, value: any) => {
    const degree = data.find((d) => d.id === id);
    if (degree) {
      updateDegree(id, { ...degree, [field]: value });
    }
  };

  const handleDurationChange = (degreeId: string, years: number) => {
    const degree = data.find((d) => d.id === degreeId);
    if (!degree) return;

    const requiredSems = years * 2;
    let currentSems = [...degree.semesters];

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

    updateDegree(degreeId, {
      ...degree,
      durationYears: years,
      semesters: currentSems,
    });
  };

  const handleSgpaChange = (degreeId: string, semIndex: number, sgpaValue: number) => {
    const degree = data.find((d) => d.id === degreeId);
    if (!degree) return;

    const updatedSems = degree.semesters.map((sem, idx) => {
      if (idx === semIndex) {
        return { ...sem, sgpa: sgpaValue };
      }
      return sem;
    });
    updateDegree(degreeId, { ...degree, semesters: updatedSems });
  };

  const handleSaveLocally = () => {
    setSavedMessage(`Saved Postgraduate Degrees!`);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-montserrat">Postgraduate Records</h3>
        <div className="flex gap-2">
          <button
            onClick={handleAddDegree}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Degree
          </button>
          <button
            onClick={handleSaveLocally}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-200 text-sm font-semibold animate-in fade-in">
          ✓ {savedMessage}
        </div>
      )}

      {data.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
          <BookOpen className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="text-slate-500 font-medium">No postgraduate records. Click "Add Degree" to start.</p>
        </div>
      ) : (
        data.map((degree) => {
          // Compute overall Master's CGPA
          const validSgpas = degree.semesters.map((s) => Number(s.sgpa)).filter((v) => v > 0);
          const mastersCgpa =
            validSgpas.length > 0
              ? (validSgpas.reduce((a, b) => a + b, 0) / validSgpas.length).toFixed(2)
              : "0.00";

          return (
            <div key={degree.id} className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
              <button
                onClick={() => handleRemoveDegree(degree.id)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                title="Remove Degree"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Form Details */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4 pr-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Master's Degree Name
                    </label>
                    <input
                      type="text"
                      value={degree.degreeName}
                      onChange={(e) => handleInputChange(degree.id, "degreeName", e.target.value)}
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
                      value={degree.universityName}
                      onChange={(e) => handleInputChange(degree.id, "universityName", e.target.value)}
                      placeholder="e.g. Indian Institute of Science"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>


              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
