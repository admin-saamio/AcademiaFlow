"use client";

import React, { useState, useRef } from "react";
import { AcademiaFlowState } from "@/types/academic";
import { Database, Download, Upload, CheckCircle2, Info, FileSpreadsheet } from "lucide-react";
import { Database, Download, Upload, CheckCircle2, Info } from "lucide-react";
import confetti from "canvas-confetti";

interface SaveControlProps {
  state: AcademiaFlowState;
  onImport: (state: AcademiaFlowState) => void;
}

export function SaveControl({ state, onImport }: SaveControlProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `academiaflow-backup-${new Date().toISOString().split('T')[0]}.json`;
  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `academiaflow-backup-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.8 } });
    showToast("JSON Data exported successfully!");
  };

  const handleExportCSV = () => {
    // Generate a simple CSV representation of School & UG degrees as an example
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Degree/Grade,Name,Institution,Duration/Completion Year\n";

    // Add School
    Object.entries(state.school.examsByGrade).forEach(([grade, exams]) => {
      exams.forEach(exam => {
        csvContent += `"School","${grade}","${exam.examName}","${exam.institutionName}","${exam.yearOfCompletion}"\n`;
      });
    });

    // Add UG
    state.undergraduate.forEach(ug => {
      csvContent += `"Undergraduate","N/A","${ug.degreeName}","${ug.collegeName}","${ug.durationYears} Years"\n`;
    });

    // Add PG
    state.postgraduate.forEach(pg => {
      csvContent += `"Postgraduate","N/A","${pg.degreeName}","${pg.universityName}","${pg.durationYears} Years"\n`;
    });

    // Add PhD
    state.doctorate.forEach(phd => {
      csvContent += `"Doctorate","N/A","${phd.thesisTitle}","N/A","${phd.defenseStatus}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `academiaflow-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.8 } });
    showToast("CSV exported successfully!");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && json.academicLevel) {
          onImport(json);
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.8 },
          });
          showToast("Data imported successfully!");
        } else {
          showToast("Invalid backup file format.");
        }
      } catch (err) {
        console.error(err);
        showToast("Error parsing backup file.");
      }
    };
    reader.readAsText(file);


    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
    });

    showToast("Data exported successfully!");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && json.academicLevel) {
          onImport(json);
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.8 },
          });
          showToast("Data imported successfully!");
        } else {
          showToast("Invalid backup file format.");
        }
      } catch (err) {
        console.error(err);
        showToast("Error parsing backup file.");
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-md">
          <div className="bg-slate-900 text-white dark:bg-emerald-600 dark:text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-white shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Data Management Bar */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Data Management
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Export or import your academic records.
              </p>

            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={handleImportClick}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Upload className="w-4 h-4" />
              Import Data
            </button>

            <button
              onClick={handleExport}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Hint Banner */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50">
          <Info className="w-4 h-4 text-emerald-500 shrink-0" />
          <p>
            <strong>Your data is saved automatically in your browser.</strong> Export your data to back it up or transfer it to another device.
          </p>
        </div>


      </div>
    </div>
  );
}
