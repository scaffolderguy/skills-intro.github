"""
Dispatch logic for intelligent skill selection and execution.

This module provides the brain of the skill system - deciding which skills to offer,
when to offer them, and how to adapt based on user resistance and success patterns.
"""

from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
import re
import random

from skills_system.core.skill_schema import (
    SkillContainer, SkillTelemetry, MuseArchetype, HealthDomain, SkillRegistry
)
from skills_system.core.safety_guardrails import SafetyGuardrails, SafetyResponse
from skills_system.muses.muse_archetypes import MuseArchetypeSystem
from skills_system.skills.core_skills import core_skills_registry


@dataclass
class UserContext:
    """Current user context for skill dispatch decisions."""
    current_input: str
    current_resistance: float  # 0.0 = no resistance, 1.0 = maximum resistance
    time_of_day: str  # morning, afternoon, evening, night
    recent_activities: List[str]
    emotional_state: Optional[str] = None
    energy_level: Optional[float] = None  # 0.0 = exhausted, 1.0 = energized
    preferred_muse: Optional[MuseArchetype] = None
    

@dataclass
class SkillRecommendation:
    """Skill recommendation with context and rationale."""
    skill: SkillContainer
    confidence_score: float  # 0.0 - 1.0
    trigger_reason: str
    selected_muse: MuseArchetype
    message_variant: str  # empathic, practical, or playful
    adaptation_notes: Optional[str] = None


@dataclass
class DispatchResponse:
    """Complete response from skill dispatch system."""
    safety_check: Optional[SafetyResponse]
    skill_recommendations: List[SkillRecommendation] 
    fallback_message: Optional[str] = None
    requires_escalation: bool = False


