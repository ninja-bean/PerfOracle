# Documentation

| Document | Purpose |
| :--- | :--- |
| [`proposal.md`](proposal.md) | FYDP proposal — the source of truth for scope, methodology and evaluation targets |
| [`architecture.md`](architecture.md) | Components, interfaces, fidelity policy and package boundaries |
| [`dataset-schema.md`](dataset-schema.md) | Record fields, units, enumerations, on-disk layout and versioning |
| [`evaluation.md`](evaluation.md) | Data splits, metrics, targets, measurement protocol and calibration study |

## Reading order

1. Start with [`../README.md`](../README.md) for the overview and quickstart.
2. Read [`proposal.md`](proposal.md) §1–§3 to understand the problem and method.
3. Read [`architecture.md`](architecture.md) before changing any code — it defines
   which package may depend on which.
4. Read [`dataset-schema.md`](dataset-schema.md) before touching measurement output.
5. Read [`evaluation.md`](evaluation.md) before claiming any result.

## Conventions used in these documents

- **Provisional** means the value will be re-baselined after the Phase A pilot
  study.
- **Core scope** is committed; **extended scope** starts only after the P2
  milestone.
- Figures marked *AI-generated mock* are illustrations, never measurements.
- Units follow the table in [`dataset-schema.md`](dataset-schema.md); times are
  stored in microseconds, memory in kilobytes, energy in millijoules.
