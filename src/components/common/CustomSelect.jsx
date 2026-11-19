import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ 
  label, 
  value, 
  onChange, 
  options = [], 
  className = '',
  placeholder = 'Select option'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center justify-between">
          <span>{label}</span>
          {selectedOption?.badge && (
            <span className="text-[10px] font-mono text-zinc-500">{selectedOption.badge}</span>
          )}
        </label>
      )}

      {/* Button trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono text-left transition-all cursor-pointer bg-white/[0.04] border border-white/[0.12] hover:border-white/[0.25] hover:bg-white/[0.07] focus:outline-none focus:border-white/50"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="text-white font-medium truncate">{selectedOption?.label || placeholder}</span>
          {selectedOption?.sub && (
            <span className="text-[10px] text-zinc-500 shrink-0 font-normal">({selectedOption.sub})</span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 p-1 rounded-xl bg-[#0e0e12] border border-white/20 shadow-2xl backdrop-blur-2xl max-h-60 overflow-y-auto space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-white text-black font-bold' 
                    : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="truncate">{opt.label}</span>
                    {opt.sub && (
                      <span className={`text-[10px] ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                        {opt.sub}
                      </span>
                    )}
                  </div>
                  {opt.desc && (
                    <div className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-zinc-800' : 'text-zinc-500'}`}>
                      {opt.desc}
                    </div>
                  )}
                </div>

                {opt.tag && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                    isSelected ? 'bg-black/10 text-black' : 'bg-white/[0.08] text-zinc-400'
                  }`}>
                    {opt.tag}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
