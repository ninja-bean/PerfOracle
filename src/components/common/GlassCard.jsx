import React from 'react';

export default function GlassCard({ 
  children, 
  className = '', 
  hover = false, 
  onClick = null, 
  ...props 
}) {
  return (
    <div
      onClick={onClick}
      className={`glass-surface-l2 rounded-2xl p-5 text-white relative overflow-hidden ${
        hover ? 'hover:-translate-y-1 cursor-pointer transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {/* Inset top specular highlight line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
