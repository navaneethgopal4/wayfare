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
    <header className="sticky top-0 w-full z-40 border-b border-border/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-colors duration-300">
      <div className="w-full max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Link */}
        <Link 
          href="/" 
          onClick={() => {
            if (window.location.pathname === '/') {
              window.location.reload();
            }
          }}
          className="flex items-center gap-2 text-primary font-extrabold text-xl tracking-tight transition-transform active:scale-95"
        >
          <Compass className="h-6 w-6 animate-spin-slow" />
          <span>Wayfare</span>
        </Link>

        {/* Action buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Saved Trips Drawer Button */}
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-card text-foreground/80 hover:bg-muted hover:text-foreground transition-all shadow-sm active:scale-95"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white animate-fade-in">
                {savedCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="relative size-9 rounded-full border border-border bg-card text-foreground/80 hover:bg-muted hover:text-foreground grid place-items-center transition-all shadow-sm active:scale-95"
            title="Toggle theme"
          >
            <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="h-3.5 w-3.5 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>

          {/* Settings / API Key Button */}
          <button
            onClick={onOpenSettings}
            className="size-9 rounded-full border border-border bg-card text-foreground/80 hover:bg-muted hover:text-foreground grid place-items-center transition-all shadow-sm active:scale-95"
            title="API settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>

          {/* Divider */}
          <div className="h-4 w-[1px] bg-border/60 mx-0.5" />

          {/* Sign In Link */}
          <Link
            href="/auth"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:opacity-90 rounded-full transition-opacity shadow-sm active:scale-95"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign in</span>
          </Link>

        </div>
      </div>
    </header>
  );
}
