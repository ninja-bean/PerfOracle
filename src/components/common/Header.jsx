import React from 'react';
import { 
  Menu, 
  Sparkles, 
  Database, 
  HelpCircle, 
  Sliders, 
  ChevronRight, 
  Brain, 
  Zap 
} from 'lucide-react';

export default function Header({ 
  activeSite = 'site2',
  onSwitchSite,
  activeTab, 
  site2ActiveTab,
  onToggleSidebar, 
  onOpenPhase2, 
  onOpenTutorial,
  onNavigate 
}) {
  const site1Titles = {
    overview:   { title: 'Overview',              crumb: 'Telemetry' },
    algorithms: { title: 'Algorithm Registry',    crumb: 'Asymptotics' },
    tiers:      { title: 'Tier Matrix',           crumb: 'Classification' },
    rubrics:    { title: 'Rubric Benchmarks',     crumb: 'Live Runner' },
    dataset:    { title: 'Dataset & CSV Studio',  crumb: 'RFC 4180' }
  };

  const site2Titles = {
    overview: { title: 'Predictor Overview',      crumb: 'Neural Engine' },
    sandbox:  { title: 'Inference Sandbox',       crumb: 'Workload Simulation' },
    scaling:  { title: 'Scaling & Log-Log Plot',  crumb: 'Asymptotic Regression' },
    hardware: { title: 'Hardware Guardrails',     crumb: 'Memory Walls' },
    models:   { title: 'Model Leaderboard',       crumb: 'Parity Calibration' }
  };

  const current = activeSite === 'site2' 
    ? (site2Titles[site2ActiveTab] || site2Titles.overview)
    : (site1Titles[activeTab] || site1Titles.overview);

  return (
    <header className="sticky top-0 z-30 w-full glass-surface-l1 border-b">
      <div className="px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Trigger + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl transition-colors text-zinc-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0 text-xs">
            <span className="text-zinc-500 font-mono hidden sm:inline font-medium">
              PerfOracle
            </span>
            <ChevronRight className="w-3 h-3 text-zinc-600 hidden sm:inline shrink-0" />
            <span className="text-zinc-400 font-mono hidden md:inline">
              {activeSite === 'site2' ? 'Site 2: Predictor' : 'Site 1: Benchmarks'}
            </span>
            <ChevronRight className="w-3 h-3 text-zinc-600 hidden md:inline shrink-0" />
            <div className="flex items-center gap-2 truncate">
              <h2 className="font-semibold text-white tracking-tight truncate text-[13px]">
                {current.title}
              </h2>
              <span className="hidden xl:inline text-[10px] font-mono text-zinc-500 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                {current.crumb}
              </span>
            </div>
          </nav>
        </div>

        {/* Right: Site Switcher, Tour & Action CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Interactive Tour Button */}
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/[0.15] text-xs font-medium cursor-pointer"
            title="Launch interactive walkthrough"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Tour</span>
          </button>

          {/* Dual-Site Switcher Segment */}
          <div className="flex items-center rounded-xl p-0.5 bg-white/[0.035] border border-white/[0.08]">
            <button
              onClick={() => onSwitchSite('site1')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                activeSite === 'site1'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Site 1
            </button>
            <button
              onClick={() => onSwitchSite('site2')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSite === 'site2'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Brain className="w-3 h-3" />
              <span>Site 2</span>
            </button>
          </div>

          {/* Context Action CTA */}
          {activeSite === 'site1' ? (
            activeTab !== 'dataset' ? (
              <button
                onClick={() => onNavigate('dataset')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 cursor-pointer hero-primary-btn"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('rubrics')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 cursor-pointer hero-primary-btn"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>New Benchmark</span>
              </button>
            )
          ) : (
            <button
              onClick={() => onNavigate('sandbox')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 cursor-pointer hero-primary-btn"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Run Inference</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
