import React from 'react';
import Link from 'next/link';
import { Compass, Moon, Sun, Settings, LogIn, Bookmark } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenSaved: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

export default function Header({ savedCount, onOpenSaved, onToggleTheme, onOpenSettings }: HeaderProps) {
  return (
    <header className="sticky top-0 w-full z-40 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-colors duration-300">
      <div className="w-full max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Link */}
        <Link 
          href="/" 
          onClick={() => {
            // Force reload page to clear states and return home if clicked
            if (window.location.pathname === '/') {
              window.location.reload();
            }
          }}
          className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-extrabold text-xl tracking-tight transition-transform active:scale-95"
        >
          <Compass className="h-6 w-6 animate-spin-slow" />
          <span>Wayfare</span>
        </Link>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Saved Trips Drawer Button */}
          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 dark:bg-violet-500 text-[10px] font-bold text-white animate-fade-in">
                {savedCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="h-4 w-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 -translate-y-4 -translate-x-2" />
            <span className="sr-only">Toggle theme</span>
          </button>

          {/* Settings / API Key Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title="API settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Sign In Link */}
          <Link
            href="/auth"
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-xl transition-colors shadow-sm"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign in</span>
          </Link>

        </div>
      </div>
    </header>
  );
}
