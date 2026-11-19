"""Empirical complexity fitting.

Implements the procedure described in Section 3.2.8 of the proposal: fit
candidate growth models to the median runtime at each input size, select the
best model with a complexity penalty, and report the log-log slope as a
continuous measure of growth.
"""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
from math import log

import numpy as np

from perforacle.schema import ComplexityClass

#: Candidate growth models expressed on the log scale, ``log g(n)``.
_CANDIDATES: tuple[tuple[ComplexityClass, str], ...] = (
    (ComplexityClass.O_1, "1"),
    (ComplexityClass.O_LOG_N, "log n"),
    (ComplexityClass.O_N, "n"),
    (ComplexityClass.O_N_LOG_N, "n log n"),
    (ComplexityClass.O_N2, "n^2"),
    (ComplexityClass.O_N3, "n^3"),
    (ComplexityClass.O_2N, "2^n"),
)


@dataclass(frozen=True, slots=True)
class ComplexityFit:
    """Result of fitting runtime against input size."""

    complexity: ComplexityClass
    slope: float
    r2: float

    def __str__(self) -> str:
        return f"{self.complexity} (slope={self.slope:.2f}, R²={self.r2:.3f})"


def _validate(sizes: Sequence[float], times: Sequence[float]) -> tuple[np.ndarray, np.ndarray]:
    if len(sizes) != len(times):
        raise ValueError("sizes and times must have the same length")
    if len(sizes) < 3:
        raise ValueError("at least three input sizes are required to fit a growth model")

    n = np.asarray(sizes, dtype=float)
    t = np.asarray(times, dtype=float)
    if np.any(n <= 1.0):
        raise ValueError("input sizes must be greater than 1 for log-log fitting")
    if np.any(t <= 0.0):
        raise ValueError("runtimes must be strictly positive")
    return n, t


def _log_model(complexity: ComplexityClass, n: np.ndarray) -> np.ndarray:
    """Return ``log g(n)`` for a candidate complexity class."""
    match complexity:
        case ComplexityClass.O_1:
            return np.zeros_like(n)
        case ComplexityClass.O_LOG_N:
            return np.log(np.log(n))
        case ComplexityClass.O_N:
            return np.log(n)
        case ComplexityClass.O_N_LOG_N:
            return np.log(n) + np.log(np.log(n))
        case ComplexityClass.O_N2:
            return 2.0 * np.log(n)
        case ComplexityClass.O_N3:
            return 3.0 * np.log(n)
        case ComplexityClass.O_2N:
            return n * log(2.0)
        case _:  # pragma: no cover - defensive
            raise ValueError(f"unsupported complexity class: {complexity}")


def log_log_slope(sizes: Sequence[float], times: Sequence[float]) -> float:
    """Return the least-squares slope of ``log(time)`` against ``log(n)``.

    A slope of roughly 1 indicates linear growth, roughly 2 quadratic growth.
    """
    n, t = _validate(sizes, times)
    slope, _intercept = np.polyfit(np.log(n), np.log(t), 1)
    return float(slope)


def fit_complexity(sizes: Sequence[float], times: Sequence[float]) -> ComplexityFit:
    """Select the best-fitting growth model with an Akaike-style penalty.

    The fit is performed in log space so that runtimes spanning several orders
    of magnitude are weighted comparably. Only the constant factor is fitted
    (``log t = a + log g(n)``): if the exponent were left free, every power-law
    candidate would collapse onto the same straight line and ``O(n)`` could
    never be distinguished from ``O(n^2)``.

    Args:
        sizes: Input sizes, strictly greater than 1.
        times: Median runtime per input size, strictly positive.

    Returns:
        The selected complexity class, the log-log slope, and the R² of the fit.
    """
    n, t = _validate(sizes, times)
    log_t = np.log(t)
    variance = float(np.sum((log_t - log_t.mean()) ** 2))

    best: tuple[float, ComplexityClass, float] | None = None
    for complexity, _label in _CANDIDATES:
        log_g = _log_model(complexity, n)
        if not np.all(np.isfinite(log_g)):
            continue

        # Least-squares intercept for a fixed shape: a = mean(log t - log g).
        intercept = float(np.mean(log_t - log_g))
        residuals = log_t - (intercept + log_g)
        sse = float(np.sum(residuals**2))
        if sse <= 0.0:
            sse = 1e-12

        # AIC with k = 1 free parameter (the constant factor); lower is better.
        aic = len(n) * log(sse / len(n)) + 2 * 1
        # R² is undefined for zero-variance data; a perfect fit scores 1.0.
        r2 = 1.0 if variance <= 1e-12 else 1.0 - sse / variance

        if best is None or aic < best[0]:
            best = (aic, complexity, r2)

    if best is None:  # pragma: no cover - defensive
        raise RuntimeError("no candidate growth model could be fitted")

    _, complexity, r2 = best
    return ComplexityFit(
        complexity=complexity,
        slope=log_log_slope(sizes, times),
        r2=max(0.0, min(1.0, r2)),
    )


__all__ = ["ComplexityFit", "fit_complexity", "log_log_slope"]
