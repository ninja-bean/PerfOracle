# Contributing to PerfOracle

Thank you for contributing. This document defines how work is proposed, reviewed
and merged. The rules are deliberately strict because every measurement in this
project becomes training data: a corrupted run propagates into every model
trained on it.

---

## 1. Ground rules

- **`main` is protected.** Direct pushes are blocked for everyone, including
  administrators. All changes arrive through a pull request.
- **One approving review is required** from a code owner — [@xrayian](https://github.com/xrayian)
  or [@ninja-bean](https://github.com/ninja-bean). See [`.github/CODEOWNERS`](.github/CODEOWNERS).
- **CI must pass.** The required status check is `CI` (lint + tests on Python
  3.11 and 3.12).
- **Conversations must be resolved** before merge.
- **Squash-merge only.** The head branch is deleted automatically.
- **No force pushes, no branch deletion** on `main`.

If you are a work-stream lead (`WS1`–`WS4`), you may review and request changes on
your area, but the branch rule still requires a code-owner approval.

---

## 2. Branching model

`main` is always releasable. Work happens on short-lived branches:

```text
<type>/<workstream>-<short-slug>
```

| Example | Meaning |
| :--- | :--- |
| `feat/ws1-esp32-adapter` | New capability, WS1 |
| `fix/ws3-complexity-fit-guard` | Bug fix, WS3 |
| `docs/proposal-typos` | Documentation only |
| `chore/ci-pin-actions` | Tooling and maintenance |

Allowed types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`,
`chore`.

Rebase on `main` before opening a PR:

```bash
git fetch origin
git rebase origin/main
```

---

## 3. Commit messages

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) are
required, because squash-merge uses the PR title as the commit subject.

```text
<type>(<scope>): <imperative summary>

[optional body — why, not what]

[optional footer — Refs #123, BREAKING CHANGE: ...]
```

Examples:

```text
feat(harness): add ESP32-S3 adapter with cycle-counter timing
fix(metrics): guard log-log fit against zero-variance inputs
docs(schema): clarify peak_mem_kb units for microcontroller targets
```

Scopes follow the package layout: `harness`, `metrics`, `predictor`, `render`,
`schema`, `targets`, `cli`, `ci`, `docs`.

Keep the subject at or below 72 characters and imperative ("add", not "added").

---

## 4. Pull request process

1. Open an issue for anything larger than a typo fix; use the issue templates.
2. Create a branch from up-to-date `main`.
3. Make the change with tests.
4. Run the local checks (below).
5. Open a PR against `main` and complete the template — including the work
   stream, type of change, and how it was tested.
6. Request review from a code owner. CI must be green.
7. Squash-merge once approved and conversations are resolved.

### Local checks

```bash
python -m pip install -e ".[dev]"
ruff check .
ruff format --check .
pytest -q
```

To auto-fix formatting: `ruff format .`

Optional pre-commit hooks:

```bash
pre-commit install
```

---

## 5. Code standards

- **Python 3.11+**, fully type-annotated public functions, `from __future__ import annotations`.
- **Ruff** for lint and formatting (line length 100). **mypy** strict for `src/`.
- Prefer small, pure functions in `metrics/` and `predictor/` so they are testable
  without hardware.
- Hardware access belongs in `harness/` behind a `TargetAdapter`. Nothing else
  may open a serial port.
- Raise specific exceptions with actionable messages; never swallow errors.
- Docstrings follow Google style. Public modules explain *why*, not only *what*.
- No new runtime dependency without a note in the PR explaining the cost.

### Tests

- Every behaviour change needs a test. Hardware-dependent tests must be marked
  `@pytest.mark.hardware`; slow tests `@pytest.mark.slow`.
- Fixtures that describe measured data must state whether they are real
  measurements or synthetic. Synthetic fixtures never become dataset rows.

---

## 6. Corpus contributions

Corpus variants live at:

```text
benchmarks/corpus/<algorithm>/<language>/<tier>.<ext>
```

Rules:

1. **Correctness first.** Every variant must pass the shared test suite for its
   algorithm and match a reference implementation's output (differential
   testing).
2. **One tier per file.** Do not branch on tier at runtime; the tier is a property
   of the file.
3. **Tier rubric is objective.** Justify the assigned tier against the rubric in
   [`docs/proposal.md`](docs/proposal.md#322-implementation-quality-tiers).
   "Feels slower" is not a tier argument.
4. **Deterministic input.** No wall-clock, RNG without a fixed seed, network or
   filesystem dependencies.
5. **No micro-optimisation beyond the tier.** A T1 variant that silently uses a
   built-in sort is a T3 variant.
6. Include a one-line header comment stating algorithm, language, tier and the
   theoretical complexity the variant is *intended* to exhibit.

### LLM-assisted variants

If a variant was generated or rewritten with an LLM, say so in the PR. The
validation gate is mandatory: static checks, differential testing, and a human
review of the diff. The rubric, not the model, decides the tier.

---

## 7. Measurement changes

Any change to the measurement protocol, instrumentation, sidecar behaviour or
metric definitions requires:

- an update to [`docs/evaluation.md`](docs/evaluation.md) or
  [`docs/dataset-schema.md`](docs/dataset-schema.md);
- a note on **dataset compatibility** — does existing data remain valid, or does
  the dataset version need to be bumped?
- for schema changes: a migration note and, where possible, a backwards-compatible
  reader.

Never edit a published dataset in place. Bump the version.

---

## 8. Data and secrets

- Do **not** commit raw sweep output, Parquet files, model checkpoints or rendered
  cards. These are build artefacts; see `.gitignore`.
- Large datasets are versioned with DVC or Git LFS and released on Hugging Face
  Datasets.
- No credentials, tokens, board serial numbers or personal data in the repository.
  Use environment variables and `.env` (git-ignored).

---

## 9. Definition of done

A PR is ready to merge when:

- [ ] The change is described and linked to an issue (where applicable).
- [ ] Tests cover the new behaviour and pass locally and in CI.
- [ ] Lint and format checks pass.
- [ ] Documentation is updated where user-visible behaviour changed.
- [ ] Dataset and schema compatibility are addressed.
- [ ] A code owner has approved, and all conversations are resolved.

---

## 10. Questions

Open a discussion or ask in the bi-weekly progress meeting. For scope questions,
refer to [`docs/proposal.md`](docs/proposal.md) first — the core scope is
committed, and extended-scope work starts only after the P2 milestone.
