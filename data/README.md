# Data directory

This directory holds generated datasets and is **not** a place for committed
files. Only this README is tracked.

Expected local layout after a measurement run:

```text
data/
└── <dataset-version>/
    ├── measurements/target=<id>/language=<lang>/*.parquet
    ├── cards/*.png
    ├── dataset-card.md
    └── manifest.json
```

Rules:

- Raw sweep output, Parquet partitions, rendered cards and model checkpoints are
  build artefacts. They are git-ignored.
- Published datasets are versioned (`MAJOR.MINOR.PATCH`) and released through DVC,
  Git LFS or Hugging Face Datasets — never committed directly to `main`.
- Every dataset version ships a `manifest.json` recording the commit SHA, pinned
  toolchain versions, row counts and checksums.
