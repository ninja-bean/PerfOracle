"""Command-line interface for PerfOracle.

Phase C target surface::

    perforacle analyze file.py --lang python --target esp32

This module currently provides the stable command shell — ``version``,
``targets`` and ``validate`` — plus a clearly-failing ``analyze`` stub so the
CLI contract is reviewable before the predictor exists.
"""

from __future__ import annotations

from pathlib import Path
from typing import Annotated

import typer
from pydantic import ValidationError

from perforacle import __version__
from perforacle.schema import MeasurementRecord
from perforacle.targets import TARGETS, get_target

app = typer.Typer(
    name="perforacle",
    help="Predict algorithm performance across languages and hardware targets.",
    add_completion=False,
    no_args_is_help=True,
    rich_markup_mode="rich",
)


def _format_ram(ram_kb: int) -> str:
    """Format a memory ceiling in the largest unit that keeps it readable."""
    if ram_kb <= 0:
        return "n/a"
    if ram_kb >= 1024:
        return f"{ram_kb / 1024:.0f} MB"
    return f"{ram_kb} KB"


@app.command()
def version() -> None:
    """Print the installed PerfOracle version."""
    typer.echo(f"perforacle {__version__}")


@app.command()
def targets(
    core_only: Annotated[
        bool,
        typer.Option("--core-only", help="Show only targets committed to the core scope."),
    ] = False,
) -> None:
    """List the hardware targets known to the harness."""
    rows = [target for target in TARGETS if target.in_core_scope or not core_only]
    header = f"{'id':<18} {'class':<10} {'mode':<15} {'clock':>7} {'ram':>10}  name"
    typer.echo(header)
    typer.echo("-" * len(header))
    for target in rows:
        clock = f"{target.clock_mhz} MHz" if target.clock_mhz else "variable"
        typer.echo(
            f"{target.id:<18} {target.target_class.value:<10} "
            f"{target.execution_mode.value:<15} {clock:>7} {_format_ram(target.ram_kb):>10}  "
            f"{target.name}"
        )


@app.command()
def validate(
    record: Annotated[
        Path,
        typer.Argument(
            help="Path to a JSON measurement record.",
            exists=True,
            dir_okay=False,
            readable=True,
            resolve_path=True,
        ),
    ],
) -> None:
    """Validate a structured measurement record against the dataset schema."""
    try:
        parsed = MeasurementRecord.model_validate_json(record.read_text(encoding="utf-8"))
    except ValidationError as exc:
        typer.echo(f"invalid record: {record}", err=True)
        typer.echo(str(exc), err=True)
        raise typer.Exit(code=1) from exc

    typer.echo(
        f"ok  {parsed.record_id}  "
        f"({parsed.algorithm}, {parsed.language}/{parsed.runtime}, {parsed.tier}, "
        f"{parsed.target}, n={parsed.input_n})"
    )


@app.command()
def analyze(
    source: Annotated[
        Path,
        typer.Argument(
            help="Source file to analyse.",
            exists=True,
            dir_okay=False,
            readable=True,
            resolve_path=True,
        ),
    ],
    language: Annotated[str, typer.Option("--lang", help="Implementation language.")] = "python",
    target: Annotated[str, typer.Option("--target", help="Hardware target id.")] = "esp32",
    output: Annotated[
        Path | None,
        typer.Option("--output", "-o", help="Destination PNG card path."),
    ] = None,
) -> None:
    """Predict performance for SOURCE on TARGET and emit a card plus JSON report."""
    try:
        get_target(target)
    except KeyError as exc:
        typer.echo(str(exc), err=True)
        raise typer.Exit(code=2) from exc

    typer.echo(
        "perforacle analyze is not implemented yet (Phase C). "
        f"Received source={source.name!r} language={language!r} target={target!r} "
        f"output={output or '<auto>'}.",
        err=True,
    )
    raise typer.Exit(code=2)


if __name__ == "__main__":  # pragma: no cover
    app()
