"""
Highballer AI Team - Elite AI-powered incident response and system management.

A tactical, responsive system designed to handle high-stakes problems with precision.
Each AI agent specializes in a specific domain and can step into chaos to restore order.
"""

__version__ = "1.0.0"
__author__ = "Highballer AI Team"

from .core.team_coordinator import HighballerTeam
from .agents import (
    IncidentCommanderAI,
    CodeRefactorSpecialist,
    SecuritySentinel,
    InfraArchitectAI,
    HumanAIInterfaceStrategist
)

__all__ = [
    'HighballerTeam',
    'IncidentCommanderAI',
    'CodeRefactorSpecialist',
    'SecuritySentinel',
    'InfraArchitectAI',
    'HumanAIInterfaceStrategist'
]