import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Activity, 
  Play, 
  Save, 
  RotateCcw, 
  Cpu, 
  HardDrive, 
  Gauge, 
  CheckCircle2, 
  Settings2,
  Sparkles,
  Zap,
  Radio
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Badge from '../common/Badge';
import CustomSelect from '../common/CustomSelect';
import { calculateRubricScore, getTierFromScore } from '../../data/dummyData';

export default function RubricTester({ 
  algorithms, 
  tiers, 
  criteria, 
  selectedAlgorithmId, 
  onAddBenchmark,
  onOpenDataset
}) {
  const [algoId, setAlgoId] = useState(selectedAlgorithmId || algorithms[0]?.id || 'ALG-001');
  const selectedAlgo = algorithms.find(a => a.id === algoId) || algorithms[0];

  const [inputSize, setInputSize] = useState(100000);
  const [workloadType, setWorkloadType] = useState('Uniform Random Vector (Standard Case)');

  const [metrics, setMetrics] = useState({
    latencyMs: 12.5,
    peakMemoryMb: 24.0,
    cpuUtilizationPct: 45,
    scalabilityScore: 9.0,
    stabilityIndex: 98.0
  });

  const [weights, setWeights] = useState({
    latency: 35,
    memory: 25,
    cpu: 15,
    scalability: 15,
    stability: 10
  });

  const [showWeightConfig, setShowWeightConfig] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (selectedAlgorithmId) {
      setAlgoId(selectedAlgorithmId);
    }
  }, [selectedAlgorithmId]);

  const currentScore = calculateRubricScore(metrics, weights);
  const currentTier = getTierFromScore(currentScore);

  // SVG Gauge calculations
  const circumference = 2 * Math.PI * 48; // radius 48
  const strokeDashoffset = circumference - (currentScore / 100) * (circumference * 0.75);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setToastMessage('');

    setTimeout(() => {
      let baseLatency = 10;
      let baseMemory = 20;

      if (selectedAlgo.timeComplexity.includes('n^3') || selectedAlgo.timeComplexity.includes('2^n')) {
        baseLatency = Math.min(750, 420 + Math.random() * 220);
        baseMemory = Math.min(450, 210 + Math.random() * 140);
      } else if (selectedAlgo.timeComplexity.includes('V * E') || selectedAlgo.timeComplexity.includes('n^2')) {
        baseLatency = Math.min(350, 130 + Math.random() * 90);
        baseMemory = Math.min(180, 80 + Math.random() * 45);
      } else if (selectedAlgo.timeComplexity.includes('n log n')) {
        const factor = Math.log10(inputSize) * 2;
        baseLatency = Math.round((4.2 + factor * 2.1 + Math.random() * 2.8) * 10) / 10;
        baseMemory = selectedAlgo.inPlace ? 12 + Math.random() * 5 : 28 + Math.random() * 14;
      } else {
        baseLatency = Math.round((1.8 + Math.random() * 2.5) * 10) / 10;
        baseMemory = 8 + Math.random() * 4;
      }

      setMetrics({
        latencyMs: Math.round(baseLatency * 10) / 10,
        peakMemoryMb: Math.round(baseMemory * 10) / 10,
        cpuUtilizationPct: Math.floor(35 + Math.random() * 45),
        scalabilityScore: Math.round((Math.max(3, 10 - (baseLatency / 60)) + Math.random() * 0.5) * 10) / 10,
        stabilityIndex: Math.round((95 + Math.random() * 4.9) * 10) / 10
      });

      setIsSimulating(false);
      setToastMessage('Empirical Telemetry Captured & Calibrated!');
      setTimeout(() => setToastMessage(''), 3000);
    }, 1400);
  };

  const handleCommit = () => {
    const newBenchmark = {
      id: `BM-${Math.floor(100 + Math.random() * 900)}`,
      algoId: selectedAlgo.id,
      name: selectedAlgo.name,
      category: selectedAlgo.category,
      timeComplexity: selectedAlgo.timeComplexity,
      spaceComplexity: selectedAlgo.spaceComplexity,
      inputSize: Number(inputSize),
      testCaseType: workloadType,
      latencyMs: Number(metrics.latencyMs),
      peakMemoryMb: Number(metrics.peakMemoryMb),
      cpuUtilizationPct: Number(metrics.cpuUtilizationPct),
      scalabilityScore: Number(metrics.scalabilityScore),
      stabilityIndex: Number(metrics.stabilityIndex),
      rubricScore: currentScore,
      assignedTier: currentTier,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    onAddBenchmark(newBenchmark);
    setToastMessage(`Committed ${newBenchmark.id} to Dataset under ${currentTier}!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleResetWeights = () => {
    setWeights({
      latency: 35,
      memory: 25,
      cpu: 15,
      scalability: 15,
      stability: 10
    });
  };

  return (
    <div data-tour="site1-rubric-tester" className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
            Performance Rubric Benchmarks
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Empirical multi-criteria evaluation engine with live composite scoring and hardware telemetry simulation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWeightConfig(!showWeightConfig)}
            className={`px-4 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 ${
              showWeightConfig ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            <span>Rubric Weights</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-white/[0.08] border border-white/20 text-xs text-white font-mono flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Weight Customization Drawer */}
      {showWeightConfig && (
        <GlassCard className="border-white/25 bg-black/70 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white font-display">Customizable Criteria Weight Matrix</h4>
              <p className="text-xs text-zinc-400">Total weight sum: {Object.values(weights).reduce((a, b) => a + b, 0)}%</p>
            </div>
            <button
              onClick={handleResetWeights}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standards</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {criteria.map((c) => (
              <div key={c.id} className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">{c.name}</span>
                  <span className="text-white font-bold">{weights[c.id]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={weights[c.id]}
                  onChange={(e) => setWeights({ ...weights, [c.id]: Number(e.target.value) })}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Two-Column Testing Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Target Workload & Fluid Sliders */}
        <div className="lg:col-span-2 space-y-8">
          {/* Workload Vector Card */}
          <GlassCard className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 font-display">
                <Cpu className="w-4 h-4 text-zinc-400" />
                <span>Workload Vector Target</span>
              </h3>
              <Badge variant="mono" size="xs">Execution Vector</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <CustomSelect
                  label="Target Algorithm"
                  value={algoId}
                  onChange={(val) => setAlgoId(val)}
                  options={algorithms.map((a) => ({
                    value: a.id,
                    label: a.name,
                    badge: a.timeComplexity,
                    meta: a.category
                  }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Input Workload Size (N)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1000, 25000, 100000, 1000000].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setInputSize(size)}
                      className={`py-2.5 rounded-xl text-xs font-mono transition-all ${
                        inputSize === size
                          ? 'bg-white text-black font-extrabold shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {size >= 1000000 ? '1M' : size >= 1000 ? `${size / 1000}k` : size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <CustomSelect
                label="Workload Distribution Profile"
                value={workloadType}
                onChange={(val) => setWorkloadType(val)}
                options={[
                  { value: "Uniform Random Vector (Standard Case)", label: "Uniform Random Vector (Standard Case)", badge: "O(n)", meta: "Standard" },
                  { value: "Partially Ordered 90%", label: "Partially Ordered 90% (Adaptive Advantage)", badge: "Adaptive", meta: "Best-Case" },
                  { value: "Worst Case Adversarial Inversion", label: "Worst-Case Adversarial Inversion", badge: "Adversarial", meta: "Worst-Case" },
                  { value: "Sparse Graph Adjacency Vector (E = 3V)", label: "Sparse Graph Adjacency Vector (E = 3V)", badge: "Sparse", meta: "Graph" },
                  { value: "Dense Complete Matrix Adjacency", label: "Dense Complete Matrix Adjacency", badge: "Dense", meta: "Matrix" },
                  { value: "Duplicate Heavy Low Key Cardinality", label: "Duplicate Heavy Low Key Cardinality", badge: "Duplicates", meta: "Entropy" }
                ]}
              />
            </div>
          </GlassCard>

          {/* Interactive Metric Sliders with Tactile Feedback */}
          <GlassCard className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 font-display">
                  <Sliders className="w-4 h-4 text-zinc-400" />
                  <span>Telemetry Rubric Controls</span>
                </h3>
                <p className="text-xs text-zinc-400">Dynamic slider inputs calibrated to mathematical rubric criteria</p>
              </div>

              {/* Lively Simulate Telemetry Button */}
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-4 py-2 rounded-2xl bg-white text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>{isSimulating ? 'Sampling Core...' : 'Simulate Telemetry'}</span>
              </button>
            </div>

            {/* Simulation Active Banner */}
            {isSimulating && (
              <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/20 flex items-center justify-between text-xs font-mono text-zinc-300 animate-pulse">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-white animate-spin" />
                  <span>Sampling CPU execution cycles & cache misses...</span>
                </div>
                <span className="text-[10px] text-zinc-500">60 FPS Hardware Probe</span>
              </div>
            )}

            {/* Slider 1: Latency */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-200 font-medium">1. Execution Latency (Wall-clock)</span>
                <span className="font-bold text-white font-mono bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                  {metrics.latencyMs} ms
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="500"
                step="0.1"
                value={metrics.latencyMs}
                onChange={(e) => setMetrics({ ...metrics, latencyMs: Number(e.target.value) })}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>0.1 ms (Optimal)</span>
                <span>250 ms</span>
                <span>500 ms (Critical)</span>
              </div>
            </div>

            {/* Slider 2: Peak RAM */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-200 font-medium">2. Peak Memory (RSS Overhead)</span>
                <span className="font-bold text-white font-mono bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                  {metrics.peakMemoryMb} MB
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="400"
                step="0.5"
                value={metrics.peakMemoryMb}
                onChange={(e) => setMetrics({ ...metrics, peakMemoryMb: Number(e.target.value) })}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>1 MB (Minimal)</span>
                <span>200 MB</span>
                <span>400 MB (High RAM)</span>
              </div>
            </div>

            {/* Slider 3: CPU Core Load */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-200 font-medium">3. CPU Core Utilization Factor</span>
                <span className="font-bold text-white font-mono bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                  {metrics.cpuUtilizationPct}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={metrics.cpuUtilizationPct}
                onChange={(e) => setMetrics({ ...metrics, cpuUtilizationPct: Number(e.target.value) })}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>5% (Idle)</span>
                <span>50%</span>
                <span>100% (Saturated)</span>
              </div>
            </div>

            {/* Slider 4: Scalability Index */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-200 font-medium">4. Scalability Gradient Index</span>
                <span className="font-bold text-white font-mono bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                  {metrics.scalabilityScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={metrics.scalabilityScore}
                onChange={(e) => setMetrics({ ...metrics, scalabilityScore: Number(e.target.value) })}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>1.0 (Degrading)</span>
                <span>5.0</span>
                <span>10.0 (Asymptotic Flawless)</span>
              </div>
            </div>

            {/* Slider 5: Stability */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-200 font-medium">5. Multi-run Convergence Stability</span>
                <span className="font-bold text-white font-mono bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                  {metrics.stabilityIndex}%
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="0.1"
                value={metrics.stabilityIndex}
                onChange={(e) => setMetrics({ ...metrics, stabilityIndex: Number(e.target.value) })}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>40% (High Variance)</span>
                <span>70%</span>
                <span>100% (Deterministic)</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Col: Creative Circular SVG Telemetry Gauge & Score */}
        <div className="space-y-8">
          <GlassCard className="border-white/20 bg-gradient-to-b from-white/[0.06] to-black/80 p-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                  Composite Rubric Gauge
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
              </div>

              {/* Creative Circular SVG Telemetry Gauge (Human-designed element) */}
              <div className="relative flex flex-col items-center justify-center py-6 border-y border-white/10 my-3">
                <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 120 120">
                  {/* Gauge background track */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    strokeWidth="8"
                    fill="transparent"
                    className="gauge-track"
                  />
                  {/* Gauge active score arc */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="gauge-fill transition-all duration-500 ease-out"
                  />
                </svg>

                {/* Score text in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black font-display tracking-tight text-white">
                    {currentScore}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                    Score / 100
                  </span>
                </div>

                <div className="mt-4">
                  <Badge variant={currentTier.toLowerCase().replace(' ', '-')} size="md">
                    Assigned: {currentTier}
                  </Badge>
                </div>
              </div>

              {/* Telemetry Digest Summary */}
              <div className="space-y-3 py-4 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Target:</span>
                  <span className="text-white font-semibold truncate max-w-[160px]">{selectedAlgo.name}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Theoretical Big-O:</span>
                  <span className="text-zinc-200">{selectedAlgo.timeComplexity}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Workload (N):</span>
                  <span className="text-white font-bold">{inputSize.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Measured Latency:</span>
                  <span className="text-white font-bold">{metrics.latencyMs} ms</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Peak RSS:</span>
                  <span className="text-white font-bold">{metrics.peakMemoryMb} MB</span>
                </div>
              </div>
            </div>

            {/* Commit Button */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <button
                onClick={handleCommit}
                className="w-full py-3.5 rounded-2xl bg-white text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
              >
                <Save className="w-4 h-4 text-black" />
                <span>Commit to Dataset (CSV)</span>
              </button>
              
              <button
                onClick={onOpenDataset}
                className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Inspect Dataset Studio
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
