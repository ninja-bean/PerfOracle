"""Metric engine: statistics, complexity fitting, energy and carbon.

Exports the public surface of the metrics package. Measurement ingestion and
dataset materialisation are added in Phase A.
"""

from perforacle.metrics.complexity import ComplexityFit, fit_complexity, log_log_slope

__all__ = ["ComplexityFit", "fit_complexity", "log_log_slope"]
