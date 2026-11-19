import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Cpu, 
  Code2, 
  Sliders, 
  Grid, 
  List, 
  CheckCircle, 
  XCircle
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Badge from '../common/Badge';

export default function AlgorithmList({ 
  algorithms, 
  onSelectForBenchmark, 
  onOpenAddModal, 
  onViewDetails 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['All', ...new Set(algorithms.map(a => a.category))];

  const filteredAlgorithms = algorithms.filter(algo => {
    const matchesSearch = 
      algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.timeComplexity.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || algo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            Algorithm Registry
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Empirical catalog of computational procedures classified with theoretical asymptotic boundaries
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-black shadow-sm font-bold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-black shadow-sm font-bold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Algorithm Button */}
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Register Algorithm</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by algorithm name, identifier (ALG-001), or complexity O(n)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          {/* Result Counter */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-mono text-zinc-400 px-1 shrink-0">
            <span>Showing</span>
            <span className="font-bold text-white px-2 py-0.5 rounded-md bg-white/10 border border-white/10">
              {filteredAlgorithms.length}
            </span>
            <span>of {algorithms.length}</span>
          </div>
        </div>

        {/* Category Pills with smooth horizontal scrolling */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-[0_0_10px_rgba(255,255,255,0.25)]'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAlgorithms.map((algo) => (
            <GlassCard
              key={algo.id}
              className="flex flex-col justify-between group border-white/10 hover:border-white/25 transition-all hover:scale-[1.01]"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1 whitespace-nowrap">
                      {algo.id}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-zinc-200 transition-colors font-display">
                      {algo.name}
                    </h3>
                  </div>
                  <Badge variant={algo.defaultTier.toLowerCase().replace(' ', '-')}>
                    {algo.defaultTier}
                  </Badge>
                </div>

                <Badge variant="ghost" size="xs" className="mb-3">
                  {algo.category}
                </Badge>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                  {algo.description}
                </p>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-xl bg-black/40 border border-white/5 mb-4">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Time (Big-O)</span>
                    <span className="font-bold text-white text-xs">{algo.timeComplexity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Space Model</span>
                    <span className="font-bold text-white text-xs">{algo.spaceComplexity}</span>
                  </div>
                </div>

                {/* In-Place and Stability Badges */}
                <div className="flex items-center gap-2 mb-4 text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    {algo.inPlace ? (
                      <CheckCircle className="w-3.5 h-3.5 text-zinc-300" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-zinc-600" />
                    )}
                    <span>{algo.inPlace ? 'In-Place' : 'Auxiliary'}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {algo.stable ? (
                      <CheckCircle className="w-3.5 h-3.5 text-zinc-300" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-zinc-600" />
                    )}
                    <span>{algo.stable ? 'Stable' : 'Unstable'}</span>
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewDetails(algo)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Inspect Spec</span>
                </button>
                <button
                  onClick={() => onSelectForBenchmark(algo)}
                  className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Benchmark</span>
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        /* Table View */
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 font-mono text-[11px] text-zinc-400">
                <tr>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">Identifier</th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">Algorithm Name</th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">Category</th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">Time Complexity</th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">Space Complexity</th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">Memory Model</th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">Default Tier</th>
                  <th className="py-3 px-4 font-medium text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredAlgorithms.map((algo) => (
                  <tr key={algo.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 font-bold text-zinc-300 whitespace-nowrap">{algo.id}</td>
                    <td className="py-3 px-4 font-sans font-semibold text-white whitespace-nowrap">{algo.name}</td>
                    <td className="py-3 px-4 font-sans text-zinc-400 whitespace-nowrap">{algo.category}</td>
                    <td className="py-3 px-4 text-white font-bold whitespace-nowrap">{algo.timeComplexity}</td>
                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">{algo.spaceComplexity}</td>
                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                      {algo.inPlace ? 'In-Place' : 'Auxiliary'} • {algo.stable ? 'Stable' : 'Unstable'}
                    </td>
                    <td className="py-3 px-4 font-sans whitespace-nowrap">
                      <Badge variant={algo.defaultTier.toLowerCase().replace(' ', '-')}>
                        {algo.defaultTier}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-sans whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewDetails(algo)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                          title="Inspect Code"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectForBenchmark(algo)}
                          className="px-2.5 py-1 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-all shadow-sm"
                        >
                          Benchmark
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
