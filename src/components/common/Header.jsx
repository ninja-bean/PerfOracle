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
    overview: { title: 'Overview',            crumb: 'Neural Engine' },
    sandbox:  { title: 'Code Sandbox',        crumb: 'Workload Simulation' },
    scaling:  { title: 'Scaling Curves',      crumb: 'Asymptotic Regression' },
    hardware: { title: 'Hardware Limits',     crumb: 'Memory Walls' },
    models:   { title: 'Leaderboard',         crumb: 'Parity Calibration' }
  };

  const current = activeSite === 'site2' 
    ? (site2Titles[site2ActiveTab] || site2Titles.overview)
    : (site1Titles[activeTab] || site1Titles.overview);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#08090d] border-b border-white/[0.12] shadow-xl shadow-black/80">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 relative z-10">
        
        {/* Left: Mobile Trigger + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl transition-colors text-zinc-400 hover:text-white hover:bg-white/[0.08] cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0 text-xs">
            <span className="text-zinc-400 font-mono hidden sm:inline font-semibold">
              PerfOracle
            </span>
            <ChevronRight className="w-3 h-3 text-zinc-500 hidden sm:inline shrink-0" />
            <span className="text-zinc-300 font-mono hidden md:inline">
              {activeSite === 'site2' ? 'Site 2: Predictor' : 'Site 1: Benchmarks'}
            </span>
            <ChevronRight className="w-3 h-3 text-zinc-500 hidden md:inline shrink-0" />
            <div className="flex items-center gap-2 truncate">
              <h2 className="font-bold text-white tracking-tight truncate text-[13px]">
                {current.title}
              </h2>
              <span className="hidden xl:inline text-[10px] font-mono text-zinc-300 bg-white/[0.08] px-2 py-0.5 rounded-md border border-white/[0.12]">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-zinc-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.15] hover:border-white/[0.25] text-xs font-semibold cursor-pointer shadow-sm"
            title="Launch interactive walkthrough"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden sm:inline">Tour</span>
          </button>

          {/* Dual-Site Switcher Segment */}
          <div className="flex items-center rounded-xl p-0.5 bg-white/[0.06] border border-white/[0.12]">
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
