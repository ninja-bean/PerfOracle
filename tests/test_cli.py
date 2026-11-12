"""Tests for the CLI command shell."""

from __future__ import annotations

import json
from pathlib import Path

from typer.testing import CliRunner

from perforacle import __version__
from perforacle.cli import app

runner = CliRunner()


def test_version_command() -> None:
    result = runner.invoke(app, ["version"])
    assert result.exit_code == 0
    assert __version__ in result.stdout


def test_targets_command_lists_core_targets() -> None:
    result = runner.invoke(app, ["targets", "--core-only"])
    assert result.exit_code == 0
    assert "esp32" in result.stdout
    assert "jetson_orin_nano" not in result.stdout


def test_targets_command_uses_readable_memory_units() -> None:
    result = runner.invoke(app, ["targets", "--core-only"])
    assert result.exit_code == 0
    assert "520 KB" in result.stdout  # ESP32
    assert "80 KB" in result.stdout  # ESP8266
    assert "4096 MB" in result.stdout  # Raspberry Pi 5


def test_analyze_is_a_stub_with_clear_error(tmp_path: Path) -> None:
    source = tmp_path / "sample.py"
    source.write_text("print('hello')\n", encoding="utf-8")
    result = runner.invoke(app, ["analyze", str(source), "--target", "esp32"])
    assert result.exit_code == 2
    assert "not implemented yet" in result.stderr


def test_analyze_rejects_unknown_target(tmp_path: Path) -> None:
    source = tmp_path / "sample.py"
    source.write_text("print('hello')\n", encoding="utf-8")
    result = runner.invoke(app, ["analyze", str(source), "--target", "not-a-board"])
    assert result.exit_code == 2
    assert "unknown target" in result.stderr


def test_validate_accepts_a_valid_record(tmp_path: Path) -> None:
    record = {
        "record_id": "bubble_py_T1_esp32_n64_rep1",
        "algorithm": "bubble_sort",
        "category": "sorting",
        "language": "python",
        "runtime": "micropython-1.23",
        "tier": "T1",
        "code_sha256": "b" * 64,
        "code_path": "benchmarks/corpus/bubble_sort/python/T1.py",
        "target": "esp32",
        "execution_mode": "physical_board",
        "hardware": {"isa": "xtensa-lx6", "clock_mhz": 240, "ram_kb": 520},
        "input_n": 64,
        "rep": 1,
        "time_us": 120.0,
        "peak_mem_kb": 3.1,
    }
    path = tmp_path / "record.json"
    path.write_text(json.dumps(record), encoding="utf-8")

    result = runner.invoke(app, ["validate", str(path)])
    assert result.exit_code == 0
    assert "ok" in result.stdout


def test_validate_rejects_an_invalid_record(tmp_path: Path) -> None:
    path = tmp_path / "record.json"
    path.write_text(json.dumps({"record_id": "incomplete"}), encoding="utf-8")
    result = runner.invoke(app, ["validate", str(path)])
    assert result.exit_code == 1
    assert "invalid record" in result.stderr
