import React, { useState, useMemo, useRef } from 'react';
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
  Info,
  Upload,
  Code2,
  FileCode,
  Check,
  Play,
  RotateCcw
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
  codePresets,
  analyzeSourceCode,
  predictAlgorithmPerformance 
} from '../../data/mlPredictorData';

export default function InferenceSandbox({ onOpenReportCard }) {
  // Input Mode: 'upload' (Custom Source Code) or 'catalog' (Pre-computed catalog)
  const [inputMode, setInputMode] = useState('upload');

  // Custom Code State
  const [sourceCode, setSourceCode] = useState(codePresets[0].code);
  const [codeFileName, setCodeFileName] = useState(codePresets[0].filename);
  const [activePresetId, setActivePresetId] = useState(codePresets[0].id);
  const [isInferencing, setIsInferencing] = useState(false);
  const fileInputRef = useRef(null);

  // Target Parameters
  const [selectedAlgoId, setSelectedAlgoId] = useState('ALG-001');
  const [selectedHardwareId, setSelectedHardwareId] = useState('esp32');
  const [selectedLanguageId, setSelectedLanguageId] = useState('c');
  const [selectedModelId, setSelectedModelId] = useState('m1');
  const [inputN, setInputN] = useState(10000);

  // Real-time AST code analysis for custom uploaded code
  const codeAnalysis = useMemo(() => {
    if (inputMode === 'upload') {
      return analyzeSourceCode(sourceCode, selectedLanguageId);
    }
    return null;
  }, [sourceCode, selectedLanguageId, inputMode]);

  // Compute live multi-target prediction
  const prediction = useMemo(() => {
    return predictAlgorithmPerformance({
      algoId: selectedAlgoId,
      hardwareId: selectedHardwareId,
      languageId: selectedLanguageId,
      n: inputN,
      modelId: selectedModelId,
      customCodeMeta: inputMode === 'upload' ? codeAnalysis : null
    });
  }, [selectedAlgoId, selectedHardwareId, selectedLanguageId, inputN, selectedModelId, inputMode, codeAnalysis]);

  const selectedAlgo = algorithmCurves[selectedAlgoId] || algorithmCurves['ALG-001'];
  const selectedHardware = hardwareTargets.find(h => h.id === selectedHardwareId) || hardwareTargets[1];
  const selectedLanguage = languageRuntimes.find(l => l.id === selectedLanguageId) || languageRuntimes[0];
  const selectedModel = mlModelSpecs.find(m => m.id === selectedModelId) || mlModelSpecs[2];

  // Options for custom selects
  const algoOptions = Object.entries(algorithmCurves).map(([id, a]) => ({
    value: id,
    label: a.name,
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

  // Handle file upload from user's disk
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCodeFileName(file.name);
    setActivePresetId('custom');

    // Auto-detect language runtime from extension
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (ext === '.c' || ext === '.h') setSelectedLanguageId('c');
    else if (ext === '.rs') setSelectedLanguageId('rust');
    else if (ext === '.py') setSelectedLanguageId('cpython');

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setSourceCode(content);
        triggerInferenceScan();
      }
    };
    reader.readAsText(file);
  };

  // Load a preset code template
  const handleLoadPreset = (preset) => {
    setActivePresetId(preset.id);
    setCodeFileName(preset.filename);
    setSelectedLanguageId(preset.language);
    setSourceCode(preset.code);
    triggerInferenceScan();
  };

  const triggerInferenceScan = () => {
    setIsInferencing(true);
    setTimeout(() => setIsInferencing(false), 450);
  };

  // Human-readable unit scaling for extreme algorithms (e.g. O(N^3) at N=10,000)
  const formatLatency = (ms) => {
    if (ms < 1) return `${(ms * 1000).toFixed(0)} μs`;
    if (ms < 1000) return `${ms.toFixed(2)} ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)} s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(1)} min`;
    return `${(ms / 3600000).toFixed(1)} hrs`;
  };

  const formatEnergy = (mJ) => {
    if (mJ < 1000) return `${mJ.toFixed(2)} mJ`;
    if (mJ < 1000000) return `${(mJ / 1000).toFixed(2)} J`;
    return `${(mJ / 1000000).toFixed(2)} kJ`;
  };

  const formatCarbon = (ug) => {
    if (ug < 1000) return `${ug.toFixed(2)} μg`;
    if (ug < 1000000) return `${(ug / 1000).toFixed(2)} mg`;
    return `${(ug / 1000000).toFixed(2)} g`;
  };

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
            Upload custom algorithm source code or dial workload parameters to predict cross-hardware execution metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mode Switcher: Custom Code vs Benchmark Catalog */}
          <div className="flex items-center rounded-xl p-0.5 bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
            <button
              onClick={() => setInputMode('upload')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                inputMode === 'upload'
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Upload Code</span>
            </button>
            <button
              onClick={() => setInputMode('catalog')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                inputMode === 'catalog'
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Catalog Presets</span>
            </button>
          </div>

          <button
            onClick={() => onOpenReportCard({
              algo: inputMode === 'upload' 
                ? { name: codeFileName, theoretical: codeAnalysis?.inferredComplexity || 'O(N log N)' }
                : selectedAlgo,
              hardware: selectedHardware,
              language: selectedLanguage,
              n: inputN,
              model: selectedModel,
              prediction,
              sourceCode: inputMode === 'upload' ? sourceCode : null,
              codeAnalysis
            })}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-white/10"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Performance Card</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Input Deck (6 cols) | Right Results Deck (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Code Upload & Parameter Configuration (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 1. SOURCE CODE UPLOADER & EDITOR */}
          {inputMode === 'upload' ? (
            <GlassCard data-tour="sandbox-workload-controls" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-white" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Algorithm Source Code
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.08]">
                    {codeFileName}
                  </span>
                </div>

                {/* Upload Button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".c,.cpp,.h,.hpp,.rs,.py,.java,.js,.ts"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] hover:border-white/[0.25] text-zinc-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload File</span>
                  </button>
                </div>
              </div>

              {/* Sample Code Presets Bar */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {codePresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleLoadPreset(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono transition-all cursor-pointer ${
                        activePresetId === preset.id
                          ? 'bg-white text-black font-bold shadow-sm'
                          : 'bg-white/[0.035] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.07] hover:text-white'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setActivePresetId('blank');
                      setCodeFileName('custom_algo.c');
                      setSourceCode('// Paste or write your custom algorithm code here\n');
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10.5px] font-mono text-zinc-500 hover:text-zinc-300 border border-dashed border-white/[0.1] hover:border-white/[0.2] transition-colors"
                  >
                    + Blank
                  </button>
                </div>
              </div>

              {/* Interactive Code Editor Box */}
              <div className="relative rounded-xl overflow-hidden border border-white/[0.1] bg-[#08080c]">
                {/* Code header bar */}
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-white/[0.03] border-b border-white/[0.06] text-[10px] font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{codeFileName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{codeAnalysis?.linesOfCode || 0} LOC</span>
                    <span className="text-zinc-600">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(sourceCode);
                      }}
                      title="Copy code"
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Editor Textarea */}
                <textarea
                  value={sourceCode}
                  onChange={(e) => {
                    setSourceCode(e.target.value);
                    setActivePresetId('custom');
                  }}
                  rows={10}
                  spellCheck={false}
                  placeholder="// Paste your algorithm code here (C, Rust, Python, C++)..."
                  className="w-full p-3.5 bg-transparent text-xs font-mono text-zinc-200 resize-y focus:outline-none focus:ring-0 leading-relaxed selection:bg-white/20"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>

              {/* Live AST Neural Analysis Card */}
              {codeAnalysis && (
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span className="font-mono text-white font-bold text-[11px] uppercase tracking-wider">
                        Extracted AST Features
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Confidence: {(codeAnalysis.confidenceScore * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px] font-mono">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06]">
                      <span className="text-zinc-500 block text-[9px] uppercase">Complexity</span>
                      <span className="text-white font-bold text-xs">{codeAnalysis.inferredComplexity}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06]">
                      <span className="text-zinc-500 block text-[9px] uppercase">Loop Depth</span>
                      <span className="text-white font-bold text-xs">{codeAnalysis.maxLoopDepth} Levels</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06]">
                      <span className="text-zinc-500 block text-[9px] uppercase">Branches</span>
                      <span className="text-white font-bold text-xs">{codeAnalysis.cyclomaticBranches} Paths</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06]">
                      <span className="text-zinc-500 block text-[9px] uppercase">UniXcoder</span>
                      <span className="text-white font-bold text-xs">768-d Vector</span>
                    </div>
                  </div>

                  <div className="text-[10.5px] font-mono text-zinc-400 flex items-center justify-between pt-1">
                    <span>Memory Allocation Strategy:</span>
                    <span className="text-zinc-200 font-medium">{codeAnalysis.memoryModel}</span>
                  </div>
                </div>
              )}
            </GlassCard>
          ) : (
            /* 2. CATALOG PRESET SELECTOR */
            <GlassCard data-tour="sandbox-workload-controls">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-white" />
                  Algorithm Catalog Preset
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

              <CustomSelect
                label="Algorithm Under Test"
                value={selectedAlgoId}
                onChange={setSelectedAlgoId}
                options={algoOptions}
              />
            </GlassCard>
          )}

          {/* 3. TARGET PLATFORM & WORKLOAD CONTROLS */}
          <GlassCard className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold block pb-2 border-b border-white/[0.08]">
              Execution Environment & Scale
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Custom Hardware Target Dropdown */}
              <CustomSelect
                label="Physical Hardware Target"
                value={selectedHardwareId}
                onChange={setSelectedHardwareId}
                options={hardwareOptions}
              />

              {/* Custom Language Runtime Dropdown */}
              <CustomSelect
                label="Language Runtime"
                value={selectedLanguageId}
                onChange={setSelectedLanguageId}
                options={languageOptions}
              />
            </div>

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
            <div data-tour="sandbox-log-slider" className="pt-3 border-t border-white/[0.06]">
              <LogSlider
                value={inputN}
                onChange={setInputN}
                label="Workload Input Size (N)"
              />
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Multi-Target Telemetry Forecast Cards (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
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
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {prediction.fitsOnTarget 
                      ? `Workload fits within ${selectedHardware.name} SRAM limit with ${(100 - prediction.memoryUtilizationPct).toFixed(1)}% headroom remaining.`
                      : `Critical: Exceeds physical SRAM ceiling of ${selectedHardware.name} (${selectedHardware.ramDisplay}). Code will crash with MemoryError.`
                    }
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">
                {selectedHardware.executionMode.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Execution Latency Forecast */}
            <GlassCard>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-white" />
                  <span className="uppercase text-[11px]">Execution Latency</span>
                </div>
                <span className="text-[10px]">±{prediction.uncertaintyPct}% conf</span>
              </div>

              <div className="mt-1">
                <div className="text-3xl font-black text-white font-mono tracking-tight">
                  {formatLatency(prediction.rawLatencyMs)}
                </div>
                <div className="mt-2 text-[10px] font-mono text-zinc-500 flex justify-between">
                  <span>95% CI Range</span>
                  <span className="text-zinc-300">
                    [{formatLatency(prediction.lowerBoundMs)} – {formatLatency(prediction.upperBoundMs)}]
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* 2. Peak RAM Footprint & MemoryTape */}
            <GlassCard>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <div className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-white" />
                  <span className="uppercase text-[11px]">Peak RAM Footprint</span>
                </div>
                <span className="text-[10px]">Cap: {selectedHardware.ramDisplay}</span>
              </div>

              <div className="mt-1 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-black text-white font-mono tracking-tight">
                    {prediction.totalMemoryDisplay}
                  </div>
                  <span className={`text-xs font-mono font-bold ${
                    prediction.memoryUtilizationPct > 100 ? 'text-red-400' : 'text-zinc-400'
                  }`}>
                    ({prediction.memoryUtilizationPct}%)
                  </span>
                </div>

                {/* Tactile MemoryTape */}
                <MemoryTape
                  utilizationPct={prediction.memoryUtilizationPct}
                  allocatedDisplay={prediction.totalMemoryDisplay}
                  totalDisplay={selectedHardware.ramDisplay}
                  showDetails={false}
                />
              </div>
            </GlassCard>

            {/* 3. Energy Consumption */}
            <GlassCard>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                  <span className="uppercase text-[11px]">Energy Per Run</span>
                </div>
                <span className="text-[10px]">{selectedHardware.nominalPowerWatts}W TDP</span>
              </div>

              <div className="mt-1">
                <div className="text-3xl font-black text-white font-mono tracking-tight">
                  {formatEnergy(prediction.energyMilliJoules)}
                </div>
                <div className="mt-2 text-[10px] font-mono text-zinc-500 flex justify-between">
                  <span>Energy-Delay Product</span>
                  <span className="text-zinc-300">
                    {((prediction.energyMilliJoules * prediction.rawLatencyMs) / 1000).toFixed(2)} mJ·s
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* 4. Carbon Footprint & Fit */}
            <GlassCard>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <div className="flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-white" />
                  <span className="uppercase text-[11px]">Carbon & Fit</span>
                </div>
                <span className="text-[10px]">R² = {prediction.r2Score}</span>
              </div>

              <div className="mt-1">
                <div className="text-3xl font-black text-white font-mono tracking-tight">
                  {formatCarbon(prediction.carbonMicroGrams)}
                </div>
                <div className="mt-2 text-[10px] font-mono text-zinc-500 flex justify-between">
                  <span>Grid Intensity Factor</span>
                  <span className="text-zinc-300">450 g/kWh</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Model Architecture Metadata & Ground-Truth Attribution */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Inference Engine: {selectedModel.name} ({selectedModel.inferenceLatency})</span>
              </div>
              <span className="text-zinc-500">Trained on Site 1 Ground Truth</span>
            </div>

            <div className="text-[11px] text-zinc-400 leading-relaxed font-sans pt-1 border-t border-white/[0.05]">
              {selectedModel.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
