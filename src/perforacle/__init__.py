"""PerfOracle — cross-hardware performance prediction for source code.

PerfOracle learns to predict the runtime, memory, empirical complexity and
energy cost of an algorithm implementation on a given language runtime and
hardware target, spanning microcontrollers, single-board computers, edge-AI
devices and desktops.
"""

from importlib.metadata import PackageNotFoundError, version

try:
    __version__ = version("perforacle")
except PackageNotFoundError:  # pragma: no cover - running from a source checkout
    __version__ = "0.1.0"

__all__ = ["__version__"]
