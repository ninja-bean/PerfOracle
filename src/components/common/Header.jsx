import React from 'react';
import { Menu, Sparkles, Database, HelpCircle, Sliders, ChevronRight, Sun, Moon } from 'lucide-react';

export default function Header({ 
  activeTab, 
  onToggleSidebar, 
  onOpenPhase2, 
  onOpenTutorial,
  onNavigate,
  theme,
  toggleTheme
}) {
  const titles = {
    overview:   { title: 'Overview',              crumb: 'Dashboard' },
    algorithms: { title: 'Algorithm Registry',    crumb: 'Registry' },
    tiers:      { title: 'Tier Matrix',           crumb: 'Classification' },
    rubrics:    { title: 'Rubric Benchmarks',     crumb: 'Testing' },
    dataset:    { title: 'Dataset & CSV Studio',  crumb: 'Export' }
  };

  const current = titles[activeTab] || titles.overview;

  return (
    <header className="sticky top-0 z-30 w-full transition-colors duration-200" style={{
      background: 'var(--header-bg)',
      borderBottom: '1px solid var(--header-border)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger (mobile) + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              theme === 'light'
                ? 'text-zinc-600 hover:text-black hover:bg-black/[0.05]'
                : 'text-zinc-500 hover:text-white hover:bg-white/[0.06]'
            }`}
            aria-label="Open sidebar"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden shrink-0">
            <img 
              src="/perforacle_icon_square.png" 
              alt="Logo" 
              className="w-6 h-6 object-contain logo-glow" 
            />
          </div>

          {/* Breadcrumb-style title */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">PerfOracle</span>
            <ChevronRight className="w-3 h-3 text-zinc-500/60 hidden sm:inline shrink-0" />
            <h2 className={`text-[13px] font-semibold tracking-tight truncate ${
              theme === 'light' ? 'text-zinc-900' : 'text-zinc-200'
            }`}>
              {current.title}
            </h2>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-[11px] font-medium border ${
              theme === 'light'
                ? 'text-zinc-700 hover:text-black hover:bg-black/[0.05] border-black/[0.08]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] border-white/[0.08]'
            }`}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 transition-transform duration-300 hover:-rotate-12" />
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 transition-transform duration-300 hover:rotate-45" />
                <span className="hidden sm:inline">Light</span>
              </>
            )}
          </button>

          {/* Tour */}
          <button
            onClick={onOpenTutorial}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-[11px] font-medium border ${
              theme === 'light'
                ? 'text-zinc-700 hover:text-black hover:bg-black/[0.05] border-black/[0.08]'
                : 'text-zinc-500 hover:text-white hover:bg-white/[0.06] border-transparent hover:border-white/[0.08]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tour</span>
          </button>

          {/* Site switcher — cleaner pill */}
          <div className="flex items-center rounded-lg p-0.5" style={{
            background: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
            border: theme === 'light' ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
          }}>
            <button
              onClick={() => onNavigate('overview')}
              className="px-2.5 py-1 text-[11px] rounded-md font-semibold transition-all"
              style={theme === 'light'
                ? { background: '#09090b', color: '#fff' }
                : { background: 'rgba(255,255,255,0.12)', color: '#fff' }
              }
            >
              Site 1
            </button>
            <button
              onClick={onOpenPhase2}
              className={`px-2.5 py-1 text-[11px] rounded-md flex items-center gap-1 transition-colors ${
                theme === 'light' ? 'text-zinc-600 hover:text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Site 2</span>
            </button>
          </div>

          {/* Context CTA */}
          {activeTab !== 'dataset' && (
            <button
              onClick={() => onNavigate('dataset')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wide transition-all hover:scale-[1.03] active:scale-95"
              style={{
                background: 'var(--primary-btn-bg)',
                color: 'var(--primary-btn-text)',
                boxShadow: 'var(--primary-btn-shadow)',
              }}
            >
              <Database className="w-3 h-3" />
              <span>Export CSV</span>
            </button>
          )}

          {activeTab === 'dataset' && (
            <button
              onClick={() => onNavigate('rubrics')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wide transition-all hover:scale-[1.03] active:scale-95"
              style={{
                background: 'var(--primary-btn-bg)',
                color: 'var(--primary-btn-text)',
                boxShadow: 'var(--primary-btn-shadow)',
              }}
            >
              <Sliders className="w-3 h-3" />
              <span>New Bench</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
