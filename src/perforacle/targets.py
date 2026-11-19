"""Hardware target catalogue.

The catalogue mirrors Section 3.2.4 of the project proposal. It is the single
source of truth for target identifiers used by the harness, the dataset schema
and the predictor's hardware descriptor.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum


class TargetClass(StrEnum):
    """Coarse hardware class used for grouping and normalisation."""

    DESKTOP = "desktop"
    EDGE_AI = "edge_ai"
    SBC = "sbc"
    MOBILE = "mobile"
    MCU = "mcu"
    SYNTHETIC = "synthetic"


class ExecutionMode(StrEnum):
    """How a target is exercised. Recorded on every measurement."""

    NATIVE = "native"
    PHYSICAL_BOARD = "physical_board"
    EMULATED = "emulated"
    SYNTHETIC = "synthetic"


@dataclass(frozen=True, slots=True)
class Target:
    """A hardware target the harness can measure on."""

    id: str
    name: str
    target_class: TargetClass
    isa: str
    clock_mhz: int
    ram_kb: int
    execution_mode: ExecutionMode
    in_core_scope: bool = True


TARGETS: tuple[Target, ...] = (
    Target(
        id="m5",
        name="Apple M5 Mac",
        target_class=TargetClass.DESKTOP,
        isa="arm64",
        clock_mhz=0,  # variable-frequency; not a fixed-clock target
        ram_kb=16 * 1024 * 1024,
        execution_mode=ExecutionMode.NATIVE,
    ),
    Target(
        id="x86_64",
        name="x86-64 PC",
        target_class=TargetClass.DESKTOP,
        isa="x86-64",
        clock_mhz=0,
        ram_kb=16 * 1024 * 1024,
        execution_mode=ExecutionMode.NATIVE,
        in_core_scope=False,
    ),
    Target(
        id="jetson_orin_nano",
        name="NVIDIA Jetson Orin Nano",
        target_class=TargetClass.EDGE_AI,
        isa="arm64",
        clock_mhz=1500,
        ram_kb=8 * 1024 * 1024,
        execution_mode=ExecutionMode.PHYSICAL_BOARD,
        in_core_scope=False,
    ),
    Target(
        id="rpi5",
        name="Raspberry Pi 5",
        target_class=TargetClass.SBC,
        isa="arm64",
        clock_mhz=2400,
        ram_kb=4 * 1024 * 1024,
        execution_mode=ExecutionMode.PHYSICAL_BOARD,
    ),
    Target(
        id="rpi_zero_2w",
        name="Raspberry Pi Zero 2 W",
        target_class=TargetClass.SBC,
        isa="arm64",
        clock_mhz=1000,
        ram_kb=512 * 1024,
        execution_mode=ExecutionMode.PHYSICAL_BOARD,
    ),
    Target(
        id="teensy41",
        name="Teensy 4.1",
        target_class=TargetClass.MCU,
        isa="armv7e-m",
        clock_mhz=600,
        ram_kb=1024,
        execution_mode=ExecutionMode.PHYSICAL_BOARD,
    ),
    Target(
        id="esp32s3",
        name="ESP32-S3",
        target_class=TargetClass.MCU,
        isa="xtensa-lx7",
        clock_mhz=240,
        ram_kb=512,
        execution_mode=ExecutionMode.PHYSICAL_BOARD,
        in_core_scope=False,
    ),
    Target(
        id="esp32",
        name="ESP32 (classic)",
        target_class=TargetClass.MCU,
        isa="xtensa-lx6",
        clock_mhz=240,
        ram_kb=520,
        execution_mode=ExecutionMode.PHYSICAL_BOARD,
    ),
    Target(
        id="esp8266",
        name="ESP8266",
        target_class=TargetClass.MCU,
        isa="xtensa-l106",
        clock_mhz=160,
        ram_kb=80,
        execution_mode=ExecutionMode.PHYSICAL_BOARD,
    ),
    Target(
        id="android_termux",
        name="Mid-range Android phone (Termux)",
        target_class=TargetClass.MOBILE,
        isa="arm64",
        clock_mhz=2000,
        ram_kb=6 * 1024 * 1024,
        execution_mode=ExecutionMode.SYNTHETIC,
        in_core_scope=False,
    ),
    Target(
        id="container_cgroup",
        name="cgroups v2 constrained container",
        target_class=TargetClass.SYNTHETIC,
        isa="host",
        clock_mhz=0,
        ram_kb=0,
        execution_mode=ExecutionMode.SYNTHETIC,
        in_core_scope=False,
    ),
)

_BY_ID: dict[str, Target] = {target.id: target for target in TARGETS}


def get_target(target_id: str) -> Target:
    """Return the target with ``target_id``.

    Raises:
        KeyError: if the identifier is not in the catalogue.
    """
    try:
        return _BY_ID[target_id]
    except KeyError as exc:
        known = ", ".join(sorted(_BY_ID))
        raise KeyError(f"unknown target {target_id!r}; known targets: {known}") from exc


def core_targets() -> tuple[Target, ...]:
    """Return the targets committed to the core scope."""
    return tuple(target for target in TARGETS if target.in_core_scope)


__all__ = [
    "TARGETS",
    "ExecutionMode",
    "Target",
    "TargetClass",
    "core_targets",
    "get_target",
]