class SkillDispatcher:
    """
    Intelligent skill dispatch system.
    
    Analyzes user context, resistance patterns, and success history to select
    the most appropriate skills and muse interactions for the current situation.
    """
    
    def __init__(self, skill_registry: SkillRegistry, safety_system: SafetyGuardrails):
        self.skill_registry = skill_registry
        self.safety_system = safety_system
        self.muse_system = MuseArchetypeSystem()
        
        # User behavior patterns (would be loaded from storage in production)
        self.user_preferences: Dict[MuseArchetype, float] = {
            MuseArchetype.COACH: 0.5,
            MuseArchetype.CARETAKER: 0.5,
            MuseArchetype.SCIENTIST: 0.5,
            MuseArchetype.PLAYMATE: 0.5
        }
        
        self.success_rates: Dict[str, float] = {}  # skill_name -> success_rate
        self.recent_history: List[SkillTelemetry] = []
    
    def dispatch(self, context: UserContext) -> DispatchResponse:
        """
        Main dispatch method - analyzes context and returns skill recommendations.
        
        Args:
            context: Current user context including input and state
            
        Returns:
            DispatchResponse with safety check and skill recommendations
        """
        
        # Step 1: Safety check ALWAYS comes first
        safety_response = self.safety_system.check_safety(context.current_input)
        if safety_response and safety_response.escalation_required:
            return DispatchResponse(
                safety_check=safety_response,
                skill_recommendations=[],
                requires_escalation=True
            )
        
        # Step 2: Analyze context for skill triggers
        triggered_skills = self._find_triggered_skills(context)
        
        # Step 3: Handle high resistance with fallback strategies
        if context.current_resistance > 0.7:
            return self._handle_high_resistance(context, triggered_skills, safety_response)
        
        # Step 4: Score and rank skills
        skill_scores = self._score_skills(triggered_skills, context)
        
        # Step 5: Select top recommendations
        recommendations = self._select_recommendations(skill_scores, context)
        
        return DispatchResponse(
            safety_check=safety_response,
            skill_recommendations=recommendations,
            requires_escalation=False
        )
    
    def _find_triggered_skills(self, context: UserContext) -> List[SkillContainer]:
        """Find skills that match current context triggers."""
        triggered = []
        
        for skill in self.skill_registry.skills.values():
            if not skill.is_active:
                continue
                
            # Check situation triggers
            for trigger in skill.situation_triggers:
                if self._matches_trigger(trigger, context):
                    triggered.append(skill)
                    break
                    
            # Check time conditions
            if skill.time_conditions:
                for time_cond in skill.time_conditions:
                    if self._matches_time(time_cond, context.time_of_day):
                        triggered.append(skill)
                        break
            
            # Check emotional triggers
            if skill.emotional_triggers and context.emotional_state:
                for emotion in skill.emotional_triggers:
                    if emotion.lower() in context.emotional_state.lower():
                        triggered.append(skill)
                        break
        
        return list({skill.skill_name: skill for skill in triggered}.values())  # Remove duplicates by name
    
    def _matches_trigger(self, trigger: str, context: UserContext) -> bool:
        """Check if a trigger pattern matches the current context."""
        trigger_lower = trigger.lower()
        input_lower = context.current_input.lower()
        
        # Direct keyword matching
        if trigger_lower in input_lower:
            return True
            
        # Pattern-based matching for specific triggers
        trigger_patterns = {
            "overwhelm": ["overwhelmed", "too much", "stressed out", "can't handle"],
            "bedtime": ["tired", "sleep", "bed", "night", "bedtime"],
            "meal": ["ate", "lunch", "dinner", "finished eating", "meal"],
            "stress": ["stressed", "pressure", "deadline", "anxious", "tense"]
        }
        
        for pattern_key, patterns in trigger_patterns.items():
            if pattern_key in trigger_lower:
                return any(pattern in input_lower for pattern in patterns)
        
        return False
    
    def _matches_time(self, time_condition: str, current_time: str) -> bool:
        """Check if time condition matches current time of day."""
        time_map = {
            "morning": ["morning", "am"],
            "afternoon": ["afternoon", "lunch", "pm"],
            "evening": ["evening", "dinner", "night"],
            "bedtime": ["night", "evening", "bedtime"]
        }
        
        condition_times = time_map.get(time_condition.lower(), [time_condition.lower()])
        return any(time_part in current_time.lower() for time_part in condition_times)
    
    def _handle_high_resistance(
        self, 
        context: UserContext, 
        triggered_skills: List[SkillContainer],
        safety_response: Optional[SafetyResponse]
    ) -> DispatchResponse:
        """Handle high resistance scenarios with gentle fallback skills."""
        
        # High resistance strategy: offer "reset" skills first
        reset_skills = [
            skill for skill in triggered_skills 
            if skill.health_domain == HealthDomain.STRESS or "reset" in skill.skill_name.lower()
        ]
        
        if reset_skills:
            # Select gentlest muse and most empathic approach
            gentle_muses = [MuseArchetype.CARETAKER, MuseArchetype.PLAYMATE]
            selected_muse = max(gentle_muses, key=lambda m: self.user_preferences[m])
            
            recommendation = SkillRecommendation(
                skill=reset_skills[0],
                confidence_score=0.6,
                trigger_reason="High resistance detected - offering gentle reset",
                selected_muse=selected_muse,
                message_variant="empathic",
                adaptation_notes="Reduced pressure, emphasized choice"
            )
            
            return DispatchResponse(
                safety_check=safety_response,
                skill_recommendations=[recommendation],
                fallback_message="I notice things feel challenging right now. Would a gentle reset help?"
            )
        
        # If no reset skills, provide supportive fallback
        return DispatchResponse(
            safety_check=safety_response,
            skill_recommendations=[],
            fallback_message="It sounds like you're going through a lot right now. I'm here when you're ready for any support, no pressure at all. 💙"
        )
    
    def _score_skills(
        self, 
        triggered_skills: List[SkillContainer], 
        context: UserContext
    ) -> List[Tuple[SkillContainer, float]]:
        """Score triggered skills based on multiple factors."""
        
        scored_skills = []
        
        for skill in triggered_skills:
            score = 0.0
            
            # Base trigger match score
            score += 0.4
            
            # Historical success rate
            success_rate = self.success_rates.get(skill.skill_name, 0.5)
            score += success_rate * 0.3
            
            # Muse preference alignment
            muse_preference = self.user_preferences.get(skill.muse_archetype, 0.5)
            score += muse_preference * 0.2
            
            # Time appropriateness
            if self._is_time_appropriate(skill, context.time_of_day):
                score += 0.1
                
            # Recent usage penalty (avoid over-suggesting same skill)
            recent_uses = sum(1 for t in self.recent_history[-10:] if t.skill_name == skill.skill_name)
            if recent_uses > 2:
                score -= 0.2
            
            scored_skills.append((skill, score))
        
        # Sort by score descending
        return sorted(scored_skills, key=lambda x: x[1], reverse=True)
    
    def _is_time_appropriate(self, skill: SkillContainer, current_time: str) -> bool:
        """Check if skill is appropriate for current time."""
        if not skill.time_conditions:
            return True  # No time restrictions
            
        return any(self._matches_time(time_cond, current_time) 
                  for time_cond in skill.time_conditions)
    
    def _select_recommendations(
        self, 
        scored_skills: List[Tuple[SkillContainer, float]], 
        context: UserContext
    ) -> List[SkillRecommendation]:
        """Select final skill recommendations from scored list."""
        
        if not scored_skills:
            return []
        
        recommendations = []
        
        # Take top skill(s) based on resistance level
        max_recommendations = 1 if context.current_resistance > 0.4 else 2
        
        for skill, score in scored_skills[:max_recommendations]:
            # Select optimal muse for this skill and context
            selected_muse = self._select_muse(skill, context)
            
            # Select message variant based on context
            message_variant = self._select_message_variant(context, selected_muse)
            
            # Generate trigger reason
            trigger_reason = self._generate_trigger_reason(skill, context)
            
            recommendation = SkillRecommendation(
                skill=skill,
                confidence_score=min(score, 1.0),
                trigger_reason=trigger_reason,
                selected_muse=selected_muse,
                message_variant=message_variant
            )
            
            recommendations.append(recommendation)
        
        return recommendations
    
    def _select_muse(self, skill: SkillContainer, context: UserContext) -> MuseArchetype:
        """Select optimal muse for skill delivery."""
        
        # If user has strong preference, use it (unless resistance is high)
        if context.preferred_muse and context.current_resistance < 0.6:
            return context.preferred_muse
        
        # Use the skill's default muse unless we have reason to override
        skill_muse = skill.muse_archetype
        
        # Override based on resistance level
        if context.current_resistance > 0.6:
            # High resistance: prefer gentler muses
            gentle_muses = [MuseArchetype.CARETAKER, MuseArchetype.PLAYMATE]
            if skill_muse not in gentle_muses:
                return max(gentle_muses, key=lambda m: self.user_preferences[m])
        
        return skill_muse
    
    def _select_message_variant(self, context: UserContext, muse: MuseArchetype) -> str:
        """Select message variant (empathic, practical, playful) based on context."""
        
        # High resistance -> empathic
        if context.current_resistance > 0.6:
            return "empathic"
        
        # Low energy -> practical
        if context.energy_level and context.energy_level < 0.3:
            return "practical" 
        
        # Playmate muse -> playful (unless high resistance)
        if muse == MuseArchetype.PLAYMATE and context.current_resistance < 0.5:
            return "playful"
        
        # Default based on resistance level
        if context.current_resistance > 0.4:
            return "empathic"
        elif context.current_resistance < 0.2:
            return "practical"
        else:
            return "empathic"
    
    def _generate_trigger_reason(self, skill: SkillContainer, context: UserContext) -> str:
        """Generate human-readable reason for why this skill was suggested."""
        
        domain_reasons = {
            HealthDomain.SLEEP: "to support your sleep routine",
            HealthDomain.STRESS: "for stress relief and reset", 
            HealthDomain.MOVEMENT: "to get your body moving",
            HealthDomain.NUTRITION: "for healthy nutrition habits",
            HealthDomain.MEDICATION_ADHERENCE: "to support medication routine"
        }
        
        base_reason = domain_reasons.get(skill.health_domain, "for your wellbeing")
        
        # Add context-specific details
        if context.current_resistance > 0.5:
            return f"Suggested gently {base_reason} when you're ready"
        elif context.energy_level and context.energy_level > 0.7:
            return f"Suggested {base_reason} while you have good energy"
        else:
            return f"Suggested {base_reason} based on your current context"
    
    def log_skill_interaction(self, telemetry: SkillTelemetry) -> None:
        """Log skill interaction for learning and adaptation."""
        self.skill_registry.log_telemetry(telemetry)
        self.recent_history.append(telemetry)
        
        # Update success rates
        skill_name = telemetry.skill_name
        current_rate = self.success_rates.get(skill_name, 0.5)
        
        # Simple exponential moving average update
        learning_rate = 0.1
        new_data = 1.0 if telemetry.accepted else 0.0
        self.success_rates[skill_name] = current_rate + learning_rate * (new_data - current_rate)
        
        # Update muse preferences if skill was accepted
        if telemetry.accepted:
            muse = telemetry.muse_archetype
            current_pref = self.user_preferences[muse]
            self.user_preferences[muse] = min(1.0, current_pref + 0.05)
    
    def get_next_try_strategy(self, declined_skill: str, decline_reason: str) -> str:
        """Generate adaptive strategy for next attempt after skill decline."""
        
        reason_strategies = {
            "no_time": "smaller_step_or_different_time",
            "not_interested": "different_muse_archetype",
            "too_hard": "reduce_friction_further", 
            "not_effective": "alternative_skill_same_domain",
            "forgot": "stronger_habit_stack_prompt"
        }
        
        return reason_strategies.get(decline_reason, "try_later_with_gentler_approach")


# Global dispatcher instance
skill_dispatcher = SkillDispatcher(core_skills_registry, SafetyGuardrails())