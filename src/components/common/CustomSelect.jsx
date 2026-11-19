import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ 
  label, 
  value, 
  onChange, 
  options = [], 
  className = '',
  placeholder = 'Select option',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const listboxRef = useRef(null);
  const id = useId();

  const selectedIndex = options.findIndex(opt => opt.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : options[0];

  // Outside click handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keep highlighted index in sync when opening
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            onChange(options[highlightedIndex].value);
            setIsOpen(false);
            triggerRef.current?.focus();
          }
        } else {
          setIsOpen(true);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => {
            const next = prev < options.length - 1 ? prev + 1 : 0;
            scrollIntoView(next);
            return next;
          });
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => {
            const next = prev > 0 ? prev - 1 : options.length - 1;
            scrollIntoView(next);
            return next;
          });
        }
        break;

      case 'Home':
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(0);
          scrollIntoView(0);
        }
        break;

      case 'End':
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(options.length - 1);
          scrollIntoView(options.length - 1);
        }
        break;

      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;

      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
        }
        break;

      default:
        break;
    }
  };

  const scrollIntoView = (index) => {
    if (listboxRef.current) {
      const element = listboxRef.current.children[index];
      if (element) {
        element.scrollIntoView({ block: 'nearest' });
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label 
          id={`${id}-label`}
          className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center justify-between select-none"
        >
          <span>{label}</span>
          {selectedOption?.badge && (
            <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.08]">
              {selectedOption.badge}
            </span>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-trigger`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
        aria-labelledby={label ? `${id}-label ${id}-trigger` : undefined}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono text-left transition-all duration-200 cursor-pointer ${
          disabled
            ? 'opacity-40 cursor-not-allowed bg-white/[0.02] border border-white/[0.05]'
            : isOpen
              ? 'bg-white/[0.08] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.15)] text-white'
              : 'bg-white/[0.035] border border-white/[0.1] hover:border-white/[0.22] hover:bg-white/[0.06] text-zinc-200'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          <span className="font-medium text-white truncate">
            {selectedOption?.label || placeholder}
          </span>
          {selectedOption?.sub && (
            <span className="text-[10px] text-zinc-400 font-normal shrink-0">
              ({selectedOption.sub})
            </span>
          )}
        </div>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`} 
        />
      </button>

      {/* Level 3 Glass Popover Menu */}
      {isOpen && (
        <ul
          ref={listboxRef}
          id={`${id}-listbox`}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          className="absolute top-full left-0 right-0 mt-2 z-50 p-1.5 rounded-2xl glass-surface-l3 max-h-64 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          {options.map((opt, index) => {
            const isSelected = opt.value === value;
            const isHighlighted = highlightedIndex === index;

            return (
              <li
                key={opt.value}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-white/[0.12] text-white border border-white/[0.2] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]'
                    : isHighlighted
                      ? 'bg-white/[0.06] text-white border border-white/[0.08]'
                      : 'text-zinc-300 border border-transparent hover:bg-white/[0.04]'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className={`truncate font-medium ${isSelected ? 'text-white font-semibold' : 'text-zinc-200'}`}>
                      {opt.label}
                    </span>
                    {opt.sub && (
                      <span className={`text-[10px] ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                        {opt.sub}
                      </span>
                    )}
                  </div>
                  {opt.desc && (
                    <div className="text-[10px] text-zinc-400 truncate mt-0.5 font-mono">
                      {opt.desc}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {opt.tag && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                      isSelected 
                        ? 'bg-white/20 text-white font-bold' 
                        : 'bg-white/[0.05] text-zinc-400 border border-white/[0.08]'
                    }`}>
                      {opt.tag}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
