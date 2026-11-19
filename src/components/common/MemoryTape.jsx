import React from 'react';

export default function MemoryTape({ 
  requiredBytes, 
  ceilingBytes, 
  targetName = 'Target',
  showDetails = true 
}) {
  const utilPct = (requiredBytes / ceilingBytes) * 100;
  const isOOM = utilPct > 100;
  const isPressure = utilPct > 80 && !isOOM;

  const formatSize = (bytes) => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="space-y-1.5 font-mono text-xs">
      {showDetails && (
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">SRAM Allocation ({targetName})</span>
          <span className={isOOM ? 'text-red-400 font-bold' : isPressure ? 'text-yellow-400' : 'text-zinc-300'}>
            {formatSize(requiredBytes)} / {formatSize(ceilingBytes)} ({utilPct.toFixed(1)}%)
          </span>
        </div>
      )}

      {/* Memory Tape Track */}
      <div className="relative w-full h-3 bg-white/[0.05] rounded-md overflow-hidden border border-white/10">
        {/* 80% Safe Threshold Marker */}
        <div 
          className="absolute top-0 bottom-0 left-[80%] w-px bg-yellow-400/40 z-10" 
          title="80% Memory Warning Threshold"
        />

        {/* Filling Bar */}
        <div 
          className={`h-full transition-all duration-300 ${
            isOOM 
              ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]' 
              : isPressure 
              ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
              : 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]'
          }`}
          style={{ width: `${Math.min(100, utilPct)}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex justify-between text-[9px] text-zinc-500">
          <span>0 KB</span>
          <span className="text-yellow-400/70">80% Threshold</span>
          <span>{formatSize(ceilingBytes)} Ceiling</span>
        </div>
      )}
    </div>
  );
}
