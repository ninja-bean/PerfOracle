import React, { useState } from 'react';
import { Layers, ShieldCheck, Cpu, Sliders, ArrowUpDown, Info, Check } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Badge from '../common/Badge';
import CustomSelect from '../common/CustomSelect';

export default function TierMatrix({ 
  tiers, 
  algorithms, 
  benchmarks, 
  onReassignTier, 
  onUpdateTierThreshold 
}) {
  const [editingTier, setEditingTier] = useState(null);
  const [thresholds, setThresholds] = useState({});

  const handleEditClick = (tier) => {
    setEditingTier(tier.id);
    setThresholds({
      minScore: tier.minScore,
      maxLatency: tier.maxLatency,
      maxMemory: tier.maxMemory
    });
  };

  const handleSaveThresholds = (tierId) => {
    onUpdateTierThreshold(tierId, thresholds);
    setEditingTier(null);
  };

  return (
    <div data-tour="site1-tier-matrix" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Tier Allocation Matrix</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Empirical rubric classification criteria used to stratify algorithms into discrete performance bands
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>Multi-Tier Calibrated</span>
        </div>
      </div>

      {/* Tiers List */}
      <div className="space-y-4">
        {tiers.map((tier) => {
          // Find algorithms assigned to this tier
          const assignedAlgos = algorithms.filter(a => a.defaultTier === tier.name);
          const tierBenchmarks = benchmarks.filter(b => b.assignedTier === tier.name);
          const isEditing = editingTier === tier.id;

          return (
            <GlassCard key={tier.id} className="border-white/10 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-extrabold text-lg text-white font-mono shadow-sm">
                    {tier.name.split(' ')[1]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white tracking-tight">{tier.name}</h3>
                      <Badge variant={tier.name.toLowerCase().replace(' ', '-')}>
                        {assignedAlgos.length} Algorithms
                      </Badge>
                      <Badge variant="mono" size="xs">
                        {tierBenchmarks.length} Benchmarks
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{tier.tagline}</p>
                  </div>
                </div>

                {/* Rubric Thresholds */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  {isEditing ? (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/60 border border-white/20">
                      <div>
                        <span className="text-[9px] text-zinc-500 block">Min Score</span>
                        <input
                          type="number"
                          value={thresholds.minScore}
                          onChange={(e) => setThresholds({ ...thresholds, minScore: Number(e.target.value) })}
                          className="w-14 px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 block">Max Latency</span>
                        <input
                          type="number"
                          value={thresholds.maxLatency}
                          onChange={(e) => setThresholds({ ...thresholds, maxLatency: Number(e.target.value) })}
                          className="w-16 px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 block">Max RAM</span>
                        <input
                          type="number"
                          value={thresholds.maxMemory}
                          onChange={(e) => setThresholds({ ...thresholds, maxMemory: Number(e.target.value) })}
                          className="w-16 px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white text-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleSaveThresholds(tier.id)}
                        className="px-2.5 py-1 rounded-lg bg-white text-black font-bold text-[11px] hover:bg-zinc-200 ml-1"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-zinc-500 text-[10px] block">Score Boundary</span>
                        <span className="text-white font-bold">&ge; {tier.minScore} / 100</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-zinc-500 text-[10px] block">Latency Upper</span>
                        <span className="text-zinc-300 font-semibold">&le; {tier.maxLatency} ms</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-zinc-500 text-[10px] block">Peak RAM Upper</span>
                        <span className="text-zinc-300 font-semibold">&le; {tier.maxMemory} MB</span>
                      </div>
                      <button
                        onClick={() => handleEditClick(tier)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors text-[11px]"
                      >
                        Edit Rule
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 py-3 leading-relaxed">
                {tier.description}
              </p>

              {/* Assigned Algorithm Chips */}
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">
                  Assigned Algorithms:
                </span>
                {assignedAlgos.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {assignedAlgos.map((algo) => (
                      <div
                        key={algo.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono group hover:border-white/30 transition-colors"
                      >
                        <span className="font-semibold text-white">{algo.name}</span>
                        <span className="text-zinc-500 text-[10px]">[{algo.timeComplexity}]</span>
                        <div className="w-28">
                          <CustomSelect
                            value={algo.defaultTier}
                            onChange={(newTier) => onReassignTier(algo.id, newTier)}
                            options={tiers.map((t) => ({
                              value: t.name,
                              label: t.name,
                              badge: t.name.split(' ')[1]
                            }))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-600 italic">No algorithms currently assigned to this tier.</p>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
