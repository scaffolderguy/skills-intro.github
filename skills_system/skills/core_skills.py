"""
Concrete skill implementations for the five core health domains.

This module contains production-ready skill containers based on evidence-based
behavior change techniques for sleep, stress, nutrition, movement, and medication adherence.
"""

from datetime import datetime
from skills_system.core.skill_schema import (
    SkillContainer, HealthDomain, MuseArchetype, BehaviorModel,
    BehaviorMapping, MicroIntervention, ScriptKit, ObservationSignals,
    SuccessMetrics, SkillRegistry
)


def create_sleep_winddown_skill() -> SkillContainer:
    """Sleep Wind-Down skill with Caretaker muse (from problem statement example)."""
    return SkillContainer(
        skill_name="sleep_winddown_caretaker",
        health_domain=HealthDomain.SLEEP,
        muse_archetype=MuseArchetype.CARETAKER,
        
        # Activation conditions
        situation_triggers=[
            "60-90 minutes before bedtime",
            "feeling wired before bed",
            "difficulty falling asleep",
            "bedtime routine needed"
        ],
        context_cues=[
            "evening hours",
            "after dinner",
            "screen time before bed",
            "feeling restless"
        ],
        time_conditions=["evening", "before bedtime", "8-11 PM"],
        emotional_triggers=["anxious", "wired", "overstimulated", "restless"],
        
        # Behavior change framework
        behavior_model=BehaviorModel.COM_B,
        behavior_mapping=BehaviorMapping(
            capability="Simple physical actions (stretching, phone placement)",
            opportunity="Evening time at home with access to bedroom/kitchen",
            motivation="Better sleep quality and easier falling asleep",
            prompt_type="Time-based and environmental",
            ability_level="Very high - minimal effort required"
        ),
        
        # Intervention components
        micro_intervention=MicroIntervention(
            two_minute_starter="Put phone to charge in kitchen, dim one light",
            habit_stack="After finishing dinner cleanup, put phone in kitchen and dim lights",
            friction_reducer="One-tap 'Night Mode' checklist on phone"
        ),
        
        script_kit=ScriptKit(
            empathic="Your body deserves this gentle preparation for rest 💤",
            practical="Let's create the perfect conditions for easy sleep 🌙",
            playful="Time for your cozy bedtime ritual! 🛌✨",
            muse_voice="warm, nurturing, gentle",
            safety_guardrails=[
                "No sleep medication advice",
                "Encourage professional help for chronic insomnia",
                "Validate sleep struggles without diagnosis"
            ]
        ),
        
        # Monitoring and measurement
        observation_signals=ObservationSignals(
            mood_indicators=["sleepiness", "calm", "relaxed", "peaceful"],
            adherence_metrics=["phone_in_kitchen", "lights_dimmed", "stretch_completed"],
            resistance_vectors=["too tired", "forgot", "phone needed"],
            recovery_patterns=["easier return after 1-day break", "consistency improves over time"]
        ),
        
        success_metrics=SuccessMetrics(
            short_term={"streak_days": 3, "completion_rate": 0.7},
            mid_term={"fall_asleep_easier": 2.0, "sleep_quality": 0.5},  # 2/5 improvement scale
            measurement_interval="weekly"
        ),
        
        reflection_prompts=[
            "What helped you wind down tonight?",
            "How did dimming the lights feel?",
            "What got in the way of your bedtime routine?",
            "What tiny adjustment would make this easier?"
        ],
        
        # Safety and ethics
        safety_escalation_rules=[
            "If reporting chronic insomnia (>2 weeks), suggest sleep specialist",
            "If mentioning sleep apnea symptoms, recommend medical evaluation",
            "No advice on sleep medications or supplements"
        ],
        autonomy_preserving_actions=[
            "Ask before suggesting timing",
            "Offer multiple wind-down options",
            "Respect individual bedtime preferences"
        ],
        
        created_at=datetime.now(),
        version="1.0"
    )


