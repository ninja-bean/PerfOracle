import React, { useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import CustomSelect from '../common/CustomSelect';

export default function AddAlgoModal({ isOpen, onClose, onAddAlgorithm, categories, nextId }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sorting & Search',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    inPlace: true,
    stable: false,
    defaultTier: 'Tier A',
    description: '',
    codeSnippet: 'def algorithm_solution(input_vector):\n    # TODO: Implement benchmark routine\n    pass'
  });

  const [activeStep, setActiveStep] = useState(1);
  const [error, setError] = useState('');

  const timeOptions = [
    'O(1)',
    'O(log n)',
    'O(n)',
    'O(n log n)',
    'O(n^2)',
    'O(n^3)',
    'O(2^n)',
    'O(n!)',
    'Custom'
  ];

  const spaceOptions = [
    'O(1)',
    'O(log n)',
    'O(n)',
    'O(n^2)',
    'Custom'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide an algorithm name.');
      setActiveStep(1);
      return;
    }

    const newAlgo = {
      ...formData,
      id: nextId
    };

    onAddAlgorithm(newAlgo);
    onClose();
    // Reset
    setFormData({
      name: '',
      category: 'Sorting & Search',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      inPlace: true,
      stable: false,
      defaultTier: 'Tier A',
      description: '',
      codeSnippet: 'def algorithm_solution(input_vector):\n    pass'
    });
    setActiveStep(1);
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Algorithm"
      subtitle={`Adding entry ${nextId} to the PerfOracle benchmark catalogue`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`font-mono flex items-center gap-1.5 transition-colors ${
              activeStep === 1 ? 'text-white font-bold' : 'text-zinc-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px]">1</span>
            <span>Metadata</span>
          </button>
          <span className="text-zinc-700">───</span>
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`font-mono flex items-center gap-1.5 transition-colors ${
              activeStep === 2 ? 'text-white font-bold' : 'text-zinc-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px]">2</span>
            <span>Complexity & Traits</span>
          </button>
          <span className="text-zinc-700">───</span>
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`font-mono flex items-center gap-1.5 transition-colors ${
              activeStep === 3 ? 'text-white font-bold' : 'text-zinc-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px]">3</span>
            <span>Pseudocode</span>
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Step 1: Metadata */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Algorithm Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Radix Sort MSD, Tarjan's Strongly Connected Components"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <CustomSelect
                label="Algorithmic Category"
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                options={categories.filter(c => c !== 'All').map((cat) => ({
                  value: cat,
                  label: cat
                }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Description & Invariants
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of algorithmic principles, pruning conditions, or theoretical trade-offs..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>
        )}

        {/* Step 2: Complexity & Traits */}
        {activeStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <CustomSelect
                  label="Time Complexity"
                  value={formData.timeComplexity}
                  onChange={(val) => setFormData({ ...formData, timeComplexity: val })}
                  options={timeOptions.map((opt) => ({
                    value: opt,
                    label: opt
                  }))}
                />
              </div>

              <div>
                <CustomSelect
                  label="Space Complexity"
                  value={formData.spaceComplexity}
                  onChange={(val) => setFormData({ ...formData, spaceComplexity: val })}
                  options={spaceOptions.map((opt) => ({
                    value: opt,
                    label: opt
                  }))}
                />
              </div>
            </div>

            {/* In-Place & Stability Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] transition-colors">
                <input
                  type="checkbox"
                  checked={formData.inPlace}
                  onChange={(e) => setFormData({ ...formData, inPlace: e.target.checked })}
                  className="rounded border-white/20 text-white focus:ring-0 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-medium text-white block">In-Place Execution</span>
                  <span className="text-[10px] text-zinc-400">Auxiliary memory O(1)</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] transition-colors">
                <input
                  type="checkbox"
                  checked={formData.stable}
                  onChange={(e) => setFormData({ ...formData, stable: e.target.checked })}
                  className="rounded border-white/20 text-white focus:ring-0 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-medium text-white block">Stable Ordering</span>
                  <span className="text-[10px] text-zinc-400">Preserves equal key rank</span>
                </div>
              </label>
            </div>

            <div>
              <CustomSelect
                label="Baseline Target Tier"
                value={formData.defaultTier}
                onChange={(val) => setFormData({ ...formData, defaultTier: val })}
                options={[
                  { value: "Tier S", label: "Tier S - Elite Throughput", badge: "< 8ms", meta: "Elite" },
                  { value: "Tier A", label: "Tier A - High Efficiency", badge: "< 35ms", meta: "High" },
                  { value: "Tier B", label: "Tier B - Standard Operational", badge: "< 120ms", meta: "Standard" },
                  { value: "Tier C", label: "Tier C - Heavy / Super-linear", badge: "< 450ms", meta: "Heavy" },
                  { value: "Tier D", label: "Tier D - Constrained Bottleneck", badge: "> 450ms", meta: "Bottleneck" }
                ]}
              />
            </div>
          </div>
        )}

        {/* Step 3: Pseudocode */}
        {activeStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Reference Code / Pseudocode
              </label>
              <textarea
                rows={6}
                value={formData.codeSnippet}
                onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono text-xs text-zinc-200"
              />
            </div>
            <p className="text-[11px] text-zinc-500">
              This pseudocode is stored in the algorithm registry and can be reviewed during benchmark runs.
            </p>
          </div>
        )}

        {/* Modal Buttons */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 transition-colors"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            {activeStep < 3 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                Register Algorithm
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
