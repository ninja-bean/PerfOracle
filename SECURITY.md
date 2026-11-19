# Security Policy

## Supported versions

PerfOracle is pre-alpha research software. Only the `main` branch receives
security fixes.

| Version | Supported |
| :--- | :--- |
| `main` (pre-alpha) | :white_check_mark: |
| Tagged releases | Not yet published |

## Reporting a vulnerability

**Do not open a public issue, discussion or pull request for a security problem.**

Report privately using GitHub's [private vulnerability reporting](https://github.com/ninja-bean/PerfOracle/security/advisories/new).
If that is unavailable, contact a repository owner directly:

- [@ninja-bean](https://github.com/ninja-bean) — Injabin Alam
- [@xrayian](https://github.com/xrayian) — Rayian Bin Shiraz Mahi

Please include:

- a description of the issue and its impact;
- the affected component (harness, metrics, predictor, renderer, CLI, CI);
- reproduction steps or a proof of concept;
- the commit SHA or branch you tested;
- any suggested mitigation.

### What to expect

| Stage | Target |
| :--- | :--- |
| Acknowledgement | within 5 working days |
| Initial assessment | within 10 working days |
| Fix or mitigation plan | discussed with you before disclosure |

We will credit reporters in the advisory unless you ask to remain anonymous. We
ask that you give us a reasonable window to ship a fix before public disclosure.

## Scope

In scope:

- Arbitrary code execution or sandbox escape in the harness or adapters;
- Path traversal or unsafe deserialisation in dataset and record handling;
- Credential or token leakage through CI, logs or committed configuration;
- Dependency vulnerabilities reachable from the CLI;
- Supply-chain risks in the build and release process.

Out of scope:

- Vulnerabilities in third-party toolchains, board support packages or vendor
  SDKs — report those upstream (we will still track them);
- Physical attacks on benchmark hardware;
- Denial of service caused by intentionally pathological benchmark code, which is
  an expected property of the corpus;
- Results from a deliberately modified local checkout.

## Safe harbour

Good-faith research that respects this policy, avoids privacy violations and data
destruction, and does not degrade the availability of project infrastructure will
not be pursued legally by the maintainers.
