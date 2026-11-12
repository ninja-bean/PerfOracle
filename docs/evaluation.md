# Evaluation plan

This document defines how PerfOracle is measured as a research contribution: the
data splits, the metrics, the provisional targets and the calibration study. It
mirrors Sections 3.2.6, 3.2.8 and 6 of the [proposal](proposal.md).

## 1. Data splits

A random split alone overstates model quality because variants of the same
algorithm leak across train and test. Four splits are reported for every model.

| Split | Construction | What it tests | Difficulty |
| :--- | :--- | :--- | :--- |
| Random | Rows sampled uniformly | Interpolation within seen algorithms | Low (leakage-prone) |
| **Held-out algorithm** | Entire algorithms withheld | **Generalisation to unseen code** | **Primary measure** |
| Leave-one-target-out | One hardware target withheld | Generalisation to unseen hardware | High |
| Held-out tier | One quality tier withheld | Assessment of unseen quality levels | Medium |

The held-out-algorithm split is the headline number. Random-split results are
reported only for comparability with prior work and are explicitly labelled as
leakage-prone.

## 2. Metrics and provisional targets

Targets are provisional and will be re-baselined after the Phase A pilot study.

| Output | Metric | Target | Notes |
| :--- | :--- | :--- | :--- |
| Complexity class | Macro-F1 | ≥ 0.75 | Held-out algorithms |
| Runtime | Share within 2× of measured | ≥ 80% | Log-scale error is also reported |
| Tier ranking on a target | Spearman's ρ | ≥ 0.8 | Ordering matters more than absolute error |
| Fits-on-target / OOM | F1 | ≥ 0.9 | The binary question that gates deployment |
| Baseline comparison | M1 vs B0, B1 | Better on all primary metrics | Required for the claim |

Supporting diagnostics, reported but not targeted:

- median and p90 absolute log error per target class;
- calibration curves for the confidence estimate;
- per-language and per-target error breakdown;
- confusion matrix over complexity classes;
- energy prediction error where labels exist.

## 3. Measurement protocol

Each `(variant, target)` configuration follows the same protocol:

1. **Input-size sweep.** `n = 2⁴ … 2¹¹` (eight sizes), capped lower on
   microcontrollers when memory is exhausted. A single size cannot reveal growth.
2. **Warm-up.** One or two warm-up runs on desktop and SBC targets to remove cache
   and JIT effects.
3. **Repetitions.** Five measured repetitions per size.
4. **Failure capture.** Crashes, OOM and timeouts are recorded as valid outcome
   labels, never discarded.
5. **Controlled conditions.** Fixed CPU-frequency governor on Pi and Jetson, no
   background load, fixed microcontroller clock, ambient temperature logged.

### Instrumentation

| Target | Timing | Memory |
| :--- | :--- | :--- |
| Desktop / SBC | `perf stat`, high-resolution timers | Peak RSS (`/usr/bin/time -v`, `psutil`) |
| ESP32 / S3 | ESP-IDF CPU cycle counter | Minimum free heap, FreeRTOS stack high-water mark |
| Teensy 4.1 | DWT cycle counter (Cortex-M7) | Stack painting, linker map |
| ESP8266 | `ESP.getCycleCount()` | Free-heap tracking |

Energy is measured with an INA226/INA219 sensor inline on the board supply, sampled
by a separate monitoring Raspberry Pi, and aligned with start/stop GPIO markers.
Desktop energy comes from `powermetrics` (macOS) or RAPL (x86 Linux), with the
idle baseline subtracted.

## 4. Complexity fitting

For each variant on each target:

1. Compute the median runtime at each input size.
2. Fit candidate models: `O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n²)`,
   `O(n³)`, `O(2ⁿ)`.
3. Select by goodness of fit with a penalty for additional parameters (AIC-style),
   in log space.
4. Report the log-log slope as a continuous measure — ≈1 linear, ≈2 quadratic.

Both the empirical class and the curated theoretical class are stored. Disagreement
between them is an analysable outcome, not an error: it usually indicates that the
sweep is too short, cache effects dominate, or the implementation deviates from its
nominal complexity.

Implementation: [`src/perforacle/metrics/complexity.py`](../src/perforacle/metrics/complexity.py).

## 5. Calibration study

Physical boards provide ground truth. Emulators and constrained containers provide
scale and reproducibility, not timing. To quantify the gap:

- a calibration subset is measured on **both** a physical board and its emulator;
- the ratio and dispersion of emulated-to-physical timing is reported per target;
- synthetic container results are compared against their nearest physical target
  across CPU quota and memory limit;
- calibration factors are published with the dataset, never baked silently into
  the model.

No emulated or synthetic row is ever relabelled as a physical measurement.

## 6. Threats to validity

| Threat | Effect | Mitigation |
| :--- | :--- | :--- |
| Algorithm leakage | Inflated random-split scores | Held-out-algorithm split as primary |
| Few unique algorithms | Memorisation instead of generalisation | Corpus expansion prioritised over extra repetitions |
| Observer effect | Monitor slows the code it measures | External sidecar for MCUs; measured and reported overhead |
| Thermal throttling | Understated runtime on SBCs | Sidecar flags and re-queues affected runs |
| Emulator fidelity | Wrong absolute timings | Emulators used for correctness and scale only |
| LLM-generated variants | Unrealistically tidy "poor" code | Human-written mix, rubric and static-analysis checks |
| Small carbon figures | Nanogram-scale emissions on MCUs | Energy is the primary metric; carbon is derived |

## 7. Reporting

Every evaluation run produces a report containing:

- the split definitions and the exact held-out sets;
- per-model, per-metric results with confidence intervals;
- baseline comparisons (B0, B1) on identical splits;
- the calibration table for the targets involved;
- dataset version, commit SHA and toolchain pins.

Reports are reproducible from a YAML configuration in `configs/`. A result that
cannot be regenerated from a committed config is not reported.
