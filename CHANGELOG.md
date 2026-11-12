# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Dataset versions are tracked separately from package versions; see
[`docs/dataset-schema.md`](docs/dataset-schema.md).

## [Unreleased]

### Added

- Repository scaffold: package layout, documentation set, CI, issue and PR
  templates, and the `main` branch protection policy.
- Structured measurement-record schema (`perforacle.schema`) with validation via
  `perforacle validate`.
- Hardware target catalogue (`perforacle.targets`) covering the core and extended
  target set.
- Empirical complexity fitting: AIC-style model selection over seven growth
  classes, plus log-log slope and R² (`perforacle.metrics`).
- B0 scaling heuristic baseline (`perforacle.predictor`).
- CLI shell: `version`, `targets`, `validate`, and an explicit Phase C stub for
  `analyze`.

[Unreleased]: https://github.com/ninja-bean/PerfOracle/commits/main
