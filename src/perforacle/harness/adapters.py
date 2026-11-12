"""Build and runtime adapters for language/target combinations.

Each adapter knows how to build a corpus variant for one language runtime on
one target and how to execute it for a given input size. The registry keeps
adapters decoupled from the orchestration layer.
"""

from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol, runtime_checkable

from perforacle.schema import RunStatus


@dataclass(frozen=True, slots=True)
class RunResult:
    """Raw outcome of one execution, before metric post-processing."""

    status: RunStatus
    time_us: float
    peak_mem_kb: float
    cycles: int | None = None
    energy_mj: float | None = None


@runtime_checkable
class TargetAdapter(Protocol):
    """Contract implemented by every language/target adapter."""

    target_id: str
    language: str
    runtime: str

    def build(self, source: Path) -> Path:
        """Compile or package ``source`` and return the artefact path."""
        ...

    def run(self, artefact: Path, input_n: int) -> RunResult:
        """Execute ``artefact`` at input size ``input_n`` and return raw metrics."""
        ...

    def teardown(self) -> None:
        """Release board, serial port or container resources."""
        ...


class AdapterRegistry:
    """Maps ``(language, target)`` pairs to adapter factories."""

    def __init__(self) -> None:
        self._factories: dict[tuple[str, str], type[TargetAdapter]] = {}

    def register(self, adapter: type[TargetAdapter]) -> type[TargetAdapter]:
        """Register ``adapter`` and return it, so this can be used as a decorator."""
        key = (adapter.language, adapter.target_id)
        if key in self._factories:
            raise ValueError(
                f"adapter already registered for language={key[0]!r} target={key[1]!r}"
            )
        self._factories[key] = adapter
        return adapter

    def create(self, language: str, target_id: str) -> TargetAdapter:
        """Instantiate the adapter for a language/target pair."""
        try:
            factory = self._factories[(language, target_id)]
        except KeyError as exc:
            raise LookupError(
                f"no adapter registered for language={language!r} target={target_id!r}"
            ) from exc
        return factory()

    def __iter__(self) -> Iterator[tuple[str, str]]:
        return iter(sorted(self._factories))

    def __len__(self) -> int:
        return len(self._factories)


#: Process-wide adapter registry.
registry = AdapterRegistry()

__all__ = ["AdapterRegistry", "RunResult", "TargetAdapter", "registry"]
