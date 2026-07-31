"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { AcademicLevelSelector } from "@/components/AcademicLevelSelector";
import { SchoolCalculator } from "@/components/SchoolCalculator";
import { UGCalculator } from "@/components/UGCalculator";
import { PGCalculator } from "@/components/PGCalculator";
import { PhDTracker } from "@/components/PhDTracker";
import { ProductivitySuite } from "@/components/ProductivitySuite";
import { SaveControl } from "@/components/SaveControl";
import { AcademiaFlowState, AcademicLevel } from "@/types/academic";
import { INITIAL_ACADEMIC_STATE } from "@/lib/utils";
import { Sparkles, Calculator, BookOpen, Layers } from "lucide-react";
import { BottomNav, NavTab } from "@/components/BottomNav";

export default function Home() {
  const [state, setState] = useState<AcademiaFlowState>(INITIAL_ACADEMIC_STATE);
  const [isLoaded, setIsLoaded] = useState(false);


  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("academiaflow_draft");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && parsed.academicLevel) {
          setState(parsed);
        }
      }
    } catch (err) {
      console.warn("Failed to load local draft:", err);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on state change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("academiaflow_draft", JSON.stringify(state));
      } catch (err) {
        console.warn("Failed to save local draft:", err);
      }
    }
  }, [state, isLoaded]);

  // Level selector handler
  const handleSelectLevel = (level: AcademicLevel) => {
    setState((prev) => ({ ...prev, academicLevel: level }));
  };

  const handleSelectGrade = (grade: string) => {
    setState((prev) => ({
      ...prev,
      school: { ...prev.school, grade },
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      {/* TOP NAVIGATION BAR */}
      <Navbar />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-y-auto">
        

              </div>
            </div>

            {/* INITIAL ACADEMIC LEVEL SELECTOR */}
            <AcademicLevelSelector
              currentLevel={state.academicLevel}
              selectedGrade={state.school.grade}
              onSelectLevel={(level) => {
                handleSelectLevel(level);
                // Auto-switch to calculators tab when a level is selected
                setActiveTab("calculators");
              }}
              onSelectGrade={handleSelectGrade}
            />
          </div>
        )}

        {activeTab === "calculators" && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            {/* DYNAMIC MARKS ENTRY & YEAR-TO-SEMESTER UNLOCKING LOGIC */}
            <section className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                      Marks & Credits Calculator
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-montserrat capitalize">
                      {state.academicLevel === "school"
                        ? `School Marks Calculator (${state.school.grade})`
                        : state.academicLevel === "undergraduate"
                        ? "Undergraduate (Bachelor's) Semester Breakdown"
                        : state.academicLevel === "postgraduate"
                        ? "Postgraduate (Master's) SGPA & CGPA Logic"
                        : "Doctorate (Ph.D.) Research & Coursework Log"}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("home")}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 min-h-[44px]"
                  >
                    Change Level
                  </button>
                  <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400 min-h-[44px] items-center">
                    Dynamic Calculator Active
                  </span>
                </div>
              </div>

              {/* DYNAMIC CALCULATOR COMPONENT */}
              {state.academicLevel === "school" && (
                <SchoolCalculator
                  data={state.school}
                  onChange={(updated) => setState((prev) => ({ ...prev, school: updated }))}
                />
              )}

              {state.academicLevel === "undergraduate" && (
                <UGCalculator
                  data={state.undergraduate}
                  onChange={(updated) => setState((prev) => ({ ...prev, undergraduate: updated }))}
                />
              )}

              {state.academicLevel === "postgraduate" && (
                <PGCalculator
                  data={state.postgraduate}
                  onChange={(updated) => setState((prev) => ({ ...prev, postgraduate: updated }))}
                />
              )}

              {state.academicLevel === "doctorate" && (
                <PhDTracker
                  data={state.doctorate}
                  onChange={(updated) => setState((prev) => ({ ...prev, doctorate: updated }))}
                />
              )}
            </section>
          </div>
        )}

        {activeTab === "productivity" && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            {/* STUDENT PRODUCTIVITY SUITE */}
            <ProductivitySuite
              todos={state.todos}
              revisions={state.revisions}
              notes={state.notes || []}
              onUpdateTodos={(updatedTodos) =>
                setState((prev) => ({ ...prev, todos: updatedTodos }))
              }
              onUpdateRevisions={(updatedRevisions) =>
                setState((prev) => ({ ...prev, revisions: updatedRevisions }))
              }
              onUpdateNotes={(updatedNotes) =>
                setState((prev) => ({ ...prev, notes: updatedNotes }))
              }
            />

    </div>
  );
}
