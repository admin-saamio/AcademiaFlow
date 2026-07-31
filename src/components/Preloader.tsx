"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Zap } from "lucide-react";

export function Preloader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("academiaflow_preloader_seen");
    if (!hasSeen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem("academiaflow_preloader_seen", "true");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("academiaflow_preloader_seen", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white animate-in fade-in duration-500">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 mt-[-10vh]">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-8 animate-pulse">
          <span className="font-extrabold text-6xl font-montserrat tracking-tighter">A</span>
        </div>

        <h1 className="text-2xl font-bold font-montserrat tracking-tight leading-tight text-white mb-4">
          Master Your Academic Journey & Student Productivity.
        </h1>

        <div className="flex items-center justify-center gap-2 mt-4 text-emerald-400">
           <svg className="animate-spin h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs font-medium uppercase tracking-widest text-emerald-400/80">Loading Workspace...</span>
        </div>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <span className="text-[10px] text-slate-500 font-medium">Powered by Saamio</span>
        <button
          onClick={dismiss}
          className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
}
