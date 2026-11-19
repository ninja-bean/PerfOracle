import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Layers, 
  Sliders, 
  Database, 
  Sparkles, 
  X,
  Compass,
  ChevronRight,
  Brain,
  TrendingUp,
  HardDrive,
  Award,
  Zap
} from 'lucide-react';
import Badge from './Badge';

export default function Sidebar({ 
  activeSite = 'site1',
  onSwitchSite,
  activeTab, 
  setActiveTab, 
  site2ActiveTab,
  setSite2ActiveTab,
  onOpenPhase2, 
  onOpenTutorial,
  algoCount, 
  benchmarkCount,
  isOpen,
  onClose
}) {
  const site1NavItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: LayoutDashboard,
      description: 'Platform health & telemetry'
    },
    { 
      id: 'algorithms', 
      label: 'Algorithm Registry', 
      icon: Cpu, 
      count: algoCount,
      description: 'Asymptotic & Big-O specs'
    },
    { 
      id: 'tiers', 
      label: 'Tier Matrix', 
      icon: Layers, 
      badge: 'S–D',
      description: 'Empirical classification'
    },
    { 
      id: 'rubrics', 
      label: 'Rubric Benchmarks', 
      icon: Sliders,
      badge: 'Live',
      description: 'Multi-metric testing runner'
    },
    { 
      id: 'dataset', 
      label: 'Dataset & CSV Studio', 
      icon: Database, 
      count: benchmarkCount,
      description: 'RFC 4180 ML training data'
    },
  ];

  const site2NavItems = [
    {
      id: 'overview',
      label: 'Predictor Overview',
      icon: Brain,
      description: 'ML model intelligence summary'
    },
    {
      id: 'sandbox',
      label: 'Inference Sandbox',
      icon: Sliders,
      badge: 'Interactive',
      description: 'Multi-target live forecasts'
    },
    {
      id: 'scaling',
      label: 'Scaling & Log-Log Plot',
      icon: TrendingUp,
      badge: 'R²=0.99',
      description: 'Empirical vs. Big-O curves'
    },
    {
      id: 'hardware',
      label: 'Hardware Guardrails',
      icon: HardDrive,
      badge: 'OOM Check',
      description: 'ESP8266 to M5 RAM ceilings'
    },
    {
      id: 'models',
      label: 'Model Leaderboard',
      icon: Award,
      badge: 'B0 vs M1',
      description: 'Ablation study & validation'
    }
  ];

  const currentNavItems = activeSite === 'site2' ? site2NavItems : site1NavItems;
  const currentActiveId = activeSite === 'site2' ? site2ActiveTab : activeTab;
  const setCurrentActiveId = (id) => {
    if (activeSite === 'site2') {
      setSite2ActiveTab(id);
    } else {
      setActiveTab(id);
    }
    onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full relative">
      {/* Ambient sidebar glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Top: Glowing Bug Logo + Platform Header */}
      <div className="p-5 relative">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => { setCurrentActiveId('overview'); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-white/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img 
                src="/perforacle_icon_square.png" 
                alt="PerfOracle" 
                className="w-9 h-9 object-contain logo-glow relative z-10" 
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-[17px] font-black tracking-tight text-white leading-none font-display">
                PerfOracle
              </h1>
              <p className="text-[10px] mt-0.5 text-zinc-500 font-mono tracking-wide">
                {activeSite === 'site2' ? 'Predictive AI (Site 2)' : 'Benchmark Studio (Site 1)'}
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unified Mode Switcher Segment */}
        <div className="mt-4 p-1 rounded-xl bg-white/[0.035] border border-white/[0.09] grid grid-cols-2 gap-1 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => onSwitchSite('site1')}
            className={`py-2 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSite === 'site1'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>Site 1</span>
          </button>
          <button
            type="button"
            onClick={() => onSwitchSite('site2')}
            className={`py-2 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSite === 'site2'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Brain className="w-3 h-3" />
            <span>Site 2</span>
          </button>
        </div>

        {/* Refined divider */}
        <div className="sidebar-divider mt-4" />
      </div>

      {/* Center: Navigation Items */}
      <div className="flex-1 px-3 pb-2 space-y-0.5 overflow-y-auto">
        <div className="sidebar-section-label mb-3">
          {activeSite === 'site2' ? 'Predictive Intelligence' : 'Empirical Modules'}
        </div>

        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentActiveId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentActiveId(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative overflow-hidden cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-bold nav-active-pill'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.045]'
              }`}
            >
              <div className="flex items-center gap-2.5 relative z-10">
                <Icon className={`w-3.5 h-3.5 transition-all duration-200 ${
                  isActive ? 'text-black' : 'text-zinc-500 group-hover:text-white group-hover:scale-110'
                }`} />
                <span className="text-[12.5px] leading-none">{item.label}</span>
              </div>

              <div className="relative z-10 flex items-center gap-1.5">
                {item.count !== undefined && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-black/15 text-black font-bold' : 'bg-white/[0.07] text-zinc-400'
                  }`}>
                    {item.count}
                  </span>
                )}

                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-black/15 text-black font-bold' : 'bg-white/[0.07] text-zinc-400'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {!isActive && (
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom: Tour & Status */}
      <div className="p-3 space-y-2">
        <div className="sidebar-divider mb-3" />

        <button
          onClick={() => { onOpenTutorial(); onClose(); }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/[0.05] border border-white/[0.07] group cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
          <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-white transition-colors">Visual Tour</span>
        </button>

        {/* Status line */}
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white status-dot" style={{ boxShadow: '0 0 6px white' }} />
            <span className="text-[10px] font-mono text-zinc-400">
              {activeSite === 'site2' ? 'Predictor Active' : 'Engine Calibrated'}
            </span>
          </div>
          <span className="text-[9px] font-mono text-zinc-600">v1.0-α</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside 
        className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col justify-between z-30"
        style={{
          background: 'linear-gradient(180deg, rgba(8,8,10,0.98) 0%, rgba(5,5,7,0.99) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.065)',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          />
          <aside 
            className="fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col justify-between lg:hidden shadow-2xl"
            style={{
              background: '#08080a',
              borderRight: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
