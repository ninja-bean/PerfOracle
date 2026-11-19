import React, { useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Cpu, 
  Database, 
  Layers, 
  Sliders, 
  Sparkles, 
  FileSpreadsheet, 
  Activity,
  TrendingUp,
  Zap,
  GitBranch,
  BarChart3
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Badge from '../common/Badge';
import StatCounters from './StatCounters';

export default function OverviewView({ 
  algorithms, 
  benchmarks, 
  tiers, 
  onNavigate, 
  onOpenAddModal, 
  onOpenPhase2 
}) {
  const recentBenchmarks = benchmarks.slice(-5).reverse();

  const categories = algorithms.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {});

  // Sparkline data for mini-chart (fake activity over 12 points)
  const sparklineData = [22, 35, 28, 48, 41, 60, 53, 71, 62, 80, 74, 88];
  const maxSpark = Math.max(...sparklineData);
  const minSpark = Math.min(...sparklineData);
  const sparkH = 40;
  const sparkW = 120;
  const pts = sparklineData.map((v, i) => {
    const x = (i / (sparklineData.length - 1)) * sparkW;
    const y = sparkH - ((v - minSpark) / (maxSpark - minSpark)) * sparkH;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-8 page-enter">
      
      {/* ═══════════════════════════════════════════════
          HERO — Asymmetric editorial layout
      ═══════════════════════════════════════════════ */}
      <div className="relative rounded-3xl overflow-hidden hero-card">
        {/* Crisp Top Specular Highlight Edge — zero blotchiness */}
        <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        <div className="relative z-10 p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            
            {/* Left: Text block */}
            <div className="flex-1 space-y-5 max-w-xl">
              {/* System tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full hero-pill text-[11px] text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-white status-dot" style={{ boxShadow: '0 0 6px white' }} />
                <span className="font-mono tracking-wide">FYDP · Empirical System · v1.0-alpha</span>
              </div>

              {/* Headline — large, weighted, human-designed */}
              <div className="space-y-1">
                <h1 className="text-[42px] sm:text-[52px] font-black leading-[0.95] tracking-tight font-display text-white">
                  Empirical<br />
                  <span className="hero-gradient-text">Benchmarking.</span>
                </h1>
                <h2 className="text-[22px] sm:text-[28px] font-light leading-tight text-zinc-500 tracking-tight font-display">
                  Precision ML Datasets.
                </h2>
              </div>

              <p className="text-[13px] text-zinc-500 leading-relaxed max-w-md">
                Record hardware execution telemetry across calibrated rubrics, classify performance tiers, 
                and compile normalized CSV matrices — the dataset fuel for Site 2 ML prediction.
              </p>

              {/* CTAs — hierarchy: primary > secondary > ghost */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => onNavigate('rubrics')}
                  className="px-5 py-2.5 rounded-2xl font-bold text-[12px] uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95 hero-primary-btn"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Launch Rubric Runner
                </button>

                <button
                  onClick={() => onNavigate('dataset')}
                  className="px-5 py-2.5 rounded-2xl font-semibold text-[12px] uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95 hero-secondary-btn"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 opacity-80" />
                  Dataset Studio
                </button>

                <button
                  onClick={onOpenPhase2}
                  className="text-btn text-[12px] text-zinc-500 hover:text-white transition-colors px-1 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Phase 2 ML Blueprint</span>
                  <ArrowRight className="w-3 h-3 opacity-60" />
                </button>
              </div>
            </div>

            {/* Right: Live pipeline stats widget — creative, not a grid */}
            <div className="lg:w-72 shrink-0 space-y-3">
              {/* Mini sparkline card */}
              <div className="rounded-2xl p-4 overview-subcard">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wide">Rubric Score Trend</span>
                  <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
                </div>
                <svg viewBox={`0 0 ${sparkW} ${sparkH}`} className="w-full h-10" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkGrad" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points={pts}
                    fill="none"
                    stroke="url(#sparkGrad)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white font-display">
                    {benchmarks.length > 0 
                      ? (benchmarks.reduce((a, b) => a + (b.rubricScore || 0), 0) / benchmarks.length).toFixed(0)
                      : '—'}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">avg score</span>
                </div>
              </div>

              {/* Pipeline flow — vertical, editorial */}
              <div className="rounded-2xl overflow-hidden overview-subcard">
                {[
                  { step: '01', label: 'Algorithm Registry', sub: 'Big-O specs', icon: Cpu },
                  { step: '02', label: 'Tier Allocation', sub: 'S → D bands', icon: Layers },
                  { step: '03', label: 'Rubric Testing', sub: 'Hardware telemetry', icon: Activity },
                  { step: '04', label: 'CSV Export', sub: 'ML training data', icon: Database, last: true },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className={`flex items-center gap-3 px-4 py-2.5 group transition-colors hover:bg-white/[0.03] ${!item.last ? 'border-b border-white/[0.05]' : ''}`}>
                      <span className="text-[9px] font-mono text-zinc-700 w-6 shrink-0">{item.step}</span>
                      <Icon className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[12px] font-semibold text-zinc-300 leading-tight truncate">{item.label}</div>
                        <div className="text-[10px] text-zinc-600 font-mono">{item.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          STAT COUNTERS
      ═══════════════════════════════════════════════ */}
      <div data-tour="site1-hero-stats">
        <StatCounters algorithms={algorithms} benchmarks={benchmarks} tiers={tiers} />
      </div>

      {/* ═══════════════════════════════════════════════
          CONTENT AREA — Asymmetric cols
      ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left block: 3 cols */}
        <div className="lg:col-span-3 space-y-6">

          {/* Algorithmic Domains */}
          <GlassCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[15px] font-bold text-white tracking-tight font-display">Algorithmic Domains</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Computational paradigms in registry</p>
              </div>
              <button
                onClick={onOpenAddModal}
                className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white transition-all hover:scale-105 border border-white/[0.1] hover:border-white/[0.25] hover:bg-white/[0.07]"
              >
                + Register
              </button>
            </div>

            <div className="space-y-2.5">
              {Object.entries(categories).map(([category, count], idx) => {
                const pct = Math.min(100, (count / algorithms.length) * 100 * 2.5);
                return (
                  <div
                    key={category}
                    onClick={() => onNavigate('algorithms')}
                    className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] font-medium text-zinc-300 group-hover:text-white transition-colors truncate">
                          {category}
                        </span>
                        <span className="font-mono text-[11px] text-zinc-500 ml-2 shrink-0">{count}</span>
                      </div>
                      <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
                        <div 
                          className="bar-fill bg-white h-full rounded-full"
                          style={{ 
                            '--bar-width': `${pct}%`,
                            boxShadow: '0 0 6px rgba(255,255,255,0.4)',
                            animationDelay: `${idx * 0.1}s`
                          }}
                        />
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Recent Benchmark Telemetry */}
          <GlassCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[15px] font-bold text-white tracking-tight font-display">Recent Telemetry</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Latest empirical runs committed to dataset</p>
              </div>
              <button
                onClick={() => onNavigate('dataset')}
                className="text-btn text-[11px] font-semibold text-zinc-500 hover:text-white transition-colors"
              >
                <span>All {benchmarks.length} records</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-600 font-mono text-[10px] uppercase tracking-wider border-b border-white/[0.05]">
                    <th className="pb-2.5 font-medium pr-4">Algorithm</th>
                    <th className="pb-2.5 font-medium pr-4 hidden sm:table-cell">Latency</th>
                    <th className="pb-2.5 font-medium pr-4 hidden md:table-cell">Score</th>
                    <th className="pb-2.5 font-medium text-right">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBenchmarks.map((bm, i) => (
                    <tr 
                      key={bm.id} 
                      className="tbl-row border-b border-white/[0.03] last:border-0"
                    >
                      <td className="py-2.5 pr-4">
                        <div className="text-[12px] font-semibold text-white">{bm.name}</div>
                        <div className="text-[10px] text-zinc-600 font-mono">{bm.algoId}</div>
                      </td>
                      <td className="py-2.5 pr-4 hidden sm:table-cell">
                        <span className="font-mono text-[12px] text-zinc-300">{bm.latencyMs}ms</span>
                      </td>
                      <td className="py-2.5 pr-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[12px] text-white font-bold">{bm.rubricScore}</span>
                          <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="bg-white h-full rounded-full" style={{ width: `${bm.rubricScore}%`, boxShadow: '0 0 4px white' }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 text-right">
                        <Badge variant={bm.assignedTier.toLowerCase().replace(' ', '-')}>
                          {bm.assignedTier}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right block: 2 cols — different visual weight */}
        <div className="lg:col-span-2 space-y-6">

          {/* Tier Distribution — compact, clear */}
          <GlassCard>
            <div className="mb-4">
              <h3 className="text-[15px] font-bold text-white tracking-tight font-display">Tier Distribution</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Empirical stratification snapshot</p>
            </div>

            <div className="space-y-2">
              {tiers.map((tier) => {
                const count = benchmarks.filter(b => b.assignedTier === tier.name).length;
                const pct = benchmarks.length > 0 ? Math.round((count / benchmarks.length) * 100) : 0;
                return (
                  <div key={tier.id} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant={tier.name.toLowerCase().replace(' ', '-')}>
                        {tier.name}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-zinc-500">{count}</span>
                        <span className="font-mono text-[10px] text-zinc-700">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/[0.05] h-1 rounded-full overflow-hidden">
                      <div 
                        className="bar-fill bg-white h-full rounded-full transition-all"
                        style={{ 
                          '--bar-width': `${pct}%`,
                          boxShadow: '0 0 5px rgba(255,255,255,0.3)',
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Phase 2 teaser — editorial, not a standard card */}
          <div
            className="rounded-3xl p-5 relative overflow-hidden cursor-pointer group transition-all duration-300 phase2-teaser-card"
            onClick={onOpenPhase2}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
              style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wide">Phase 2</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
              </div>

              <h4 className="text-[16px] font-bold text-white font-display leading-tight mb-2">
                ML Performance<br />Predictor
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Every benchmark row here trains the Site 2 regressor to forecast algorithm performance before execution.
              </p>

              <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-3 h-3 text-zinc-600" />
                  <span className="text-[10px] font-mono text-zinc-600">{benchmarks.length} training rows ready</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-wider">Calibrated</span>
              </div>
            </div>
          </div>

          {/* Quick jump — domain-aware shortcuts */}
          <div className="rounded-2xl overflow-hidden overview-subcard">
            <div className="px-4 py-3 border-b border-white/[0.05] quick-actions-header">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wide">Quick Actions</span>
            </div>
            {[
              { label: 'Register Algorithm', action: onOpenAddModal, icon: Cpu },
              { label: 'Run Benchmark', action: () => onNavigate('rubrics'), icon: Zap },
              { label: 'Export CSV', action: () => onNavigate('dataset'), icon: FileSpreadsheet },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.04] border-b border-white/[0.04] last:border-0 group"
                >
                  <Icon className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
                  <span className="text-[12px] text-zinc-400 group-hover:text-white transition-colors">{item.label}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-700 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Needed for ChevronRight inside this file
function ChevronRight({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
