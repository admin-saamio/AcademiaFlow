"use client";

import React from "react";
import { UGRecord, SemesterData, SubjectMarks } from "@/types/academic";
import { Plus, Trash2, GraduationCap, ChevronDown, ChevronUp, Layers } from "lucide-react";

interface UGCalculatorProps {
  data: UGRecord;
  onChange: (updated: UGRecord) => void;
}

export function UGCalculator({ data, onChange }: UGCalculatorProps) {
  const [openSemIndex, setOpenSemIndex] = React.useState<number | null>(0);

  const handleInputChange = (field: keyof UGRecord, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Duration changes dynamically unlock 6, 8, 10, or 12 semester boxes
  const handleDurationChange = (years: number) => {
    const requiredSems = years * 2;
    let currentSems = [...data.semesters];

    if (currentSems.length < requiredSems) {
      for (let i = currentSems.length; i < requiredSems; i++) {
        currentSems.push({
          semNumber: i + 1,
          sgpa: 0,
          obtained: 0,
          max: 0,
          subjects: [
            { id: `sem${i+1}-s1`, name: "Core Course 1", obtained: 0, max: 100 },
          ],
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

  const handleUpdateSemester = (semIndex: number, field: keyof SemesterData, value: any) => {
    const updatedSems = data.semesters.map((sem, idx) => {
      if (idx === semIndex) {
        return { ...sem, [field]: value };
      }
      return sem;
    });
    onChange({ ...data, semesters: updatedSems });
  };

  // Add/Remove subject inside a semester
  const handleAddSemesterSubject = (semIndex: number) => {
    const targetSem = data.semesters[semIndex];
    const newSubject: SubjectMarks = {
      id: `sem${semIndex+1}-s${targetSem.subjects.length + 1}-${Date.now()}`,
      name: `Subject ${targetSem.subjects.length + 1}`,
      obtained: 85,
      max: 100,
    };

    const updatedSems = data.semesters.map((sem, idx) => {
      if (idx === semIndex) {
        return { ...sem, subjects: [...sem.subjects, newSubject] };
      }
      return sem;
    });
    onChange({ ...data, semesters: updatedSems });
  };

  const handleUpdateSemesterSubject = (
    semIndex: number,
    subId: string,
    field: keyof SubjectMarks,
    value: any
  ) => {
    const updatedSems = data.semesters.map((sem, idx) => {
      if (idx === semIndex) {
        const updatedSubjects = sem.subjects.map((sub) => {
          if (sub.id === subId) {
            return { ...sub, [field]: value };
          }
          return sub;
        });

        // Recalculate sem obtained/max from subjects if present
        const semObtained = updatedSubjects.reduce((acc, s) => acc + (Number(s.obtained) || 0), 0);
        const semMax = updatedSubjects.reduce((acc, s) => acc + (Number(s.max) || 0), 0);

        return {
          ...sem,
          subjects: updatedSubjects,
          obtained: semObtained > 0 ? semObtained : sem.obtained,
          max: semMax > 0 ? semMax : sem.max,
        };
      }
      return sem;
    });
    onChange({ ...data, semesters: updatedSems });
  };

  const handleRemoveSemesterSubject = (semIndex: number, subId: string) => {
    const updatedSems = data.semesters.map((sem, idx) => {
      if (idx === semIndex) {
        const updatedSubjects = sem.subjects.filter((sub) => sub.id !== subId);
        return { ...sem, subjects: updatedSubjects };
      }
      return sem;
    });
    onChange({ ...data, semesters: updatedSems });
  };

  // Cumulative Calculations
  const validSgpas = data.semesters.map((s) => Number(s.sgpa)).filter((val) => val > 0);
  const cumulativeCgpa =
    validSgpas.length > 0
      ? (validSgpas.reduce((a, b) => a + b, 0) / validSgpas.length).toFixed(2)
      : "0.00";

  const totalUGObtained = data.semesters.reduce((sum, s) => sum + (Number(s.obtained) || 0), 0);
  const totalUGMax = data.semesters.reduce((sum, s) => sum + (Number(s.max) || 0), 0);
  const overallPercentage =
    totalUGMax > 0
      ? ((totalUGObtained / totalUGMax) * 100).toFixed(2)
      : validSgpas.length > 0
      ? (Number(cumulativeCgpa) * 9.5).toFixed(2) // Fallback standard CGPA -> % conversion formula
      : "0.00";

  return (
    <div className="space-y-6">
      {/* Program Details & Duration Unlocking Selector */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Degree Name
            </label>
            <input
              type="text"
              value={data.degreeName}
              onChange={(e) => handleInputChange("degreeName", e.target.value)}
              placeholder="e.g. B.Tech in Computer Science"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              College / University Name
            </label>
            <input
              type="text"
              value={data.collegeName}
              onChange={(e) => handleInputChange("collegeName", e.target.value)}
              placeholder="e.g. National Institute of Technology"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              City & Country
            </label>
            <input
              type="text"
              value={data.cityCountry}
              onChange={(e) => handleInputChange("cityCountry", e.target.value)}
              placeholder="Bangalore, India"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Duration Selector -> Dynamic Unlocking Logic */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Program Duration (Automatically unlocks semester boxes):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[3, 4, 5, 6].map((yrs) => {
              const active = data.durationYears === yrs;
              const semCount = yrs * 2;
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
                  <span className="block font-extrabold text-sm">{yrs} Years</span>
                  <span className={`text-xs ${active ? "text-emerald-100" : "text-slate-500"}`}>
                    Unlocks {semCount} Semesters
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cumulative CGPA & Percentage Header Summary */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-600/20 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
            <GraduationCap className="w-8 h-8 text-emerald-200" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
              Cumulative CGPA
            </span>
            <h3 className="text-3xl font-black font-montserrat tracking-tight mt-0.5">
              {cumulativeCgpa} <span className="text-sm font-semibold text-emerald-200">/ 10</span>
            </h3>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-center sm:text-left">
          <span className="block text-xs text-emerald-200 uppercase tracking-wider font-bold">
            Overall Percentage
          </span>
          <span className="text-2xl font-black">{overallPercentage}%</span>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-center sm:text-left">
          <span className="block text-xs text-emerald-200 uppercase tracking-wider font-bold">
            Unlocked Semesters
          </span>
          <span className="text-2xl font-black">
            {validSgpas.length} / {data.semesters.length} Recorded
          </span>
        </div>
      </div>

      {/* Unlocked Semester Boxes Breakdown */}
      <div className="space-y-4">
        <h4 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-500" />
          Semester-wise Mark Sheets ({data.semesters.length} Unlocked Boxes)
        </h4>

        <div className="grid grid-cols-1 gap-4">
          {data.semesters.map((sem, semIdx) => {
            const isOpen = openSemIndex === semIdx;
            return (
              <div
                key={sem.semNumber}
                className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden transition-all"
              >
                {/* Semester Accordion Header */}
                <div
                  onClick={() => setOpenSemIndex(isOpen ? null : semIdx)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm flex items-center justify-center">
                      S{sem.semNumber}
                    </span>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                        Semester {sem.semNumber}
                      </h5>
                      <span className="text-xs text-slate-500">
                        {sem.subjects.length} Subjects Registered
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block text-xs font-semibold text-slate-500">SGPA</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {sem.sgpa || "0.00"}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Semester Details */}
                {isOpen && (
                  <div className="p-5 border-t border-slate-200 dark:border-slate-700/60 space-y-4 bg-white dark:bg-slate-900/60">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Semester SGPA (0 to 10)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          value={sem.sgpa || ""}
                          onChange={(e) =>
                            handleUpdateSemester(semIdx, "sgpa", parseFloat(e.target.value) || 0)
                          }
                          placeholder="e.g. 9.15"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Sem Obtained Marks
                        </label>
                        <input
                          type="number"
                          value={sem.obtained || ""}
                          onChange={(e) =>
                            handleUpdateSemester(semIdx, "obtained", parseFloat(e.target.value) || 0)
                          }
                          placeholder="e.g. 480"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Sem Max Marks
                        </label>
                        <input
                          type="number"
                          value={sem.max || ""}
                          onChange={(e) =>
                            handleUpdateSemester(semIdx, "max", parseFloat(e.target.value) || 0)
                          }
                          placeholder="e.g. 500"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Semester Subject Breakdown */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Subject Breakdown (Sem {sem.semNumber})
                        </span>
                        <button
                          onClick={() => handleAddSemesterSubject(semIdx)}
                          className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Course
                        </button>
                      </div>

                      <div className="space-y-2">
                        {sem.subjects.map((sub) => (
                          <div
                            key={sub.id}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60"
                          >
                            <div className="sm:col-span-6">
                              <input
                                type="text"
                                value={sub.name}
                                onChange={(e) =>
                                  handleUpdateSemesterSubject(semIdx, sub.id, "name", e.target.value)
                                }
                                placeholder="Course Name"
                                className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="number"
                                value={sub.obtained || ""}
                                onChange={(e) =>
                                  handleUpdateSemesterSubject(
                                    semIdx,
                                    sub.id,
                                    "obtained",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                placeholder="Obtained"
                                className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <input
                                type="number"
                                value={sub.max || ""}
                                onChange={(e) =>
                                  handleUpdateSemesterSubject(
                                    semIdx,
                                    sub.id,
                                    "max",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                placeholder="Max"
                                className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                            </div>
                            <div className="sm:col-span-1 flex justify-end">
                              <button
                                onClick={() => handleRemoveSemesterSubject(semIdx, sub.id)}
                                className="text-slate-400 hover:text-red-500 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
