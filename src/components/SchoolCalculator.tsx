"use client";

import React, { useState } from "react";
import { SchoolRecord, SchoolExam, SubjectMarks } from "@/types/academic";
import { Plus, Trash2, Calculator, School as SchoolIcon, Award, Save } from "lucide-react";

interface SchoolCalculatorProps {
  data: SchoolRecord;
  onChange: (updated: SchoolRecord) => void;
}

export function SchoolCalculator({ data, onChange }: SchoolCalculatorProps) {
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const currentGradeExams = data.examsByGrade[data.grade] || [];

  const handleAddExam = () => {
    const newExam: SchoolExam = {
      id: `exam-${Date.now()}`,
      examName: `Exam ${currentGradeExams.length + 1}`,
      institutionName: "",
      cityCountry: "",
      yearOfCompletion: "",
      subjects: [],
    };
    onChange({
      ...data,
      examsByGrade: {
        ...data.examsByGrade,
        [data.grade]: [...currentGradeExams, newExam]
      }
    });
  };

  const handleUpdateExam = (examId: string, field: keyof SchoolExam, value: any) => {
    const updatedExams = currentGradeExams.map((exam) => {
      if (exam.id === examId) {
        return { ...exam, [field]: value };
      }
      return exam;
    });
    onChange({
      ...data,
      examsByGrade: { ...data.examsByGrade, [data.grade]: updatedExams }
    });
  };

  const handleRemoveExam = (examId: string) => {
    onChange({
      ...data,
      examsByGrade: {
        ...data.examsByGrade,
        [data.grade]: currentGradeExams.filter(e => e.id !== examId)
      }
    });
  };

  const handleAddSubject = (examId: string) => {
    const updatedExams = currentGradeExams.map(exam => {
      if (exam.id === examId) {
        const newSubject: SubjectMarks = {
          id: `sub-${Date.now()}`,
          name: `Subject ${exam.subjects.length + 1}`,
          obtained: 85,
          max: 100,
        };
        return { ...exam, subjects: [...exam.subjects, newSubject] };
      }
      return exam;
    });
    onChange({ ...data, examsByGrade: { ...data.examsByGrade, [data.grade]: updatedExams } });
  };

  const handleUpdateSubject = (examId: string, subId: string, field: keyof SubjectMarks, value: any) => {
    const updatedExams = currentGradeExams.map(exam => {
      if (exam.id === examId) {
        const updatedSubjects = exam.subjects.map(sub => {
          if (sub.id === subId) {
            return { ...sub, [field]: value };
          }
          return sub;
        });
        return { ...exam, subjects: updatedSubjects };
      }
      return exam;
    });
    onChange({ ...data, examsByGrade: { ...data.examsByGrade, [data.grade]: updatedExams } });
  };

  const handleRemoveSubject = (examId: string, subId: string) => {
    const updatedExams = currentGradeExams.map(exam => {
      if (exam.id === examId) {
        return { ...exam, subjects: exam.subjects.filter(sub => sub.id !== subId) };
      }
      return exam;
    });
    onChange({ ...data, examsByGrade: { ...data.examsByGrade, [data.grade]: updatedExams } });
  };

  const handleSaveLocally = () => {
    // Triggers a visual toast indication since actual save is debounced at page level
    setSavedMessage(`Saved ${data.grade} Data!`);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-montserrat">{data.grade} Records</h3>
        <div className="flex gap-2">
          <button
            onClick={handleAddExam}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Exam
          </button>
          <button
            onClick={handleSaveLocally}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all"
          >
            <Save className="w-4 h-4" /> Save {data.grade}
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-200 text-sm font-semibold animate-in fade-in">
          ✓ {savedMessage}
        </div>
      )}

      {currentGradeExams.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
          <SchoolIcon className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="text-slate-500 font-medium">No exams recorded for {data.grade}. Click &quot;Add Exam&quot; to start.</p>
        </div>
      ) : (
        currentGradeExams.map((exam, index) => {
          const totalObtained = exam.subjects.reduce((sum, s) => sum + (Number(s.obtained) || 0), 0);
          const totalMax = exam.subjects.reduce((sum, s) => sum + (Number(s.max) || 0), 0);
          const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

          return (
            <div key={exam.id} className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
              <button
                onClick={() => handleRemoveExam(exam.id)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                title="Remove Exam"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Overview & Form Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-10">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Exam Name
                  </label>
                  <input
                    type="text"
                    value={exam.examName}
                    onChange={(e) => handleUpdateExam(exam.id, "examName", e.target.value)}
                    placeholder="e.g. Final Annual Exam"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    School / Institution
                  </label>
                  <input
                    type="text"
                    value={exam.institutionName}
                    onChange={(e) => handleUpdateExam(exam.id, "institutionName", e.target.value)}
                    placeholder="e.g. School/College Name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Year of Completion
                  </label>
                  <input
                    type="text"
                    value={exam.yearOfCompletion}
                    onChange={(e) => handleUpdateExam(exam.id, "yearOfCompletion", e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Auto-Calculation Summary Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-xl shadow-emerald-600/20 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                    <Calculator className="w-8 h-8 text-emerald-200" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
                      {exam.examName || `Exam ${index + 1}`} Score
                    </span>
                    <h3 className="text-3xl font-black font-montserrat tracking-tight mt-0.5">
                      {percentage}%
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <span className="block text-xs text-emerald-200">Marks Obtained</span>
                    <span className="text-lg font-bold">{totalObtained}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <span className="block text-xs text-emerald-200">Max Marks</span>
                    <span className="text-lg font-bold">{totalMax}</span>
                  </div>
                </div>
              </div>

              {/* Subject Marks Entry Table */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4 overflow-x-auto max-w-full">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-500" />
                    Subject Breakdown
                  </h4>
                  <button
                    onClick={() => handleAddSubject(exam.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" /> Add Subject
                  </button>
                </div>

                {exam.subjects.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-500">
                    No subjects added to this exam.
                  </p>
                ) : (
                  <div className="space-y-2 min-w-max">
                    {exam.subjects.map((sub, sIndex) => {
                      const subPercentage = sub.max > 0 ? ((sub.obtained / sub.max) * 100).toFixed(1) : 0;
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 p-2 rounded-xl"
                        >
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => handleUpdateSubject(exam.id, sub.id, "name", e.target.value)}
                            placeholder={`Subject ${sIndex + 1}`}
                            className="flex-1 min-w-[150px] px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                          />
                          <input
                            type="number"
                            value={sub.obtained || ""}
                            onChange={(e) => handleUpdateSubject(exam.id, sub.id, "obtained", parseFloat(e.target.value) || 0)}
                            placeholder="Obt."
                            className="w-20 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                          />
                          <input
                            type="number"
                            value={sub.max || ""}
                            onChange={(e) => handleUpdateSubject(exam.id, sub.id, "max", parseFloat(e.target.value) || 0)}
                            placeholder="Max"
                            className="w-20 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                          />
                          <div className="w-16 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 text-right">
                            {subPercentage}%
                          </div>
                          <button
                            onClick={() => handleRemoveSubject(exam.id, sub.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
                            title="Remove Subject"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
