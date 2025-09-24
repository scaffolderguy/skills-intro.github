"""
Bellhop AI - Ambient Multi-Agent Mesh
AutoGen + Bellhop AI = Intelligent agent coordination and routing
"""

__version__ = "0.1.0"
__author__ = "Bellhop AI Team"

from .agent_scanner import generate_fingerprint, calculate_resonance, trust_score
from .clipboard_digest import ClipboardDigest
from .bellhop_router import BellhopRouter

__all__ = [
    "generate_fingerprint",
    "calculate_resonance", 
    "trust_score",
    "ClipboardDigest",
    "BellhopRouter"
]