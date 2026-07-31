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

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl px-6 space-y-6">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-4 animate-bounce">
          <span className="font-extrabold text-5xl font-montserrat tracking-tighter">A</span>
        </div>

        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4" /> Unleash Your Potential
        </span>

        <h1 className="text-4xl sm:text-6xl font-black font-montserrat tracking-tight leading-tight">
          Engineer Your Success with Elite Focus.
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl">
          Built for high-performers. Turn your academic trajectory into actionable data. Track, optimize, and dominate every degree program with absolute privacy and precision.
        </p>

        <button
          onClick={dismiss}
          className="mt-8 group flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-slate-950 font-bold text-sm hover:bg-emerald-50 transition-all hover:scale-105"
        >
          Skip Intro <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="absolute bottom-10 w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full w-full animate-[shrink_5s_linear_forwards]"></div>
      </div>
    </div>
  );
}
