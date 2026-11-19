import React, { useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Zap, 
  HardDrive, 
  TrendingUp, 
  Cpu, 
  Brain,
  ShieldCheck,
  CheckCircle2,
  Code2
} from 'lucide-react';

export default function PredictionCardModal({ isOpen, onClose, data }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const { algo, hardware, language, n, model, prediction, sourceCode, codeAnalysis } = data;

  const structuredJson = JSON.stringify({
    schema_version: '1.0.0',
    generated_at: new Date().toISOString(),
    tool: 'PerfOracle Site 2 ML Predictor',
    target: {
      hardware_id: hardware.id,
      hardware_name: hardware.name,
      arch: hardware.arch,
      clock_mhz: hardware.clockMhz,
      ram_bytes: hardware.ramBytes,
      nominal_power_watts: hardware.nominalPowerWatts
    },
    workload: {
      algorithm: algo.name,
      theoretical_complexity: algo.theoretical,
      language: language.name,
      input_size_n: n,
      has_custom_source: !!sourceCode,
      ast_analysis: codeAnalysis ? {
        lines_of_code: codeAnalysis.linesOfCode,
        max_loop_depth: codeAnalysis.maxLoopDepth,
        cyclomatic_branches: codeAnalysis.cyclomaticBranches,
        inferred_complexity: codeAnalysis.inferredComplexity,
        confidence_score: codeAnalysis.confidenceScore,
        memory_model: codeAnalysis.memoryModel
      } : null
    },
    predictions: {
      model_id: model.id,
      model_name: model.name,
      predicted_latency_ms: prediction.rawLatencyMs,
      confidence_interval_95_ms: [prediction.lowerBoundMs, prediction.upperBoundMs],
      uncertainty_pct: prediction.uncertaintyPct,
      peak_memory_bytes: prediction.totalMemoryBytes,
      memory_utilization_pct: prediction.memoryUtilizationPct,
      fits_on_target: prediction.fitsOnTarget,
      energy_milli_joules: prediction.energyMilliJoules,
      carbon_micrograms: prediction.carbonMicroGrams,
      predicted_rubric_tier: prediction.predictedTier
    }
  }, null, 2);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(structuredJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="PerfOracle Performance Card & Report"
      subtitle="Structured prediction record exportable for research publications and embedded verification"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Printable Visual Card Container */}
        <div className="p-6 rounded-2xl border border-white/20 bg-gradient-to-b from-[#121216] to-[#09090b] text-white space-y-5 shadow-2xl">
          
          {/* Card Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <img 
                src="/perforacle_icon_square.png" 
                alt="PerfOracle" 
                className="w-8 h-8 object-contain logo-glow" 
              />
              <div>
                <h3 className="text-base font-bold font-display tracking-tight text-white flex items-center gap-2">
                  <span>{algo.name}</span>
                  {sourceCode && (
                    <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-zinc-300">
                      User Uploaded
                    </span>
                  )}
                </h3>
                <span className="text-[11px] font-mono text-zinc-400">
                  Target: {hardware.name} ({hardware.arch}) · {language.name}
                </span>
              </div>
            </div>
            <Badge variant={prediction.fitsOnTarget ? 'tier-s' : 'tier-d'}>
              {prediction.predictedTier}
            </Badge>
          </div>

          {/* AST Extracted Tags if custom code */}
          {codeAnalysis && (
            <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.06]">
              <span className="text-zinc-500">AST Analysis:</span>
              <span className="text-white font-bold">{codeAnalysis.inferredComplexity}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300">{codeAnalysis.maxLoopDepth} Loop Nesting</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300">{codeAnalysis.linesOfCode} LOC</span>
              <span className="text-zinc-600">·</span>
              <span className="text-emerald-400 font-semibold">{(codeAnalysis.confidenceScore * 100).toFixed(0)}% Confidence</span>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-zinc-500 text-[10px] block uppercase">Runtime</span>
              <span className="text-lg font-bold text-white block mt-0.5">{formatLatency(prediction.rawLatencyMs)}</span>
              <span className="text-[9px] text-zinc-500">±{prediction.uncertaintyPct}% conf</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-zinc-500 text-[10px] block uppercase">Peak RAM</span>
              <span className="text-lg font-bold text-white block mt-0.5">{prediction.totalMemoryDisplay}</span>
              <span className="text-[9px] text-zinc-500">{prediction.memoryUtilizationPct}% cap</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-zinc-500 text-[10px] block uppercase">Energy</span>
              <span className="text-lg font-bold text-white block mt-0.5">{formatEnergy(prediction.energyMilliJoules)}</span>
              <span className="text-[9px] text-zinc-500">{prediction.powerWatts}W TDP</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-zinc-500 text-[10px] block uppercase">Feasibility</span>
              <span className={`text-base font-bold block mt-0.5 ${prediction.fitsOnTarget ? 'text-emerald-400' : 'text-red-400'}`}>
                {prediction.fitsOnTarget ? 'PASSED' : 'OOM FAIL'}
              </span>
              <span className="text-[9px] text-zinc-500">N = {n.toLocaleString()}</span>
            </div>
          </div>

          {/* Model Provenance Footer */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>Model: {model.name}</span>
            <span>Ground Truth: Site 1 Telemetry Matrix</span>
            <span>R² Fit: {prediction.r2Score}</span>
          </div>
        </div>

        {/* Structured JSON Output Tab */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>RFC Structured JSON Record:</span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-zinc-300 font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed">
            {structuredJson}
          </pre>
        </div>

        {/* Modal actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </Modal>
  );
}
