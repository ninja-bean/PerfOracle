import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Brain, 
  Sliders, 
  TrendingUp, 
  HardDrive, 
  Award,
  Sparkles,
  Zap
} from 'lucide-react';

export const SITE2_TOUR_STEPS = [
  {
    id: 'overview-metrics',
    tab: 'overview',
    target: '[data-tour="site2-hero-metrics"]',
    icon: Brain,
    badge: 'Neural Engine',
    title: 'Predictive Intelligence Core',
    body: 'PerfOracle transforms empirical hardware telemetry from Site 1 into deep predictive models. The primary M1 Multi-Task Neural Regressor achieves 89.4% accuracy within 2× of measured runtimes with a 0.91 Spearman rank correlation across unseen code.',
    actionLabel: 'Enter Inference Sandbox'
  },
  {
    id: 'sandbox-controls',
    tab: 'sandbox',
    target: '[data-tour="sandbox-workload-controls"]',
    icon: Sliders,
    badge: 'Workload Simulation',
    title: 'Multi-Target Parameter Tuning',
    body: 'Dial algorithm specifications, hardware targets, and language runtime factors using custom glassmorphic dropdowns. Compare compiled native C (GCC 13.2 -O3) against bytecoded MicroPython v1.23 without ever touching a physical board.',
    actionLabel: 'Inspect Scale Slider'
  },
  {
    id: 'sandbox-slider',
    tab: 'sandbox',
    target: '[data-tour="sandbox-log-slider"]',
    icon: Zap,
    badge: 'Logarithmic Transfer',
    title: 'Logarithmic Input Scale (10² → 10⁶)',
    body: 'Linear sliders compress microcontroller input sizes into an unclickable 2% margin. This logarithmic transfer slider provides micro-precision from tiny pilot inputs (N=100) up to extreme million-element sweeps (N=1,000,000), synchronized with direct numeric input.',
    actionLabel: 'View Hardware Walls'
  },
  {
    id: 'hardware-guardrails',
    tab: 'hardware',
    target: '[data-tour="hardware-guardrails-grid"]',
    icon: HardDrive,
    badge: 'Hardware Constraints',
    title: 'SRAM Memory Walls & OOM Guardrails',
    body: '"Does it fit?" strictly precedes "How fast is it?". The visual MemoryTape calculates active payload vs physical SRAM ceilings. Notice how ESP8266 (80KB limit) triggers a hard red OOM breach at N=25,000 while ESP32 and Pi Zero remain safe.',
    actionLabel: 'Check Model Leaderboard'
  },
  {
    id: 'model-parity',
    tab: 'models',
    target: '[data-tour="model-parity-plot"]',
    icon: Award,
    badge: 'Calibration Validation',
    title: '45° Parity Scatter Calibration (y = x)',
    body: 'Empirically validate model calibration against ground truth measurements. Ideal predictions cluster tightly along the 45-degree dashed diagonal. Toggle between B0 Heuristic, B1 Classical ML, and M1 Deep Regressor across four held-out validation splits.',
    actionLabel: 'Finish Walkthrough'
  }
];

export default function Site2Tour({ 
  isOpen, 
  onClose, 
  activeTab, 
  onNavigateTab 
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const coachmarkRef = useRef(null);

  const step = SITE2_TOUR_STEPS[currentStepIndex];
  const StepIcon = step?.icon || Sparkles;

  // Navigate to step's tab if not already on it
  useEffect(() => {
    if (!isOpen || !step) return;
    if (activeTab !== step.tab) {
      onNavigateTab(step.tab);
    }
  }, [isOpen, currentStepIndex, step, activeTab, onNavigateTab]);

  // Compute target element bounding rect with retry
  useEffect(() => {
    if (!isOpen || !step) return;

    let timeoutId;
    const updateTargetRect = () => {
      const el = document.querySelector(step.target);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right
        });
      } else {
        // Fallback default center box if element not found yet
        setTargetRect(null);
      }
    };

    // Measure after DOM has settled
    timeoutId = setTimeout(updateTargetRect, 150);

    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [isOpen, currentStepIndex, step, activeTab]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < SITE2_TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Compute coachmark positioning
  const getCoachmarkStyle = () => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed'
      };
    }

    const margin = 16;
    const coachmarkWidth = 420;
    const coachmarkHeight = 280;

    // Prefer positioning below target if space allows, otherwise above
    let top = targetRect.bottom + margin;
    if (top + coachmarkHeight > window.innerHeight - 20) {
      top = Math.max(20, targetRect.top - coachmarkHeight - margin);
    }

    // Horizontal centering relative to target, clamped to viewport
    let left = targetRect.left + (targetRect.width / 2) - (coachmarkWidth / 2);
    left = Math.max(16, Math.min(left, window.innerWidth - coachmarkWidth - 16));

    return {
      top: `${top}px`,
      left: `${left}px`,
      position: 'fixed',
      width: `${coachmarkWidth}px`,
      zIndex: 60
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto">
      {/* SVG Spotlight Mask Cutout Overlay */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-50">
        <defs>
          <mask id="tour-spotlight-mask">
            {/* White background covers everything (opaque) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutout reveals the element underneath (transparent) */}
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="16"
                ry="16"
                fill="black"
              />
            )}
          </mask>
        </defs>
        
        {/* Semi-transparent dark frosted overlay using mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(4, 4, 6, 0.82)"
          mask="url(#tour-spotlight-mask)"
        />

        {/* Luminous Specular Spotlight Ring around active element */}
        {targetRect && (
          <rect
            x={targetRect.left - 8}
            y={targetRect.top - 8}
            width={targetRect.width + 16}
            height={targetRect.height + 16}
            rx="16"
            ry="16"
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="1.5"
            className="tour-pulse-ring"
          />
        )}
      </svg>

      {/* Backdrop click dismisses or progresses */}
      <div 
        className="fixed inset-0 z-50 pointer-events-auto"
        onClick={onClose}
      />

      {/* Floating Level 4 Glass Coachmark Card */}
      <div 
        ref={coachmarkRef}
        style={getCoachmarkStyle()}
        onClick={(e) => e.stopPropagation()}
        className="glass-surface-l4 rounded-3xl p-6 text-white shadow-2xl z-60 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Specular Edge Highlight */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Header: Step counter & Dismiss */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white">
              <StepIcon className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
              Step {currentStepIndex + 1} of {SITE2_TOUR_STEPS.length}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.08]">
              {step.badge}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Skip walkthrough"
            title="Skip tour (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Body */}
        <div className="space-y-2 mb-6">
          <h3 className="text-base font-bold font-display text-white tracking-tight">
            {step.title}
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {step.body}
          </p>
        </div>

        {/* Progress Dots + Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          {/* Mini progress dots */}
          <div className="flex items-center gap-1.5">
            {SITE2_TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex 
                    ? 'w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Prev</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wide uppercase bg-white text-black hover:bg-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-white/10"
            >
              <span>{currentStepIndex === SITE2_TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}</span>
              {currentStepIndex === SITE2_TOUR_STEPS.length - 1 ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Use keyboard arrows</span>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-zinc-400 text-[9px]">←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-zinc-400 text-[9px]">→</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-zinc-400 text-[9px]">Esc</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
