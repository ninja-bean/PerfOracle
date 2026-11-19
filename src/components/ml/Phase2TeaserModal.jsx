import React, { useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { Sparkles, Brain, Cpu, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Phase2TeaserModal({ isOpen, onClose, totalRecords, algorithms }) {
  const [testN, setTestN] = useState(250000);
  const [selectedAlgoName, setSelectedAlgoName] = useState(algorithms[0]?.name || 'Dual-Pivot Quicksort');

  // Simple heuristic prediction preview
  const estimatedLatency = (Math.log10(testN) * 4.2).toFixed(1);
  const estimatedRam = (12 + (testN / 100000) * 3.5).toFixed(1);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Phase 2 Architecture: ML Performance Predictor"
      subtitle="How the Site 1 CSV dataset powers the upcoming predictive machine learning engine"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 rounded-xl border border-white/15 bg-white/[0.03] flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white text-black font-bold">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Continuous Learning Handoff</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Site 1 generates the empirical ground-truth dataset ({totalRecords} observations compiled so far). In Phase 2, Site 2 will train supervised regressors to predict how untested algorithms or extreme workloads will perform before code execution.
            </p>
          </div>
        </div>

        {/* Feature Pipeline Diagram */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
            ML Training Pipeline Specification:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl border border-white/10 bg-black/40">
              <span className="text-zinc-500 text-[10px] block uppercase">1. Feature Inputs</span>
              <p className="text-white font-semibold mt-1">Algorithm Features</p>
              <ul className="text-[11px] text-zinc-400 mt-2 space-y-1">
                <li>• Big-O Time & Space</li>
                <li>• Input Size (N)</li>
                <li>• Distribution Type</li>
                <li>• Memory In-Place Flag</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl border border-white/10 bg-black/40">
              <span className="text-zinc-500 text-[10px] block uppercase">2. Trained Estimators</span>
              <p className="text-white font-semibold mt-1">Supervised Regressors</p>
              <ul className="text-[11px] text-zinc-400 mt-2 space-y-1">
                <li>• Gradient Boosted Trees</li>
                <li>• Random Forest Regressor</li>
                <li>• Multi-Layer Perceptron (MLP)</li>
                <li>• Polynomial Feature Ridge</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl border border-white/10 bg-black/40">
              <span className="text-zinc-500 text-[10px] block uppercase">3. Predicted Outputs</span>
              <p className="text-white font-semibold mt-1">Runtime Forecasts</p>
              <ul className="text-[11px] text-zinc-400 mt-2 space-y-1">
                <li>• Predicted Latency (ms)</li>
                <li>• Peak RAM Footprint (MB)</li>
                <li>• Forecasted Rubric Tier (S-D)</li>
                <li>• Confidence Bounds (&plusmn;12%)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Prediction Sandbox Preview */}
        <div className="p-4 rounded-xl border border-white/20 bg-gradient-to-b from-white/[0.04] to-black/80 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Interactive Model Inference Sandbox (Preview)</span>
            </h5>
            <Badge variant="tier-s" size="xs">Phase 2 Mock</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Target Algorithm</label>
              <select
                value={selectedAlgoName}
                onChange={(e) => setSelectedAlgoName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg glass-input text-xs bg-[#111111]"
              >
                {algorithms.map(a => (
                  <option key={a.id} value={a.name} className="bg-[#111111] text-white">
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Arbitrary Input Size (N): {testN.toLocaleString()}</label>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="50000"
                value={testN}
                onChange={(e) => setTestN(Number(e.target.value))}
                className="w-full accent-white cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Model Inference Outputs */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 font-mono text-center">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-400 block">Predicted Latency</span>
              <span className="text-sm font-bold text-white">{estimatedLatency} ms</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-400 block">Predicted Memory</span>
              <span className="text-sm font-bold text-white">{estimatedRam} MB</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-400 block">Predicted Tier</span>
              <span className="text-sm font-bold text-white">Tier S</span>
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono">
            Ready to implement after Site 1 review
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </Modal>
  );
}
