import React from 'react';
import { Menu, Sparkles, Database, HelpCircle, Sliders, ChevronRight, Brain, Zap } from 'lucide-react';

export default function Header({ 
  activeSite = 'site1',
  onSwitchSite,
  activeTab, 
  site2ActiveTab,
  onToggleSidebar, 
  onOpenPhase2, 
  onOpenTutorial,
  onNavigate 
}) {
  const site1Titles = {
    overview:   { title: 'Overview',              crumb: 'Dashboard' },
    algorithms: { title: 'Algorithm Registry',    crumb: 'Registry' },
    tiers:      { title: 'Tier Matrix',           crumb: 'Classification' },
    rubrics:    { title: 'Rubric Benchmarks',     crumb: 'Testing' },
    dataset:    { title: 'Dataset & CSV Studio',  crumb: 'Export' }
  };

  const site2Titles = {
    overview: { title: 'Predictor Overview',      crumb: 'Neural Engine' },
    sandbox:  { title: 'Inference Sandbox',       crumb: 'Simulation' },
    scaling:  { title: 'Scaling & Log-Log Plot',  crumb: 'Asymptotics' },
    hardware: { title: 'Hardware Guardrails',     crumb: 'Constraints' },
    models:   { title: 'Model Leaderboard',       crumb: 'Validation' }
  };

  const current = activeSite === 'site2' 
    ? (site2Titles[site2ActiveTab] || site2Titles.overview)
    : (site1Titles[activeTab] || site1Titles.overview);

  return (
    <header className="sticky top-0 z-30 w-full" style={{
      background: 'rgba(6,6,8,0.88)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger (mobile) + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl transition-colors text-zinc-500 hover:text-white hover:bg-white/[0.06] cursor-pointer"
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
            <span className="text-[11px] text-zinc-600 font-mono hidden sm:inline">
              PerfOracle
            </span>
            <ChevronRight className="w-3 h-3 text-zinc-700 hidden sm:inline shrink-0" />
            <span className="text-[11px] text-zinc-500 font-mono hidden md:inline">
              {activeSite === 'site2' ? 'Site 2: Predictor' : 'Site 1: Benchmarks'}
            </span>
            <ChevronRight className="w-3 h-3 text-zinc-700 hidden md:inline shrink-0" />
            <h2 className="text-[13px] font-semibold text-zinc-200 tracking-tight truncate">
              {current.title}
            </h2>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Tour */}
          <button
            onClick={onOpenTutorial}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-zinc-500 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] text-[11px] font-medium cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tour</span>
          </button>

          {/* Dual-Site Switcher Pill */}
          <div className="flex items-center rounded-lg p-0.5" style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <button
              onClick={() => onSwitchSite('site1')}
              className={`px-3 py-1 text-[11px] rounded-md font-semibold transition-all cursor-pointer ${
                activeSite === 'site1'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Site 1
            </button>
            <button
              onClick={() => onSwitchSite('site2')}
              className={`px-3 py-1 text-[11px] rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSite === 'site2'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Brain className="w-3 h-3" />
              <span>Site 2</span>
            </button>
          </div>

          {/* Context CTA */}
          {activeSite === 'site1' ? (
            activeTab !== 'dataset' ? (
              <button
                onClick={() => onNavigate('dataset')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wide transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                style={{
                  background: '#fff',
                  color: '#000',
                  boxShadow: '0 0 18px rgba(255,255,255,0.18)',
                }}
              >
                <Database className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('rubrics')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wide transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                style={{
                  background: '#fff',
                  color: '#000',
                  boxShadow: '0 0 18px rgba(255,255,255,0.18)',
                }}
              >
                <Sliders className="w-3 h-3" />
                <span>New Bench</span>
              </button>
            )
          ) : (
            <button
              onClick={() => onNavigate('sandbox')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wide transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
              style={{
                background: '#fff',
                color: '#000',
                boxShadow: '0 0 18px rgba(255,255,255,0.18)',
              }}
            >
              <Zap className="w-3 h-3" />
              <span>Run Inference</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
