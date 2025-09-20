"""
AI Health Coaching Skills System

A comprehensive framework for teaching AI to coach healthy behaviors through
reusable skill containers and motivational muse archetypes.

This system provides:
- Teachable skill containers for health behavior coaching
- Four muse archetypes (Coach, Caretaker, Scientist, Playmate)
- Safety-first approach with medical escalation protocols
- Measurable micro-interventions with 2-minute starters
- Intelligent dispatch based on context and resistance
- Learning and adaptation from user feedback

Quick Start:
    >>> from skills_system import health_coaching_system
    >>> 
    >>> response = health_coaching_system.coach_user(
    ...     "I'm feeling really stressed today",
    ...     time_of_day="afternoon"
    ... )
    >>> print(response.message)

Main Components:
- SkillsCoachingSystem: Main interface for AI coaching
- SkillContainer: Reusable health behavior instruction sets
- MuseArchetype: Motivational guide personalities  
- SafetyGuardrails: Medical safety and escalation protocols
- SkillDispatcher: Intelligent skill selection logic

See README.md for full documentation and examples.
"""

from skills_system.skills_coaching_system import health_coaching_system
from skills_system.core.skill_schema import (
    SkillContainer, HealthDomain, MuseArchetype, BehaviorModel,
    SkillRegistry, SkillTelemetry
)
from skills_system.core.safety_guardrails import SafetyGuardrails
from skills_system.utils.skill_template import SkillTemplate

__version__ = "1.0.0"
__author__ = "Skills System Development Team"

# Main exports
__all__ = [
    "health_coaching_system",
    "SkillContainer", 
    "HealthDomain",
    "MuseArchetype",
    "BehaviorModel",
    "SkillRegistry",
    "SkillTelemetry",
    "SafetyGuardrails",
    "SkillTemplate"
]