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
import { useAuth } from "@/context/AuthContext";
import { AcademicTrackerState, AcademicLevel } from "@/types/academic";
import { INITIAL_ACADEMIC_STATE } from "@/lib/utils";
import { Sparkles, Calculator, BookOpen, Layers } from "lucide-react";

export default function Home() {
  const { cloudData } = useAuth();
  const [state, setState] = useState<AcademicTrackerState>(INITIAL_ACADEMIC_STATE);

  // Synchronize state when Cloud Firestore data is retrieved upon Google Login
  useEffect(() => {
    if (cloudData) {
      setState(cloudData);
    } else {
      // Check local storage draft
      try {
        const savedDraft = localStorage.getItem("academic_tracker_draft");
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && parsed.academicLevel) {
            setState(parsed);
          }
        }
      } catch (err) {
        console.warn("Failed to load local draft:", err);
      }
    }
  }, [cloudData]);

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
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* 1. TOP NAVIGATION BAR */}
      <Navbar />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* HERO INTRO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-10 text-white shadow-2xl border border-slate-700/50">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Academic Tracking
            </span>
            
            <h1 className="text-3xl sm:text-5xl font-black font-montserrat tracking-tight leading-tight">
              Master Your Academic Journey & Student Productivity.
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300">
              Seamless score calculations for School (Grades 1–12), Bachelor's, Master's, and Ph.D. degrees with live year-to-semester unlocking and Cloud Firestore auto-sync.
            </p>
          </div>
        </div>

        {/* 2. STEP 1: INITIAL ACADEMIC LEVEL SELECTOR */}
        <AcademicLevelSelector
          currentLevel={state.academicLevel}
          selectedGrade={state.school.grade}
          onSelectLevel={handleSelectLevel}
          onSelectGrade={handleSelectGrade}
        />

        {/* 3. STEP 2: DYNAMIC MARKS ENTRY & YEAR-TO-SEMESTER UNLOCKING LOGIC */}
        <section className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                  Step 2: Marks & Credits Calculator
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

            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
              Dynamic Calculator Active
            </span>
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

        {/* 4. STUDENT PRODUCTIVITY SUITE */}
        <ProductivitySuite
          todos={state.todos}
          revisions={state.revisions}
          onUpdateTodos={(updatedTodos) =>
            setState((prev) => ({ ...prev, todos: updatedTodos }))
          }
          onUpdateRevisions={(updatedRevisions) =>
            setState((prev) => ({ ...prev, revisions: updatedRevisions }))
          }
        />

        {/* 5. REAL-TIME AUTO-SAVE & FIRESTORE DATABASE SYNCHRONIZATION */}
        <SaveControl state={state} />

      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            AcademicTracker. &copy; {new Date().getFullYear()} &mdash; Empowering students worldwide with intelligent grade tracking & productivity workflows.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-600">
            Powered by Next.js App Router, Tailwind CSS, and Firebase Cloud Firestore.
          </p>
        </div>
      </footer>
    </div>
  );
}
