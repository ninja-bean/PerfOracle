"""Tests for empirical complexity fitting."""

from __future__ import annotations

import pytest

from perforacle.metrics import fit_complexity, log_log_slope
from perforacle.schema import ComplexityClass

SIZES = [2**4, 2**5, 2**6, 2**7, 2**8, 2**9, 2**10, 2**11]


def test_linear_growth_has_slope_near_one() -> None:
    times = [3.0 * n + 12.0 for n in SIZES]
    assert log_log_slope(SIZES, times) == pytest.approx(1.0, abs=0.05)


def test_quadratic_growth_has_slope_near_two() -> None:
    times = [0.01 * n**2 for n in SIZES]
    assert log_log_slope(SIZES, times) == pytest.approx(2.0, abs=0.05)


@pytest.mark.parametrize(
    ("times", "expected"),
    [
        ([5.0 for _ in SIZES], ComplexityClass.O_1),
        ([3.0 * n for n in SIZES], ComplexityClass.O_N),
        ([0.5 * n**2 for n in SIZES], ComplexityClass.O_N2),
    ],
)
def test_fit_selects_expected_class(times: list[float], expected: ComplexityClass) -> None:
    fit = fit_complexity(SIZES, times)
    assert fit.complexity is expected
    assert fit.r2 > 0.99


def test_too_few_points_is_rejected() -> None:
    with pytest.raises(ValueError, match="at least three"):
        fit_complexity([16, 32], [1.0, 2.0])


def test_non_positive_runtime_is_rejected() -> None:
    with pytest.raises(ValueError, match="strictly positive"):
        fit_complexity([16, 32, 64], [1.0, 0.0, 3.0])
