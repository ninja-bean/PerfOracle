import React from 'react';

export default function GlassCard({ children, className = '', hover = false, onClick = null, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`glass-card-human rounded-2xl p-5 relative overflow-hidden ${
        hover ? 'card-hover-lift cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {/* Inset top highlight line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
