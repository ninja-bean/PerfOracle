# Architecture

This document describes the components of PerfOracle, their responsibilities, and
the interfaces between them. The full methodology is in
[`proposal.md`](proposal.md); this file is the engineering view.

## System context

PerfOracle answers one question: **given this source code, this language runtime
and this hardware target, how will it perform?** Answering it requires three
capabilities that are built in sequence.

```text
            ┌──────────────────────────────────────────────────────┐
            │                     Phase A                          │
            │  corpus → variants → measurement → dataset           │
            └──────────────────────────────────────────────────────┘
                              │ PerfOracle-Bench (Parquet + code)
                              ▼
            ┌──────────────────────────────────────────────────────┐
            │                     Phase B                          │
            │  (code, language, hardware) → predicted metrics      │
            └──────────────────────────────────────────────────────┘
                              │ trained model
                              ▼
            ┌──────────────────────────────────────────────────────┐
            │                     Phase C                          │
            │  CLI → PNG performance card + JSON report            │
            └──────────────────────────────────────────────────────┘
```

## Phase A — dataset generation

| Component | Responsibility | Code |
| :--- | :--- | :--- |
| **Corpus** | Curated algorithms with complexity variation inside each category | `benchmarks/corpus/` |
| **Variant generator** | LLM-driven rewrite from tier *Ti* to *Ti+1*, guided by the rubric | planned: `harness/variants/` |
| **Validation gate** | Lint, static checks, unit tests and differential testing against a reference implementation | planned: `harness/validation/` |
| **Adapter layer** | One adapter per language × target: build, run, collect raw metrics, tear down | `harness/adapters.py` |
| **Health-monitoring sidecar** | Resource, thermal, liveness and power monitoring; resets and re-queues invalid runs | planned: `harness/sidecar/` |
| **Metric engine** | Statistics, complexity fitting, energy and carbon derivation | `metrics/` |
| **Dataset writer** | Schema-validated Parquet partitions, dataset cards, versioning | planned: `metrics/dataset.py` |

### Adapter contract

Every language × target combination is implemented as a `TargetAdapter`:

```python
class TargetAdapter(Protocol):
    target_id: str
    language: str
    runtime: str

    def build(self, source: Path) -> Path: ...
    def run(self, artefact: Path, input_n: int) -> RunResult: ...
    def teardown(self) -> None: ...
```

Adapters register themselves in the process-wide `registry`. Nothing outside
`harness/` may touch a serial port, a debug probe or a board power rail. This keeps
measurement policy in one place and makes the rest of the system testable on CI
without hardware.

### Fidelity policy

Each record stores an `execution_mode`:

| Mode | Meaning | Timing valid? |
| :--- | :--- | :--- |
| `native` | Runs directly on the host OS | Yes |
| `physical_board` | Runs on real hardware under measurement | Yes |
| `emulated` | Runs in QEMU or Renode | No — correctness and scale only |
| `synthetic` | Runs in a constrained container | No — flagged, interpolation only |

A calibration subset is measured in more than one mode so the deviation between
modes can be quantified and reported. Emulated or synthetic results are never
silently promoted to physical measurements.

## Phase B — predictor

The predictor consumes `(source code, language, hardware descriptor)` and emits a
multi-target prediction: runtime curve, peak memory, energy, empirical complexity
class, fits-on-target probability, each with a confidence estimate.

| Model | Description | Role |
| :--- | :--- | :--- |
| **B0** | Scaling heuristic: desktop runtime × clock ratio × language factor | Naive baseline — implemented in `predictor/baseline.py` |
| **B1** | Gradient boosting on handcrafted static features plus a hardware vector | Classical baseline |
| **M1** | Pretrained code-encoder embeddings plus hardware vector, multi-task heads | Primary model |
| **M2** | Small open-source code LLM fine-tuned with LoRA to emit structured JSON | Extended scope |

Regression targets are predicted on a logarithmic scale because runtimes span
roughly six orders of magnitude between the ESP8266 and the M5.

### Why B0 exists

B0 is intentionally wrong in an informative way: it ignores memory ceilings,
cache behaviour and interpreter overhead. Its error profile shows which of those
factors the learned models must actually capture.

## Phase C — tool

```text
perforacle analyze <file> --lang <language> --target <target>
    │
    ├── load and parse source
    ├── build hardware descriptor from `targets.py`
    ├── predictor inference (M1)
    ├── render PNG card            → render/card.py
    └── emit structured JSON       → the source of truth
```

The PNG is a human-readable view. The structured record is authoritative; all
training and evaluation use the numerical data.

## Cross-cutting concerns

| Concern | Approach |
| :--- | :--- |
| **Reproducibility** | Pinned toolchains, YAML experiment configs, dataset versioning, recorded commit SHAs |
| **Observer effect** | External sidecar for microcontrollers; dedicated core and low sampling rate on SBCs; overhead measured and reported |
| **Validity** | Runs affected by throttling, background load or brownouts are flagged and excluded or re-run |
| **Determinism** | Fixed governors and clocks, fixed seeds, controlled ambient conditions logged per run |
| **Testability** | Pure functions in `metrics/` and `predictor/`; hardware isolated behind adapters and marked `@pytest.mark.hardware` |

## Repository boundaries

| Package | May import | Must not |
| :--- | :--- | :--- |
| `schema`, `targets` | stdlib, pydantic | anything project-specific |
| `metrics` | `schema` | `harness`, `predictor`, `render` |
| `harness` | `schema`, `targets`, `metrics` | `predictor`, `render` |
| `predictor` | `schema`, `targets`, `metrics` | `harness`, `render` |
| `render` | `schema` | `harness`, `predictor` |
| `cli` | all of the above | — |

Keeping the dependency graph acyclic is what allows the predictor and renderer to
be developed against fixture data while the harness is still being built.
