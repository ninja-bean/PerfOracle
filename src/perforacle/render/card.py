"""Performance-card renderer.

A card is a human-readable PNG view of a structured record. Rendering lands in
Phase C; the structured Parquet/JSON record remains the source of truth and is
what the predictor is trained on.
"""

from __future__ import annotations

from pathlib import Path

from perforacle.schema import MeasurementRecord


def render_card(record: MeasurementRecord, output: Path) -> Path:
    """Render ``record`` as a PNG performance card at ``output``.

    Args:
        record: Structured measurement (or prediction) to visualise.
        output: Destination path for the rendered PNG.

    Returns:
        The path written.

    Raises:
        NotImplementedError: until the Phase C card renderer is implemented.
    """
    raise NotImplementedError("Card rendering is scheduled for Phase C; see docs/architecture.md.")


__all__ = ["render_card"]
