import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Cpu, 
  Layers, 
  Sliders, 
  Database, 
  Sparkles,
  BarChart3,
  Award
} from 'lucide-react';

export const SITE1_TOUR_STEPS = [
  {
    id: 'overview-telemetry',
    tab: 'overview',
    target: '[data-tour="site1-hero-stats"]',
    icon: Sparkles,
    badge: 'Telemetry Core',
    title: 'Empirical Telemetry Hub',
    body: 'PerfOracle captures real-world algorithm telemetry across calibrated rubrics. Track real-time metric aggregates, active computational paradigms, and pipeline throughput.',
    actionLabel: 'Inspect Algorithm Registry'
  },
  {
    id: 'algo-registry',
    tab: 'algorithms',
    target: '[data-tour="site1-algo-registry"]',
    icon: Cpu,
    badge: 'Asymptotics',
    title: 'Asymptotic Algorithm Registry',
    body: 'Explore computational algorithms cataloged with theoretical Big-O boundaries, memory invariants (in-place vs. auxiliary), and implementation pseudocode. Register custom algorithms directly into the system.',
    actionLabel: 'View Tier Allocations'
  },
  {
    id: 'tier-matrix',
    tab: 'tiers',
    target: '[data-tour="site1-tier-matrix"]',
    icon: Layers,
    badge: 'Classification',
    title: 'Tier Allocation Matrix (Tier S → D)',
    body: 'Stratify algorithms into discrete performance bands based on strict latency and memory ceilings. Use the Level 3 CustomSelect popovers to reassign tiers or tune mathematical boundary thresholds.',
    actionLabel: 'Open Rubric Console'
  },
  {
    id: 'rubric-tester',
    tab: 'rubrics',
    target: '[data-tour="site1-rubric-tester"]',
    icon: Sliders,
    badge: 'Live Runner',
    title: 'Rubric Benchmarking Console',
    body: 'Simulate multi-parameter execution workloads across varying input sizes (N=1,000 to 1,000,000). Weight criteria dynamically to calculate normalized 0–100 composite scores.',
    actionLabel: 'Explore Dataset Studio'
  },
  {
    id: 'dataset-studio',
    tab: 'dataset',
    target: '[data-tour="site1-dataset-studio"]',
    icon: Database,
    badge: 'ML Dataset',
    title: 'RFC 4180 CSV Dataset Studio',
    body: 'Compile, filter, and export clean RFC 4180 CSV telemetry records. This ground-truth dataset serves as the direct training input for Site 2 Machine Learning predictive inference.',
    actionLabel: 'Finish Walkthrough'
  }
];

