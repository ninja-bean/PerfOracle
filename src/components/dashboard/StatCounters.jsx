import React from 'react';
import { Cpu, Database, Award, Activity } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function StatCounters({ algorithms, benchmarks, tiers }) {
  const totalAlgos = algorithms.length;
  const totalBenchmarks = benchmarks.length;
  
  const avgScore = benchmarks.length > 0 
    ? (benchmarks.reduce((acc, b) => acc + (b.rubricScore || 0), 0) / benchmarks.length).toFixed(1)
    : '—';

  const eliteCount = benchmarks.filter(b => b.assignedTier === 'Tier S' || b.assignedTier === 'Tier A').length;
  const eliteRatio = totalBenchmarks > 0 ? Math.round((eliteCount / totalBenchmarks) * 100) : 0;

  const stats = [
    {
      label: 'Algorithms',
      value: totalAlgos,
      unit: null,
      sub: '6 active domains',
      icon: Cpu,
      tag: 'Registered'
    },
    {
      label: 'Benchmark Records',
      value: totalBenchmarks,
      unit: null,
      sub: 'Empirical telemetry rows',
      icon: Database,
      tag: 'ML Ready'
    },
    {
      label: 'Avg Rubric Score',
      value: avgScore,
      unit: '/100',
      sub: 'Weighted composite',
      icon: Activity,
      tag: 'Normalized'
    },
    {
      label: 'Elite Tier Rate',
      value: `${eliteRatio}`,
      unit: '%',
      sub: `${eliteCount} of ${totalBenchmarks} runs S or A`,
      icon: Award,
      tag: 'S & A tiers'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`glass-card-human rounded-2xl p-4 relative overflow-hidden fade-slide-up fade-slide-up-${idx + 1}`}
          >
            {/* Subtle top highlight */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider leading-tight">{stat.label}</p>
              <div className="rounded-lg p-1.5 bg-white/[0.05] border border-white/[0.08] text-zinc-600 group-hover:bg-white group-hover:text-black transition-all duration-300 shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-[32px] font-black text-white leading-none font-display stat-number">
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-[14px] font-semibold text-zinc-500 font-mono">{stat.unit}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-600 truncate mr-2">{stat.sub}</span>
              <span className="text-[9px] font-mono text-zinc-700 bg-white/[0.04] px-1.5 py-0.5 rounded-md border border-white/[0.06] whitespace-nowrap shrink-0">
                {stat.tag}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
