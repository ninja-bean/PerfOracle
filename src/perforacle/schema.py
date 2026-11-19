"""Dataset record schema.

The structured record — not the rendered PNG card — is the source of truth.
Field names and units follow Section 3.2.10 and 3.2.7 of the project proposal.
"""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, Field, field_validator

from perforacle.targets import ExecutionMode


class Tier(StrEnum):
    """Implementation-quality tier, defined by the rubric in Section 3.2.2."""

    T0 = "T0"  # Poor: correct but wasteful
    T1 = "T1"  # Naive: straightforward textbook implementation
    T2 = "T2"  # Adequate: idiomatic, reasonable complexity
    T3 = "T3"  # Optimised: optimal and target-aware


class RunStatus(StrEnum):
    """Outcome of a single execution. Failures are valid outcome labels."""

    OK = "ok"
    CRASH = "crash"
    OOM = "oom"
    TIMEOUT = "timeout"
    UNSUPPORTED = "unsupported"
    INVALID = "invalid"  # e.g. thermal throttling or brownout


class ComplexityClass(StrEnum):
    """Empirical complexity classes considered by the fitting procedure."""

    O_1 = "O(1)"
    O_LOG_N = "O(log n)"
    O_N = "O(n)"
    O_N_LOG_N = "O(n log n)"
    O_N2 = "O(n^2)"
    O_N3 = "O(n^3)"
    O_2N = "O(2^n)"
    UNKNOWN = "unknown"


class HardwareDescriptor(BaseModel):
    """Minimal hardware vector consumed by the predictor."""

    model_config = {"frozen": True}

    isa: str
    clock_mhz: int = Field(ge=0)
    ram_kb: int = Field(ge=0)
    cache_kb: int | None = Field(default=None, ge=0)
    fpu: bool | None = None


class MeasurementRecord(BaseModel):
    """One measured (code, target, input size, repetition) observation."""

    model_config = {"frozen": True}

    record_id: str = Field(min_length=1)
    algorithm: str = Field(min_length=1)
    category: str = Field(min_length=1)
    language: str = Field(min_length=1)
    runtime: str = Field(min_length=1)
    tier: Tier
    code_sha256: str
    code_path: str
    target: str = Field(min_length=1)
    execution_mode: ExecutionMode
    hardware: HardwareDescriptor
    input_n: int = Field(ge=0)
    rep: int = Field(ge=1)
    time_us: float = Field(ge=0)
    cycles: int | None = Field(default=None, ge=0)
    peak_mem_kb: float = Field(ge=0)
    energy_mj: float | None = Field(default=None, ge=0)
    status: RunStatus = RunStatus.OK
    card_path: str | None = None

    @field_validator("code_sha256")
    @classmethod
    def _sha256_hex(cls, value: str) -> str:
        if len(value) != 64 or any(c not in "0123456789abcdef" for c in value.lower()):
            raise ValueError("code_sha256 must be a 64-character hexadecimal digest")
        return value.lower()

    @property
    def fits_on_target(self) -> bool:
        """Whether the run completed without exhausting memory on the target."""
        return self.status not in {RunStatus.OOM, RunStatus.UNSUPPORTED}


__all__ = [
    "ComplexityClass",
    "HardwareDescriptor",
    "MeasurementRecord",
    "RunStatus",
    "Tier",
]
