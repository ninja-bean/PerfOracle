# Benchmark corpus

The corpus is the input to the measurement pipeline. It is organised so that
computational complexity varies **within** each category, and so that each
algorithm is implemented at four controlled quality tiers in every supported
language.

## Layout

```text
benchmarks/corpus/
└── <algorithm>/
    ├── meta.yaml            # category, theoretical complexity, reference output
    ├── <language>/
    │   ├── T0.<ext>         # Poor
    │   ├── T1.<ext>         # Naive
    │   ├── T2.<ext>         # Adequate
    │   └── T3.<ext>         # Optimised
    └── tests/               # shared correctness suite for every language
```

Example:

```text
benchmarks/corpus/bubble_sort/
├── meta.yaml
├── python/{T0,T1,T2,T3}.py
├── c/{T0,T1,T2,T3}.c
├── rust/{T0,T1,T2,T3}.rs
└── tests/
```

## `meta.yaml`

```yaml
algorithm: bubble_sort
category: sorting
theoretical_complexity:
  best: "O(n)"
  average: "O(n^2)"
  worst: "O(n^2)"
space: "O(1)"
reference: "ascending stable sort of the input array"
input_generator: ascending_random
```

`theoretical_complexity` is the curated ground-truth label used to evaluate the
empirical fit. `reference` defines the observable contract the differential test
checks.

## Categories

| Category | Examples |
| :--- | :--- |
| Warm-up / constant-factor | FizzBuzz, prime sieve, string reversal |
| Sorting | Bubble, insertion, merge, quick, heap, counting |
| Searching | Linear, binary, interpolation, hash lookup |
| Graph | BFS, DFS, Dijkstra, A\*, Floyd–Warshall |
| Dynamic programming | Fibonacci (naive / memoised / iterative), LCS, knapsack, edit distance |
| String processing | Naive matching, KMP, Rabin–Karp |
| Mathematical / numeric | Matrix multiplication, GCD, fast exponentiation, FFT |
| Embedded-relevant | CRC32, moving-average filter, ring buffer, fixed-point arithmetic |

Core scope: 20 algorithms. Extended scope: 60 or more.

## Tier rubric

| Tier | Definition | Sorting example |
| :--- | :--- | :--- |
| **T0 Poor** | Correct but wasteful: worse complexity, pathological constant factors, anti-patterns | Bubble sort without early exit, list copied on every pass |
| **T1 Naive** | Straightforward textbook version | Insertion sort |
| **T2 Adequate** | Idiomatic, reasonable complexity | Standard merge sort |
| **T3 Optimised** | Optimal complexity, target-aware (allocation-free on MCUs, cache-friendly on desktop) | Built-in / introsort, in-place |

A variant's tier is a property of the file, decided against the rubric — never a
runtime branch.

## Validation gate

Every variant must pass, before it is queued for measurement:

1. **Lint and static checks** — style, cyclomatic complexity, and verification that
   the intended complexity change is actually present.
2. **Correctness tests** — the shared suite in `tests/`.
3. **Differential testing** — output must match the reference implementation for
   every input size in the sweep.

A variant that is faster but wrong never enters the dataset.

## Conventions

- Deterministic input only: no wall clock, no unseeded RNG, no network, no
  filesystem dependencies.
- A one-line header comment in every variant states algorithm, language, tier and
  the complexity it is intended to exhibit.
- I/O is excluded from the measured region; the harness calls the algorithm
  entry point directly.
- Microcontroller variants must respect the tightest memory budget in the target
  set (ESP8266, ~80 KB user RAM) unless the algorithm is deliberately a
  does-not-fit case.

See [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for the contribution process.