def create_stress_reset_skill() -> SkillContainer:
    """Stress Reset Micro-Break skill with Coach muse (from problem statement example)."""
    return SkillContainer(
        skill_name="stress_reset_micro_break",
        health_domain=HealthDomain.STRESS,
        muse_archetype=MuseArchetype.COACH,
        
        # Activation conditions
        situation_triggers=[
            "language indicating overwhelm",
            "high resistance spike detected",
            "stress level self-report >7/10",
            "tension or anxiety mentions"
        ],
        context_cues=[
            "work pressure",
            "deadline stress",
            "feeling overwhelmed",
            "need for reset"
        ],
        emotional_triggers=["overwhelmed", "stressed", "anxious", "tense", "frazzled"],
        
        # Behavior change framework
        behavior_model=BehaviorModel.FOGG,
        behavior_mapping=BehaviorMapping(
            capability="Basic breathing and movement - anyone can do",
            opportunity="Can be done anywhere, anytime in 60 seconds",
            motivation="Immediate stress relief and reset feeling",
            prompt_type="High - triggered by stress language",
            ability_level="Ultra-high - requires no equipment or special location"
        ),
        
        # Intervention components
        micro_intervention=MicroIntervention(
            two_minute_starter="60-second box breathing while standing with water sip",
            habit_stack="After noticing stress language, immediately do box breathing",
            friction_reducer="No equipment needed, works anywhere, ultra-brief"
        ),
        
        script_kit=ScriptKit(
            empathic="I can sense you're feeling the pressure - let's reset together 💪",
            practical="Quick stress circuit: breathe, stand, hydrate - 60 seconds total ⚡",
            playful="Time to hit your personal reset button! Ready? 🎯",
            muse_voice="direct, encouraging, action-focused",
            safety_guardrails=[
                "No advice for severe anxiety disorders",
                "Escalate if panic attack symptoms mentioned",
                "Validate stress without minimizing"
            ]
        ),
        
        # Monitoring and measurement
        observation_signals=ObservationSignals(
            mood_indicators=["calmer", "clearer", "reset", "relieved"],
            adherence_metrics=["completed_breathing", "stood_up", "drank_water"],
            resistance_vectors=["too busy", "not private enough", "doesn't work"],
            recovery_patterns=["effectiveness improves with practice", "builds habit quickly"]
        ),
        
        success_metrics=SuccessMetrics(
            short_term={"resistance_delta": -0.2, "completion_rate": 0.8},
            mid_term={"stress_management": 0.5, "daily_adherence": 2.0},  # 2x per day
            measurement_interval="daily"
        ),
        
        reflection_prompts=[
            "How do you feel after that reset?",
            "What did you notice in your breathing?",
            "What stress signal should we watch for?",
            "When would this micro-break help most?"
        ],
        
        # Safety and ethics
        safety_escalation_rules=[
            "If reporting panic attacks, suggest professional support",
            "If chronic stress affecting sleep/eating, recommend healthcare",
            "No diagnosis of anxiety disorders"
        ],
        autonomy_preserving_actions=[
            "Ask if now is a good time",
            "Offer alternative quick techniques",
            "Respect if user wants to skip"
        ],
        
        created_at=datetime.now(),
        version="1.0"
    )


def create_post_meal_walk_skill() -> SkillContainer:
    """Post-Meal Walk Habit Stack skill with Playmate muse (from problem statement example)."""
    return SkillContainer(
        skill_name="post_meal_walk_habit_stack",
        health_domain=HealthDomain.MOVEMENT,
        muse_archetype=MuseArchetype.PLAYMATE,
        
        # Activation conditions
        situation_triggers=[
            "after lunch logged",
            "meal completion time window",
            "post-meal sluggishness",
            "digestion support needed"
        ],
        context_cues=[
            "finished eating",
            "lunch break time",
            "afternoon energy dip",
            "sedentary period"
        ],
        time_conditions=["post-meal", "lunch break", "12-2 PM"],
        
        # Behavior change framework
        behavior_model=BehaviorModel.COM_B,
        behavior_mapping=BehaviorMapping(
            capability="Walking ability - accessible to most people",
            opportunity="Post-meal timing creates natural window",
            motivation="Better digestion, energy, mood boost",
            prompt_type="Meal completion trigger",
            ability_level="High - short duration, familiar activity"
        ),
        
        # Intervention components
        micro_intervention=MicroIntervention(
            two_minute_starter="Walk 5 minutes while your favorite playlist starts",
            habit_stack="After finishing lunch, start 5-minute walk playlist",
            friction_reducer="Auto-start 5-minute timer with playlist link on phone"
        ),
        
        script_kit=ScriptKit(
            empathic="Your body will love this gentle movement after eating! 🚶‍♀️💚",
            practical="Quick 5-minute walk = better digestion + energy boost! 🎵⚡",
            playful="Time for your post-lunch adventure soundtrack! Let's groove and move! 🎶🎉",
            muse_voice="energetic, fun, music-focused",
            safety_guardrails=[
                "No medical claims about digestion",
                "Respect physical limitations",
                "Weather and safety considerations"
            ]
        ),
        
        # Monitoring and measurement
        observation_signals=ObservationSignals(
            mood_indicators=["energized", "happy", "refreshed", "accomplished"],
            adherence_metrics=["walk_completed", "music_played", "duration_met"],
            resistance_vectors=["weather", "no time", "too full", "no motivation"],
            recovery_patterns=["easier to restart after short breaks", "momentum builds quickly"]
        ),
        
        success_metrics=SuccessMetrics(
            short_term={"weekly_adherence": 4, "completion_rate": 0.6},  # 4/7 days
            mid_term={"mood_post_walk": 0.5, "energy_levels": 0.4},
            measurement_interval="weekly"
        ),
        
        reflection_prompts=[
            "How did that walk make you feel?",
            "What music got you moving today?",
            "What made it easy or hard to walk?",
            "What's your perfect post-lunch walk like?"
        ],
        
        # Safety and ethics  
        safety_escalation_rules=[
            "Consider physical limitations and accessibility",
            "Weather and environmental safety",
            "No medical claims about post-meal benefits"
        ],
        autonomy_preserving_actions=[
            "Offer indoor/outdoor options",
            "Flexible timing within post-meal window",
            "Music preferences respected"
        ],
        
        created_at=datetime.now(),
        version="1.0"
    )


