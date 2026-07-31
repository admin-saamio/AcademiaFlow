"use client";

import React, { useState } from "react";
import { PhDRecord, PublicationItem } from "@/types/academic";
import { Plus, Trash2, Award, FileText, Save } from "lucide-react";

interface PhDTrackerProps {
  data: PhDRecord[];
  onChange: (updated: PhDRecord[]) => void;
}

export function PhDTracker({ data, onChange }: PhDTrackerProps) {
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleAddDegree = () => {
    const newDegree: PhDRecord = {
      id: `phd-${Date.now()}`,
      courseworkCgpa: 0,
      thesisTitle: "",
      defenseStatus: "Enrolled",
      publications: [],
    };
    onChange([...data, newDegree]);
  };

  const handleRemoveDegree = (id: string) => {
    onChange(data.filter((d) => d.id !== id));
  };

  const updateDegree = (id: string, updated: PhDRecord) => {
    onChange(data.map((d) => (d.id === id ? updated : d)));
  };

  const handleInputChange = (id: string, field: keyof PhDRecord, value: any) => {
    const degree = data.find((d) => d.id === id);
    if (degree) {
      updateDegree(id, { ...degree, [field]: value });
    }
  };

  const handleAddPublication = (degreeId: string) => {
    const degree = data.find((d) => d.id === degreeId);
    if (!degree) return;

    const newPub: PublicationItem = {
      id: `pub-${Date.now()}`,
      title: "Title of Paper",
      venue: "Journal / Conference Name",
      year: new Date().getFullYear().toString(),
      doiLink: "",
      status: "In Preparation",
    };
    updateDegree(degreeId, { ...degree, publications: [...degree.publications, newPub] });
  };

  const handleUpdatePublication = (
    degreeId: string,
    pubId: string,
    field: keyof PublicationItem,
    value: string
  ) => {
    const degree = data.find((d) => d.id === degreeId);
    if (!degree) return;

    const updatedPubs = degree.publications.map((pub) => {
      if (pub.id === pubId) {
        return { ...pub, [field]: value };
      }
      return pub;
    });
    updateDegree(degreeId, { ...degree, publications: updatedPubs });
  };

  const handleRemovePublication = (degreeId: string, pubId: string) => {
    const degree = data.find((d) => d.id === degreeId);
    if (!degree) return;

    updateDegree(degreeId, {
      ...degree,
      publications: degree.publications.filter((pub) => pub.id !== pubId),
    });
  };

  const handleSaveLocally = () => {
    setSavedMessage(`Saved Doctorate Records!`);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-montserrat">Doctorate Records</h3>
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
          <Award className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="text-slate-500 font-medium">No doctorate records. Click "Add Degree" to start.</p>
        </div>
      ) : (
        data.map((degree) => (
          <div key={degree.id} className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
            <button
              onClick={() => handleRemoveDegree(degree.id)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              title="Remove Degree"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Ph.D. Core Details */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 grid grid-cols-1 md:grid-cols-3 gap-4 pr-10">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Coursework CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={degree.courseworkCgpa || ""}
                  onChange={(e) =>
                    handleInputChange(degree.id, "courseworkCgpa", parseFloat(e.target.value) || 0)
                  }
                  placeholder="e.g. 9.80"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Dissertation Defense Status
                </label>
                <select
                  value={degree.defenseStatus}
                  onChange={(e) =>
                    handleInputChange(degree.id, "defenseStatus", e.target.value as PhDRecord["defenseStatus"])
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                >
                  <option value="Enrolled">Enrolled / Doctoral Candidate</option>
                  <option value="Submitted">Thesis Submitted</option>
                  <option value="Awarded">Degree Awarded (Ph.D.)</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Thesis / Dissertation Title
                </label>
                <input
                  type="text"
                  value={degree.thesisTitle}
                  onChange={(e) => handleInputChange(degree.id, "thesisTitle", e.target.value)}
                  placeholder="e.g. Deep Reinforcement Learning for Autonomous Agent Optimization"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Summary Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-600/20 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                  <Award className="w-8 h-8 text-emerald-200" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
                    Doctorate Status
                  </span>
                  <h3 className="text-2xl font-black font-montserrat tracking-tight mt-0.5">
                    {degree.defenseStatus}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <span className="block text-xs text-emerald-200">Coursework CGPA</span>
                  <span className="text-lg font-bold">{degree.courseworkCgpa} / 10</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <span className="block text-xs text-emerald-200">Publications</span>
                  <span className="text-lg font-bold">{degree.publications.length} Papers</span>
                </div>
              </div>
            </div>

            {/* Publication Log Entries */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Publication & Conference Paper Log
                </h4>
                <button
                  onClick={() => handleAddPublication(degree.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all min-h-[44px]"
                >
                  <Plus className="w-4 h-4" /> Add Publication
                </button>
              </div>

              {degree.publications.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-500">
                  No publications added yet. Click "+ Add Publication" to record your academic research.
                </p>
              ) : (
                <div className="space-y-3">
                  {degree.publications.map((pub) => (
                    <div
                      key={pub.id}
                      className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <div className="md:col-span-6">
                          <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                            Paper Title
                          </label>
                          <input
                            type="text"
                            value={pub.title}
                            onChange={(e) => handleUpdatePublication(degree.id, pub.id, "title", e.target.value)}
                            placeholder="Title of Publication"
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-4">
                          <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                            Journal / Conference Venue
                          </label>
                          <input
                            type="text"
                            value={pub.venue}
                            onChange={(e) => handleUpdatePublication(degree.id, pub.id, "venue", e.target.value)}
                            placeholder="e.g. IEEE / NeurIPS"
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                            Publication Status
                          </label>
                          <select
                            value={pub.status}
                            onChange={(e) =>
                              handleUpdatePublication(
                                degree.id,
                                pub.id,
                                "status",
                                e.target.value as PublicationItem["status"]
                              )
                            }
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            <option value="Published">Published</option>
                            <option value="Under Review">Under Review</option>
                            <option value="In Preparation">In Preparation</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={pub.doiLink}
                            onChange={(e) => handleUpdatePublication(degree.id, pub.id, "doiLink", e.target.value)}
                            placeholder="DOI URL (e.g. https://doi.org/10...)"
                            className="flex-1 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300"
                          />
                        </div>
                        <button
                          onClick={() => handleRemovePublication(degree.id, pub.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
