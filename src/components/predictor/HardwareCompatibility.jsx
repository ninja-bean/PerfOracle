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
import CustomSelect from '../common/CustomSelect';
import LogSlider from '../common/LogSlider';
import MemoryTape from '../common/MemoryTape';
import { hardwareTargets, algorithmCurves } from '../../data/mlPredictorData';

export default function HardwareCompatibility() {
  const [selectedAlgoId, setSelectedAlgoId] = useState('ALG-001');
  const [inputN, setInputN] = useState(25000);

  const algo = algorithmCurves[selectedAlgoId] || algorithmCurves['ALG-001'];

  // Memory required by this algorithm for N items
  const totalMemoryBytes = algo.fixedMemoryBytes + (inputN * algo.memoryPerItemBytes);

  const algoOptions = Object.entries(algorithmCurves).map(([id, a]) => ({
    value: id,
    label: a.name,
    tag: a.theoretical
  }));

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

        {/* Algorithm Custom Dropdown */}
        <div className="w-72">
          <CustomSelect
            value={selectedAlgoId}
            onChange={setSelectedAlgoId}
            options={algoOptions}
          />
        </div>
      </div>

      {/* Input Slider Banner */}
      <GlassCard>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                Workload Scale Simulator
              </span>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Adjust input size N to observe where hardware targets breach their physical memory ceilings
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-zinc-500 block">
                Current Required Payload
              </span>
              <span className="text-lg font-bold text-white font-mono">
                {(totalMemoryBytes / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>

          <LogSlider
            value={inputN}
            onChange={setInputN}
            label="Simulated Workload Input Size (N)"
          />
        </div>
      </GlassCard>

      {/* Target Matrix Cards */}
      <div data-tour="hardware-guardrails-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hardwareTargets.map((hw) => {
          const utilPct = (totalMemoryBytes / hw.ramBytes) * 100;
          const fits = totalMemoryBytes <= hw.ramBytes;
          const isWarning = fits && utilPct > 80;
          
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

              {/* Memory Tape Bar */}
              <div className="mt-4 pt-3 border-t border-white/[0.06]">
                <MemoryTape
                  requiredBytes={totalMemoryBytes}
                  ceilingBytes={hw.ramBytes}
                  targetName={hw.name}
                  showDetails={true}
                />
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
                  <span className="text-red-400 font-mono">
                    ⚠ Exceeds physical data RAM ({hw.ramDisplay}). Microcontroller triggers hard fault / Guru Meditation panic.
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
