import React from 'react';
import { 
  Cpu, 
  Layers, 
  Sliders, 
  Database, 
  LayoutDashboard, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Badge from './Badge';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenPhase2, 
  algoCount, 
  benchmarkCount 
}) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'algorithms', label: 'Algorithm Registry', icon: Cpu },
    { id: 'tiers', label: 'Tier Matrix', icon: Layers },
    { id: 'rubrics', label: 'Rubric Benchmarks', icon: Sliders },
    { id: 'dataset', label: 'Dataset & CSV Studio', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080808]/85 backdrop-blur-xl">
      {/* Top Banner: Dual-Site Switcher & Telemetry */}
      <div className="border-b border-white/5 px-4 lg:px-8 py-2 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-zinc-200 font-semibold tracking-wider">PERFORACLE RUNTIME</span>
          </div>
          <span className="text-zinc-700">|</span>
          <span className="hidden sm:inline">Telemetry Engine: Calibrated</span>
          <span className="text-zinc-700 hidden sm:inline">|</span>
          <span className="hidden md:inline font-mono text-[11px] text-zinc-400">Memory: ~18MB DOM • Zero-Bloat</span>
        </div>

        {/* Dual-Portal Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-white/5 border border-white/10 rounded-lg p-0.5 flex items-center">
            <button
              onClick={() => setActiveTab('overview')}
              className="px-2.5 py-1 text-[11px] rounded-md bg-white text-black font-semibold flex items-center gap-1 shadow-sm"
            >
              <span>Site 1: Dataset Engine</span>
            </button>
            <button
              onClick={onOpenPhase2}
              className="px-2.5 py-1 text-[11px] rounded-md text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-zinc-300" />
              <span>Site 2: ML Predictor</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-zinc-300 border border-white/10 ml-0.5">Phase 2</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">
            <img 
              src="/perforacle_logo.jpg" 
              alt="PerfOracle Logo" 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                PerfOracle
              </span>
              <Badge variant="mono" size="xs">v1.0-alpha</Badge>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
              Algorithm Benchmark & Dataset Studio
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {tab.id === 'algorithms' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/15 text-black' : 'bg-white/10 text-zinc-300'}`}>
                    {algoCount}
                  </span>
                )}
                {tab.id === 'dataset' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/15 text-black' : 'bg-white/10 text-zinc-300'}`}>
                    {benchmarkCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('rubrics')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-zinc-200" />
            <span>New Benchmark</span>
          </button>
          <button
            onClick={() => setActiveTab('dataset')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            <Database className="w-3.5 h-3.5 text-black" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center justify-between border-t border-white/5 px-3 py-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-black font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
