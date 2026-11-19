import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Copy, Check, Download, FileSpreadsheet } from 'lucide-react';

export default function CsvRawModal({ isOpen, onClose, csvText }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(csvText || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `perforacle_dataset_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Raw CSV Dataset Inspection"
      subtitle="Standardized RFC 4180 CSV export ready for machine learning ingestion"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>Encoding: UTF-8 • MIME: text/csv</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy CSV'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code display */}
        <div className="p-4 rounded-xl border border-white/15 bg-black/90 font-mono text-xs text-zinc-300 max-h-[50vh] overflow-auto whitespace-pre leading-relaxed select-all">
          {csvText}
        </div>

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
