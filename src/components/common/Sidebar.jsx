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
  Sun,
  Moon
} from 'lucide-react';
import Badge from './Badge';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenPhase2, 
  onOpenTutorial,
  algoCount, 
  benchmarkCount,
  isOpen,
  onClose,
  theme,
  toggleTheme
}) {
  const navItems = [
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

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full relative">
      {/* Ambient sidebar glow — top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Top: Glowing Bug Logo */}
      <div className="p-5 relative">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => { setActiveTab('overview'); onClose(); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Pure Bug Glyph — no box, just light */}
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-white/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img 
                src="/perforacle_icon_square.png" 
                alt="PerfOracle" 
                className="w-9 h-9 object-contain logo-glow relative z-10" 
              />
            </div>

            <div className="min-w-0">
              <h1 className={`text-[17px] font-black tracking-tight leading-none font-display ${
                theme === 'light' ? 'text-zinc-900' : 'text-white'
              }`}>
                PerfOracle
              </h1>
              <p className="text-[10px] mt-0.5 text-zinc-500 font-mono tracking-wide">
                Benchmark Studio
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className={`lg:hidden p-1.5 rounded-xl transition-colors ${
              theme === 'light' ? 'text-zinc-500 hover:text-black hover:bg-black/10' : 'text-zinc-500 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Refined divider */}
        <div className="sidebar-divider mt-5" />
      </div>

      {/* Center: Navigation */}
      <div className="flex-1 px-3 pb-2 space-y-0.5 overflow-y-auto">
        <div className="sidebar-section-label mb-3">Modules</div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); onClose(); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? 'nav-active-item font-bold nav-active-pill'
                  : theme === 'light'
                  ? 'text-zinc-600 hover:text-black hover:bg-black/[0.045]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.045]'
              }`}
            >
              <div className="flex items-center gap-2.5 relative z-10">
                <Icon className={`w-3.5 h-3.5 transition-all duration-200 ${
                  isActive 
                    ? (theme === 'light' ? 'text-white' : 'text-black')
                    : (theme === 'light' ? 'text-zinc-500 group-hover:text-black group-hover:scale-110' : 'text-zinc-500 group-hover:text-white group-hover:scale-110')
                }`} />
                <span className="text-[12.5px] leading-none">{item.label}</span>
              </div>

              <div className="relative z-10 flex items-center gap-1.5">
                {item.count !== undefined && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive 
                      ? (theme === 'light' ? 'bg-white/20 text-white font-bold' : 'bg-black/15 text-black font-bold')
                      : (theme === 'light' ? 'bg-black/[0.06] text-zinc-700' : 'bg-white/[0.07] text-zinc-400')
                  }`}>
                    {item.count}
                  </span>
                )}

                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive 
                      ? (theme === 'light' ? 'bg-white/20 text-white font-bold' : 'bg-black/15 text-black font-bold')
                      : (theme === 'light' ? 'bg-black/[0.06] text-zinc-700' : 'bg-white/[0.07] text-zinc-400')
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

        {/* Organic divider */}
        <div className="sidebar-divider my-4" />
        <div className="sidebar-section-label mb-3">Predictive AI</div>

        {/* Phase 2 ML Portal */}
        <button
          onClick={() => { onOpenPhase2(); onClose(); }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative overflow-hidden border ${
            theme === 'light'
              ? 'text-zinc-700 hover:text-black border-black/[0.08] bg-black/[0.02] hover:bg-black/[0.05]'
              : 'text-zinc-400 hover:text-white border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400 group-hover:scale-110 duration-200" />
            <span className="text-[12.5px]">Site 2: ML Model</span>
          </div>
          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono border ${
            theme === 'light'
              ? 'bg-black/[0.05] text-zinc-600 border-black/[0.08]'
              : 'bg-white/[0.07] text-zinc-400 border-white/[0.07]'
          }`}>
            Phase 2
          </span>
        </button>
      </div>

      {/* Bottom: Tour & Theme & Status */}
      <div className="p-3 space-y-2">
        <div className="sidebar-divider mb-3" />

        {/* Theme Switcher in Sidebar */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
            theme === 'light'
              ? 'border-black/[0.08] hover:bg-black/[0.04] text-zinc-700'
              : 'border-white/[0.07] hover:bg-white/[0.05] text-zinc-400'
          }`}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          <div className="flex items-center gap-2">
            {theme === 'light' ? (
              <Moon className="w-3.5 h-3.5 text-zinc-700" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span className="text-[11px] font-medium">{theme === 'light' ? 'Light Theme' : 'Dark Theme'}</span>
          </div>
          <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md font-semibold ${
            theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'
          }`}>
            {theme === 'light' ? 'Light' : 'Dark'}
          </span>
        </button>

        <button
          onClick={() => { onOpenTutorial(); onClose(); }}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 border group ${
            theme === 'light'
              ? 'border-black/[0.08] hover:bg-black/[0.04] text-zinc-700'
              : 'border-white/[0.07] hover:bg-white/[0.05] text-zinc-400'
          }`}
        >
          <Compass className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="text-[11px] font-semibold transition-colors">Visual Tour</span>
        </button>

        {/* Status line */}
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-1.5">
            <span 
              className={`w-1.5 h-1.5 rounded-full status-dot ${theme === 'light' ? 'bg-zinc-900' : 'bg-white'}`} 
              style={{ boxShadow: theme === 'light' ? '0 0 6px rgba(0,0,0,0.5)' : '0 0 6px white' }} 
            />
            <span className="text-[10px] font-mono text-zinc-500">Engine Calibrated</span>
          </div>
          <span className="text-[9px] font-mono text-zinc-500/70">v1.0-α</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar (Natural Flex Child in Flow — Never Overlaps Content) */}
      <aside 
        className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col justify-between z-30 transition-colors duration-200"
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer (Only Renders When Active on Mobile Viewports) */}
      {isOpen && (
        <>
          <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden modal-backdrop"
          />
          <aside 
            className="fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col justify-between lg:hidden shadow-2xl transition-colors duration-200"
            style={{
              background: 'var(--sidebar-bg)',
              borderRight: '1px solid var(--sidebar-border)',
            }}
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
