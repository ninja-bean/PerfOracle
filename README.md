<div align="center">

# PerfOracle

**Learning to predict algorithm performance across programming languages and hardware — from microcontrollers to edge AI.**

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11%20%7C%203.12-blue.svg)](pyproject.toml)
[![Frontend](https://img.shields.io/badge/react-19-black.svg)](package.json)
[![Vite](https://img.shields.io/badge/vite-6-purple.svg)](package.json)
[![Status](https://img.shields.io/badge/status-active--research-green.svg)](#project-status)

Final Year Design Project · Department of Computer Science and Engineering  
United International University · Dhaka, Bangladesh · November 2026

</div>

---

## 🌟 Executive Summary

Traditional computer science evaluates algorithms using asymptotic notation ($O(n \log n)$, $O(n^2)$), which obscures critical low-level hardware effects such as cache hierarchies, branch misprediction penalties, instruction-level parallelism, dynamic vs compiled runtime overhead, and hard microcontroller memory walls.

**PerfOracle** closes this gap by combining empirical hardware telemetry with deep predictive intelligence:
1. **Site 1 (Empirical Benchmark & Dataset Studio):** Catalogs computational procedures across 6 algorithmic paradigms, executes multi-metric hardware evaluations (latency, memory pressure, instruction stability, energy), scores and classifies procedures into standardized performance tiers (Tier S through D), and exports RFC 4180 datasets.
2. **Site 2 (ML Performance Predictor Studio):** Consumes empirical measurement matrices to train supervised multi-task deep neural regressors (M1) and baseline heuristics (B0, B1). Predicts runtime latency ($\pm 8.5\%$ bound), peak SRAM consumption, asymptotic empirical scaling slope ($\alpha$), energy cost ($mJ$), and hardware OOM breaches before flashing code to physical chips (ESP8266, ESP32, Raspberry Pi Zero 2 W, Raspberry Pi 5, Apple M5).

---

## 🖥️ Interactive Web Studios

The web platform is hosted as an obsidian dark glassmorphic engineering suite:

### 1. Site 1: Empirical Benchmark Studio
- **Algorithm Registry:** Interactive catalog with Big-O boundaries, pseudocode inspection, paradigm filters, and quick-link runners.
- **Rubric Benchmarks:** Testing console with parameter sliders ($N$, input distributions, rubric weighting) and circular SVG telemetry gauge.
- **Tier Matrix:** Stratification criteria across Tier S, A, B, C, D based on latency, memory, and stability score bands.
- **Dataset & CSV Studio:** RFC 4180 export studio with dynamic search, tier filtration, column visibility toggles, raw CSV viewer, and direct download.

### 2. Site 2: ML Performance Predictor Studio
- **Predictor Overview:** System telemetry, held-out model accuracy ($89.4\%$ within $2\times$), Spearman rank correlation ($\rho = 0.91$), and hardware spectrum.
- **Inference Sandbox:** Interactive workload simulator featuring logarithmic range slider ($10^2 \to 10^6$), custom spec dropdowns, visual SRAM memory tape with 80% ceiling line, and downloadable performance prediction cards.
- **Scaling Curves & Asymptotic Analysis:** Dual-mode log-log and linear interactive regression plots ($R^2 \ge 0.985$) displaying learned empirical slope vs theoretical Big-O asymptotes.
- **Hardware Guardrails & OOM Wall:** Side-by-side memory tape validation for ESP8266 (80 KB), ESP32 (520 KB), RPi Zero 2 W (512 MB), RPi 5 (8 GB), and Apple M5 (32 GB) to identify physical memory breaches before deployment.
- **Model Leaderboard & Parity Plot:** 45-degree calibration scatter plot ($y = x$) comparing B0 Heuristic, B1 Classical ML, and M1 Deep Neural Regressors across 4 validation splits (Held-Out Algorithm, Leave-One-Target-Out, Held-Out Quality Tier, Random Split).

---

## 🛠️ Stack & Technologies

### Frontend Platform
- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS v4 (Obsidian monochrome theme `#060608`, specular highlights, zero white bloat)
- **Icons:** Lucide React
- **Deployment:** Vercel

### Python Core & ML Pipeline
- **Languages:** Python 3.11 / 3.12, C/C++ (GCC 13.2 -O3), Rust 1.78, MicroPython v1.23
- **Validation:** Pydantic schema validation for empirical measurement records
- **Analysis:** AIC model selection, log-log slope regression, $R^2$ goodness-of-fit

---

## 💻 Local Development

### Web Studio (Frontend)

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev
```
Open `http://localhost:3000` to interact with both Site 1 and Site 2.

```bash
# Build production bundle
npm run build
```

### Python Core Tooling

```bash
# Install package in editable mode
pip install -e ".[dev]"

# Inspect hardware target catalogue
perforacle targets

# Validate measurement records
perforacle validate path/to/record.json
```

---

## 📖 Citation

If you use PerfOracle in academic research:

```bibtex
@misc{perforacle2026,
  author  = {Alam, Injabin and Collaborators},
  title   = {PerfOracle: Learning to Predict Algorithm Performance Across Programming Languages and Hardware},
  year    = {2026},
  school  = {United International University},
  url     = {https://github.com/ninja-bean/PerfOracle},
  license = {Apache-2.0}
}
```

---

<div align="center">
<sub>Department of CSE · United International University · Final Year Design Project</sub>
</div>
