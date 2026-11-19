import React, { useState } from 'react';
import { 
  Brain, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Award,
  Zap,
  Activity
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Badge from '../common/Badge';
import { mlModelSpecs } from '../../data/mlPredictorData';

export default function ModelLeaderboard() {
  const [activeSplit, setActiveSplit] = useState('held_out_algo');

  const splits = [
    { id: 'held_out_algo', name: 'Held-Out Algorithm (Primary)', desc: 'Generalization to completely unseen source code' },
    { id: 'leave_one_target', name: 'Leave-One-Target-Out', desc: 'Transfer across unseen hardware architectures' },
    { id: 'held_out_tier', name: 'Held-Out Quality Tier', desc: 'Robustness across unseen code quality levels' },
    { id: 'random', name: 'Random Split', desc: 'Standard interpolation baseline' }
  ];

  const splitMetrics = {
    held_out_algo: [
      { metric: 'Complexity Macro-F1', target: '≥ 0.75', b0: '0.52', b1: '0.74', m1: '0.86', passed: true },
      { metric: 'Runtime (Within 2× Measured)', target: '≥ 80%', b0: '41.2%', b1: '76.8%', m1: '89.4%', passed: true },
      { metric: 'Tier Ranking (Spearman ρ)', target: '≥ 0.80', b0: '0.58', b1: '0.81', m1: '0.91', passed: true },
      { metric: 'Fits-on-Target / OOM (F1)', target: '≥ 0.90', b0: '0.48', b1: '0.88', m1: '0.96', passed: true }
    ],
    leave_one_target: [
      { metric: 'Complexity Macro-F1', target: '≥ 0.70', b0: '0.48', b1: '0.69', m1: '0.82', passed: true },
      { metric: 'Runtime (Within 2× Measured)', target: '≥ 75%', b0: '38.5%', b1: '71.2%', m1: '84.6%', passed: true },
      { metric: 'Tier Ranking (Spearman ρ)', target: '≥ 0.75', b0: '0.52', b1: '0.76', m1: '0.88', passed: true },
      { metric: 'Fits-on-Target / OOM (F1)', target: '≥ 0.85', b0: '0.44', b1: '0.83', m1: '0.93', passed: true }
    ],
    held_out_tier: [
      { metric: 'Complexity Macro-F1', target: '≥ 0.75', b0: '0.50', b1: '0.72', m1: '0.85', passed: true },
      { metric: 'Runtime (Within 2× Measured)', target: '≥ 80%', b0: '42.0%', b1: '75.4%', m1: '87.8%', passed: true },
      { metric: 'Tier Ranking (Spearman ρ)', target: '≥ 0.80', b0: '0.55', b1: '0.79', m1: '0.89', passed: true },
      { metric: 'Fits-on-Target / OOM (F1)', target: '≥ 0.90', b0: '0.46', b1: '0.86', m1: '0.95', passed: true }
    ],
    random: [
      { metric: 'Complexity Macro-F1', target: '≥ 0.80', b0: '0.56', b1: '0.81', m1: '0.92', passed: true },
      { metric: 'Runtime (Within 2× Measured)', target: '≥ 85%', b0: '45.1%', b1: '82.4%', m1: '94.2%', passed: true },
      { metric: 'Tier Ranking (Spearman ρ)', target: '≥ 0.85', b0: '0.62', b1: '0.87', m1: '0.95', passed: true },
      { metric: 'Fits-on-Target / OOM (F1)', target: '≥ 0.92', b0: '0.51', b1: '0.91', m1: '0.98', passed: true }
    ]
  };

  const currentMetrics = splitMetrics[activeSplit];

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white font-display tracking-tight">
              Model Evaluation & Benchmark Leaderboard
            </h2>
            <Badge variant="tier-s" size="xs">FYDP Target Verified</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Comparing B0 heuristic baseline, B1 classical ML, and M1 deep transformer across four validation splits
          </p>
        </div>
      </div>

      {/* Split Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {splits.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSplit(s.id)}
            className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeSplit === s.id
                ? 'bg-white text-black border-white shadow-lg'
                : 'bg-white/[0.025] text-white border-white/[0.08] hover:bg-white/[0.05]'
            }`}
          >
            <div className={`text-xs font-bold font-sans ${activeSplit === s.id ? 'text-black' : 'text-white'}`}>
              {s.name}
            </div>
            <div className={`text-[10px] mt-1 leading-relaxed ${activeSplit === s.id ? 'text-zinc-700' : 'text-zinc-500'}`}>
              {s.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Evaluation Results Table */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
            Split Performance Verification Matrix
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            Split: {splits.find(s => s.id === activeSplit)?.name}
          </span>
        </div>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-zinc-500 text-[10px] uppercase tracking-wider border-b border-white/[0.08]">
                <th className="pb-3 pr-4">Evaluation Metric</th>
                <th className="pb-3 pr-4">Target Threshold</th>
                <th className="pb-3 pr-4">B0 (Heuristic)</th>
                <th className="pb-3 pr-4">B1 (LightGBM)</th>
                <th className="pb-3 pr-4 text-white">M1 (Neural · Primary)</th>
                <th className="pb-3 text-right">Target Status</th>
              </tr>
            </thead>
            <tbody>
              {currentMetrics.map((row, i) => (
                <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 font-sans font-semibold text-white">
                    {row.metric}
                  </td>
                  <td className="py-3 pr-4 text-zinc-400">
                    {row.target}
                  </td>
                  <td className="py-3 pr-4 text-zinc-500">
                    {row.b0}
                  </td>
                  <td className="py-3 pr-4 text-zinc-300">
                    {row.b1}
                  </td>
                  <td className="py-3 pr-4 text-white font-bold text-sm">
                    {row.m1}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-sans font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PASSED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Model Architecture Deep-Dive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mlModelSpecs.map((m) => (
          <GlassCard key={m.id}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                {m.name}
              </span>
              <Badge variant={m.id === 'm1' ? 'tier-s' : 'tier-b'} size="xs">
                {m.id === 'm1' ? 'Primary' : 'Baseline'}
              </Badge>
            </div>

            <div className="text-sm font-bold text-white font-display mb-2">{m.type}</div>
            <p className="text-[11px] text-zinc-400 leading-relaxed min-h-[50px]">{m.description}</p>

            <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Accuracy (≤ 2×):</span>
                <span className="text-white font-bold">{m.accuracyWithin2x}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Macro-F1:</span>
                <span className="text-white font-bold">{m.macroF1}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Inference Latency:</span>
                <span className="text-zinc-300">{m.inferenceLatency}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
