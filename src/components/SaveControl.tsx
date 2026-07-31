"use client";

import React, { useState, useRef } from "react";
import { AcademiaFlowState } from "@/types/academic";
import { Database, Download, Upload, CheckCircle2, Info, FileSpreadsheet } from "lucide-react";
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
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.8 } });
    showToast("JSON Data exported successfully!");
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Helper to safely escape CSV strings
    const escapeCSV = (str: string | number) => `"${String(str).replace(/"/g, '""')}"`;

    const studentName = escapeCSV(state.studentName || "Unknown Student");

    // 1. School Data
    csvContent += "=== SCHOOL RECORDS ===\n";
    csvContent += "Student Name,Grade,Exam Name,Institution,City/Country,Year,Subject,Max Marks,Obtained Marks\n";
    Object.entries(state.school.examsByGrade).forEach(([grade, exams]) => {
      exams.forEach(exam => {
        if (exam.subjects.length === 0) {
           csvContent += `${studentName},${escapeCSV(grade)},${escapeCSV(exam.examName)},${escapeCSV(exam.institutionName)},${escapeCSV(exam.cityCountry)},${escapeCSV(exam.yearOfCompletion)},N/A,0,0\n`;
        } else {
          exam.subjects.forEach(sub => {
            csvContent += `${studentName},${escapeCSV(grade)},${escapeCSV(exam.examName)},${escapeCSV(exam.institutionName)},${escapeCSV(exam.cityCountry)},${escapeCSV(exam.yearOfCompletion)},${escapeCSV(sub.name)},${sub.max},${sub.obtained}\n`;
          });
        }
      });
    });
    csvContent += "\n";

    // 2. UG Data
    csvContent += "=== UNDERGRADUATE RECORDS ===\n";
    csvContent += "Student Name,Degree Name,College,City/Country,Duration Years,Semester,SGPA,Subject Name,Max Marks,Obtained Marks\n";
    state.undergraduate.forEach(ug => {
      ug.semesters.forEach(sem => {
        if (sem.subjects.length === 0) {
           csvContent += `${studentName},${escapeCSV(ug.degreeName)},${escapeCSV(ug.collegeName)},${escapeCSV(ug.cityCountry)},${ug.durationYears},${sem.semNumber},${sem.sgpa},N/A,0,0\n`;
        } else {
          sem.subjects.forEach(sub => {
            csvContent += `${studentName},${escapeCSV(ug.degreeName)},${escapeCSV(ug.collegeName)},${escapeCSV(ug.cityCountry)},${ug.durationYears},${sem.semNumber},${sem.sgpa},${escapeCSV(sub.name)},${sub.max},${sub.obtained}\n`;
          });
        }
      });
    });
    csvContent += "\n";

    // 3. PG Data
    csvContent += "=== POSTGRADUATE RECORDS ===\n";
    csvContent += "Student Name,Degree Name,University,Duration Years,Semester,SGPA\n";
    state.postgraduate.forEach(pg => {
      pg.semesters.forEach(sem => {
        csvContent += `${studentName},${escapeCSV(pg.degreeName)},${escapeCSV(pg.universityName)},${pg.durationYears},${sem.semNumber},${sem.sgpa}\n`;
      });
    });
    csvContent += "\n";

    // 4. PhD Data
    csvContent += "=== DOCTORATE RECORDS ===\n";
    csvContent += "Student Name,Thesis Title,Coursework CGPA,Defense Status,Publication Title,Venue,Year,Status,DOI\n";
    state.doctorate.forEach(phd => {
      if (phd.publications.length === 0) {
        csvContent += `${studentName},${escapeCSV(phd.thesisTitle)},${phd.courseworkCgpa},${escapeCSV(phd.defenseStatus)},N/A,N/A,N/A,N/A,N/A\n`;
      } else {
        phd.publications.forEach(pub => {
          csvContent += `${studentName},${escapeCSV(phd.thesisTitle)},${phd.courseworkCgpa},${escapeCSV(phd.defenseStatus)},${escapeCSV(pub.title)},${escapeCSV(pub.venue)},${escapeCSV(pub.year)},${escapeCSV(pub.status)},${escapeCSV(pub.doiLink)}\n`;
        });
      }
    });
    csvContent += "\n";

    // 5. Productivity
    csvContent += "=== PRODUCTIVITY TASKS ===\n";
    csvContent += "Student Name,Task Title,Deadline,Priority,Completed\n";
    state.todos.forEach(todo => {
      csvContent += `${studentName},${escapeCSV(todo.title)},${escapeCSV(todo.deadline)},${escapeCSV(todo.priority)},${todo.completed ? 'Yes' : 'No'}\n`;
    });
    csvContent += "\n";

    // 6. Notes
    csvContent += "=== QUICK NOTES ===\n";
    csvContent += "Student Name,Note Title,Last Updated,Content\n";
    state.notes.forEach(note => {
      csvContent += `${studentName},${escapeCSV(note.title)},${escapeCSV(note.updatedAt)},${escapeCSV(note.content)}\n`;
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

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportJSON}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
              <button
                onClick={handleExportCSV}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Hint Banner & Transfer Guide */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 space-y-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                <strong>Your data is strictly private and saved automatically in your browser.</strong>
                Since AcademiaFlow operates offline without a cloud database, you must manually transfer your data to use it on another device (like your phone).
              </p>

              <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">How to transfer your records to a new device:</h5>

                <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">1</div>
                  <p>On your current device, click the <strong>Export JSON</strong> button above. This will download a `.json` backup file containing your entire academic history and tasks.</p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">2</div>
                  <p>Send this `.json` file to your new device (via Email, WhatsApp, AirDrop, or a USB drive).</p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">3</div>
                  <p>Open AcademiaFlow on your new device, navigate to this Data tab, click <strong>Import Data</strong>, and select the `.json` file you transferred.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
