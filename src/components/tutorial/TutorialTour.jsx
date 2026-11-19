import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Cpu, 
  Layers, 
  Sliders, 
  Database, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import Badge from '../common/Badge';

export default function TutorialTour({ isOpen, onClose, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const steps = [
    {
      title: "Welcome to PerfOracle",
      subtitle: "Two-Site Algorithmic Evaluation & Machine Learning Platform",
      badge: "Project Architecture",
      icon: Sparkles,
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            PerfOracle is designed to solve a central problem in computer science: <strong className="text-white">Empirically evaluating and predicting algorithmic performance</strong>.
          </p>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5 font-mono text-[11px]">
            <div className="text-white font-bold flex items-center gap-1.5">
              <span>● Site 1 (Current Platform)</span>
            </div>
            <p className="text-zinc-400">
              Registers algorithms, classifies them into performance tiers under defined rubrics, records testing telemetry, and compiles a normalized CSV dataset.
            </p>
            <div className="text-zinc-400 font-bold flex items-center gap-1.5 pt-1">
              <span>○ Site 2 (Phase 2 ML Model)</span>
            </div>
            <p className="text-zinc-400">
              Consumes the Site 1 dataset to train predictive machine learning regressors forecasting performance for any arbitrary input size.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Left Sidebar Navigation",
      subtitle: "Seamless control across all core benchmark modules",
      badge: "Navigation",
      icon: Cpu,
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            The new left sidebar gives you instant access to all core platform modules without clunky tabs:
          </p>
          <ul className="space-y-2 text-zinc-400">
            <li className="flex items-start gap-2">
              <strong className="text-white font-mono min-w-[130px]">1. Overview:</strong>
              <span>High-level platform health, domain breakdown, and recent runs.</span>
            </li>
            <li className="flex items-start gap-2">
              <strong className="text-white font-mono min-w-[130px]">2. Algo Registry:</strong>
              <span>Asymptotic catalog of algorithms with Big-O notations and code.</span>
            </li>
            <li className="flex items-start gap-2">
              <strong className="text-white font-mono min-w-[130px]">3. Tier Matrix:</strong>
              <span>Empirical classification into Tier S through Tier D bands.</span>
            </li>
            <li className="flex items-start gap-2">
              <strong className="text-white font-mono min-w-[130px]">4. Rubric Benchmarks:</strong>
              <span>Live testing console with interactive metric sliders and simulations.</span>
            </li>
            <li className="flex items-start gap-2">
              <strong className="text-white font-mono min-w-[130px]">5. Dataset Studio:</strong>
              <span>RFC 4180 CSV builder and feature exporter for Phase 2 ML.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Algorithm Registry & Big-O",
      subtitle: "Cataloging asymptotic bounds & runtime characteristics",
      badge: "Algorithm Specs",
      icon: Cpu,
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            Every algorithm is documented with theoretical time and space complexities:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-3 rounded-xl bg-black/40 border border-white/10">
            <div>
              <span className="text-zinc-500 block uppercase text-[9px]">Time Complexity</span>
              <span className="text-white font-bold">O(n log n), O(V+E), O(n^2)</span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase text-[9px]">Memory Model</span>
              <span className="text-white font-bold">In-Place vs Auxiliary</span>
            </div>
          </div>
          <p className="text-zinc-400">
            You can search algorithms, switch between Grid and Table views, inspect reference pseudocode, or click <strong className="text-white">"Register Algorithm"</strong> to add your own custom algorithm.
          </p>
        </div>
      )
    },
    {
      title: "Rubric Benchmarking & Telemetry",
      subtitle: "Live composite scoring & hardware simulation",
      badge: "Empirical Rubric",
      icon: Sliders,
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            The Rubric Benchmarking module calculates a live <strong className="text-white">0–100 composite score</strong>:
          </p>
          <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-[11px]">
            <div className="flex justify-between text-zinc-400">
              <span>• Execution Latency:</span>
              <span className="text-white">Weight 35%</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>• Peak RAM (RSS):</span>
              <span className="text-white">Weight 25%</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>• CPU Utilization & Stability:</span>
              <span className="text-white">Weight 40%</span>
            </div>
          </div>
          <p className="text-zinc-400">
            Click <strong className="text-white">"Simulate Telemetry"</strong> to sample hardware metrics based on the algorithm's actual Big-O curve, then hit <strong className="text-white">"Commit to Dataset"</strong> to save the run!
          </p>
        </div>
      )
    },
    {
      title: "Dataset Studio & Phase 2 ML Handoff",
      subtitle: "Exporting clean training observations",
      badge: "Dataset Pipeline",
      icon: Database,
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            All committed benchmark runs accumulate in the <strong className="text-white">Dataset Studio</strong>:
          </p>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-2 text-[11px]">
            <div className="flex items-center gap-2 text-white font-bold">
              <CheckCircle className="w-4 h-4 text-white" />
              <span>Full User Control over Features</span>
            </div>
            <p className="text-zinc-400">
              Select or deselect feature columns (e.g. latency, input size, tier) before exporting.
            </p>
            <div className="flex items-center gap-2 text-white font-bold pt-1">
              <CheckCircle className="w-4 h-4 text-white" />
              <span>One-Click CSV Download</span>
            </div>
            <p className="text-zinc-400">
              Generates an RFC 4180 standard CSV file ready to directly feed into Phase 2 for training regression and classification ML models!
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleFinish = () => {
    if (dontShowAgain) {
      localStorage.setItem('perforacle_tutorial_dismissed', 'true');
    }
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('perforacle_tutorial_dismissed', 'true');
    onClose();
  };

  if (!isOpen) return null;

  const current = steps[currentStep];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Frosted Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity modal-backdrop" 
        onClick={handleFinish}
      />

      {/* Tutorial Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-[#0e0e11]/95 p-6 text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-10 animate-in zoom-in-95 duration-200 modal-dialog-container">
        {/* Top bar with glowing logo and Skip */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img 
              src="/perforacle_icon_square.png" 
              alt="Logo" 
              className="w-7 h-7 object-contain logo-glow" 
            />
            <span className="font-bold text-xs uppercase tracking-wider text-zinc-300 font-mono">
              Guided Interactive Tour
            </span>
          </div>

          {/* Prominent Skip Button */}
          <button
            onClick={handleSkip}
            className="px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
          >
            <span>Skip Tour</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Header */}
        <div className="mt-4 mb-3">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <Badge variant="mono" size="xs">{current.badge}</Badge>
            <span className="text-[11px] font-mono text-zinc-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <StepIcon className="w-5 h-5 text-white" />
            <span>{current.title}</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">{current.subtitle}</p>
        </div>

        {/* Step Body */}
        <div className="min-h-[160px] py-2">
          {current.content}
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 py-3">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStep ? 'w-6 bg-white' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          {/* Checkbox: Don't show again */}
          <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-white/20 bg-black text-white focus:ring-0 w-3.5 h-3.5"
            />
            <span>Don't show on start</span>
          </label>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-1.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-4 py-1.5 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <span>Get Started</span>
                <CheckCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
