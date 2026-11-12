"""Baseline models for performance prediction.

B0 is the naive scaling heuristic from Section 3.3 of the proposal: take a
reference desktop runtime and scale it by the clock ratio and a per-language
factor. It exists to be beaten by B1 and M1, not to be accurate.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field


@dataclass(frozen=True, slots=True)
class ScalingHeuristic:
    """B0: desktop runtime x clock ratio x language factor."""

    language_factors: Mapping[str, float] = field(
        default_factory=lambda: {
            "c": 1.0,
            "rust": 1.1,
            "cpp": 1.1,
            "python": 30.0,
            "javascript": 8.0,
            "typescript": 8.0,
            "php": 25.0,
            "go": 1.5,
        }
    )

    def predict_time_ms(
        self,
        *,
        desktop_ms: float,
        desktop_clock_mhz: float,
        target_clock_mhz: float,
        language: str,
    ) -> float:
        """Predict runtime on ``target`` from a measured desktop runtime.

        Args:
            desktop_ms: Reference runtime on the desktop target.
            desktop_clock_mhz: Desktop clock in MHz; must be positive.
            target_clock_mhz: Target clock in MHz; must be positive.
            language: Language key present in ``language_factors``.

        Returns:
            Predicted runtime in milliseconds on the target.

        Raises:
            ValueError: if a clock is not positive or the language is unknown.
        """
        if desktop_clock_mhz <= 0 or target_clock_mhz <= 0:
            raise ValueError("clock frequencies must be positive")
        if desktop_ms < 0:
            raise ValueError("desktop_ms must be non-negative")
        try:
            factor = self.language_factors[language]
        except KeyError as exc:
            known = ", ".join(sorted(self.language_factors))
            raise ValueError(f"unknown language {language!r}; known: {known}") from exc

        clock_ratio = desktop_clock_mhz / target_clock_mhz
        return desktop_ms * clock_ratio * factor


__all__ = ["ScalingHeuristic"]
