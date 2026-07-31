"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Download } from "lucide-react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);

      // Optionally show the banner if they haven't dismissed it
      const hasDismissed = localStorage.getItem('pwa_banner_dismissed');
      if (!hasDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
    setShowBanner(false);
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_banner_dismissed', 'true');
  };

  return (
    <>
      {showBanner && (
        <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex bg-white/20 p-1.5 rounded-lg">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Install AcademiaFlow App</p>
              <p className="text-xs text-emerald-100">Add to your home screen for quick access and offline use.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-white text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Install
            </button>
            <button
              onClick={dismissBanner}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-500/50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
      )}
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between h-auto py-3 sm:py-0 sm:h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-500/20">
              A
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white font-montserrat">
              AcademiaFlow<span className="text-emerald-500 font-extrabold">.</span>
            </span>
          </div>

          {/* Right Action Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end mt-2 sm:mt-0">

            {/* Persistent Install Button (if banner dismissed but still installable) */}
            {isInstallable && !showBanner && (
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors min-w-[44px] min-h-[44px] justify-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            {/* Powered by Saamio Credit Badge */}
            <a
              href="https://saamio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition-colors min-h-[44px]"
            >
              Powered by Saamio
            </a>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            )}
          </div>

          {/* Mobile Powered by Saamio Credit Badge */}
          <div className="w-full sm:hidden flex justify-center mt-[-0.5rem] mb-1">
             <a
              href="https://saamio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
            >
              Powered by Saamio
            </a>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
