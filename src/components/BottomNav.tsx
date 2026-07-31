"use client";

import React from "react";
import { Home, Calculator, LayoutList, Database } from "lucide-react";

export type NavTab = "home" | "calculators" | "productivity" | "data";

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const tabs: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "calculators", label: "Grades", icon: Calculator },
    { id: "productivity", label: "Tasks", icon: LayoutList },
    { id: "data", label: "Data", icon: Database },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors min-h-[44px] ${
                isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className={`relative p-1 rounded-full ${isActive ? "bg-emerald-50 dark:bg-emerald-900/30" : ""}`}>
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
