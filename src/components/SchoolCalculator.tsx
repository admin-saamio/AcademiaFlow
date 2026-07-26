"use client";

import React from "react";
import { SchoolRecord, SubjectMarks } from "@/types/academic";
import { Plus, Trash2, Calculator, School as SchoolIcon, Award } from "lucide-react";

interface SchoolCalculatorProps {
  data: SchoolRecord;
  onChange: (updated: SchoolRecord) => void;
}

export function SchoolCalculator({ data, onChange }: SchoolCalculatorProps) {
  const handleInputChange = (field: keyof SchoolRecord, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddSubject = () => {
    const newSubject: SubjectMarks = {
      id: Date.now().toString(),
      name: `Subject ${data.subjects.length + 1}`,
      obtained: 85,
      max: 100,
    };
    onChange({ ...data, subjects: [...data.subjects, newSubject] });
  };

  const handleUpdateSubject = (id: string, field: keyof SubjectMarks, value: string | number) => {
    const updatedSubjects = data.subjects.map((sub) => {
      if (sub.id === id) {
        return { ...sub, [field]: value };
      }
      return sub;
    });
    onChange({ ...data, subjects: updatedSubjects });
  };

  const handleRemoveSubject = (id: string) => {
    onChange({ ...data, subjects: data.subjects.filter((sub) => sub.id !== id) });
  };

  // Real-time calculations
  const totalObtained = data.subjects.reduce((sum, s) => sum + (Number(s.obtained) || 0), 0);
  const totalMax = data.subjects.reduce((sum, s) => sum + (Number(s.max) || 0), 0);
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      {/* Overview & Form Header */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Exam Name
          </label>
          <input
            type="text"
            value={data.examName}
            onChange={(e) => handleInputChange("examName", e.target.value)}
            placeholder="e.g. Final Annual Exam"
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            School / Institution Name, City & Country
          </label>
          <input
            type="text"
            value={data.institutionName}
            onChange={(e) => handleInputChange("institutionName", e.target.value)}
            placeholder="e.g. St. Joseph School, Bangalore, India"
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Year of Completion
          </label>
          <input
            type="text"
            value={data.yearOfCompletion}
            onChange={(e) => handleInputChange("yearOfCompletion", e.target.value)}
            placeholder="e.g. 2024"
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Live Auto-Calculation Summary Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-600/20 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
            <Calculator className="w-8 h-8 text-emerald-200" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
              Real-Time Score Summary ({data.grade})
            </span>
            <h3 className="text-3xl font-black font-montserrat tracking-tight mt-0.5">
              {percentage}%
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <span className="block text-xs text-emerald-200">Total Marks Obtained</span>
            <span className="text-lg font-bold">{totalObtained}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <span className="block text-xs text-emerald-200">Maximum Marks</span>
            <span className="text-lg font-bold">{totalMax}</span>
          </div>
        </div>
      </div>

      {/* Subject Marks Entry Table */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            Subject Breakdown & Marks Entry
          </h4>
          <button
            onClick={handleAddSubject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>

        {data.subjects.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-500">
            No subjects added yet. Click "+ Add Subject" to start entering marks.
          </p>
        ) : (
          <div className="space-y-3">
            {data.subjects.map((sub, index) => {
              const subPercentage = sub.max > 0 ? ((sub.obtained / sub.max) * 100).toFixed(1) : 0;
              return (
                <div
                  key={sub.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-sm"
                >
                  <div className="sm:col-span-5">
                    <label className="sm:hidden block text-[10px] text-slate-400 font-semibold mb-1">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => handleUpdateSubject(sub.id, "name", e.target.value)}
                      placeholder={`Subject ${index + 1}`}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="sm:hidden block text-[10px] text-slate-400 font-semibold mb-1">
                      Obtained Marks
                    </label>
                    <input
                      type="number"
                      value={sub.obtained || ""}
                      onChange={(e) => handleUpdateSubject(sub.id, "obtained", parseFloat(e.target.value) || 0)}
                      placeholder="Obtained"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="sm:hidden block text-[10px] text-slate-400 font-semibold mb-1">
                      Max Marks
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={sub.max || ""}
                        onChange={(e) => handleUpdateSubject(sub.id, "max", parseFloat(e.target.value) || 0)}
                        placeholder="Max"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                      />
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 min-w-[45px] text-right">
                        {subPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      onClick={() => handleRemoveSubject(sub.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Remove Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
