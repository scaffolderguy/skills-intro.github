"""
Skill template and creation utilities for extending the skill system.

This module provides templates and utilities to make it easy to create new
skill containers that follow best practices and safety guidelines.
"""

from datetime import datetime
from typing import List, Dict, Optional
from skills_system.core.skill_schema import (
    SkillContainer, HealthDomain, MuseArchetype, BehaviorModel,
    BehaviorMapping, MicroIntervention, ScriptKit, ObservationSignals,
    SuccessMetrics
)


class SkillTemplate:
    """
    Template for creating new skills with guided prompts and validation.
    
    This class helps developers create new skill containers by providing
    structured prompts and ensuring all required components are included.
    """
    
    @staticmethod
    def create_skill_template() -> str:
        """Return the copy-paste skill template from the problem statement."""
        return """
# Skill Template - Copy and customize this template

## Basic Information
- **Skill Name**: [unique_skill_name_with_muse]
- **Health Domain**: [sleep|stress|nutrition|movement|meds_adherence]  
- **Muse Archetype**: [coach|caretaker|scientist|playmate]

## Activation Triggers
- **When to Use**: 
  - [Describe specific situations, contexts, or user states that should trigger this skill]
  - [Include time conditions, emotional states, or behavioral cues]

## Behavior Model
Choose COM-B or Fogg mapping:

### COM-B Model:
- **Capability**: [What the user needs to be able to do - skills, knowledge, physical ability]
- **Opportunity**: [Physical and social environment that enables the behavior]
- **Motivation**: [Reflective motivation (plans, beliefs) and automatic motivation (emotions, impulses)]

### Fogg B=MAP Model:
- **Behavior**: [The specific target behavior]
- **Motivation**: [Why the user would want to do this - benefits, values alignment]
- **Ability**: [How easy/hard this is - time, physical effort, mental effort, social deviance, non-routine]
- **Prompt**: [What triggers the behavior - person, context, technology]

## Micro-Intervention (The core of the skill)
- **2-Minute Starter**: [Ultra-simple version that takes ≤2 minutes and builds confidence]
- **Habit Stack**: "After [existing habit], I will [new behavior]"
- **Friction Reducer**: [Remove one obstacle that prevents the behavior]

## Script Kit (Muse Communication)
Customize these for your chosen muse archetype:

- **Empathic**: [Warm, understanding, validating message that acknowledges struggle]
- **Practical**: [Clear, action-focused message with concrete next steps]  
- **Playful**: [Fun, creative, engaging message that makes it feel like play/adventure]

## Safety Guardrails
- **Medical Boundaries**: [What medical advice this skill should NOT give]
- **Escalation Rules**: [When to refer to healthcare professionals]
- **Autonomy Preservation**: [How to ensure user choice and control]

## Observation & Measurement
- **Observation Signals**: 
  - Mood indicators: [What emotional/mood changes to watch for]
  - Adherence metrics: [What behaviors to track]
  - Resistance vectors: [Common reasons for non-compliance]
  - Recovery patterns: [How users typically restart after lapses]

## Success Metrics
- **Short-term** (daily/weekly):
  - [Quantified measures like streak days, completion rate, frequency]
- **Mid-term** (monthly):  
  - [Self-reported improvements, symptom changes, quality of life measures]

## Reflection Prompts
- "[What helped you succeed with this today?]"
- "[What got in the way or made it harder?]"
- "[What would make this easier next time?]"
- "[What did you notice about how this made you feel?]"

## Example Implementation Notes
- Keep interventions under 2 minutes for the starter
- Stack onto existing habits when possible
- Use the muse's characteristic voice and motivation style
- Always preserve user autonomy with choice-offering language
- Build in safety guardrails specific to the health domain
- Make success measurable and trackable
"""

    @staticmethod
    def create_guided_skill(
        skill_name: str,
        health_domain: HealthDomain,
        muse_archetype: MuseArchetype,
        situation_triggers: List[str],
        two_minute_starter: str,
        habit_stack: str,
        empathic_message: str,
        practical_message: str,
        playful_message: str
    ) -> SkillContainer:
        """
        Create a skill container using guided inputs with sensible defaults.
        
        This is a simplified skill creation method that fills in reasonable
        defaults while allowing customization of the key components.
        """
        
        # Generate reasonable defaults based on inputs
        behavior_mapping = BehaviorMapping(
            capability=f"Basic actions for {health_domain.value}",
            opportunity="Available in typical daily environment", 
            motivation=f"Improved {health_domain.value} and wellbeing"
        )
        
        micro_intervention = MicroIntervention(
            two_minute_starter=two_minute_starter,
            habit_stack=habit_stack,
            friction_reducer="Simplified process with minimal barriers"
        )
        
        script_kit = ScriptKit(
            empathic=empathic_message,
            practical=practical_message,
            playful=playful_message,
            muse_voice=f"{muse_archetype.value} style communication",
            safety_guardrails=[
                "No medical diagnosis or treatment advice",
                "Refer medical concerns to healthcare providers",
                "Preserve user autonomy and choice"
            ]
        )
        
        observation_signals = ObservationSignals(
            mood_indicators=["positive", "accomplished", "motivated"],
            adherence_metrics=["completion", "frequency", "consistency"],
            resistance_vectors=["time", "energy", "motivation", "forgetting"],
            recovery_patterns=["gradual restart", "habit rebuilding"]
        )
        
        success_metrics = SuccessMetrics(
            short_term={"completion_rate": 0.7, "streak_days": 3},
            mid_term={"satisfaction": 0.6, "habit_strength": 0.5},
            measurement_interval="weekly"
        )
        
        return SkillContainer(
            skill_name=skill_name,
            health_domain=health_domain,
            muse_archetype=muse_archetype,
            situation_triggers=situation_triggers,
            context_cues=[],  # Can be added later
            behavior_model=BehaviorModel.COM_B,
            behavior_mapping=behavior_mapping,
            micro_intervention=micro_intervention,
            script_kit=script_kit,
            observation_signals=observation_signals,
            success_metrics=success_metrics,
            reflection_prompts=[
                "What worked well today?",
                "What made it challenging?",
                "How did this make you feel?",
                "What would help next time?"
            ],
            safety_escalation_rules=[
                f"Refer complex {health_domain.value} issues to professionals"
            ],
            autonomy_preserving_actions=[
                "Ask before suggesting",
                "Offer choices",
                "Respect user preferences"
            ],
            created_at=datetime.now()
        )

    @staticmethod 
    def validate_skill(skill: SkillContainer) -> Dict[str, List[str]]:
        """
        Validate a skill container for completeness and safety.
        
        Returns dictionary with validation results:
        - 'errors': Critical issues that must be fixed
        - 'warnings': Issues that should be addressed  
        - 'suggestions': Optional improvements
        """
        errors = []
        warnings = []
        suggestions = []
        
        # Required field validation
        if not skill.skill_name or len(skill.skill_name) < 3:
            errors.append("Skill name must be at least 3 characters")
            
        if not skill.situation_triggers:
            errors.append("At least one situation trigger is required")
            
        if not skill.micro_intervention.two_minute_starter:
            errors.append("Two-minute starter is required")
            
        if not skill.micro_intervention.habit_stack:
            warnings.append("Habit stack helps with adherence")
            
        # Safety validation
        if not skill.safety_escalation_rules:
            warnings.append("Consider adding safety escalation rules")
            
        if "medical" not in " ".join(skill.script_kit.safety_guardrails).lower():
            warnings.append("Consider medical advice boundaries")
            
        # Autonomy validation
        autonomy_words = ["choice", "prefer", "would you", "consider", "might"]
        script_text = (skill.script_kit.empathic + skill.script_kit.practical + 
                      skill.script_kit.playful).lower()
        
        if not any(word in script_text for word in autonomy_words):
            warnings.append("Consider adding autonomy-preserving language")
            
        # Measurement validation
        if not skill.success_metrics.short_term:
            warnings.append("Short-term success metrics help track progress")
            
        # Completeness suggestions
        if len(skill.reflection_prompts) < 3:
            suggestions.append("More reflection prompts provide better insights")
            
        if not skill.time_conditions:
            suggestions.append("Time conditions can improve targeting")
            
        return {
            "errors": errors,
            "warnings": warnings, 
            "suggestions": suggestions
        }

    @staticmethod
    def get_skill_examples_by_domain() -> Dict[HealthDomain, List[str]]:
        """Get example skill ideas for each health domain."""
        return {
            HealthDomain.SLEEP: [
                "Progressive muscle relaxation before bed",
                "Blue light reduction evening routine", 
                "Bedroom temperature optimization",
                "Morning light exposure for circadian rhythm",
                "Weekend sleep schedule consistency"
            ],
            HealthDomain.STRESS: [
                "Desk breathing exercises during work",
                "5-minute nature walk stress breaks",
                "Gratitude journaling for perspective", 
                "Progressive muscle release sequences",
                "Transition rituals between activities"
            ],
            HealthDomain.MOVEMENT: [
                "Stair climbing instead of elevators",
                "Parking farther away walking habit",
                "Standing desk intervals",
                "Dancing while cooking dinner",
                "Morning stretch routine"
            ],
            HealthDomain.NUTRITION: [
                "Mindful eating pace awareness",
                "Vegetable addition to existing meals",
                "Healthy snack prep sessions",
                "Water intake timing optimization",
                "Portion size awareness techniques"
            ],
            HealthDomain.MEDICATION_ADHERENCE: [
                "Weekly pill organizer system",
                "Medication timing with meals",
                "Pharmacy refill reminder system",
                "Side effect tracking journal",
                "Healthcare provider check-in scheduling"
            ]
        }

    @staticmethod
    def get_muse_style_guide() -> Dict[MuseArchetype, Dict[str, str]]:
        """Get style guide for each muse archetype."""
        return {
            MuseArchetype.COACH: {
                "tone": "Direct, motivating, achievement-focused",
                "vocabulary": "achieve, progress, goal, challenge, strength, power, victory",
                "message_style": "Clear action steps with confidence building",
                "encouragement": "Celebrates progress and pushes for next level"
            },
            MuseArchetype.CARETAKER: {
                "tone": "Warm, nurturing, supportive, gentle",
                "vocabulary": "care, gentle, nurture, comfort, healing, kindness, love",
                "message_style": "Soft guidance with emotional validation",
                "encouragement": "Celebrates self-care and gentle progress"  
            },
            MuseArchetype.SCIENTIST: {
                "tone": "Curious, analytical, evidence-based, systematic",
                "vocabulary": "data, experiment, measure, analyze, optimize, discover, patterns",
                "message_style": "Hypothesis-driven with measurable outcomes",
                "encouragement": "Celebrates insights and systematic progress"
            },
            MuseArchetype.PLAYMATE: {
                "tone": "Fun, creative, energetic, spontaneous",
                "vocabulary": "play, fun, adventure, explore, create, joy, magic, game",
                "message_style": "Creative and engaging with playful challenges", 
                "encouragement": "Celebrates joy and creative expression"
            }
        }


