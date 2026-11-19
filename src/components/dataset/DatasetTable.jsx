import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  FileText, 
  Search, 
  Trash2, 
  RefreshCw, 
  CheckSquare, 
  Square,
  ArrowUpDown,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Badge from '../common/Badge';
import CustomSelect from '../common/CustomSelect';
import { generateCsvDataset } from '../../data/dummyData';

export default function DatasetTable({ 
  benchmarks, 
  onDeleteBenchmark, 
  onResetBenchmarks,
  onOpenRawCsv,
  onOpenPhase2 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const availableColumns = [
    { key: "id", label: "benchmark_id" },
    { key: "algoId", label: "algorithm_id" },
    { key: "name", label: "algorithm_name" },
    { key: "category", label: "category" },
    { key: "timeComplexity", label: "time_complexity" },
    { key: "spaceComplexity", label: "space_complexity" },
    { key: "inputSize", label: "input_size_n" },
    { key: "testCaseType", label: "workload_distribution" },
    { key: "latencyMs", label: "latency_ms" },
    { key: "peakMemoryMb", label: "peak_memory_mb" },
    { key: "cpuUtilizationPct", label: "cpu_usage_pct" },
    { key: "scalabilityScore", label: "scalability_index" },
    { key: "stabilityIndex", label: "stability_pct" },
    { key: "rubricScore", label: "rubric_composite_score" },
    { key: "assignedTier", label: "assigned_tier" },
    { key: "timestamp", label: "benchmark_timestamp" }
  ];

  const [selectedColumns, setSelectedColumns] = useState(availableColumns.map(c => c.key));
  const [showColumnConfig, setShowColumnConfig] = useState(false);

  const toggleColumn = (key) => {
    if (selectedColumns.includes(key)) {
      if (selectedColumns.length > 2) {
        setSelectedColumns(selectedColumns.filter(k => k !== key));
      }
    } else {
      setSelectedColumns([...selectedColumns, key]);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = benchmarks.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.algoId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = selectedTier === 'All' || item.assignedTier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDownloadCsv = () => {
    const csvContent = generateCsvDataset(benchmarks, selectedColumns);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `perforacle_ml_dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviewCsv = () => {
    const csvContent = generateCsvDataset(benchmarks, selectedColumns);
    onOpenRawCsv(csvContent);
  };

  return (
    <div data-tour="site1-dataset-studio" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            Dataset & CSV Studio
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Empirical observation repository and RFC 4180 feature export pipeline for Phase 2 ML model training
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Inspect Raw CSV */}
          <button
            onClick={handlePreviewCsv}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-zinc-400" />
            <span>Preview Raw CSV</span>
          </button>

          {/* Download CSV File */}
          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4 text-black" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Config Bar */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search benchmarks by algorithm name, ID, or domain..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tier Filter */}
            <div className="w-44">
              <CustomSelect
                value={selectedTier}
                onChange={(val) => { setSelectedTier(val); setCurrentPage(1); }}
                options={[
                  { value: "All", label: "All Tiers", badge: `${benchmarks.length}` },
                  { value: "Tier S", label: "Tier S", badge: "Elite" },
                  { value: "Tier A", label: "Tier A", badge: "High" },
                  { value: "Tier B", label: "Tier B", badge: "Standard" },
                  { value: "Tier C", label: "Tier C", badge: "Heavy" },
                  { value: "Tier D", label: "Tier D", badge: "Bottleneck" }
                ]}
              />
            </div>

            {/* Column Selector Toggle */}
            <button
              onClick={() => setShowColumnConfig(!showColumnConfig)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                showColumnConfig ? 'bg-white text-black font-bold border-white' : 'bg-white/5 text-zinc-300 border-white/10 hover:border-white/20'
              }`}
            >
              Columns ({selectedColumns.length}/{availableColumns.length})
            </button>

            {/* Reset Defaults */}
            <button
              onClick={onResetBenchmarks}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors"
              title="Reset to default benchmark dataset"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Feature Column Selection Area */}
        {showColumnConfig && (
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Select Features to Include in CSV Dataset</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedColumns(availableColumns.map(c => c.key))}
                  className="text-zinc-400 hover:text-white text-[11px] font-mono underline"
                >
                  Select All
                </button>
                <span className="text-zinc-600">•</span>
                <button
                  onClick={() => setSelectedColumns(['id', 'algoId', 'latencyMs', 'peakMemoryMb', 'rubricScore', 'assignedTier'])}
                  className="text-zinc-400 hover:text-white text-[11px] font-mono underline"
                >
                  Essential ML Core
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {availableColumns.map((col) => {
                const isSelected = selectedColumns.includes(col.key);
                return (
                  <button
                    key={col.key}
                    onClick={() => toggleColumn(col.key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                      isSelected
                        ? 'bg-white/15 text-white border-white/40 font-bold shadow-sm'
                        : 'bg-black/50 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-white" /> : <Square className="w-3.5 h-3.5 text-zinc-600" />}
                    <span>{col.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Main Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 font-mono text-[11px] text-zinc-400">
              <tr>
                <th 
                  onClick={() => handleSort('id')} 
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('name')} 
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Algorithm</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('inputSize')} 
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Input (N)</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('latencyMs')} 
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Latency</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('peakMemoryMb')} 
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>RAM</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('cpuUtilizationPct')} 
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>CPU</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('rubricScore')} 
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Rubric Score</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('assignedTier')} 
                  className="py-3 px-4 font-medium cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Tier</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="py-3 px-4 font-medium text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 font-bold text-zinc-300 whitespace-nowrap">{row.id}</td>
                    <td className="py-3 px-4 font-sans whitespace-nowrap">
                      <div className="font-semibold text-white">{row.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        {row.category} • {row.timeComplexity}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 whitespace-nowrap">{row.inputSize.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white font-medium whitespace-nowrap">{row.latencyMs} ms</td>
                    <td className="py-3 px-4 text-zinc-300 whitespace-nowrap">{row.peakMemoryMb} MB</td>
                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">{row.cpuUtilizationPct}%</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-white/10 font-bold text-white border border-white/10">
                        {row.rubricScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans whitespace-nowrap">
                      <Badge variant={row.assignedTier.toLowerCase().replace(' ', '-')}>
                        {row.assignedTier}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-sans whitespace-nowrap">
                      <button
                        onClick={() => onDeleteBenchmark(row.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-zinc-500 font-sans">
                    No benchmark observations matching the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Status Footer */}
        <div className="py-3.5 px-4 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-400">
          <div>
            Showing <span className="text-white font-bold">{sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to <span className="text-white font-bold">{Math.min(currentPage * pageSize, sortedData.length)}</span> of <span className="text-white font-bold">{sortedData.length}</span> records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white font-bold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Dataset Pipeline Info Card */}
      <GlassCard className="border-white/10 bg-gradient-to-r from-white/[0.04] to-transparent p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">
                RFC 4180 Dataset Ready for Phase 2 ML Training
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Each observation row captures empirical hardware cycles alongside asymptotic Big-O bounds.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPhase2}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-semibold flex items-center gap-2 transition-all hover:scale-105 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span>Open Phase 2 ML Blueprint</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