def create_hydration_scientist_skill() -> SkillContainer:
    """Hydration Tracking skill with Scientist muse for data-driven approach."""
    return SkillContainer(
        skill_name="hydration_tracking_scientist",
        health_domain=HealthDomain.NUTRITION,
        muse_archetype=MuseArchetype.SCIENTIST,
        
        # Activation conditions
        situation_triggers=[
            "low water intake patterns",
            "afternoon energy crashes",
            "headache mentions",
            "dry mouth or thirst"
        ],
        context_cues=[
            "morning routine",
            "work sessions",
            "physical activity",
            "hot weather"
        ],
        time_conditions=["hourly reminders", "with meals", "morning", "pre-exercise"],
        
        # Behavior change framework
        behavior_model=BehaviorModel.FOGG,
        behavior_mapping=BehaviorMapping(
            capability="Drinking water - universally accessible",
            opportunity="Water available throughout day",
            motivation="Energy, health, cognitive performance data",
            prompt_type="Time-based and physiological cues",
            ability_level="Ultra-high - requires only water access"
        ),
        
        # Intervention components
        micro_intervention=MicroIntervention(
            two_minute_starter="Drink one glass of water and log it",
            habit_stack="After each bathroom visit, drink water and mark it",
            friction_reducer="Water bottle always within reach, one-tap logging"
        ),
        
        script_kit=ScriptKit(
            empathic="Your cells are counting on optimal hydration for peak performance 🔬💧",
            practical="Let's collect hydration data and measure energy correlation 📊⚡",
            playful="Time for a hydration experiment! Your body is the lab! 🧪💦",
            muse_voice="curious, data-focused, experimental",
            safety_guardrails=[
                "No specific fluid recommendations for medical conditions",
                "Acknowledge individual hydration needs vary",
                "No replacement for medical advice on fluid balance"
            ]
        ),
        
        # Monitoring and measurement
        observation_signals=ObservationSignals(
            mood_indicators=["alert", "clear-headed", "energetic", "focused"],
            adherence_metrics=["glasses_logged", "timing_consistency", "daily_target_hit"],
            resistance_vectors=["forgetting", "bathroom frequency", "taste preferences"],
            recovery_patterns=["habit strengthens with visual tracking", "becomes automatic quickly"]
        ),
        
        success_metrics=SuccessMetrics(
            short_term={"daily_glasses": 6, "logging_consistency": 0.75},
            mid_term={"energy_correlation": 0.3, "headache_reduction": 0.4},
            measurement_interval="daily with weekly analysis"
        ),
        
        reflection_prompts=[
            "What patterns do you notice in your hydration data?",
            "How does your energy correlate with water intake?",
            "What environmental factors affect your drinking?",
            "What's the optimal timing for your hydration?"
        ],
        
        # Safety and ethics
        safety_escalation_rules=[
            "No specific medical recommendations for fluid restrictions",
            "If reporting extreme thirst/urination changes, suggest medical check",
            "Acknowledge medication effects on hydration needs"
        ],
        autonomy_preserving_actions=[
            "Personalized daily targets based on activity",
            "Flexible timing and methods",
            "Respect taste and temperature preferences"
        ],
        
        created_at=datetime.now(),
        version="1.0"
    )