# Example usage and quick skill creation functions

def create_quick_sleep_skill(habit_stack: str, muse: MuseArchetype = MuseArchetype.CARETAKER) -> SkillContainer:
    """Quick creation of a sleep skill with habit stack."""
    return SkillTemplate.create_guided_skill(
        skill_name=f"sleep_habit_{muse.value}",
        health_domain=HealthDomain.SLEEP,
        muse_archetype=muse,
        situation_triggers=["bedtime approaching", "trouble sleeping", "evening routine"],
        two_minute_starter="Dim lights and put phone in another room",
        habit_stack=habit_stack,
        empathic_message="Your body deserves this gentle preparation for rest 💤",
        practical_message="Let's create the perfect sleep environment 🌙", 
        playful_message="Time for your magical sleep transformation! ✨🛌"
    )

def create_quick_movement_skill(activity: str, muse: MuseArchetype = MuseArchetype.PLAYMATE) -> SkillContainer:
    """Quick creation of a movement skill."""
    return SkillTemplate.create_guided_skill(
        skill_name=f"movement_{activity}_{muse.value}",
        health_domain=HealthDomain.MOVEMENT,
        muse_archetype=muse,
        situation_triggers=["sedentary period", "low energy", "break needed"],
        two_minute_starter=f"Do {activity} for 2 minutes",
        habit_stack=f"After [existing habit], do {activity}",
        empathic_message=f"Your body will appreciate this gentle {activity} 💚",
        practical_message=f"Quick {activity} session - let's energize! ⚡",
        playful_message=f"Adventure time with {activity}! Let's move and groove! 🎉"
    )