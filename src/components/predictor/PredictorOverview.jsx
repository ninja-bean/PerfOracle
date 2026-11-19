import React from 'react';
import { 
  Brain, 
  Cpu, 
  Zap, 
  Activity, 
  ArrowRight, 
  Layers, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp,
  HardDrive,
  BarChart3
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Badge from '../common/Badge';
import { hardwareTargets, mlModelSpecs } from '../../data/mlPredictorData';

export default function PredictorOverview({ onNavigate, onOpenSandbox }) {
  return (
    <div className="space-y-8 page-enter">
      {/* ═══════════════════════════════════════════════
          SITE 2 HERO — Predictive Intelligence Engine
      ═══════════════════════════════════════════════ */}
      <div className="relative rounded-3xl overflow-hidden hero-card">
        {/* Crisp Top Specular Highlight Edge */}
        <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        <div className="relative z-10 p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            
            {/* Left: Text block */}
            <div className="flex-1 space-y-5 max-w-xl">
              {/* System tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full hero-pill text-[11px] text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-white status-dot" style={{ boxShadow: '0 0 6px white' }} />
                <span className="font-mono tracking-wide">Site 2 · ML Performance Predictor · v1.0-alpha</span>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <h1 className="text-[40px] sm:text-[50px] font-black leading-[0.95] tracking-tight font-display text-white">
                  Predictive<br />
                  <span className="hero-gradient-text">Performance.</span>
                </h1>
                <h2 className="text-[20px] sm:text-[26px] font-light leading-tight text-zinc-500 tracking-tight font-display">
                  Forecast Before Execution.
                </h2>
              </div>

              <p className="text-[13px] text-zinc-400 leading-relaxed max-w-md">
                Trained on Site 1 empirical hardware telemetry. Predict runtime scaling curves, peak RAM footprints, 
                energy costs, and hardware ceiling violations (ESP8266 to Apple M5) without flashing physical hardware.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => onNavigate('sandbox')}
                  className="px-5 py-2.5 rounded-2xl font-bold text-[12px] uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95 hero-primary-btn cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Launch Inference Sandbox
                </button>

                <button
                  onClick={() => onNavigate('scaling')}
                  className="px-5 py-2.5 rounded-2xl font-semibold text-[12px] uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95 hero-secondary-btn cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 opacity-80" />
                  Log-Log Curves
                </button>

                <button
                  onClick={() => onNavigate('models')}
                  className="text-btn text-[12px] text-zinc-400 hover:text-white transition-colors px-1 font-medium cursor-pointer"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Model Leaderboard</span>
                  <ArrowRight className="w-3 h-3 opacity-60" />
                </button>
              </div>
            </div>

            {/* Right: Live Predictor Telemetry Summary */}
            <div className="lg:w-80 shrink-0 space-y-3">
              {/* Primary Model Score Card */}
              <div data-tour="site2-hero-metrics" className="rounded-2xl p-4 overview-subcard">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5 text-white" />
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide">M1 Neural Regressor</span>
                  </div>
                  <Badge variant="tier-s" size="xs">Primary</Badge>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Macro-F1</span>
                    <span className="text-xl font-black text-white font-display">0.86</span>
                    <span className="text-[9px] text-zinc-600 block mt-0.5">Held-out split</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Within 2×</span>
                    <span className="text-xl font-black text-white font-display">89.4%</span>
                    <span className="text-[9px] text-zinc-600 block mt-0.5">Measured runtime</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Spearman Rank ρ</span>
                  <span className="text-white font-bold">0.91</span>
                </div>
              </div>

              {/* Hardware Targets Overview */}
              <div className="rounded-2xl p-4 overview-subcard space-y-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                  Calibrated Hardware Spectrum
                </span>
                <div className="space-y-1.5">
                  {hardwareTargets.slice(0, 3).map((hw) => (
                    <div key={hw.id} className="flex items-center justify-between text-xs py-1 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3 h-3 text-zinc-500" />
                        <span className="text-zinc-300 font-medium">{hw.name}</span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-500">{hw.ramDisplay}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          CORE CAPABILITY METRIC TILES
      ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Latency Forecasting',
            metric: '±8.5%',
            sub: 'Uncertainty bounds on runtime',
            icon: Zap,
            tab: 'sandbox'
          },
          {
            title: 'Memory Wall Guard',
            metric: '80 KB → 32 GB',
            sub: 'Hardware OOM risk classifier',
            icon: HardDrive,
            tab: 'hardware'
          },
          {
            title: 'Empirical Complexity',
            metric: 'R² ≥ 0.985',
            sub: 'Log-log slope regression',
            icon: TrendingUp,
            tab: 'scaling'
          },
          {
            title: 'Baseline Accuracy',
            metric: 'B0 vs B1 vs M1',
            sub: 'Ablation benchmark study',
            icon: Layers,
            tab: 'models'
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(item.tab)}
              className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">{item.title}</span>
                <Icon className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-2xl font-black text-white font-display mb-1">{item.metric}</div>
              <div className="text-[11px] text-zinc-500 leading-snug">{item.sub}</div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════
          TWO-COLUMN WORKSPACE: PREDICTOR HIGHLIGHTS
      ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Workflow Guide */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[16px] font-bold text-white tracking-tight font-display">
                  How Site 2 Inference Operates
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  From source code AST features to physical hardware execution forecasts
                </p>
              </div>
              <Badge variant="tier-s" size="xs">Pipeline</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-[10px]">
                  01
                </div>
                <div className="font-bold text-white text-[13px] font-sans">Feature Synthesis</div>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  Extracts syntactic token trees, cyclomatic complexity, memory mutability, and Big-O heuristics from raw code.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-[10px]">
                  02
                </div>
                <div className="font-bold text-white text-[13px] font-sans">Hardware Projection</div>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  Injects physical hardware vector (clock speed, SRAM/DRAM limits, cache levels, instruction latency).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-[10px]">
                  03
                </div>
                <div className="font-bold text-white text-[13px] font-sans">Multi-Target Output</div>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  Yields joint runtime curve, peak memory, energy (Joules), carbon, and binary "Fits-on-Target" feasibility.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-mono">Ready to simulate custom workloads?</span>
              <button
                onClick={() => onNavigate('sandbox')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right Column (1 col): Hardware Quick Guardrails */}
        <div className="space-y-6">
          <GlassCard>
            <div className="mb-4">
              <h3 className="text-[15px] font-bold text-white tracking-tight font-display">Target Hardware Specs</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Physical device execution spectrum</p>
            </div>

            <div className="space-y-3">
              {hardwareTargets.map((hw) => (
                <div 
                  key={hw.id}
                  onClick={() => onNavigate('hardware')}
                  className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-bold text-white group-hover:text-zinc-200">{hw.name}</span>
                    <Badge variant={hw.category === 'MCU' ? 'tier-s' : 'tier-b'} size="xs">{hw.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>{hw.clockMhz} MHz</span>
                    <span className="text-zinc-300 font-semibold">{hw.ramDisplay} RAM</span>
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-1 truncate">{hw.notes}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
