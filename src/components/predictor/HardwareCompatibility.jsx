import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle2, 
  BatteryCharging, 
  Zap, 
  ArrowRight,
  ShieldAlert,
  Server
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Badge from '../common/Badge';
import { hardwareTargets, algorithmCurves } from '../../data/mlPredictorData';

export default function HardwareCompatibility() {
  const [selectedAlgoId, setSelectedAlgoId] = useState('ALG-001');
  const [inputN, setInputN] = useState(25000);

  const algo = algorithmCurves[selectedAlgoId] || algorithmCurves['ALG-001'];

  // Memory required by this algorithm for N items
  const totalMemoryBytes = algo.fixedMemoryBytes + (inputN * algo.memoryPerItemBytes);

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white font-display tracking-tight">
              Hardware Guardrails & Memory Ceilings
            </h2>
            <Badge variant="tier-s" size="xs">First-Order Constraints</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            "Does it fit?" precedes "how fast is it?" — validating hard memory walls on microcontrollers
          </p>
        </div>

        {/* Algorithm picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">Algorithm:</span>
          <select
            value={selectedAlgoId}
            onChange={(e) => setSelectedAlgoId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl glass-input cursor-pointer bg-[#0f0f12]"
          >
            {Object.entries(algorithmCurves).map(([id, a]) => (
              <option key={id} value={id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Input Slider Banner */}
      <GlassCard>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                Workload Scale Simulator
              </span>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Adjust input size N to observe where hardware targets breach their physical memory ceilings
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-white font-mono">N = {inputN.toLocaleString()}</span>
              <span className="text-[10px] text-zinc-500 block font-mono">
                Payload: {(totalMemoryBytes / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>

          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={inputN}
            onChange={(e) => setInputN(Number(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>N = 1,000 (Safe for all)</span>
            <span>N = 10,000 (ESP8266 Ceiling boundary)</span>
            <span>N = 50,000 (ESP32 SRAM boundary)</span>
            <span>N = 100,000 (SBC / Desktop only)</span>
          </div>
        </div>
      </GlassCard>

      {/* Target Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hardwareTargets.map((hw) => {
          const utilPct = (totalMemoryBytes / hw.ramBytes) * 100;
          const fits = totalMemoryBytes <= hw.ramBytes;
          const isWarning = fits && utilPct > 70;
          
          // Battery life estimate (1200 mAh @ 3.7V = 4.44 Wh)
          const runEnergyMilliJoules = hw.nominalPowerWatts * (algo.constant * Math.pow(inputN, algo.baseSlope) / 1000) * 1000;
          const runsOnBattery = Math.floor((4.44 * 3600 * 1000) / Math.max(0.1, runEnergyMilliJoules));

          return (
            <div
              key={hw.id}
              className={`p-5 rounded-2xl border transition-all ${
                !fits
                  ? 'bg-red-500/[0.05] border-red-500/40 text-red-200'
                  : isWarning
                  ? 'bg-yellow-500/[0.04] border-yellow-500/30'
                  : 'bg-white/[0.025] border-white/[0.08]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    !fits ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'
                  }`}>
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">{hw.name}</h3>
                    <span className="text-[10px] font-mono text-zinc-500">{hw.arch}</span>
                  </div>
                </div>
                <Badge variant={!fits ? 'tier-d' : isWarning ? 'tier-b' : 'tier-s'} size="xs">
                  {!fits ? 'OOM FAILED' : isWarning ? 'PRESSURE' : 'PASSED'}
                </Badge>
              </div>

              {/* Memory stats */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">RAM Ceiling</span>
                  <span className="text-white font-bold">{hw.ramDisplay}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Required Memory</span>
                  <span className={!fits ? 'text-red-400 font-bold' : 'text-zinc-300'}>
                    {(totalMemoryBytes / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Memory Utilization</span>
                  <span className={!fits ? 'text-red-400 font-bold' : 'text-white'}>
                    {utilPct.toFixed(1)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full transition-all ${
                      !fits ? 'bg-red-500' : isWarning ? 'bg-yellow-400' : 'bg-white'
                    }`}
                    style={{ width: `${Math.min(100, utilPct)}%` }}
                  />
                </div>
              </div>

              {/* Power & Reliability */}
              <div className="mt-5 pt-3 border-t border-white/[0.06] space-y-1.5 text-[11px] font-mono text-zinc-500">
                <div className="flex items-center justify-between">
                  <span>Nominal Active Power</span>
                  <span className="text-zinc-300">{hw.nominalPowerWatts} W</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Est. Runs on 1200mAh LiPo</span>
                  <span className="text-zinc-300">{fits ? runsOnBattery.toLocaleString() : '0 (Crashes)'}</span>
                </div>
              </div>

              {/* Status Note */}
              <div className="mt-3 text-[10px] text-zinc-400 leading-snug">
                {!fits ? (
                  <span className="text-red-400">
                    ⚠ Exceeds physical data RAM. Device will throw Kernel Panic / Guru Meditation Error.
                  </span>
                ) : (
                  <span>Safe execution zone with ample stack and heap headroom.</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