export default function TutorialTour({ 
  isOpen, 
  onClose, 
  activeTab = 'overview', 
  onNavigateTab 
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const coachmarkRef = useRef(null);

  const step = SITE1_TOUR_STEPS[currentStepIndex];
  const StepIcon = step?.icon || Sparkles;

  // Navigate to step's tab if not already on it
  useEffect(() => {
    if (!isOpen || !step) return;
    if (activeTab !== step.tab && onNavigateTab) {
      onNavigateTab(step.tab);
    }
  }, [isOpen, currentStepIndex, step, activeTab, onNavigateTab]);

  // Locate target element, auto-scroll smoothly to center it, and track position
  useEffect(() => {
    if (!isOpen || !step) return;

    let isMounted = true;
    let animationFrameId;
    let pollCount = 0;

    const locateAndScroll = () => {
      const el = document.querySelector(step.target);
      if (!el) {
        if (pollCount < 25 && isMounted) {
          pollCount++;
          setTimeout(locateAndScroll, 60);
        }
        return;
      }

      // Smoothly scroll the highlighted section into center/start of viewport
      const isTall = el.offsetHeight > window.innerHeight * 0.75;
      el.scrollIntoView({
        behavior: 'smooth',
        block: isTall ? 'start' : 'center',
        inline: 'nearest'
      });

      // Track bounding rect smoothly during scroll animation (850ms duration)
      const startTime = performance.now();
      const trackPosition = () => {
        if (!isMounted) return;
        const currentEl = document.querySelector(step.target);
        if (currentEl) {
          const rect = currentEl.getBoundingClientRect();
          setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            bottom: rect.bottom,
            right: rect.right
          });
        }
        if (performance.now() - startTime < 850) {
          animationFrameId = requestAnimationFrame(trackPosition);
        }
      };
      animationFrameId = requestAnimationFrame(trackPosition);
    };

    // Delay slightly to give React time to mount tab components
    const timer = setTimeout(locateAndScroll, 90);

    const handleViewportChange = () => {
      const currentEl = document.querySelector(step.target);
      if (currentEl) {
        const rect = currentEl.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right
        });
      }
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, { passive: true, capture: true });

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
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
    if (currentStepIndex < SITE1_TOUR_STEPS.length - 1) {
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

  // Compute smart, viewport-safe coachmark positioning
  const getCoachmarkStyle = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const coachmarkWidth = Math.min(440, viewportWidth - 32);
    const coachmarkHeight = coachmarkRef.current?.offsetHeight || 310;
    const headerOffset = 65; // Height of sticky top header

    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed',
        width: `${coachmarkWidth}px`,
        zIndex: 70
      };
    }

    let top;
    let left = targetRect.left + (targetRect.width / 2) - (coachmarkWidth / 2);
    left = Math.max(16, Math.min(left, viewportWidth - coachmarkWidth - 16));

    const spaceBelow = viewportHeight - targetRect.bottom;
    const spaceAbove = targetRect.top - headerOffset;

    if (spaceBelow >= coachmarkHeight + 16) {
      // Preferred: Position below target
      top = targetRect.bottom + 16;
    } else if (spaceAbove >= coachmarkHeight + 16) {
      // Preferred: Position above target
      top = targetRect.top - coachmarkHeight - 16;
    } else if (viewportWidth >= 1200 && viewportWidth - targetRect.right >= coachmarkWidth + 24) {
      // Desktop: Side placement to the right
      left = targetRect.right + 20;
      top = Math.max(headerOffset + 16, Math.min(targetRect.top, viewportHeight - coachmarkHeight - 20));
    } else if (viewportWidth >= 1200 && targetRect.left >= coachmarkWidth + 24) {
      // Desktop: Side placement to the left
      left = targetRect.left - coachmarkWidth - 20;
      top = Math.max(headerOffset + 16, Math.min(targetRect.top, viewportHeight - coachmarkHeight - 20));
    } else {
      // Fallback: Dock safely above viewport bottom
      top = Math.max(headerOffset + 12, viewportHeight - coachmarkHeight - 20);
      left = Math.max(16, Math.min(viewportWidth - coachmarkWidth - 20, left));
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      position: 'fixed',
      width: `${coachmarkWidth}px`,
      zIndex: 70
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto">
      {/* SVG Spotlight Mask Cutout Overlay */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-50">
        <defs>
          <mask id="site1-tour-spotlight-mask">
            {/* White background: dark overlay applies everywhere */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutout: transparent hole revealing the target element */}
            {targetRect && (
              <rect
                x={Math.max(0, targetRect.left - 10)}
                y={Math.max(0, targetRect.top - 10)}
                width={targetRect.width + 20}
                height={targetRect.height + 20}
                rx="16"
                ry="16"
                fill="black"
              />
            )}
          </mask>
        </defs>
        
        {/* Deep dark backdrop frosted overlay with cutout mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(3, 4, 7, 0.86)"
          mask="url(#site1-tour-spotlight-mask)"
        />

        {/* Luminous Specular Spotlight Ring around active element */}
        {targetRect && (
          <rect
            x={Math.max(0, targetRect.left - 10)}
            y={Math.max(0, targetRect.top - 10)}
            width={targetRect.width + 20}
            height={targetRect.height + 20}
            rx="16"
            ry="16"
            fill="none"
            stroke="rgba(255, 255, 255, 0.55)"
            strokeWidth="2"
            className="tour-pulse-ring"
          />
        )}
      </svg>

      {/* Backdrop click dismisses */}
      <div 
        className="fixed inset-0 z-50 pointer-events-auto"
        onClick={onClose}
      />

      {/* Floating High-Contrast Coachmark Card (100% Solid Obsidian - Zero Bleed) */}
      <div 
        ref={coachmarkRef}
        style={getCoachmarkStyle()}
        onClick={(e) => e.stopPropagation()}
        className="fixed z-[70] bg-[#0c0d14] border-2 border-white/20 rounded-2xl p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.98)] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Specular Edge Highlight */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

        {/* Header: Step counter & Dismiss */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.12] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <StepIcon className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono tracking-widest uppercase text-zinc-300 font-bold">
              Step {currentStepIndex + 1} of {SITE1_TOUR_STEPS.length}
            </span>
            <span className="text-[11px] font-mono text-white bg-white/10 px-2 py-0.5 rounded-md border border-white/20 font-medium">
              {step.badge}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
            aria-label="Skip walkthrough"
            title="Skip tour (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Body */}
        <div className="space-y-2 mb-6">
          <h3 className="text-lg font-bold font-display text-white tracking-tight leading-snug">
            {step.title}
          </h3>
          <p className="text-sm text-zinc-200 leading-relaxed font-sans">
            {step.body}
          </p>
        </div>

        {/* Progress Dots + Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          {/* Mini progress dots */}
          <div className="flex items-center gap-2">
            {SITE1_TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex 
                    ? 'w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]' 
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-zinc-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold font-mono tracking-wider uppercase bg-white text-black hover:bg-zinc-100 transition-all flex items-center gap-2 cursor-pointer shadow-xl shadow-white/20"
            >
              <span>{currentStepIndex === SITE1_TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}</span>
              {currentStepIndex === SITE1_TOUR_STEPS.length - 1 ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>Use keyboard arrows</span>
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-zinc-300 text-[10px]">←</kbd>
            <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-zinc-300 text-[10px]">→</kbd>
            <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-zinc-300 text-[10px]">Esc</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
