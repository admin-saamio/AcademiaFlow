"use client";

import React, { useState } from "react";
import { UGRecord, SemesterData, SubjectMarks } from "@/types/academic";
import { Plus, Trash2, GraduationCap, ChevronDown, ChevronUp, Layers, Save } from "lucide-react";

interface UGCalculatorProps {
  data: UGRecord[];
  onChange: (updated: UGRecord[]) => void;
}

export function UGCalculator({ data, onChange }: UGCalculatorProps) {
  const [openSemIndices, setOpenSemIndices] = useState<Record<string, number | null>>({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const toggleSem = (degreeId: string, semIdx: number) => {
    setOpenSemIndices(prev => ({
      ...prev,
      [degreeId]: prev[degreeId] === semIdx ? null : semIdx
    }));
  };

  const handleAddDegree = () => {
    const newDegree: UGRecord = {
      id: `ug-${Date.now()}`,
      degreeName: `Undergraduate Degree ${data.length + 1}`,
      collegeName: "",
      cityCountry: "",
      durationYears: 4,
      semesters: Array.from({ length: 8 }, (_, i) => ({
        semNumber: i + 1,
        sgpa: 0,
        obtained: 0,
        max: 0,
        subjects: [],
      })),
    };
    onChange([...data, newDegree]);
  };

  const handleRemoveDegree = (id: string) => {
    onChange(data.filter(d => d.id !== id));
  };

  const updateDegree = (id: string, updated: UGRecord) => {
    onChange(data.map(d => d.id === id ? updated : d));
  };

  const handleInputChange = (id: string, field: keyof UGRecord, value: any) => {
    const degree = data.find(d => d.id === id);
    if (degree) {
      updateDegree(id, { ...degree, [field]: value });
    }
  };

  const handleDurationChange = (degreeId: string, years: number) => {
    const degree = data.find(d => d.id === degreeId);
    if (!degree) return;

    const requiredSems = years * 2;
    let currentSems = [...degree.semesters];

    if (currentSems.length < requiredSems) {
      for (let i = currentSems.length; i < requiredSems; i++) {
        currentSems.push({
          semNumber: i + 1,
          sgpa: 0,
          obtained: 0,
          max: 0,
          subjects: [],
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

  const handleUpdateSemester = (degreeId: string, semIndex: number, field: keyof SemesterData, value: any) => {
    const degree = data.find(d => d.id === degreeId);
    if (!degree) return;

    const updatedSems = degree.semesters.map((sem, idx) => {
      if (idx === semIndex) {
        return { ...sem, [field]: value };
      }
      return sem;
    });
    updateDegree(degreeId, { ...degree, semesters: updatedSems });
  };

  const handleAddSemesterSubject = (degreeId: string, semIndex: number) => {
    const degree = data.find(d => d.id === degreeId);
    if (!degree) return;

    const updatedSems = degree.semesters.map((sem, idx) => {
      if (idx === semIndex) {
        const newSubject: SubjectMarks = {
          id: Date.now().toString(),
          name: `Course ${sem.subjects.length + 1}`,
          obtained: 0,
          max: 100,
        };
        return { ...sem, subjects: [...sem.subjects, newSubject] };
      }
      return sem;
    });
    updateDegree(degreeId, { ...degree, semesters: updatedSems });
  };

  const handleUpdateSemesterSubject = (
    degreeId: string,
    semIndex: number,
    subId: string,
    field: keyof SubjectMarks,
    value: any
  ) => {
    const degree = data.find(d => d.id === degreeId);
    if (!degree) return;

    const updatedSems = degree.semesters.map((sem, idx) => {
      if (idx === semIndex) {
        const updatedSubjects = sem.subjects.map((sub) => {
          if (sub.id === subId) {
            return { ...sub, [field]: value };
          }
          return sub;
        });
        return { ...sem, subjects: updatedSubjects };
      }
      return sem;
    });
    updateDegree(degreeId, { ...degree, semesters: updatedSems });
  };

  const handleRemoveSemesterSubject = (degreeId: string, semIndex: number, subId: string) => {
    const degree = data.find(d => d.id === degreeId);
    if (!degree) return;

    const updatedSems = degree.semesters.map((sem, idx) => {
      if (idx === semIndex) {
        const updatedSubjects = sem.subjects.filter((sub) => sub.id !== subId);
        return { ...sem, subjects: updatedSubjects };
      }
      return sem;
    });
    updateDegree(degreeId, { ...degree, semesters: updatedSems });
  };

  const handleSaveLocally = () => {
    setSavedMessage(`Saved Undergraduate Degrees!`);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-montserrat">Undergraduate Records</h3>
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
          <GraduationCap className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="text-slate-500 font-medium">No undergraduate records. Click "Add Degree" to start.</p>
        </div>
      ) : (
        data.map((degree) => {
          // Compute overall CGPA dynamically for this degree
          const validSgpas = degree.semesters.map((s) => Number(s.sgpa)).filter((v) => v > 0);
          const cumulativeCgpa =
            validSgpas.length > 0
              ? (validSgpas.reduce((a, b) => a + b, 0) / validSgpas.length).toFixed(2)
              : "0.00";

          // Approximate percentage conversion
          const approximatePercentage =
            validSgpas.length > 0
              ? (Number(cumulativeCgpa) * 9.5).toFixed(2) // Fallback standard CGPA -> % conversion formula
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

              {/* Program Details & Duration Unlocking Selector */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4 pr-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Degree Name
                    </label>
                    <input
                      type="text"
                      value={degree.degreeName}
                      onChange={(e) => handleInputChange(degree.id, "degreeName", e.target.value)}
                      placeholder="e.g. B.Tech in Computer Science"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      College Name
                    </label>
                    <input
                      type="text"
                      value={degree.collegeName}
                      onChange={(e) => handleInputChange(degree.id, "collegeName", e.target.value)}
                      placeholder="e.g. MIT"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      City & Country
                    </label>
                    <input
                      type="text"
                      value={degree.cityCountry}
                      onChange={(e) => handleInputChange(degree.id, "cityCountry", e.target.value)}
                      placeholder="e.g. Boston, USA"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dynamic Duration Unlocking */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Degree Duration:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[3, 4, 5, 6].map((yrs) => {
                      const active = degree.durationYears === yrs;
                      return (
                        <button
                          key={yrs}
                          onClick={() => handleDurationChange(degree.id, yrs)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            active
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500/50"
                          }`}
                        >
                          <span className="block font-extrabold text-sm">{yrs} Years</span>
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
                    <GraduationCap className="w-8 h-8 text-emerald-200" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
                      Cumulative Academic Score (CGPA)
                    </span>
                    <h3 className="text-3xl font-black font-montserrat tracking-tight mt-0.5">
                      {cumulativeCgpa} <span className="text-sm font-semibold text-emerald-200">/ 10</span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center">
                    <span className="block text-xs text-emerald-200">Est. Percentage</span>
                    <span className="text-lg font-bold">{approximatePercentage}%</span>
                  </div>
                </div>

                <div className="w-full sm:w-auto bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-center sm:text-left">
                  <span className="block text-xs text-emerald-200 uppercase tracking-wider font-bold">
                    Unlocked Semesters
                  </span>
                  <span className="text-2xl font-black">
                    {validSgpas.length} / {degree.semesters.length} Recorded
                  </span>
                </div>
              </div>

              {/* Unlocked Semester Boxes Breakdown */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-500" />
                  Semester-wise Mark Sheets ({degree.semesters.length} Unlocked Boxes)
                </h4>

                <div className="grid grid-cols-1 gap-4">
                  {degree.semesters.map((sem, semIdx) => {
                    const isOpen = openSemIndices[degree.id] === semIdx;
                    return (
                      <div
                        key={sem.semNumber}
                        className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden transition-all"
                      >
                        {/* Semester Accordion Header */}
                        <div
                          onClick={() => toggleSem(degree.id, semIdx)}
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
                                    handleUpdateSemester(degree.id, semIdx, "sgpa", parseFloat(e.target.value) || 0)
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
                                    handleUpdateSemester(degree.id, semIdx, "obtained", parseFloat(e.target.value) || 0)
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
                                    handleUpdateSemester(degree.id, semIdx, "max", parseFloat(e.target.value) || 0)
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
                                  onClick={() => handleAddSemesterSubject(degree.id, semIdx)}
                                  className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline min-h-[44px]"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Course
                                </button>
                              </div>

                              <div className="space-y-2 overflow-x-auto max-w-full pb-2">
                                {sem.subjects.map((sub) => (
                                  <div
                                    key={sub.id}
                                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 min-w-[500px]"
                                  >
                                    <div className="sm:col-span-6">
                                      <input
                                        type="text"
                                        value={sub.name}
                                        onChange={(e) =>
                                          handleUpdateSemesterSubject(degree.id, semIdx, sub.id, "name", e.target.value)
                                        }
                                        placeholder="Course Name"
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                                      />
                                    </div>
                                    <div className="sm:col-span-2">
                                      <input
                                        type="number"
                                        value={sub.obtained || ""}
                                        onChange={(e) =>
                                          handleUpdateSemesterSubject(
                                            degree.id,
                                            semIdx,
                                            sub.id,
                                            "obtained",
                                            parseFloat(e.target.value) || 0
                                          )
                                        }
                                        placeholder="Obtained"
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                                      />
                                    </div>
                                    <div className="sm:col-span-3">
                                      <input
                                        type="number"
                                        value={sub.max || ""}
                                        onChange={(e) =>
                                          handleUpdateSemesterSubject(
                                            degree.id,
                                            semIdx,
                                            sub.id,
                                            "max",
                                            parseFloat(e.target.value) || 0
                                          )
                                        }
                                        placeholder="Max"
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                                      />
                                    </div>
                                    <div className="sm:col-span-1 flex justify-end">
                                      <button
                                        onClick={() => handleRemoveSemesterSubject(degree.id, semIdx, sub.id)}
                                        className="text-slate-400 hover:text-red-500 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
        })
      )}
    </div>
  );
}