def create_medication_reminder_skill() -> SkillContainer:
    """Medication Adherence skill with Caretaker muse for supportive approach."""
    return SkillContainer(
        skill_name="medication_adherence_caretaker",
        health_domain=HealthDomain.MEDICATION_ADHERENCE,
        muse_archetype=MuseArchetype.CARETAKER,
        
        # Activation conditions
        situation_triggers=[
            "prescribed medication schedule",
            "missed dose yesterday",
            "medication time approaching",
            "pill organizer empty"
        ],
        context_cues=[
            "morning routine",
            "meal times",
            "bedtime routine",
            "weekly pill prep"
        ],
        time_conditions=["medication schedule times", "weekly prep day"],
        
        # Behavior change framework
        behavior_model=BehaviorModel.COM_B,
        behavior_mapping=BehaviorMapping(
            capability="Taking prescribed medication as directed",
            opportunity="Medication available at scheduled times",
            motivation="Health maintenance and treatment adherence",
            prompt_type="Time-based with routine anchoring",
            ability_level="High when properly organized and reminded"
        ),
        
        # Intervention components
        micro_intervention=MicroIntervention(
            two_minute_starter="Take medication with water and check it off list",
            habit_stack="After brushing teeth (morning), take medications",
            friction_reducer="Pill organizer by toothbrush with water glass ready"
        ),
        
        script_kit=ScriptKit(
            empathic="Taking care of your health is such an important act of self-love 💝💊",
            practical="Let's make medication taking feel automatic and effortless 🗓️✅",
            playful="Time for your daily health maintenance routine! You've got this! 💪🌟",
            muse_voice="supportive, non-judgmental, health-focused",
            safety_guardrails=[
                "NO medication dosage advice",
                "NO medication substitution suggestions", 
                "ALWAYS refer medication questions to healthcare provider",
                "NO advice on stopping or changing medications"
            ]
        ),
        
        # Monitoring and measurement
        observation_signals=ObservationSignals(
            mood_indicators=["responsible", "cared-for", "healthy", "consistent"],
            adherence_metrics=["doses_taken", "timing_accuracy", "weekly_prep_completed"],
            resistance_vectors=["forgetting", "side effects", "complex schedule"],
            recovery_patterns=["easier to restart with system reset", "habit rebuilds quickly"]
        ),
        
        success_metrics=SuccessMetrics(
            short_term={"weekly_adherence": 0.9, "missed_doses": 1},  # Max 1 missed per week
            mid_term={"medication_routine_strength": 0.8, "confidence_level": 0.6},
            measurement_interval="daily tracking with weekly review"
        ),
        
        reflection_prompts=[
            "What's working well with your medication routine?",
            "What makes it easier to remember?",
            "Any questions to discuss with your healthcare provider?",
            "How can we make this routine feel smoother?"
        ],
        
        # Safety and ethics - CRITICAL for medication skills
        safety_escalation_rules=[
            "ANY medication questions -> refer to healthcare provider",
            "Side effects mentioned -> encourage provider contact",
            "Missed multiple doses -> suggest provider consultation",
            "Medication changes -> ONLY healthcare provider decides",
            "Drug interactions -> immediate provider referral"
        ],
        autonomy_preserving_actions=[
            "Support adherence to prescribed regimen only",
            "Encourage provider communication for all medication concerns",
            "Respect individual routine preferences within safe bounds"
        ],
        
        created_at=datetime.now(),
        version="1.0"
    )


def initialize_core_skills() -> SkillRegistry:
    """Initialize and register all core skills in the registry."""
    registry = SkillRegistry()
    
    # Register all five core skills
    registry.register_skill(create_sleep_winddown_skill())
    registry.register_skill(create_stress_reset_skill())
    registry.register_skill(create_post_meal_walk_skill())
    registry.register_skill(create_hydration_scientist_skill())
    registry.register_skill(create_medication_reminder_skill())
    
    return registry


# Global registry instance with all core skills
core_skills_registry = initialize_core_skills()