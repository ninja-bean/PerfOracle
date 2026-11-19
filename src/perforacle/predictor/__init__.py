"""Performance predictor: baselines B0/B1 and the primary model M1.

The predictor maps ``(source code, language, hardware descriptor)`` to a
runtime curve, peak memory, energy, empirical complexity class and a
fits-on-target probability, each with a confidence estimate.
"""

from perforacle.predictor.baseline import ScalingHeuristic

__all__ = ["ScalingHeuristic"]
