import React, { useState } from 'react';
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
  Zap,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import Badge from './Badge';

export default function Sidebar({ 
  activeSite = 'site2',
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const site1NavSections = [
    {
      title: 'Platform Core',
      items: [
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
        }
      ]
    },
    {
      title: 'Testing & Data',
      items: [
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
        }
      ]
    }
  ];

  const site2NavSections = [
    {
      title: 'Predictor Core',
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: Brain,
          badge: 'v1.0',
          description: 'ML model intelligence summary'
        },
        {
          id: 'sandbox',
          label: 'Code Sandbox',
          icon: Sliders,
          badge: 'Live',
          description: 'Multi-target live forecasts'
        }
      ]
    },
    {
      title: 'Asymptotics & Limits',
      items: [
        {
          id: 'scaling',
          label: 'Scaling Curves',
          icon: TrendingUp,
          badge: 'R²≥0.99',
          description: 'Empirical vs Big-O curves'
        },
        {
          id: 'hardware',
          label: 'Hardware Limits',
          icon: HardDrive,
          badge: 'OOM Wall',
          description: 'ESP8266 to M5 RAM ceilings'
        }
      ]
    },
    {
      title: 'Model Evaluation',
      items: [
        {
          id: 'models',
          label: 'Leaderboard',
          icon: Award,
          badge: 'Parity 45°',
          description: 'Ablation study & calibration'
        }
      ]
    }
  ];

  const currentNavSections = activeSite === 'site2' ? site2NavSections : site1NavSections;
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
      {/* Top Header & Brand Identity */}
      <div className={`p-4 relative border-b border-white/[0.06] ${isCollapsed ? 'px-2' : ''}`}>
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setCurrentActiveId('overview')}
            className={`flex items-center gap-3 cursor-pointer group ${isCollapsed ? 'justify-center w-full' : ''}`}
            title="PerfOracle Home"
          >
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="/perforacle_icon_square.png" 
                alt="PerfOracle" 
                className="w-8 h-8 object-contain logo-glow relative z-10" 
              />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="text-sm font-black tracking-tight text-white leading-none font-display">
                  PerfOracle
                </h1>
                <p className="text-[10px] mt-0.5 text-zinc-500 font-mono tracking-wider">
                  {activeSite === 'site2' ? 'Predictive AI (Site 2)' : 'Benchmark Studio (Site 1)'}
                </p>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unified Mode Switcher Segment (Site 1 vs Site 2) */}
        {!isCollapsed ? (
          <div className="mt-3 p-1 rounded-xl bg-white/[0.035] border border-white/[0.08] grid grid-cols-2 gap-1 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => onSwitchSite('site1')}
              className={`py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
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
              className={`py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSite === 'site2'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Brain className="w-3 h-3" />
              <span>Site 2</span>
            </button>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-1 items-center">
            <button
              type="button"
              onClick={() => onSwitchSite(activeSite === 'site1' ? 'site2' : 'site1')}
              title={`Switch to ${activeSite === 'site1' ? 'Site 2 (ML Predictor)' : 'Site 1 (Benchmark)'}`}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.1] text-zinc-300 hover:text-white cursor-pointer"
            >
              {activeSite === 'site2' ? <Brain className="w-4 h-4 text-white" /> : <Database className="w-4 h-4 text-white" />}
            </button>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {currentNavSections.map((section, sIdx) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed ? (
              <div className="px-2.5 mb-1.5 text-[10px] font-mono font-medium tracking-widest text-zinc-500 uppercase select-none">
                {section.title}
              </div>
            ) : sIdx > 0 ? (
              <div className="sidebar-divider my-2" />
            ) : null}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentActiveId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentActiveId(item.id)}
                  title={isCollapsed ? `${item.label} — ${item.description}` : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-medium transition-all duration-150 group cursor-pointer relative ${
                    isCollapsed 
                      ? 'justify-center p-2.5' 
                      : 'justify-between px-3 py-2.5'
                  } ${
                    isActive
                      ? 'nav-active-tactile'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] hover:border hover:border-white/[0.06]'
                  }`}
                >
                  <div className={`flex items-center gap-2.5 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
                    <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white group-hover:scale-105'
                    }`} />
                    {!isCollapsed && (
                      <span className="truncate leading-none text-[12px]">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.count !== undefined && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                          isActive 
                            ? 'bg-white/20 text-white font-bold' 
                            : 'bg-white/[0.06] text-zinc-400 border border-white/[0.06]'
                        }`}>
                          {item.count}
                        </span>
                      )}

                      {item.badge && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                          isActive 
                            ? 'bg-white/20 text-white font-bold' 
                            : 'bg-white/[0.05] text-zinc-400 border border-white/[0.06]'
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {!isActive && (
                        <ChevronRight className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Footer: Tour, Collapse Rail Toggle & Telemetry Heartbeat */}
      <div className={`p-3 border-t border-white/[0.06] space-y-2.5 ${isCollapsed ? 'px-2' : ''}`}>
        {/* Interactive Tour Trigger */}
        <button
          onClick={() => { onOpenTutorial(); onClose(); }}
          title="Interactive Platform Tour"
          className={`w-full flex items-center rounded-xl transition-all duration-200 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/[0.14] group cursor-pointer ${
            isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
          }`}
        >
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
            {!isCollapsed && (
              <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white transition-colors">
                Visual Tour
              </span>
            )}
          </div>
          {!isCollapsed && (
            <span className="text-[9px] font-mono text-zinc-500 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.08]">
              {activeSite === 'site2' ? 'Site 2' : 'Site 1'}
            </span>
          )}
        </button>

        {/* Desktop Rail Collapse Toggle */}
        <div className="hidden lg:flex items-center justify-between pt-1 text-[11px] text-zinc-500 font-mono">
          {!isCollapsed ? (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white status-dot" style={{ boxShadow: '0 0 6px white' }} />
              <span className="text-[10px] text-zinc-400">
                {activeSite === 'site2' ? 'Predictor Active' : 'Bench Ready'}
              </span>
            </div>
          ) : (
            <div className="w-full flex justify-center mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white status-dot" style={{ boxShadow: '0 0 6px white' }} />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse to rail'}
            className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            {isCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar Rail */}
      <aside 
        className={`hidden lg:flex sticky top-0 h-screen shrink-0 flex-col justify-between z-30 transition-all duration-300 bg-[#08090d] glass-surface-l1 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
        style={{
          borderRight: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-40 lg:hidden"
          />
          <aside 
            className="fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col justify-between lg:hidden shadow-2xl bg-[#08090d] glass-surface-l1"
            style={{
              borderRight: '1px solid rgba(255,255,255,0.14)'
            }}
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
