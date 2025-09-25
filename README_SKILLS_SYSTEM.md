# AI Health Coaching Skills System

A comprehensive framework for teaching AI to coach healthy behaviors through reusable skill containers and motivational muse archetypes.

## Overview

This system transforms the problem of AI health coaching from vague advice-giving into a structured, teachable framework. It provides reusable "skill containers" that tell AI exactly:
- When to use specific health interventions
- How to collaborate with user's motivational muse
- What behavior techniques to apply
- How to measure progress and adapt

## Key Features

### 🎯 **Skill Containers**
- Reusable instruction sets for health behavior coaching
- 5 core health domains: Sleep, Stress, Nutrition, Movement, Medication Adherence
- Evidence-based micro-interventions with 2-minute starters
- Built-in habit stacking and friction reduction

### 🎭 **Four Muse Archetypes**
- **Coach**: Direct, encouraging, goal-focused ("Let's crush this!")
- **Caretaker**: Nurturing, supportive, gentle ("Your body deserves this care")
- **Scientist**: Data-driven, analytical, curious ("Let's experiment and measure")
- **Playmate**: Fun, creative, engaging ("Time to make this into a game!")

### 🛡️ **Safety-First Design**
- Comprehensive safety guardrails with medical escalation protocols
- Never provides medical diagnosis or treatment advice
- Automatic detection of emergency keywords with appropriate responses
- Preserves user autonomy with choice-offering language

### 📊 **Intelligent Dispatch**
- Context-aware skill selection based on user input and resistance
- Adaptive muse selection based on success patterns
- Learning system that improves from user feedback
- Resistance-sensitive approach (high resistance → gentler muses)

### 🔬 **Measurable & Adaptive**
- Telemetry logging for skill performance tracking  
- Success metrics: short-term (streaks, completion) and mid-term (symptom improvement)
- Bandit-style learning from user acceptance/rejection patterns
- Micro-win celebration system for motivation

## Quick Start

```python
from skills_system import health_coaching_system

# Basic coaching interaction
response = health_coaching_system.coach_user(
    "I'm feeling really stressed today",
    time_of_day="afternoon",
    energy_level=0.3
)

print(response.message)
# Output: "I can sense you're feeling the pressure - let's reset together 💪
#          💡 Micro-action: 60-second box breathing while standing with water sip
#          This takes about 2 minutes. Would you like to try it?"

# Log user feedback for learning
health_coaching_system.log_skill_feedback(
    session_id="default",
    skill_name="stress_reset_micro_break", 
    accepted=True,
    resistance_after=0.1
)

# Celebrate micro-wins
win_response = health_coaching_system.celebrate_micro_win(
    "default", 
    "Completed 2-minute stress reset"
)
print(win_response.message)  
# Output: "THAT'S what I'm talking about! You're building real momentum! 🏆"
```

## Core Skills Included

### 1. Sleep Wind-Down (Caretaker Muse)
- **Trigger**: 60-90 minutes before bedtime or "feeling wired"
- **Intervention**: Phone in kitchen + dim lights + 2-minute stretch
- **Success**: 3-day streak, easier sleep self-report

### 2. Stress Reset Micro-Break (Coach Muse)  
- **Trigger**: "overwhelmed" language or high resistance spike
- **Intervention**: 60-second box breathing + stand + water
- **Success**: Resistance reduction ≥ 0.2, 2x daily adherence

### 3. Post-Meal Walk (Playmate Muse)
- **Trigger**: After lunch or meal completion
- **Intervention**: 5-minute walk with playlist
- **Success**: 4/7 days, mood boost post-walk

### 4. Hydration Tracking (Scientist Muse)
- **Trigger**: Low water intake patterns, energy crashes
- **Intervention**: Glass of water + logging after bathroom visits
- **Success**: 6 glasses daily, energy correlation tracking

### 5. Medication Adherence (Caretaker Muse)  
- **Trigger**: Medication schedule times, missed doses
- **Intervention**: Pills by toothbrush with habit stack
- **Success**: 90% weekly adherence, max 1 missed dose

## System Architecture

