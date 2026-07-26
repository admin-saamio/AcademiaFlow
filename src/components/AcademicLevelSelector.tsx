"use client";

import React from "react";
import { AcademicLevel } from "@/types/academic";
import { GraduationCap, School, BookOpen, Award, Check } from "lucide-react";

interface AcademicLevelSelectorProps {
  currentLevel: AcademicLevel;
  selectedGrade: string;
  onSelectLevel: (level: AcademicLevel) => void;
  onSelectGrade: (grade: string) => void;
}

export function AcademicLevelSelector({
  currentLevel,
  selectedGrade,
  onSelectLevel,
  onSelectGrade,
}: AcademicLevelSelectorProps) {
  const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

  return (
    <section className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Step 1: Configuration
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-montserrat tracking-tight">
          Select Your Current Academic Level
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Tailor your grade records, credit metrics, and revision productivity workflows.
        </p>
      </div>

      {/* Main Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Option Group A: School Education */}
        <div
          onClick={() => onSelectLevel("school")}
          className={`cursor-pointer group relative p-5 rounded-2xl border transition-all duration-200 ${
            currentLevel === "school"
              ? "bg-gradient-to-b from-emerald-500/10 to-teal-500/5 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10"
              : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/70 hover:border-emerald-500/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${currentLevel === "school" ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
              <School className="w-6 h-6" />
            </div>
            {currentLevel === "school" && (
              <span className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white font-montserrat">
            School Education
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Grades 1 through 12 mark sheets and annual exam percentage trackers.
          </p>
        </div>

        {/* Option Group B: Undergraduate Degree */}
        <div
          onClick={() => onSelectLevel("undergraduate")}
          className={`cursor-pointer group relative p-5 rounded-2xl border transition-all duration-200 ${
            currentLevel === "undergraduate"
              ? "bg-gradient-to-b from-emerald-500/10 to-teal-500/5 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10"
              : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/70 hover:border-emerald-500/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${currentLevel === "undergraduate" ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            {currentLevel === "undergraduate" && (
              <span className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white font-montserrat">
            Undergraduate (Bachelor's)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            B.Tech, B.Sc, B.Com multi-year semester SGPA & cumulative CGPA logic.
          </p>
        </div>

        {/* Option Group C: Postgraduate Degree */}
        <div
          onClick={() => onSelectLevel("postgraduate")}
          className={`cursor-pointer group relative p-5 rounded-2xl border transition-all duration-200 ${
            currentLevel === "postgraduate"
              ? "bg-gradient-to-b from-emerald-500/10 to-teal-500/5 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10"
              : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/70 hover:border-emerald-500/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${currentLevel === "postgraduate" ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
              <BookOpen className="w-6 h-6" />
            </div>
            {currentLevel === "postgraduate" && (
              <span className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white font-montserrat">
            Postgraduate (Master's)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            M.Tech, M.Sc, MBA credit structures & Master's thesis evaluation.
          </p>
        </div>

        {/* Option Group D: Doctorate Degree */}
        <div
          onClick={() => onSelectLevel("doctorate")}
          className={`cursor-pointer group relative p-5 rounded-2xl border transition-all duration-200 ${
            currentLevel === "doctorate"
              ? "bg-gradient-to-b from-emerald-500/10 to-teal-500/5 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10"
              : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/70 hover:border-emerald-500/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${currentLevel === "doctorate" ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
              <Award className="w-6 h-6" />
            </div>
            {currentLevel === "doctorate" && (
              <span className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white font-montserrat">
            Doctorate Degree (Ph.D.)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Coursework CGPA, dissertation defense status, and publication log.
          </p>
        </div>
      </div>

      {/* Sub-selector for School Grades (1 to 12) */}
      {currentLevel === "school" && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Select Grade (1 through 12):
            </h4>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              Active: {selectedGrade}
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {grades.map((grade) => {
              const isSelected = selectedGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => onSelectGrade(grade)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {grade.replace("Grade ", "Gr. ")}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
