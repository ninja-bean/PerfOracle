import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { Copy, Check, Terminal, Cpu } from 'lucide-react';

export default function CodeInspectModal({ algo, isOpen, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!algo) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(algo.codeSnippet || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={algo.name}
      subtitle={`${algo.id} • ${algo.category}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Spec Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono">
          <div>
            <span className="text-zinc-500 block text-[9px] uppercase">Time</span>
            <span className="text-white font-semibold">{algo.timeComplexity}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[9px] uppercase">Space</span>
            <span className="text-zinc-300 font-semibold">{algo.spaceComplexity}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[9px] uppercase">Memory Model</span>
            <span className="text-zinc-300">{algo.inPlace ? 'In-Place' : 'Auxiliary'}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[9px] uppercase">Stability</span>
            <span className="text-zinc-300">{algo.stable ? 'Stable' : 'Unstable'}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-300 leading-relaxed">
          {algo.description}
        </p>

        {/* Code Block with Copy */}
        <div className="relative rounded-xl border border-white/15 bg-black/80 overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-white/5 text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-zinc-300" />
              <span>Reference Specification</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
            <code>{algo.codeSnippet || '// No code implementation provided.'}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
