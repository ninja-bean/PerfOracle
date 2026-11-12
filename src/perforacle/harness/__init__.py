"""Benchmark harness: orchestration, adapters and the health-monitoring sidecar.

The harness turns a corpus variant into measurements: it selects the adapter
for a language/target pair, executes the input-size sweep, and hands raw
results to the metric engine. Sidecar integration (resource, thermal, liveness
and power monitoring) lands in Phase A.
"""

from perforacle.harness.adapters import AdapterRegistry, RunResult, TargetAdapter, registry

__all__ = ["AdapterRegistry", "RunResult", "TargetAdapter", "registry"]
