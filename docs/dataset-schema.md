# Dataset schema

PerfOracle-Bench stores one row per `(variant, target, input size, repetition)`
observation. The structured record — not the rendered card — is the source of
truth. The machine-readable definition lives in
[`src/perforacle/schema.py`](../src/perforacle/schema.py); this document is the
human-readable contract.

> Values in examples are illustrative placeholders, not measurements.

## Record

```json
{
  "record_id": "fizzbuzz_py_T0_esp32_n256_rep3",
  "algorithm": "fizzbuzz",
  "category": "warmup",
  "language": "python",
  "runtime": "micropython-1.23",
  "tier": "T0",
  "code_sha256": "…64 hex characters…",
  "code_path": "benchmarks/corpus/fizzbuzz/python/T0.py",
  "target": "esp32",
  "execution_mode": "physical_board",
  "hardware": { "isa": "xtensa-lx6", "clock_mhz": 240, "ram_kb": 520, "fpu": true },
  "input_n": 256,
  "rep": 3,
  "time_us": 4210.0,
  "cycles": 1010400,
  "peak_mem_kb": 7.4,
  "energy_mj": 1.52,
  "status": "ok",
  "card_path": "cards/fizzbuzz_py_T0_esp32.png"
}
```

## Fields

| Field | Type | Unit | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `record_id` | string | — | yes | Stable identifier: `<algorithm>_<lang>_<tier>_<target>_n<n>_rep<r>` |
| `algorithm` | string | — | yes | Corpus algorithm key, e.g. `bubble_sort` |
| `category` | string | — | yes | Corpus category, e.g. `sorting`, `graph`, `warmup` |
| `language` | string | — | yes | Source language, e.g. `python`, `c`, `rust` |
| `runtime` | string | — | yes | Concrete runtime and version, e.g. `micropython-1.23` |
| `tier` | enum | — | yes | `T0` \| `T1` \| `T2` \| `T3` |
| `code_sha256` | string | — | yes | SHA-256 of the variant source file |
| `code_path` | string | — | yes | Repository-relative path to the variant |
| `target` | string | — | yes | Target id from `src/perforacle/targets.py` |
| `execution_mode` | enum | — | yes | `native` \| `physical_board` \| `emulated` \| `synthetic` |
| `hardware` | object | — | yes | Hardware descriptor, see below |
| `input_n` | integer | elements | yes | Input size for this run |
| `rep` | integer | — | yes | Repetition index, 1-based |
| `time_us` | float | µs | yes | Wall-clock (or cycle-derived) runtime |
| `cycles` | integer | count | no | CPU cycles where the target exposes a counter |
| `peak_mem_kb` | float | KB | yes | Peak RSS or heap high-water mark |
| `energy_mj` | float | mJ | no | Energy per run from the inline power sensor |
| `status` | enum | — | yes | `ok` \| `crash` \| `oom` \| `timeout` \| `unsupported` \| `invalid` |
| `card_path` | string | — | no | Repository-relative path to the rendered card |

### Hardware descriptor

| Field | Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `isa` | string | — | Instruction set, e.g. `xtensa-lx6`, `arm64` |
| `clock_mhz` | integer | MHz | Operating clock; `0` for variable-frequency targets |
| `ram_kb` | integer | KB | Usable memory ceiling |
| `cache_kb` | integer | KB | Last-level cache where meaningful (optional) |
| `fpu` | boolean | — | Hardware floating-point unit present (optional) |

## Enumerations

### Implementation quality tiers

| Tier | Definition |
| :--- | :--- |
| `T0` | **Poor** — correct but wasteful: worse complexity or pathological constant factors |
| `T1` | **Naive** — straightforward textbook version, no anti-patterns, no optimisation |
| `T2` | **Adequate** — idiomatic, reasonable complexity |
| `T3` | **Optimised** — optimal complexity, idiomatic and target-aware |

### Run status

| Status | Meaning | Counts as fits-on-target? |
| :--- | :--- | :--- |
| `ok` | Completed and validated | Yes |
| `crash` | Process or board crash | Yes (the code ran but failed) |
| `oom` | Out of memory | No |
| `timeout` | Exceeded the per-run budget | Yes |
| `unsupported` | Language × target combination not feasible | No |
| `invalid` | Throttling, brownout or background-load contamination | Excluded from aggregates; re-run |

`unsupported` is recorded explicitly rather than approximated. A sparse matrix is
a property of the design, not a data-quality defect.

## Derived metrics

These are computed from the record set and are not stored per repetition:

| Metric | Derivation |
| :--- | :--- |
| Median / p95 runtime | Across the five repetitions at a given `input_n` |
| Coefficient of variation | `std / mean` across repetitions |
| Empirical complexity class | Best-fit growth model over the input-size sweep |
| Log-log slope | Least-squares slope of `log(time)` vs `log(n)` |
| Fit R² | Goodness of fit of the selected model |
| Energy-Delay Product | `energy × time` |
| Carbon estimate | `energy (kWh) × grid intensity (gCO₂e/kWh)` |
| Throughput | `input_n / time` |
| Throughput per watt | `throughput / average power` |
| Normalised score | Ratio against the C/T3 baseline on the same target |

## Layout on disk

```text
data/
└── v0.1.0/
    ├── measurements/
    │   ├── target=esp32/language=python/part-000.parquet
    │   └── …
    ├── cards/                 # rendered PNGs (not committed)
    ├── dataset-card.md        # datasheet: provenance, protocol, caveats
    └── manifest.json          # commit SHA, toolchain pins, row counts, checksums
```

Partitioning by `target` then `language` keeps the common query — "everything for
this board" — cheap in Polars and DuckDB.

## Versioning rules

- The dataset version is `MAJOR.MINOR.PATCH`.
- **MAJOR**: a field is removed, renamed or its unit changes.
- **MINOR**: a field or target is added; existing rows remain valid.
- **PATCH**: corrections to invalid rows, with a changelog entry naming the affected
  `record_id`s.

Published data is never edited in place. Corrections ship as a new version with a
migration note.

## Validation

```bash
perforacle validate path/to/record.json
```

The command parses the record against the Pydantic schema and prints a summary or a
field-level error. Dataset writers must validate every row before writing a
partition.
