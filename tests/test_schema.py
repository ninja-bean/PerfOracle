"""Tests for the structured dataset schema."""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from perforacle.schema import HardwareDescriptor, MeasurementRecord, RunStatus, Tier

VALID_RECORD = {
    "record_id": "fizzbuzz_py_T0_esp32_n256_rep3",
    "algorithm": "fizzbuzz",
    "category": "warmup",
    "language": "python",
    "runtime": "micropython-1.23",
    "tier": "T0",
    "code_sha256": "a" * 64,
    "code_path": "benchmarks/corpus/fizzbuzz/python/T0.py",
    "target": "esp32",
    "execution_mode": "physical_board",
    "hardware": {"isa": "xtensa-lx6", "clock_mhz": 240, "ram_kb": 520, "fpu": True},
    "input_n": 256,
    "rep": 3,
    "time_us": 4210.0,
    "cycles": 1_010_400,
    "peak_mem_kb": 7.4,
    "energy_mj": 1.52,
    "status": "ok",
    "card_path": "cards/fizzbuzz_py_T0_esp32.png",
}


def test_valid_record_parses() -> None:
    record = MeasurementRecord.model_validate(VALID_RECORD)
    assert record.tier is Tier.T0
    assert record.status is RunStatus.OK
    assert record.fits_on_target is True


def test_sha256_must_be_hexadecimal() -> None:
    payload = {**VALID_RECORD, "code_sha256": "z" * 64}
    with pytest.raises(ValidationError):
        MeasurementRecord.model_validate(payload)


def test_negative_time_is_rejected() -> None:
    payload = {**VALID_RECORD, "time_us": -1.0}
    with pytest.raises(ValidationError):
        MeasurementRecord.model_validate(payload)


def test_oom_does_not_fit_on_target() -> None:
    record = MeasurementRecord.model_validate({**VALID_RECORD, "status": "oom"})
    assert record.fits_on_target is False


def test_hardware_descriptor_is_frozen() -> None:
    hardware = HardwareDescriptor(isa="arm64", clock_mhz=2400, ram_kb=4_194_304)
    with pytest.raises(ValidationError):
        hardware.clock_mhz = 1000  # type: ignore[misc]
