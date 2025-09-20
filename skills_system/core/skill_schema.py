"""
Core skill container schema and data structures for AI health behavior coaching.

This module defines the fundamental structure of skill containers that enable
AI to provide personalized health behavior coaching through motivational muses.
"""

from enum import Enum
from dataclasses import dataclass
from typing import List, Dict, Optional, Union
from datetime import datetime


class HealthDomain(Enum):
    """Health domains for skill categorization."""
    SLEEP = "sleep"
    STRESS = "stress" 
    NUTRITION = "nutrition"
    MOVEMENT = "movement"
    MEDICATION_ADHERENCE = "meds_adherence"


class MuseArchetype(Enum):
    """Motivational guide archetypes with distinct coaching styles."""
    COACH = "coach"          # Direct, encouraging, goal-focused
    CARETAKER = "caretaker"  # Nurturing, supportive, gentle
    SCIENTIST = "scientist"  # Data-driven, analytical, curious
    PLAYMATE = "playmate"    # Fun, creative, engaging


class BehaviorModel(Enum):
    """Behavior change models for intervention design."""
    COM_B = "com_b"  # Capability, Opportunity, Motivation - Behavior
    FOGG = "fogg"    # B=MAP: Behavior = Motivation + Ability + Prompt


@dataclass
class BehaviorMapping:
    """Maps behavior change components to specific interventions."""
    capability: str
    opportunity: str 
    motivation: str
    prompt_type: Optional[str] = None
    ability_level: Optional[str] = None


@dataclass
class MicroIntervention:
    """Ultra-small behavior change actions designed for easy completion."""
    two_minute_starter: str
    habit_stack: str  # "After X, do Y"
    friction_reducer: str
    
    
@dataclass
class ScriptKit:
    """Voice and tone variants for muse communication."""
    empathic: str
    practical: str
    playful: str
    muse_voice: str
    safety_guardrails: List[str]


@dataclass
class ObservationSignals:
    """Signals to monitor for skill effectiveness."""
    mood_indicators: List[str]
    adherence_metrics: List[str]
    resistance_vectors: List[str]
    recovery_patterns: List[str]


@dataclass
class SuccessMetrics:
    """Short and mid-term success indicators."""
    short_term: Dict[str, Union[int, float]]  # streak_days, completion_rate
    mid_term: Dict[str, Union[str, float]]    # symptom_report, energy_levels
    measurement_interval: str


@dataclass
class SkillContainer:
    """
    Complete skill container with all components for AI coaching.
    
    A reusable instruction set that tells the AI:
    - When to use the skill
    - How to collaborate with the user's muse
    - The exact behavior technique to apply
    - What to observe, say, and measure
    """
    skill_name: str
    health_domain: HealthDomain
    muse_archetype: MuseArchetype
    
    # Activation conditions
    situation_triggers: List[str]
    context_cues: List[str]
    
    # Behavior change framework
    behavior_model: BehaviorModel
    behavior_mapping: BehaviorMapping
    
    # Intervention components
    micro_intervention: MicroIntervention
    script_kit: ScriptKit
    
    # Monitoring and measurement
    observation_signals: ObservationSignals
    success_metrics: SuccessMetrics
    reflection_prompts: List[str]
    
    # Safety and ethics
    safety_escalation_rules: List[str]
    autonomy_preserving_actions: List[str]
    
    # Metadata
    created_at: datetime
    
    # Optional fields with defaults (must come last)
    time_conditions: Optional[List[str]] = None
    emotional_triggers: Optional[List[str]] = None
    version: str = "1.0"
    is_active: bool = True
    

@dataclass
class SkillTelemetry:
    """Telemetry data for skill performance tracking."""
    skill_name: str
    muse_archetype: MuseArchetype
    offered_at: datetime
    accepted: bool
    resistance_before: float
    resistance_after: Optional[float] = None
    resistance_delta: Optional[float] = None
    streak_days: int = 0
    last_completed_at: Optional[datetime] = None
    decline_reasons: Optional[List[str]] = None
    next_try_strategy: Optional[str] = None
    micro_win_logged: bool = False
    

class SkillRegistry:
    """Registry for managing and retrieving skill containers."""
    
    def __init__(self):
        self.skills: Dict[str, SkillContainer] = {}
        self.telemetry: List[SkillTelemetry] = []
        
    def register_skill(self, skill: SkillContainer) -> None:
        """Register a new skill container."""
        self.skills[skill.skill_name] = skill
        
    def get_skill(self, skill_name: str) -> Optional[SkillContainer]:
        """Retrieve a skill container by name."""
        return self.skills.get(skill_name)
        
    def get_skills_by_domain(self, domain: HealthDomain) -> List[SkillContainer]:
        """Get all skills for a specific health domain."""
        return [skill for skill in self.skills.values() 
                if skill.health_domain == domain]
                
    def get_skills_by_muse(self, muse: MuseArchetype) -> List[SkillContainer]:
        """Get all skills for a specific muse archetype."""
        return [skill for skill in self.skills.values()
                if skill.muse_archetype == muse]
    
    def log_telemetry(self, telemetry: SkillTelemetry) -> None:
        """Log skill usage telemetry."""
        self.telemetry.append(telemetry)
        
    def get_skill_performance(self, skill_name: str) -> Dict[str, Union[float, int]]:
        """Get performance metrics for a specific skill."""
        skill_logs = [t for t in self.telemetry if t.skill_name == skill_name]
        if not skill_logs:
            return {}
            
        total_offers = len(skill_logs)
        acceptances = sum(1 for t in skill_logs if t.accepted)
        acceptance_rate = acceptances / total_offers if total_offers > 0 else 0
        
        resistance_deltas = [t.resistance_delta for t in skill_logs 
                           if t.resistance_delta is not None]
        avg_resistance_reduction = sum(resistance_deltas) / len(resistance_deltas) if resistance_deltas else 0
        
        return {
            "total_offers": total_offers,
            "acceptance_rate": acceptance_rate,
            "avg_resistance_reduction": avg_resistance_reduction,
            "current_streak": max([t.streak_days for t in skill_logs], default=0)
        }