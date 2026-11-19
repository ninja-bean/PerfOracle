import React from 'react';

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[9px]',
    sm: 'px-2.5 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-[11px] font-semibold'
  };

  const variantClasses = {
    default: 'bg-white/[0.06] text-zinc-300 border border-white/[0.1] hover:border-white/25',
    primary: 'bg-white text-black font-bold border border-white',
    ghost: 'bg-transparent text-zinc-500 border border-white/[0.08]',
    // Tier S — premium white, strong presence
    'tier-s': 'bg-white text-black font-extrabold border border-white/80',
    // Tier A — frosted bright
    'tier-a': 'bg-white/[0.12] text-white font-bold border border-white/40',
    // Tier B — mid-zinc
    'tier-b': 'bg-white/[0.06] text-zinc-200 font-semibold border border-white/[0.15]',
    // Tier C — dim
    'tier-c': 'bg-white/[0.03] text-zinc-400 font-medium border border-white/[0.08]',
    // Tier D — ghost
    'tier-d': 'bg-transparent text-zinc-600 font-medium border border-zinc-800',
    mono: 'bg-white/[0.05] text-zinc-300 border border-white/[0.1] font-mono'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg uppercase tracking-wider whitespace-nowrap transition-all duration-200 select-none font-semibold badge-root badge-${variant} ${sizeClasses[size] || sizeClasses.sm} ${
        variantClasses[variant] || variantClasses.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
