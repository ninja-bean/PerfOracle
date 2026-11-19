# PerfOracle

### Learning to Predict Algorithm Performance Across Programming Languages and Hardware, from Microcontrollers to Edge AI

**Final Year Design Project — Proposal**

*Embedded Systems · Performance Modelling · Machine Learning · Energy-Aware Computing*

| | |
| :--- | :--- |
| **Submitted to** | Mr. Md. Tarek Hasan, Assistant Professor, Dept. of CSE & UG Program Coordinator<br>Ms. Siana Rizwan, Lecturer, Dept. of CSE |
| **Submitted by** | Rayian Bin Shiraz Mahi — 0112330146<br>Injabin Alam — 0112330344<br>Fardin Jany Raad — 0112331148<br>Jahid Hassan Sabbir — 0112330978 |
| **Department** | Computer Science and Engineering, United International University |
| **Date** | November 2026 |

> *This document was converted from the submitted PDF. Formatting and structure
> have been normalised; the technical content is unchanged.*

---

## Contents

1. [Introduction and Problem Statement](#1-introduction-and-problem-statement)
2. [Objectives](#2-objectives)
3. [Proposed Methodology](#3-proposed-methodology)
   - [3.1 System Architecture](#31-system-architecture)
   - [3.2 Phase A: Dataset Generation](#32-phase-a-dataset-generation)
   - [3.3 Phase B: Performance Predictor](#33-phase-b-performance-predictor)
   - [3.4 Phase C: Tool](#34-phase-c-tool)
4. [Feasibility, Limitations and Mitigations](#4-feasibility-limitations-and-mitigations)
5. [Related Work and Novelty](#5-related-work-and-novelty)
6. [Evaluation Plan](#6-evaluation-plan)
7. [Scope](#7-scope)
8. [Dataset Size and Compute Estimate](#8-dataset-size-and-compute-estimate)
9. [Tools and Technologies](#9-tools-and-technologies)
10. [Hardware Requirements and Budget](#10-hardware-requirements-and-budget)
11. [Team Structure and Work Streams](#11-team-structure-and-work-streams)
12. [Project Timeline](#12-project-timeline)
13. [Risk Management](#13-risk-management)
14. [Expected Deliverables and Impact](#14-expected-deliverables-and-impact)
15. [Mapping to Complex Engineering Problem Attributes](#15-mapping-to-complex-engineering-problem-attributes)
16. [Points for Supervisor Guidance](#16-points-for-supervisor-guidance)
- [References](#references)

---

## Cover Note

##### Dear Mr. Hasan and Ms. Rizwan,

We respectfully submit this proposal for our Final Year Design Project. The
project addresses a practical problem in embedded and edge software development: a
developer cannot know how a piece of code will perform on a constrained device
without building, flashing and measuring it on that device.

We propose to build a measured, multi-hardware dataset of algorithm
implementations. On top of it we will train a model that predicts how unseen code
will perform across a range of targets, from an ESP8266 microcontroller to a
Raspberry Pi, an NVIDIA Jetson and a modern desktop. The prediction will cover
runtime, memory, empirical complexity and energy.

We would be grateful for your guidance on the scope, methodology and evaluation
plan outlined below. Points where we particularly seek your direction are listed
in Section 16.

##### *Sincerely,*

*Rayian Bin Shiraz Mahi, Injabin Alam, Fardin Jany Raad, Jahid Hassan Sabbir*

---

## Abstract

Classical asymptotic analysis does not capture the factors that dominate software
performance on embedded and edge hardware. These include interpreter overhead,
hard memory ceilings, and energy consumption. This project proposes **PerfOracle**,
a system that predicts the performance of unseen source code on a specified
language runtime and hardware target.

The project has three parts:

1. **An automated benchmark harness and dataset.** Algorithm implementations
   spanning up to 8 programming languages, 4 controlled code-quality tiers and
   approximately 9 hardware targets are measured on real boards, emulators and
   constrained environments. Each configuration runs an input-size sweep with 5
   repetitions per size.
2. **A learned predictor.** It maps (source code, language, hardware descriptor)
   to runtime, peak memory, empirical complexity class, energy, estimated carbon
   emissions and fit-on-target probability.
3. **A usable tool.** It renders each prediction as a performance card (PNG) with
   an accompanying structured report.

To our knowledge, no existing dataset or tool jointly covers the
microcontroller-to-desktop hardware spectrum, multiple language runtimes and
controlled implementation quality.

**Keywords:** performance prediction, embedded systems, empirical complexity,
energy efficiency, code representation learning, benchmarking

---

## 1. Introduction and Problem Statement

Developers targeting embedded and edge devices typically learn how their code
performs only after deploying it. Big-O notation describes growth rate but omits
several factors that are decisive on small devices:

- **Constant factors and runtime overhead.** An interpreter running on a 160 MHz
  microcontroller behaves very differently from CPython on a desktop.
- **Hard memory limits.** An ESP8266 offers roughly 80 KB of usable data RAM, so
  whether an implementation fits at all is a first-order question.
- **Energy consumption and carbon cost**, which are critical for battery-powered
  and IoT deployments.
- **Language and runtime choice**, for example C versus MicroPython versus
  Espruino on the same chip.

Measuring every implementation on every target is slow, requires physical hardware
and does not scale. A tool that estimates cross-hardware behaviour directly from
source code would let developers compare implementations and choose suitable
targets and languages early in the design process.

---

## 2. Objectives

| # | Objective | Measurable outcome |
| :--- | :--- | :--- |
| **O1** | Develop an automated, reproducible benchmark harness spanning microcontroller, single-board computer, edge-AI and desktop targets | The same algorithm executes across ≥ 6 targets and ≥ 3 languages from a single command |
| **O2** | Produce a public dataset of (code, language, hardware, metrics) records across 4 implementation-quality tiers | ≥ 50,000 measured executions in the core scope, versioned and documented |
| **O3** | Train and evaluate a predictor for performance on unseen code and targets | Meets the targets in Section 6 on held-out algorithms |
| **O4** | Deliver a tool (CLI, with a web interface as an extension) that outputs performance cards | Source code in, PNG card and JSON report out, within seconds |

---

## 3. Proposed Methodology

### 3.1 System Architecture

*Figure 1. System architecture of PerfOracle. The dashed link marks the
health-monitoring sidecar, which observes, resets and re-runs the execution
environment.*

```text
                     ┌───────────────────────┐
                     │   Algorithm corpus    │
                     └───────────┬───────────┘
                                 ▼
                     ┌───────────────────────┐
                     │   Variant generator   │◄──────────────┐
                     └───────────┬───────────┘               │
                                 ▼                           │
                     ┌───────────────────────┐    no / retry │
                     │  Passes test suite?   │───────────────┘
                     └───────────┬───────────┘
                                 │ yes
                                 ▼
        ┌────────────────────────────────────────────────────┐
        │  Execution targets                                 │
        │  boards · emulators · containers                   │
        │  build & runtime adapters per language × target    │
        └───────────┬────────────────────────────────────────┘
                    │ telemetry
                    ▼
        ┌────────────────────────────────────────────────────┐
        │  Metric engine                                     │
        │  stats · complexity fit · energy · carbon          │
        └───────────┬────────────────────────────────────────┘
                    ▼
        ┌────────────────────────────────────────────────────┐
        │  Dataset (Parquet + code)  ·  Card renderer → PNG  │
        └───────────┬────────────────────────────────────────┘
                    ▼
        ┌────────────────────────────────────────────────────┐
        │  Predictor training                                │
        │  code + language + target → card                   │
        └────────────────────────────────────────────────────┘

   Health-monitoring sidecar: resources · thermal · liveness · power
   (observes, resets and re-runs the execution environment — dashed link)
```

The work proceeds in three phases:

- **Phase A, Dataset Generation:** corpus → variants → measurement → dataset.
- **Phase B, Predictor:** learn the mapping from (code, language, hardware) to
  performance metrics.
- **Phase C, Tool:** package the predictor as a usable application that produces
  performance cards.

### 3.2 Phase A: Dataset Generation

#### 3.2.1 Algorithm Corpus

The corpus is curated so that computational complexity varies within each
category:

| Category | Examples |
| :--- | :--- |
| Warm-up / constant-factor tests | FizzBuzz, prime sieve, string reversal |
| Sorting | Bubble, insertion, merge, quick, heap, counting sort |
| Searching | Linear, binary, interpolation, hash lookup |
| Graph | BFS, DFS, Dijkstra, A\*, Floyd–Warshall |
| Dynamic programming | Fibonacci (naive / memoised / iterative), LCS, knapsack, edit distance |
| String processing | Naive matching, KMP, Rabin–Karp |
| Mathematical / numeric | Matrix multiplication, GCD, fast exponentiation, FFT |
| Embedded-relevant | CRC32, moving-average filter, ring buffer, fixed-point arithmetic |

Core scope: 20 algorithms. Extended scope: 60 or more.

#### 3.2.2 Implementation Quality Tiers

Each algorithm is implemented in four quality tiers per language, defined by an
objective rubric:

| Tier | Definition | FizzBuzz (Python) | Sorting |
| :--- | :--- | :--- | :--- |
| **T0 Poor** | Correct but wasteful: worse complexity or pathological constant factors and anti-patterns | Repeated `str +=` concatenation, redundant modulo checks, full list built before output | Bubble sort without early exit, list copied on every pass |
| **T1 Naive** | Straightforward textbook version, no anti-patterns, no optimisation | Plain `if/elif` with `%` | Insertion sort |
| **T2 Adequate** | Idiomatic, reasonable complexity | Precomputed checks, single `join` | Standard merge sort |
| **T3 Optimised** | Optimal complexity, idiomatic and target-aware (allocation-free on microcontrollers, cache-friendly on desktop) | Streaming output, no allocation, 15-step lookup cycle | Built-in / introsort, in-place |

**Validation gate:** every variant must pass the same test suite and match a
reference implementation's output (differential testing). This guarantees that a
faster variant is not an incorrect one.

#### 3.2.3 Self-Improvement Loop and Health-Monitoring Sidecar

**Variant generation.** The self-improvement loop works as follows:

1. Begin from a seed implementation, either human-written or LLM-generated at tier
   T0.
2. An LLM agent rewrites the implementation toward the next tier, guided by a
   tier-specific prompt and the rubric.
3. Static checks run: linting, cyclomatic complexity and verification of the
   intended complexity change.
4. The test suite gates acceptance. On failure, the agent retries with the error
   feedback, up to a fixed number of attempts.
5. Accepted variants enter the measurement queue.

**Health-monitoring sidecar.** Every execution environment is paired with a
sidecar: an independent health-monitoring system that continuously watches the
system running the code, separately from the code under test. Its
responsibilities are:

| Function | What it monitors or does |
| :--- | :--- |
| Resource health | CPU utilisation, memory pressure and heap, stack high-water mark, swap activity |
| Thermal and power health | SoC temperature, thermal-throttling events, supply voltage and current (via INA226) |
| Liveness | Hang and timeout detection, crash and watchdog-reset detection |
| Recovery | Automatic board reset and re-flash, then re-queues the interrupted run |
| Run validity | Flags runs affected by throttling, background load or brownouts so they are excluded or re-run |
| Telemetry | Streams timing, memory and power samples to the metric engine |

On desktop and SBC targets, the sidecar runs as a separate process or container
pinned to its own CPU core. On microcontrollers, which cannot host a second
process without disturbing measurements, the sidecar is an external Raspberry Pi
connected over UART, GPIO and the power sensor.

#### 3.2.4 Hardware Targets

| Tier | Target | CPU / Clock | RAM | Execution mode |
| :--- | :--- | :--- | :--- | :--- |
| Desktop (high) | Apple M5 Mac | Apple Silicon (arm64) | 16 GB+ | Native |
| Desktop x86 *(extended)* | x86-64 PC | Varies | Varies | Native |
| Edge AI (high) | NVIDIA Jetson Orin Nano | 6× Cortex-A78AE | 8 GB | Physical board |
| SBC (mid) | Raspberry Pi 5 | 4× Cortex-A76 @ 2.4 GHz | 4–8 GB | Physical board |
| SBC (low) | Raspberry Pi Zero 2 W | 4× Cortex-A53 @ 1 GHz | 512 MB | Physical board |
| Mobile *(extended)* | Mid-range Android phone | Cortex-A7x class | 6–8 GB | Termux (approximate) |
| MCU (high) | Teensy 4.1 | Cortex-M7 @ 600 MHz | 1 MB SRAM | Physical board |
| MCU (mid-high) | ESP32-S3 | 2× Xtensa LX7 @ 240 MHz | 512 KB SRAM (+PSRAM) | Physical board + emulator |
| MCU (mid) | ESP32 (classic) | 2× Xtensa LX6 @ 240 MHz | 520 KB SRAM | Physical board + Espressif QEMU |
| MCU (low) | ESP8266 | Xtensa L106 @ 80/160 MHz | ~80 KB user data RAM | Physical board |
| Synthetic | cgroups-v2 constrained containers | CPU quota | Memory limit | Interpolation only, flagged as synthetic |

**Fidelity policy:** every record stores an `execution_mode` field (`native`,
`physical_board`, `emulated`, `synthetic`). A calibration subset is measured on
both physical boards and emulators so the deviation of each mode can be quantified
and reported.

#### 3.2.5 Language and Hardware Support Matrix

Not every language runtime is available on every target. The dataset is therefore
sparse by design. Infeasible combinations are recorded as `unsupported`, never
approximated.

| Language | Desktop | Jetson / Pi | ESP32 / S3 | Teensy 4.1 | ESP8266 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| C | ✓ clang/gcc | ✓ gcc | ✓ ESP-IDF | ✓ Teensyduino | ✓ Arduino core |
| C++ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Rust | ✓ | ✓ | ✓ esp-rs | ! community (teensy4-rs) | ! experimental |
| Python | ✓ CPython | ✓ CPython | ✓ MicroPython | ✓ MicroPython (mimxrt port) | ! MicroPython, limited RAM |
| JavaScript | ✓ Node.js | ✓ Node.js | ! Espruino / Moddable XS | ✗ | ! Espruino (limited) |
| TypeScript | ✓ → JS | ✓ | ! compiled → JS | ✗ | ! |
| PHP | ✓ PHP CLI | ✓ | ✗ | ✗ | ✗ |
| Go *(extended)* | ✓ | ✓ | ! TinyGo | ! TinyGo | ! TinyGo |

**✓** supported · **!** language subset or different runtime · **✗** no practical
runtime. All **!** entries will be verified during the Phase A pilot.

On microcontrollers, "Python" refers to MicroPython, which is a different runtime
from CPython. The dataset therefore stores `runtime` separately from `language`.

#### 3.2.6 Measurement Protocol

Each (variant × target) configuration is measured as follows:

- **Input-size sweep:** n = 2⁴, 2⁵, … up to 2¹¹ (8 sizes), capped lower on
  microcontrollers when memory is exhausted. A single input size cannot reveal
  growth rate; the sweep is what makes complexity measurable.
- **Five repetitions per size**, preceded by one or two warm-up runs on desktop and
  SBC targets to remove cache and JIT effects.
- **Failure capture:** crashes, out-of-memory errors and timeouts are recorded as
  valid outcome labels.
- **Controlled conditions:** fixed CPU frequency governor on Pi/Jetson, no
  background load, fixed microcontroller clock, and logged ambient temperature.

**On-device instrumentation:**

| Target | Timing | Memory |
| :--- | :--- | :--- |
| Desktop / SBC | `perf stat`, high-resolution timers | Peak RSS (`/usr/bin/time -v`, `psutil`) |
| ESP32 / S3 | CPU cycle counter (ESP-IDF) | Minimum free heap, FreeRTOS stack high-water mark |
| Teensy 4.1 | DWT cycle counter (Cortex-M7) | Stack painting, linker map |
| ESP8266 | `ESP.getCycleCount()` | Free-heap tracking |

**Energy measurement:** an INA226/INA219 current sensor is placed inline on each
board's power supply and sampled by a separate monitoring Raspberry Pi. Power
samples are aligned with start/stop GPIO markers emitted by the device under test.
On desktop machines, energy is read from operating-system counters (`powermetrics`
on macOS, RAPL on x86 Linux).

#### 3.2.7 Metrics Captured

| Category | Metric | Unit |
| :--- | :--- | :--- |
| Time | Median and 95th-percentile wall-clock time | ms / µs |
| | CPU cycles, instructions retired (where available) | count |
| | Coefficient of variation across repetitions | % |
| Space | Peak memory (RSS / heap high-water mark) | KB |
| | Stack usage | bytes |
| | Binary / flash footprint | KB |
| Complexity | Empirical time complexity class, fitted log-log exponent, fit R² | class, float |
| | Empirical space complexity class | class |
| | Curated theoretical Big-O (ground-truth label) | class |
| Energy | Energy per run, average power | mJ, mW |
| | Energy-Delay Product (EDP) | J·s |
| Carbon | Estimated emissions = energy (kWh) × grid intensity (gCO₂e/kWh) | gCO₂e |
| Efficiency | Throughput, throughput per watt | ops/s, ops/J |
| | Normalised score against the C / T3 baseline on the same target | ratio |
| Code quality | Lines of code, cyclomatic complexity, Halstead volume, maintainability index | various |
| Reliability | Correctness, crash / OOM / timeout flags, fits-on-target | boolean |

#### 3.2.8 Empirical Complexity Fitting

For each variant on each target:

1. Compute the median runtime at each input size n.
2. Fit candidate growth models: O(1), O(log n), O(n), O(n log n), O(n²), O(n³),
   O(2ⁿ).
3. Select the best model by goodness-of-fit with a penalty for additional
   parameters.
4. Report the log-log slope as a continuous measure (≈ 1 indicates linear growth,
   ≈ 2 quadratic).

Both the empirical class and the curated theoretical class are stored.
Disagreement between the two, for example due to small input sizes or cache
effects, is itself an analysable outcome.

#### 3.2.9 Performance Card

Each measured or predicted configuration produces a PNG card rendered from the
structured data:

- **Header:** algorithm, language and runtime, tier, target, execution mode, and
  complexity / fit badges.
- **Key figures:** median time, peak memory, energy, carbon estimate, complexity
  fit, and slowdown versus the T3 (Optimised) tier on the same language and target.
- **Runtime versus n** on log–log axes with the fitted complexity curve overlaid.
- **Memory versus n** against the target's available memory.
- **Radar profile** of speed, memory, energy, code quality and reliability,
  normalised per target.
- **Tier comparison** against the other tiers of the same algorithm on the same
  target.
- **Sidecar health strip:** peak temperature, throttling, watchdog resets, crashes,
  brownouts and valid-run count.

*Figure 2. Mock performance card for Bubble Sort (tier T0, Poor), MicroPython on
ESP32.*

> **AI-GENERATED MOCK.** Figure 2 is an AI-generated mock for illustration only.
> Every value on it is a placeholder, not a measurement, and the final card design
> may change. Measured cards will replace it after the Phase A pilot study.

The PNG is a human-readable view. The structured record (Parquet/JSON) is the
source of truth, and all model training uses the numerical data.

#### 3.2.10 Data Record Schema

*Values below are illustrative placeholders, not measurements.*

```json
{
  "record_id": "fizzbuzz_py_T0_esp32_n256_rep3",
  "algorithm": "fizzbuzz",
  "category": "warmup",
  "language": "python",
  "runtime": "micropython-1.x",
  "tier": "T0",
  "code_sha256": "…",
  "code_path": "code/fizzbuzz/python/T0.py",
  "target": "esp32",
  "execution_mode": "physical_board",
  "hardware": { "isa": "xtensa-lx6", "clock_mhz": 240, "ram_kb": 520, "fpu": true },
  "input_n": 256,
  "rep": 3,
  "time_us": 0,
  "cycles": 0,
  "peak_mem_kb": 0,
  "energy_mj": 0,
  "status": "ok",
  "card_path": "cards/fizzbuzz_py_T0_esp32.png"
}
```

**Motivating example:** CPython includes a special-case optimisation for repeated
`s += t` string building, which MicroPython may not replicate. The same poor-tier
FizzBuzz could therefore show near-linear behaviour on the desktop and degrade on
the ESP32. This runtime-dependent behaviour is invisible to asymptotic analysis
alone and will be verified during the pilot study.

### 3.3 Phase B: Performance Predictor

**Input:** source code, language, and a hardware descriptor (instruction set,
clock, RAM, cache, FPU, runtime).

**Output:** predicted runtime curve, peak memory, energy, complexity class and
fits-on-target probability, each with a confidence estimate.

| Model | Description | Role |
| :--- | :--- | :--- |
| **B0** | Scaling heuristic: desktop runtime × clock ratio × language factor | Naive baseline |
| **B1** | Gradient boosting on handcrafted static features (loop depth, recursion, allocations, AST node counts) plus hardware vector | Classical baseline |
| **M1** | Pretrained code-encoder embeddings plus hardware vector, feeding multi-task neural heads | Primary model |
| **M2** *(extended)* | Small open-source code LLM fine-tuned with LoRA to emit structured metric JSON | Comparative study |

Regression targets are predicted on a logarithmic scale, as runtimes span roughly
six orders of magnitude between the ESP8266 and the M5.

### 3.4 Phase C: Tool

- **Command-line interface:** `perforacle analyze file.py --lang python --target esp32`
  produces a PNG card and a JSON report.
- **Web interface** *(extended)*: paste code, select targets, compare predicted
  cards side by side.
- **Multi-target mode:** a single input yields cards for every target and a
  recommended language/target summary.

---

## 4. Feasibility, Limitations and Mitigations

| Limitation | Reason | Mitigation |
| :--- | :--- | :--- |
| Exact Big-O of arbitrary code is undecidable in general | Follows from Rice's theorem: no program can determine the complexity of every program | Predict empirical complexity with an explicit confidence score |
| Constrained containers do not reproduce microcontrollers | Different instruction set, no operating system, different memory hierarchy, different runtimes | Physical boards provide ground truth; containers are flagged synthetic; a calibration study quantifies the gap |
| Emulators are not cycle-accurate | QEMU models functional behaviour, not timing | Emulators are used for correctness and scale; physical boards supply timing labels |
| Carbon figures on microcontrollers are extremely small | Microjoule-scale runs yield nanogram-scale emissions | Energy is the primary metric; carbon is derived with a configurable grid-intensity parameter |
| macOS measurement caveats | Docker on macOS runs inside a Linux VM; `powermetrics` reports system-wide power and requires administrator access | M5 benchmarks run natively; idle-baseline power is subtracted |
| Monitoring overhead (observer effect) | A monitor running on the same device can slow the code it measures | External sidecar for microcontrollers; dedicated core and low sampling rate on SBCs; overhead measured and reported |
| Low variance on deterministic targets | Bare-metal microcontroller runs vary very little | Five repetitions are retained for protocol consistency; low variance confirms determinism |
| Limited number of unique algorithms | The model may memorise algorithms instead of generalising | Held-out-algorithm evaluation as the primary split; corpus expansion (extended: Project CodeNet) |
| LLM-generated poor code may be unrealistic | LLMs tend to produce tidy rather than genuinely poor code | Mix in human-written code; rubric and static-analysis checks |

---

## 5. Related Work and Novelty

| Work | Contribution | Gap relative to this project |
| :--- | :--- | :--- |
| Pereira et al. (2017) | Energy, time and memory across 27 programming languages | Desktop only; no microcontroller or edge targets; no quality tiers |
| Goldsmith et al. (2007), *trend-prof* | Fits empirical performance to input size | Measures existing runs; does not predict from code |
| Sikka et al. (2020), *CoRCoD*; Jeon et al. (2022), *CodeComplex* | Classify Big-O from source code | No hardware dimension; no energy |
| Mendis et al. (2019), *Ithemal* | Learned throughput prediction for x86 basic blocks | Instruction level; single architecture |
| Banbury et al. (2021), *MLPerf Tiny*; EEMBC CoreMark | Standardised microcontroller benchmarks | Fixed workloads, not arbitrary user code |

**Contribution:** to our knowledge, this is the first dataset and predictor that
jointly spans microcontroller, edge and desktop hardware, multiple languages and
runtimes, and controlled implementation-quality tiers, with energy and
fit-on-target labels.

---

## 6. Evaluation Plan

**Data splits.** All four are reported, since a random split alone overstates
performance:

| Split | What it tests | Difficulty |
| :--- | :--- | :--- |
| Random | Interpolation within seen algorithms | Low (prone to leakage) |
| Held-out algorithm | Generalisation to unseen code | **Primary measure** |
| Leave-one-target-out | Generalisation to unseen hardware | High |
| Held-out tier | Assessment of unseen quality levels | Medium |

**Metrics and proposed targets** (to be refined after the pilot study):

| Output | Metric | Target |
| :--- | :--- | :--- |
| Complexity class | Macro-F1 | ≥ 0.75 on held-out algorithms |
| Runtime | Share of predictions within 2× of measured value | ≥ 80% |
| Ranking of tiers on a target | Spearman's ρ | ≥ 0.8 |
| Fits-on-target / OOM | F1 | ≥ 0.9 |
| Baseline comparison | M1 outperforms B0 and B1 | On all primary metrics |

---

## 7. Scope

| | **Core scope (committed)** | **Extended scope (if time permits)** |
| :--- | :--- | :--- |
| Languages | Python, C, Rust | C++, JavaScript, TypeScript, PHP, Go |
| Targets | M5, Raspberry Pi 5, Pi Zero 2 W, ESP32, ESP8266, Teensy 4.1 | Jetson Orin Nano, ESP32-S3, x86, mobile, synthetic tiers |
| Algorithms | 20 | 60+ |
| Models | B0, B1, M1 | M2 (fine-tuned LLM) |
| Tool | CLI with PNG card | Web interface, multi-target comparison |
| Optimisation suggestions | — | Given code and a target, propose an improved variant using the self-improvement loop |

---

## 8. Dataset Size and Compute Estimate

Executions = algorithms × languages × tiers × targets × input sizes × repetitions

| Scope | Algorithms | Languages | Tiers | Targets | Sizes | Reps | Executions (before removing unsupported combinations) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Core | 20 | 3 | 4 | 6 | 8 | 5 | **57,600** |
| Extended | 60 | 8 | 4 | 9 | 8 | 5 | **691,200** |

The predictor learns from unique (code, target) pairs rather than raw executions.
Even the extended scope yields at most 60 × 8 × 4 × 9 = **17,280 training rows**,
drawn from only 60 algorithms. Generalisation to unseen algorithms is therefore the
central challenge, and expanding the corpus is prioritised over additional
repetitions.

**Compute:** at roughly 3 seconds per execution (including flashing and boot,
batched per binary), the core scope requires about 48 machine-hours. The work
parallelises across boards.

---

## 9. Tools and Technologies

*The latest stable version of each tool will be pinned at project start and
recorded in the repository.*

| Layer | Tools |
| :--- | :--- |
| Orchestration | Python, task queue, YAML experiment configuration |
| Build toolchains | ESP-IDF, Arduino CLI / Teensyduino, rustup with esp-rs, MicroPython, Espruino, Node.js, PHP CLI |
| Emulation | Espressif QEMU fork, Renode (Cortex-M where supported) |
| Containers | Docker / Podman with cgroups v2 (synthetic tier, Linux host) |
| Telemetry | `perf`, `psutil`, INA226 sensors via Raspberry Pi, CodeCarbon (desktop) |
| Analysis | pandas / Polars, SciPy (curve fitting), Matplotlib (card rendering) |
| Data management | Parquet with Git LFS or DVC; public release on Hugging Face Datasets |
| Machine learning | PyTorch, scikit-learn, LightGBM, Hugging Face Transformers |
| Application | Typer (CLI), FastAPI with a lightweight web frontend |

---

## 10. Hardware Requirements and Budget

*Approximate costs in USD. Prices fluctuated during 2025–26 and import costs to
Bangladesh vary; figures will be confirmed with local vendors.*

| Item | Qty | Approx. cost |
| :--- | :--- | :--- |
| ESP8266 (NodeMCU) | 2 | ~$8 |
| ESP32 DevKit | 2 | ~$15 |
| ESP32-S3 DevKit | 1 | ~$12 |
| Teensy 4.1 | 1 | ~$35 + import |
| Raspberry Pi Zero 2 W | 1 | ~$15 |
| Raspberry Pi 5 (4 GB) with power supply | 1 | ~$80 |
| INA226 current sensor modules | 3 | ~$10 |
| USB power meter, cables, breadboards | — | ~$25 |
| **Core scope subtotal** | | **≈ $200** |
| NVIDIA Jetson Orin Nano developer kit *(extended)* | 1 | ~$250 |

Duplicate units of the low-cost boards are included so that a hardware failure
does not halt data collection.

---

## 11. Team Structure and Work Streams

| Work stream | Responsibilities | Lead |
| :--- | :--- | :--- |
| **WS1: Benchmark Harness and Embedded Targets** | Toolchains and runtime adapters, on-device instrumentation, health-monitoring sidecar, board management | Rayian Bin Shiraz Mahi |
| **WS2: Corpus and Variant Generation** | Algorithm corpus, tier rubric, LLM self-improvement loop, test suites and validation gate | Injabin Alam |
| **WS3: Data Pipeline and Metrics** | Metric engine, complexity fitting, dataset schema and versioning, performance-card rendering | Fardin Jany Raad |
| **WS4: Predictor and Tool** | Baselines and primary model, evaluation across all splits, CLI and web interface | Jahid Hassan Sabbir |
| **Shared** | Literature review, pilot study, calibration study, thesis and paper writing | All members |

We propose bi-weekly progress meetings with our supervisors, with a short written
update shared before each meeting.

---

## 12. Project Timeline

*Phases will be aligned with the department's official FYDP schedule and
deadlines.*

| Phase | Duration | Milestones |
| :--- | :--- | :--- |
| **P1: Foundation** | ~4 months | Literature review · corpus and tier rubric finalised · harness operational on M5, Raspberry Pi 5 and ESP32 · pilot study with 5 algorithms end-to-end · proposal defence |
| **P2: Dataset** | ~4 months | All core targets operational · variant generator with validation gate · core dataset (~57,600 executions) · baselines B0 and B1 · calibration study (physical vs emulated vs synthetic) |
| **P3: Model and Tool** | ~4 months | Primary model M1 trained and evaluated on all splits · CLI and card renderer · extended-scope items as time permits · thesis and paper draft · public dataset release |

---

## 13. Risk Management

| Risk | Likelihood | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| Toolchain difficulties on microcontrollers (e.g. Rust on ESP8266, JavaScript runtimes) | High | Medium | Mark combinations unsupported early; the pipeline does not block on them |
| Measurement noise on single-board computers | Medium | Medium | Fixed governor, warm-up runs, median and coefficient of variation, thermal logging |
| Model memorises algorithms instead of generalising | High | High | Held-out-algorithm split as the primary metric; corpus expansion |
| Hardware failure or supply shortage | Medium | Medium | Duplicate boards; emulator fallback for non-timing data |
| Scope expansion across languages and targets | High | High | Committed core scope; extended items only after the P2 milestone |
| Defects in LLM-generated variants | Medium | High | Mandatory test-suite gate and differential testing |

---

## 14. Expected Deliverables and Impact

### Deliverables

1. **PerfOracle-Bench:** an open, versioned dataset of code, measurements and
   performance cards, with a datasheet.
2. **Benchmark harness:** reproducible, single-command measurement across targets.
3. **Trained predictor** with an evaluation report and baseline comparisons.
4. **PerfOracle tool:** a CLI (and, in extended scope, a web interface) that
   produces performance cards.
5. **Thesis**, and a workshop or conference paper submission if results support it.

### Expected impact

- Helps developers choose implementations, languages and hardware for constrained
  devices before deployment.
- Promotes energy-aware software engineering by making energy cost visible at
  design time.
- Provides an open dataset for future research on cross-hardware performance and
  code representation learning.

---

## 15. Mapping to Complex Engineering Problem Attributes

This project is designed to meet the complex engineering problem criteria of the
Washington Accord graduate attribute profile, as adopted by BAETE. A complex
engineering problem must satisfy P1 and some or all of P2–P7; this project
addresses all seven, and all five complex engineering activity attributes.

### 15.1 Complex Engineering Problem Attributes (P1–P7)

| Attribute | Description | How PerfOracle addresses it |
| :--- | :--- | :--- |
| **P1** Depth of knowledge required | Cannot be resolved without in-depth engineering knowledge | Requires computer architecture (instruction sets, memory hierarchy), embedded systems, compilers and interpreters, algorithm analysis, statistics, machine learning and power-measurement electronics |
| **P2** Range of conflicting requirements | Wide-ranging or conflicting technical and engineering issues | Measurement fidelity vs throughput (physical boards vs emulators); language coverage vs project time; dataset breadth vs depth; prediction accuracy vs inference speed and explainability |
| **P3** Depth of analysis required | No obvious solution; requires abstract thinking and original analysis | Exact complexity is undecidable in general, so an approximation must be designed: empirical complexity fitting, calibration across execution modes, and multi-task learning across heterogeneous hardware |
| **P4** Familiarity of issues | Involves infrequently encountered issues | Cross-instruction-set prediction from source code; runtime-specific behaviour (e.g. CPython vs MicroPython); microcontroller power profiling |
| **P5** Extent of applicable codes | Beyond the scope of established standards and codes of practice | No standard exists for cross-hardware performance prediction of arbitrary code; the project builds on, and extends, benchmarking practice such as CoreMark and MLPerf Tiny |
| **P6** Stakeholder involvement and conflicting requirements | Diverse stakeholders with differing needs | Embedded developers (accuracy, fit-on-target), researchers (open, reproducible data), educators (explainable cards), supervisors and evaluators (rigour); needs are balanced through the evaluation plan and scope tiers |
| **P7** Interdependence | High-level problem with many component sub-problems | Harness, health-monitoring sidecar, dataset, predictor and tool are tightly coupled; a measurement error propagates into every model trained on it |

### 15.2 Complex Engineering Activity Attributes (A1–A5)

| Attribute | Description | How PerfOracle addresses it |
| :--- | :--- | :--- |
| **A1** Range of resources | Diverse resources: people, money, equipment, materials, information and technologies | Four-member team with two supervisors; hardware budget; 10+ boards and current sensors; up to 8 language toolchains, emulators and ML frameworks; published literature and datasets |
| **A2** Level of interaction | Resolving significant problems arising from interactions between technical or engineering issues | Monitoring overhead affecting measurements; emulator-vs-board timing gaps; interaction between language runtimes and hardware memory limits |
| **A3** Innovation | Creative use of engineering principles and research-based knowledge | LLM self-improvement loop for controlled-quality variants; health-monitoring sidecar with power alignment; first dataset spanning microcontrollers to desktops across languages and quality tiers |
| **A4** Consequences for society and the environment | Significant consequences in a range of contexts | Energy-aware software design reduces power consumption in IoT deployments; open dataset benefits the research community; responsible, verified use of LLM-generated code |
| **A5** Familiarity | Extends beyond previous experience by applying principles-based approaches | Requires the team to apply knowledge beyond coursework: hardware power measurement, emulation, code representation learning and empirical performance modelling |

*The mapping will be adjusted to match the department's FYDP template if a
specific format is required.*

---

## 16. Points for Supervisor Guidance

We would appreciate your direction on the following:

1. Is the committed core scope (3 languages, 6 targets, 20 algorithms) appropriate
   for the FYDP timeframe?
2. Should carbon estimation be a required output, or is energy measurement
   sufficient with carbon reported as a derived figure?
3. Can the department or lab support hardware procurement, or should the team plan
   for self-funding?
4. Is GPU compute available through the department for training the primary and
   extended models?
5. Are there specific publication venues or evaluation standards you would like us
   to target?

---

## References

1. R. Pereira et al., "Energy Efficiency across Programming Languages," *Proc. ACM SIGPLAN Int. Conf. on Software Language Engineering (SLE)*, 2017.
2. S. Goldsmith, A. Aiken, D. Wilkerson, "Measuring Empirical Computational Complexity," *Proc. ESEC/FSE*, 2007.
3. J. Sikka et al., "Learning Based Methods for Code Runtime Complexity Prediction," *Proc. European Conference on Information Retrieval (ECIR)*, 2020.
4. M. Jeon et al., "CodeComplex: A Time-Complexity Dataset for Bilingual Source Codes," *arXiv preprint*, 2022.
5. C. Mendis et al., "Ithemal: Accurate, Portable and Fast Basic Block Throughput Estimation using Deep Neural Networks," *Proc. ICML*, 2019.
6. R. Puri et al., "Project CodeNet: A Large-Scale AI for Code Dataset for Learning a Diversity of Coding Tasks," *NeurIPS Datasets and Benchmarks Track*, 2021.
7. C. Banbury et al., "MLPerf Tiny Benchmark," *NeurIPS Datasets and Benchmarks Track*, 2021.
8. L. Lannelongue, J. Grealey, M. Inouye, "Green Algorithms: Quantifying the Carbon Footprint of Computation," *Advanced Science*, 2021.
9. EEMBC, "CoreMark: An EEMBC Benchmark."
10. CodeCarbon, open-source emissions tracking library.
11. Espressif Systems, QEMU fork for ESP32; Antmicro, Renode simulation framework.
