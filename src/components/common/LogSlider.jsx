import React from 'react';

export default function LogSlider({ 
  value = 10000, 
  onChange, 
  minLog = 2, // 10^2 = 100
  maxLog = 6, // 10^6 = 1,000,000
  label = 'Input Size (N)'
}) {
  const currentLog = Math.log10(Math.max(10, value));

  const handleSliderChange = (e) => {
    const logVal = parseFloat(e.target.value);
    const actualVal = Math.round(Math.pow(10, logVal));
    onChange(actualVal);
  };

  const handleInputChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = Number(raw);
    if (!isNaN(num)) {
      onChange(Math.max(10, Math.min(1000000, num)));
    }
  };

  const presets = [
    { label: 'Tiny (100)', value: 100 },
    { label: 'Pilot (1k)', value: 1000 },
    { label: 'MCU Ceiling (10k)', value: 10000 },
    { label: 'ESP32 Max (50k)', value: 50000 },
    { label: 'SBC (100k)', value: 100000 },
    { label: 'Extreme (1M)', value: 1000000 }
  ];

  return (
    <div className="space-y-3 font-mono">
      {/* Label and synchronized direct input */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-300 font-sans">
          {label}
        </label>
        <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.12] rounded-lg px-2.5 py-1">
          <span className="text-[11px] text-zinc-500 font-bold">N =</span>
          <input
            type="text"
            value={value.toLocaleString()}
            onChange={handleInputChange}
            className="w-24 text-right bg-transparent text-white font-mono text-xs font-bold outline-none focus:text-white"
          />
        </div>
      </div>

      {/* Logarithmic Track Slider */}
      <input
        type="range"
        min={minLog}
        max={maxLog}
        step="0.02"
        value={currentLog}
        onChange={handleSliderChange}
        className="w-full accent-white cursor-pointer h-1.5 bg-white/10 rounded-full"
      />

      {/* Logarithmic Markers */}
      <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
        <span>10² (100)</span>
        <span>10³ (1k)</span>
        <span>10⁴ (10k)</span>
        <span>10⁵ (100k)</span>
        <span>10⁶ (1M)</span>
      </div>

      {/* Quick preset chips */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange(preset.value)}
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors cursor-pointer ${
              value === preset.value
                ? 'bg-white text-black font-bold shadow-sm'
                : 'bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
