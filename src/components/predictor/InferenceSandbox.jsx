import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Cpu, 
  Zap, 
  HardDrive, 
  Layers, 
  Brain, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  Sparkles,
  RefreshCw,
  Copy,
  Info
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Badge from '../common/Badge';
import CustomSelect from '../common/CustomSelect';
import LogSlider from '../common/LogSlider';
import MemoryTape from '../common/MemoryTape';
import { 
  hardwareTargets, 
  languageRuntimes, 
  mlModelSpecs, 
  algorithmCurves,
  predictAlgorithmPerformance 
} from '../../data/mlPredictorData';

export default function InferenceSandbox({ onOpenReportCard }) {
  const [selectedAlgoId, setSelectedAlgoId] = useState('ALG-001');
  const [selectedHardwareId, setSelectedHardwareId] = useState('esp32');
  const [selectedLanguageId, setSelectedLanguageId] = useState('c');
  const [selectedModelId, setSelectedModelId] = useState('m1');
  const [inputN, setInputN] = useState(10000);

  // Compute live multi-target prediction
  const prediction = useMemo(() => {
    return predictAlgorithmPerformance({
      algoId: selectedAlgoId,
      hardwareId: selectedHardwareId,
      languageId: selectedLanguageId,
      n: inputN,
      modelId: selectedModelId
    });
  }, [selectedAlgoId, selectedHardwareId, selectedLanguageId, inputN, selectedModelId]);

  const selectedAlgo = algorithmCurves[selectedAlgoId] || algorithmCurves['ALG-001'];
  const selectedHardware = hardwareTargets.find(h => h.id === selectedHardwareId) || hardwareTargets[1];
  const selectedLanguage = languageRuntimes.find(l => l.id === selectedLanguageId) || languageRuntimes[0];
  const selectedModel = mlModelSpecs.find(m => m.id === selectedModelId) || mlModelSpecs[2];

  // Options for custom selects
  const algoOptions = Object.entries(algorithmCurves).map(([id, a]) => ({
    value: id,
    label: a.name,
    sub: a.theoretical,
    tag: a.theoretical
  }));

  const hardwareOptions = hardwareTargets.map(h => ({
    value: h.id,
    label: h.name,
    sub: `${h.clockMhz}MHz`,
    tag: h.ramDisplay,
    desc: `${h.arch} · ${h.nominalPowerWatts}W nominal`
  }));

  const languageOptions = languageRuntimes.map(l => ({
    value: l.id,
    label: l.name,
    sub: l.type,
    tag: `${l.factor}× factor`
  }));

  return (
    <div className="space-y-8 page-enter">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white font-display tracking-tight">
              Predictive Inference Sandbox
            </h2>
            <Badge variant="tier-s" size="xs">Live Neural Inference</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Simulate unseen workloads across physical hardware targets without flashing physical boards
          </p>
        </div>

        <button
          onClick={() => onOpenReportCard({
            algo: selectedAlgo,
            hardware: selectedHardware,
            language: selectedLanguage,
            n: inputN,
            model: selectedModel,
            prediction
          })}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-white/10"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Export Performance Card</span>
        </button>
      </div>

      {/* Main Grid: Left Control Panel (5 cols) | Right Results Deck (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Parameter Configuration Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-white" />
                Workload Parameters
              </span>
              <button 
                onClick={() => {
                  setSelectedAlgoId('ALG-001');
                  setSelectedHardwareId('esp32');
                  setSelectedLanguageId('c');
                  setSelectedModelId('m1');
                  setInputN(10000);
                }}
                className="text-[11px] font-mono text-zinc-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            </div>

            <div className="space-y-4">
              {/* Custom Algorithm Dropdown */}
              <CustomSelect
                label="Algorithm Under Test"
                value={selectedAlgoId}
                onChange={setSelectedAlgoId}
                options={algoOptions}
              />

              {/* Custom Hardware Target Dropdown */}
              <CustomSelect
                label="Physical Hardware Target"
                value={selectedHardwareId}
                onChange={setSelectedHardwareId}
                options={hardwareOptions}
              />

              {/* Custom Language Runtime Dropdown */}
              <CustomSelect
                label="Language Runtime & Optimization"
                value={selectedLanguageId}
                onChange={setSelectedLanguageId}
                options={languageOptions}
              />

              {/* Model Estimator Selector */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center justify-between">
                  <span>Inference Model Architecture</span>
                  <span className="text-[10px] font-mono text-zinc-400">Acc: {selectedModel.accuracyWithin2x}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {mlModelSpecs.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModelId(m.id)}
                      className={`py-2 px-2 rounded-xl text-center text-xs font-mono transition-all cursor-pointer ${
                        selectedModelId === m.id
                          ? 'bg-white text-black font-bold shadow-md'
                          : 'bg-white/[0.03] text-zinc-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      <div className="text-[11px]">{m.name.split(' ')[0]}</div>
                      <div className="text-[9px] opacity-75">{m.type.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logarithmic Slider for N */}
              <div className="pt-3 border-t border-white/[0.06]">
                <LogSlider
                  value={inputN}
                  onChange={setInputN}
                  label="Workload Input Size (N)"
                />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Multi-Target Telemetry Forecast Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Status Callout: Fits on Target? */}
          <div className={`p-4 rounded-2xl border transition-all ${
            prediction.fitsOnTarget 
              ? 'bg-white/[0.03] border-white/20' 
              : 'bg-red-500/[0.08] border-red-500/40 text-red-200'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  prediction.fitsOnTarget ? 'bg-white text-black' : 'bg-red-500 text-white font-bold'
                }`}>
                  {prediction.fitsOnTarget ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white font-display">
                      {prediction.fitsOnTarget ? 'Hardware Feasibility: PASSED' : 'Hardware Feasibility: OOM BREACH'}
                    </h3>
                    <Badge variant={prediction.fitsOnTarget ? 'tier-s' : 'tier-d'} size="xs">
                      {prediction.predictedTier}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    {prediction.fitsOnTarget 
                      ? `Workload fits comfortably within ${selectedHardware.name} SRAM limit with ${(100 - prediction.memoryUtilizationPct).toFixed(1)}% headroom remaining.`
                      : `Peak payload exceeds ${selectedHardware.name} total RAM (${selectedHardware.ramDisplay}). Microcontroller will trigger hard fault or panic.`}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider shrink-0 hidden sm:inline">
                {selectedHardware.executionMode}
              </span>
            </div>
          </div>

          {/* 4 Multi-Target Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Runtime / Latency */}
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-zinc-400" />
                  Execution Latency
                </span>
                <span className="text-[10px] font-mono text-zinc-500">±{prediction.uncertaintyPct}% conf</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-display">
                  {prediction.rawLatencyMs < 1000 
                    ? `${prediction.rawLatencyMs} ms` 
                    : `${(prediction.rawLatencyMs / 1000).toFixed(2)} s`}
                </span>
              </div>

              <div className="mt-2 text-[11px] font-mono text-zinc-500 flex items-center justify-between border-t border-white/[0.06] pt-2">
                <span>95% CI Range</span>
                <span className="text-zinc-300">[{prediction.lowerBoundMs}ms – {prediction.upperBoundMs}ms]</span>
              </div>
            </GlassCard>

            {/* 2. Peak RAM Footprint with Memory Tape */}
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
                  Peak RAM Footprint
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Cap: {selectedHardware.ramDisplay}</span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-black text-white font-display">
                  {prediction.totalMemoryDisplay}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  ({prediction.memoryUtilizationPct}%)
                </span>
              </div>

              {/* Memory Tape Bar */}
              <MemoryTape
                requiredBytes={prediction.totalMemoryBytes}
                ceilingBytes={selectedHardware.ramBytes}
                targetName={selectedHardware.name}
                showDetails={false}
              />
            </GlassCard>

            {/* 3. Energy & Power Consumption */}
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                  Energy per Run
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{prediction.powerWatts}W TDP</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-display">
                  {prediction.energyMilliJoules < 1000 
                    ? `${prediction.energyMilliJoules} mJ` 
                    : `${(prediction.energyMilliJoules / 1000).toFixed(2)} J`}
                </span>
              </div>

              <div className="mt-2 text-[11px] font-mono text-zinc-500 flex items-center justify-between border-t border-white/[0.06] pt-2">
                <span>Energy-Delay Product</span>
                <span className="text-zinc-300">{(prediction.energyMilliJoules * prediction.rawLatencyMs / 1000).toFixed(2)} mJ·s</span>
              </div>
            </GlassCard>

            {/* 4. Carbon & Fit */}
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-zinc-400" />
                  Carbon & Fit
                </span>
                <span className="text-[10px] font-mono text-zinc-500">R² = {prediction.r2Score}</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-display">
                  {prediction.carbonMicroGrams} <span className="text-xs font-normal text-zinc-500">µg CO₂e</span>
                </span>
              </div>

              <div className="mt-2 text-[11px] font-mono text-zinc-500 flex items-center justify-between border-t border-white/[0.06] pt-2">
                <span>Grid Intensity Factor</span>
                <span className="text-zinc-300">450 g/kWh</span>
              </div>
            </GlassCard>
          </div>

          {/* Model Inference Metadata Strip */}
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500 font-mono">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Inference Engine: {selectedModel.name} ({selectedModel.inferenceLatency})</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>Trained on Site 1 Ground Truth</span>
              <span>•</span>
              <span className="text-zinc-300">UniXcoder Transformer Heads</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
