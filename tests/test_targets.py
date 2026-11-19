"""Smoke tests: the package imports and the target catalogue is coherent."""

from __future__ import annotations

from perforacle import __version__
from perforacle.targets import TARGETS, ExecutionMode, core_targets, get_target


def test_version_is_a_string() -> None:
    assert isinstance(__version__, str)
    assert __version__


def test_target_ids_are_unique() -> None:
    ids = [target.id for target in TARGETS]
    assert len(ids) == len(set(ids))


def test_core_scope_matches_proposal() -> None:
    ids = {target.id for target in core_targets()}
    assert ids == {"m5", "rpi5", "rpi_zero_2w", "esp32", "esp8266", "teensy41"}


def test_get_target_returns_catalogue_entry() -> None:
    target = get_target("esp32")
    assert target.name == "ESP32 (classic)"
    assert target.execution_mode is ExecutionMode.PHYSICAL_BOARD


def test_get_target_rejects_unknown_id() -> None:
    try:
        get_target("does-not-exist")
    except KeyError as exc:
        assert "unknown target" in str(exc)
    else:  # pragma: no cover
        raise AssertionError("expected KeyError")
