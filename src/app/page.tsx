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
import { Sparkles, Calculator, BookOpen, Layers, Zap } from "lucide-react";
import { BottomNav, NavTab } from "@/components/BottomNav";
import { Preloader } from "@/components/Preloader";

export default function Home() {
  const [state, setState] = useState<AcademiaFlowState>(INITIAL_ACADEMIC_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("home");

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
      <Preloader />
      {/* TOP NAVIGATION BAR */}
      <Navbar />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-y-auto">
        
        {activeTab === "home" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            {/* HERO INTRO BANNER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-10 text-white shadow-2xl border border-slate-700/50">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="flex flex-col gap-4 items-start sm:w-2/3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5" /> Unleash Your Potential
                  </span>

                  <h1 className="text-3xl sm:text-5xl font-black font-montserrat tracking-tight leading-tight">
                    Engineer Your Success with Elite Focus.
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300">
                    Built for high-performers. Turn your academic trajectory into actionable data. Track, optimize, and dominate every degree program with absolute privacy and precision.
                  </p>
                </div>
              </div>
            </div>

            {/* STUDENT NAME INPUT */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                What's your name?
              </label>
              <input
                type="text"
                value={state.studentName || ""}
                onChange={(e) => setState((prev) => ({ ...prev, studentName: e.target.value }))}
                placeholder="Enter your name..."
                className="w-full sm:max-w-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
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
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                        Marks & Credits Calculator
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-montserrat capitalize">
                        {state.academicLevel === "school"
                          ? `School Marks Calculator`
                          : state.academicLevel === "undergraduate"
                          ? "Undergraduate Calculator"
                          : state.academicLevel === "postgraduate"
                          ? "Postgraduate Calculator"
                          : "Doctorate Log"}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 shrink-0">
                  <select
                    value={state.academicLevel}
                    onChange={(e) => handleSelectLevel(e.target.value as AcademicLevel)}
                    className="appearance-none px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[44px] w-full sm:w-auto"
                  >
                    <option value="school">School</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="postgraduate">Postgraduate</option>
                    <option value="doctorate">Doctorate</option>
                  </select>

                  {state.academicLevel === "school" && (
                    <select
                      value={state.school.grade}
                      onChange={(e) => handleSelectGrade(e.target.value)}
                      className="appearance-none px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[44px] w-full sm:w-auto"
                    >
                      {Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`).map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  )}
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
        )}

        {activeTab === "data" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
            {/* DATA MANAGEMENT & EXPORT/IMPORT */}
            <SaveControl state={state} onImport={(newState) => setState(newState)} />

            {/* FOOTER inside data tab */}
            <footer className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-6 shadow-xl">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                &copy; 2026 AcademiaFlow. All rights reserved. &mdash; Empowering students worldwide with intelligent grade tracking & productivity workflows.
              </p>
              <div className="flex justify-center">
                <a
                  href="https://saamio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:-translate-y-0.5 min-h-[44px]"
                >
                  Powered by Saamio
                </a>
              </div>
            </footer>
          </div>
        )}

      </main>

      {/* MOBILE APP BOTTOM NAVIGATION */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
