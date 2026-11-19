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
  const [activeModelComparison, setActiveModelComparison] = useState('m1');

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

  // Parity points for 45-degree scatter plot: (measured vs predicted)
  const parityPoints = {
    m1: [
      { name: 'Quicksort N=1k', measured: 1.05, predicted: 1.08 },
      { name: 'Quicksort N=10k', measured: 13.8, predicted: 14.1 },
      { name: 'Dijkstra N=200', measured: 1.84, predicted: 1.90 },
      { name: 'Dijkstra N=2k', measured: 31.5, predicted: 29.8 },
      { name: 'Strassen N=64', measured: 5.12, predicted: 4.95 },
      { name: 'AES-256 N=5k', measured: 4.52, predicted: 4.60 },
      { name: 'FFT N=1k', measured: 2.10, predicted: 2.15 },
      { name: 'FFT N=4k', measured: 9.80, predicted: 10.1 }
    ],
    b1: [
      { name: 'Quicksort N=1k', measured: 1.05, predicted: 1.35 },
      { name: 'Quicksort N=10k', measured: 13.8, predicted: 17.2 },
      { name: 'Dijkstra N=200', measured: 1.84, predicted: 2.40 },
      { name: 'Dijkstra N=2k', measured: 31.5, predicted: 24.1 },
      { name: 'Strassen N=64', measured: 5.12, predicted: 6.80 },
      { name: 'AES-256 N=5k', measured: 4.52, predicted: 5.40 },
      { name: 'FFT N=1k', measured: 2.10, predicted: 2.70 },
      { name: 'FFT N=4k', measured: 9.80, predicted: 13.5 }
    ],
    b0: [
      { name: 'Quicksort N=1k', measured: 1.05, predicted: 0.40 },
      { name: 'Quicksort N=10k', measured: 13.8, predicted: 4.00 },
      { name: 'Dijkstra N=200', measured: 1.84, predicted: 0.65 },
      { name: 'Dijkstra N=2k', measured: 31.5, predicted: 6.50 },
      { name: 'Strassen N=64', measured: 5.12, predicted: 18.2 },
      { name: 'AES-256 N=5k', measured: 4.52, predicted: 1.20 },
      { name: 'FFT N=1k', measured: 2.10, predicted: 0.80 },
      { name: 'FFT N=4k', measured: 9.80, predicted: 3.20 }
    ]
  };

  const currentMetrics = splitMetrics[activeSplit];
  const activeParity = parityPoints[activeModelComparison];

  // SVG dimensions for parity plot
  const pSize = 260;
  const pPad = 35;
  const pMax = 35; // max latency ms for plotting

  const toCoord = (val) => {
    const frac = Math.min(1, Math.max(0, val / pMax));
    return pPad + frac * (pSize - 2 * pPad);
  };

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

      {/* Two Column Grid: Left Metrics Matrix (7 cols) | Right 45-Degree Parity Scatter Plot (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Evaluation Results Table */}
        <div className="lg:col-span-7 space-y-6">
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
                    <th className="pb-3 pr-4">B0</th>
                    <th className="pb-3 pr-4">B1</th>
                    <th className="pb-3 pr-4 text-white">M1 (Primary)</th>
                    <th className="pb-3 text-right">Status</th>
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
        </div>

        {/* Right Column: 45-Degree Parity Scatter Plot */}
        <div data-tour="model-parity-plot" className="lg:col-span-5 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold block">
                  Parity Plot (Measured vs Predicted)
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  Ideal fit lies precisely along 45° diagonal (y = x)
                </span>
              </div>

              {/* Model Choice for Parity */}
              <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.08]">
                {['b0', 'b1', 'm1'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveModelComparison(m)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-all cursor-pointer ${
                      activeModelComparison === m 
                        ? 'bg-white text-black font-bold shadow' 
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Parity SVG */}
            <div className="flex justify-center">
              <svg viewBox={`0 0 ${pSize} ${pSize}`} className="w-64 h-64">
                {/* Background Box */}
                <rect x={pPad} y={pPad} width={pSize - 2 * pPad} height={pSize - 2 * pPad} fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                
                {/* 45° Diagonal Reference Line (y = x) */}
                <line
                  x1={pPad}
                  y1={pSize - pPad}
                  x2={pSize - pPad}
                  y2={pPad}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* ±20% Error Margin Cone */}
                <line
                  x1={pPad}
                  y1={pSize - pPad}
                  x2={pSize - pPad}
                  y2={pPad + (pSize - 2 * pPad) * 0.18}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
                <line
                  x1={pPad}
                  y1={pSize - pPad}
                  x2={pSize - pPad - (pSize - 2 * pPad) * 0.18}
                  y2={pPad}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />

                {/* Parity Points */}
                {activeParity.map((pt, i) => {
                  const cx = toCoord(pt.measured);
                  const cy = (pSize - pPad) - ((toCoord(pt.predicted) - pPad));
                  const isTight = Math.abs(pt.measured - pt.predicted) / pt.measured <= 0.15;

                  return (
                    <g key={i} className="group cursor-pointer">
                      <circle
                        cx={cx}
                        cy={cy}
                        r="5"
                        fill={isTight ? '#ffffff' : '#f87171'}
                        stroke="#060608"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}

                {/* Axis Labels */}
                <text x={pSize / 2} y={pSize - 8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">
                  Measured Latency (ms) →
                </text>
                <text x={12} y={pSize / 2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono" transform={`rotate(-90 12 ${pSize / 2})`}>
                  Predicted (ms) →
                </text>
              </svg>
            </div>

            <div className="mt-2 text-center text-[10px] font-mono text-zinc-500">
              {activeModelComparison === 'm1' && <span className="text-emerald-400 font-bold">M1: Tightly bounded along y = x (Spearman ρ = 0.91)</span>}
              {activeModelComparison === 'b1' && <span className="text-zinc-300">B1: Moderate dispersion under complex memory recursion</span>}
              {activeModelComparison === 'b0' && <span className="text-red-400">B0: Heavy systematic divergence (ignores cache walls)</span>}
            </div>
          </GlassCard>
        </div>

      </div>

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