```
skills-system/
├── core/
│   ├── skill_schema.py      # Data structures and registry
│   └── safety_guardrails.py # Medical safety and escalation
├── muses/
│   └── muse_archetypes.py   # Four muse personality systems  
├── skills/
│   └── core_skills.py       # Five concrete skill implementations
├── dispatch/
│   └── skill_dispatcher.py  # Intelligent skill selection logic
├── utils/
│   └── skill_template.py    # Templates for creating new skills
└── skills_coaching_system.py # Main coordinator interface
```

## Creating New Skills

Use the provided template system to easily create new skills:

```python
from skills_system.utils import SkillTemplate

# Use the guided creation helper
new_skill = SkillTemplate.create_guided_skill(
    skill_name="morning_sunlight_scientist",
    health_domain=HealthDomain.SLEEP,
    muse_archetype=MuseArchetype.SCIENTIST,
    situation_triggers=["morning routine", "circadian rhythm"],
    two_minute_starter="Step outside for 2 minutes of natural light",
    habit_stack="After making morning coffee, step outside for sunlight",
    empathic_message="Your circadian rhythm will thank you for this! ☀️",
    practical_message="Let's optimize your sleep-wake cycle with morning light 📊", 
    playful_message="Time for your daily photon experiment! 🌟🔬"
)

# Validate the skill
validation = SkillTemplate.validate_skill(new_skill)
print(validation)  # Shows errors, warnings, suggestions

# Register with the system
health_coaching_system.skill_registry.register_skill(new_skill)
```

## Safety Protocols

The system includes comprehensive safety guardrails:

- **Medical Emergency Detection**: Chest pain, breathing difficulty → immediate 911 referral
- **Mental Health Crisis**: Suicidal ideation → 988 Suicide Lifeline referral  
- **Medication Safety**: Any medication questions → healthcare provider referral
- **Eating Disorder Detection**: Purging, restricting behaviors → NEDA referral
- **Boundary Maintenance**: No diagnosis, no treatment advice, professional escalation

## Muse Collaboration Ethics

All muse interactions follow ethical guidelines:
- **Autonomy First**: Ask before nudging, offer choices
- **Empathy Always**: Validate effort and context
- **Specific Next Steps**: 2-minute starters, not vague advice
- **Celebrate Micro-Wins**: Immediate positive reinforcement
- **Safe Boundaries**: Clear medical limits with escalation rules

## Measurement & Learning

The system tracks multiple metrics:

**Skill Performance**:
- Acceptance rate (% of offered skills accepted)
- Resistance reduction (before/after intervention)
- Streak maintenance and completion rates
- Recovery patterns after lapses

**Muse Effectiveness**:
- Success rate by muse archetype
- User preference learning over time
- Context-appropriate muse selection

**System Learning**:
- Bandit algorithm for skill recommendation optimization
- Exponential moving averages for success rate tracking
- Adaptation strategies for declined interventions

## Production Considerations

For production deployment, consider:

1. **Persistence**: User preferences, skill history, and learning data storage
2. **Privacy**: Secure handling of health behavior data with encryption
3. **Integration**: API endpoints for chat interfaces and health apps
4. **Monitoring**: Success metrics dashboards and intervention effectiveness
5. **Compliance**: HIPAA considerations for health data handling
6. **Scaling**: Multi-user session management and performance optimization

## Research Foundation

This system implements evidence-based behavior change models:
- **COM-B Model**: Capability + Opportunity + Motivation → Behavior
- **Fogg B=MAP**: Behavior = Motivation × Ability × Prompt
- **Atomic Habits**: 2-minute rule, habit stacking, environmental design
- **Micro-Interventions**: Ultra-small steps that reduce activation energy

## Contributing

To add new skills or enhance existing ones:

1. Use `SkillTemplate` for consistent skill creation
2. Validate with `SkillTemplate.validate_skill()`
3. Test safety guardrails with edge cases
4. Ensure muse voice consistency with archetype guidelines
5. Include measurable success metrics
6. Document trigger patterns and use cases

## License

This skills system is designed for educational and research purposes. For production use, ensure compliance with relevant healthcare regulations and data protection laws.

---

**"Turn knowledge into teachable skills, skills into healthy behaviors, behaviors into lasting change."**