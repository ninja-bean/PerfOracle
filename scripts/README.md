# Operational scripts

Helpers that are too task-specific for the Python package. Anything that encodes
project policy belongs in `src/perforacle/` and must be tested; scripts here are
thin wrappers.

Planned contents:

| Script | Purpose |
| :--- | :--- |
| `flash_board.*` | Flash a built artefact to a board and verify the boot banner |
| `calibrate_power.*` | Zero and verify an INA226 channel against a known load |
| `verify_toolchains.*` | Print pinned compiler, runtime and SDK versions for the manifest |
| `render_cards.*` | Batch-render cards from a Parquet slice |

Rules:

- Scripts must be idempotent and fail loudly.
- No script may write into `data/` without a dataset version.
- Document the required hardware and privileges at the top of each file.
