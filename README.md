# PerfOracle — Empirical Benchmark Studio

> **Final Year Design Project (FYDP) — Site 1: Empirical Algorithmic Benchmarking & Dataset Studio**  
> Bridging theoretical asymptotic computational boundaries with real-world hardware telemetry to construct training matrices for predictive machine learning models.

---

## 🌟 Executive Summary

Traditional computer science evaluates algorithms using asymptotic notation ($O(n \log n)$, $O(n^2)$), which obscures critical low-level hardware effects such as cache hierarchies, branch misprediction penalties, instruction-level parallelism, and memory allocation pressure.

**PerfOracle Site 1** serves as the empirical evaluation engine. It:
1. Catalogs computational procedures across multiple paradigms (Sorting, Graph Theory, Dynamic Programming, Linear Algebra, Signal Processing, Cryptography).
2. Executes rubric-based hardware simulations measuring latency, memory footprint, CPU utilization, scalability, and execution stability.
3. Classifies algorithms into standardized performance tiers (Tier S through Tier D).
4. Compiles normalized datasets formatted to RFC 4180 CSV specifications for **Phase 2 (Site 2: Supervised Machine Learning Regressors & Classifiers)**.

---

## 🚀 Key Modules & Capabilities

- **Platform Overview:** High-level system health telemetry, algorithmic domain breakdown, rubric score trend sparklines, and quick benchmark action shortcuts.
- **Algorithm Registry:** Interactive catalog with Big-O theoretical boundaries, code/pseudocode inspection, category filtering, and instant benchmark linking.
- **Tier Matrix:** Multi-tier threshold configuration (Tier S, A, B, C, D) stratifying algorithms into discrete empirical performance bands with customizable score, latency, and memory criteria.
- **Rubric Benchmarks:** Testing console with interactive parameter sliders (input size $N$, workload distributions, weight configurations) and live circular SVG telemetry scoring gauge.
- **Dataset & CSV Studio:** RFC 4180 compliant export studio with search, tier filtration, column visibility toggles, raw CSV inspection, and instant file download.
- **Dual Visual Theme:** High-craft Dark & Light themes with glassmorphism, monochrome aesthetic, and local persistence.
- **Site 2 ML Blueprint:** Interactive preview of the machine learning inference engine that consumes Site 1 datasets to predict runtime metrics on unseen workloads.

---

## 🛠️ Stack & Technologies

- **Frontend Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 6](https://vite.dev/)
- **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/) with custom glassmorphic monochrome design tokens
- **Iconography:** [Lucide React](https://lucide.dev/)
- **Deployment Platform:** [Vercel](https://vercel.com/)

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ / 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FYDP

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Production Build

```bash
# Create optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
├── public/                 # Static assets & icons
│   ├── perforacle_icon_square.png
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── algorithms/     # Algorithm registry, modals & pseudocode
│   │   ├── common/         # Sidebar, Header, GlassCard, Badge, Modal
│   │   ├── dashboard/      # Overview hero, sparkline & stat counters
│   │   ├── dataset/        # RFC 4180 dataset table & CSV raw modal
│   │   ├── ml/             # Phase 2 predictive ML preview modal
│   │   ├── rubrics/        # Multi-metric rubric benchmark runner
│   │   ├── tiers/          # Tier Matrix threshold configuration
│   │   └── tutorial/       # Interactive visual onboarding tour
│   ├── data/
│   │   └── dummyData.js    # Calibrated baseline telemetry & algorithms
│   ├── App.jsx             # Root layout & theme management
│   ├── index.css           # Design tokens, keyframes & theme overrides
│   └── main.jsx            # React root mount
├── vercel.json             # Vercel deployment & routing configuration
└── vite.config.js          # Vite build pipeline & server configuration
```

---

## 📄 License

Academic / Final Year Design Project — All rights reserved.
