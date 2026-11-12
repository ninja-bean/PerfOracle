"""Tests for the B0 scaling baseline."""

from __future__ import annotations

import pytest

from perforacle.predictor import ScalingHeuristic


def test_slower_clock_increases_predicted_time() -> None:
    model = ScalingHeuristic()
    predicted = model.predict_time_ms(
        desktop_ms=1.0,
        desktop_clock_mhz=3000,
        target_clock_mhz=240,
        language="c",
    )
    assert predicted == pytest.approx(12.5)


def test_language_factor_is_applied() -> None:
    model = ScalingHeuristic()
    c_time = model.predict_time_ms(
        desktop_ms=1.0, desktop_clock_mhz=3000, target_clock_mhz=3000, language="c"
    )
    python_time = model.predict_time_ms(
        desktop_ms=1.0, desktop_clock_mhz=3000, target_clock_mhz=3000, language="python"
    )
    assert python_time > c_time


def test_zero_clock_is_rejected() -> None:
    model = ScalingHeuristic()
    with pytest.raises(ValueError, match="positive"):
        model.predict_time_ms(
            desktop_ms=1.0, desktop_clock_mhz=0, target_clock_mhz=240, language="c"
        )


def test_unknown_language_is_rejected() -> None:
    model = ScalingHeuristic()
    with pytest.raises(ValueError, match="unknown language"):
        model.predict_time_ms(
            desktop_ms=1.0, desktop_clock_mhz=3000, target_clock_mhz=240, language="cobol"
        )
