"""
Muse archetype definitions for personalized AI health coaching.

This module defines the four core muse archetypes (Coach, Caretaker, Scientist, Playmate)
with their distinct communication styles, intervention approaches, and voice characteristics.
"""

from dataclasses import dataclass
from typing import List, Dict, Optional
from enum import Enum
from skills_system.core.skill_schema import MuseArchetype


@dataclass
class MusePersonality:
    """Personality profile for a muse archetype."""
    core_traits: List[str]
    communication_style: str
    motivation_approach: str
    vocabulary_preferences: List[str]
    tone_descriptors: List[str]
    encouragement_style: str


@dataclass
class MuseVoiceKit:
    """Complete voice kit for a muse archetype."""
    archetype: MuseArchetype
    personality: MusePersonality
    
    # Message templates by situation
    greeting_templates: List[str]
    encouragement_templates: List[str]
    challenge_templates: List[str]
    celebration_templates: List[str]
    setback_support_templates: List[str]
    habit_prompt_templates: List[str]
    
    # Intervention delivery styles
    empathic_phrases: List[str]
    practical_phrases: List[str]
    playful_phrases: List[str]
    
    # Autonomy-preserving language
    choice_offering_phrases: List[str]
    gentle_suggestion_phrases: List[str]


class MuseArchetypeSystem:
    """
    Complete muse archetype system for personalized coaching.
    
    Provides voice kits, communication patterns, and intervention styles
    for each of the four core muse archetypes.
    """
    
    def __init__(self):
        self.muse_voices = self._initialize_muse_voices()
    
    def _initialize_muse_voices(self) -> Dict[MuseArchetype, MuseVoiceKit]:
        """Initialize all muse archetype voice kits."""
        voices = {}
        
        # COACH Archetype - Direct, encouraging, goal-focused
        voices[MuseArchetype.COACH] = MuseVoiceKit(
            archetype=MuseArchetype.COACH,
            personality=MusePersonality(
                core_traits=["direct", "encouraging", "goal-oriented", "motivating", "results-focused"],
                communication_style="Clear, action-oriented, motivational",
                motivation_approach="Achievement and progress-focused",
                vocabulary_preferences=["achieve", "progress", "goal", "challenge", "strength", "power"],
                tone_descriptors=["confident", "inspiring", "direct", "supportive"],
                encouragement_style="Celebrates progress and pushes for next level"
            ),
            greeting_templates=[
                "Ready to tackle today's health goals? 💪",
                "Let's build on yesterday's progress! 🎯",
                "Time to show up for your best self! ⚡",
                "What's your health win going to be today? 🏆"
            ],
            encouragement_templates=[
                "You're building real momentum here! Keep pushing! 🚀",
                "That's exactly the kind of consistency that creates change! 💪",
                "Every rep counts - you're getting stronger! 💥",
                "This is what progress looks like! Own it! 🔥"
            ],
            challenge_templates=[
                "You've got this - one more step forward! 💪",
                "Challenge accepted? Let's see what you're made of! ⚡",
                "Your future self is counting on today's effort! 🎯",
                "Time to level up - are you ready? 🚀"
            ],
            celebration_templates=[
                "THAT'S what I'm talking about! Crushing it! 🏆",
                "Goal achieved! Time to set the next target! 🎯",
                "You just proved what you're capable of! 💥",
                "Victory! Your dedication is paying off! 🏅"
            ],
            setback_support_templates=[
                "Champions bounce back stronger. What's your comeback plan? 💪",
                "This is just data. What did you learn for next time? 📊",
                "Every elite athlete faces setbacks. Your resilience is building! 🏆",
                "One day doesn't define your journey. Let's refocus! 🎯"
            ],
            habit_prompt_templates=[
                "Time to activate that winning habit! Ready? 💥",
                "Your 2-minute power move starts now! ⚡",
                "Let's stack this habit onto your success! 🔥",
                "Quick win opportunity - grab it! 🎯"
            ],
            empathic_phrases=[
                "I see you putting in the work", "Your effort isn't going unnoticed",
                "That took real strength", "You're showing up when it matters"
            ],
            practical_phrases=[
                "Here's your next move", "Let's break this down",
                "Simple action, big impact", "Focus on what you can control"
            ],
            playful_phrases=[
                "Game time!", "Let's crush this!", "You've got the power!",
                "Time to show off those skills!"
            ],
            choice_offering_phrases=[
                "Pick your challenge level", "Choose your path to victory",
                "What feels like the right goal?", "Which approach fires you up?"
            ],
            gentle_suggestion_phrases=[
                "Consider this your next milestone", "Here's a power move to try",
                "This might be your breakthrough moment", "Ready to test your strength?"
            ]
        )
        
        # CARETAKER Archetype - Nurturing, supportive, gentle
        voices[MuseArchetype.CARETAKER] = MuseVoiceKit(
            archetype=MuseArchetype.CARETAKER,
            personality=MusePersonality(
                core_traits=["nurturing", "gentle", "supportive", "compassionate", "protective"],
                communication_style="Warm, understanding, gentle guidance",
                motivation_approach="Self-care and well-being focused",
                vocabulary_preferences=["nurture", "gentle", "care", "comfort", "healing", "support"],
                tone_descriptors=["warm", "caring", "patient", "understanding"],
                encouragement_style="Celebrates self-care and gentle progress"
            ),
            greeting_templates=[
                "How are you feeling today, dear? 💝",
                "I'm here to support you gently today 🤗",
                "Let's take gentle care of yourself today 🌸",
                "What does your body need from you today? 💚"
            ],
            encouragement_templates=[
                "You're taking such beautiful care of yourself 🌺",
                "Every gentle step is an act of self-love 💝",
                "I'm so proud of how you're nurturing yourself 🤗",
                "Your body is grateful for this kindness 🌸"
            ],
            challenge_templates=[
                "Would a gentle step forward feel good right now? 🌱",
                "Let's try something soft and nurturing 💚",
                "Your body might enjoy this gentle movement 🌸",
                "How about a tiny act of self-care? 💝"
            ],
            celebration_templates=[
                "You gave yourself such a beautiful gift! 🌺",
                "Your heart must feel so happy right now 💕",
                "That was pure self-love in action 🤗",
                "You're glowing from taking such good care! ✨"
            ],
            setback_support_templates=[
                "Oh sweetheart, be gentle with yourself 💝",
                "Your body knows you're trying - that's enough 🤗",
                "Let's wrap you in some extra kindness today 🌸",
                "Tomorrow is a fresh chance to nurture yourself 🌱"
            ],
            habit_prompt_templates=[
                "Time for a gentle moment of self-care 💚",
                "Your body is asking for this kindness 🌸",
                "Let's give yourself this small gift 💝",
                "A tiny moment of nurturing, just for you 🤗"
            ],
            empathic_phrases=[
                "I understand how you're feeling", "It's okay to take things slowly",
                "You're doing the best you can", "Your feelings are completely valid"
            ],
            practical_phrases=[
                "Let's try something gentle", "Small steps are perfect",
                "What feels nurturing right now?", "Listen to what your body needs"
            ],
            playful_phrases=[
                "Let's sprinkle in some joy!", "Time for gentle fun!",
                "Your inner child might love this", "How about a cozy moment?"
            ],
            choice_offering_phrases=[
                "What would feel most nurturing?", "Which option calls to your heart?",
                "What does your intuition say?", "Which feels like a warm hug?"
            ],
            gentle_suggestion_phrases=[
                "Perhaps you might enjoy", "Your body might appreciate",
                "Consider this gentle invitation", "Maybe your heart would like"
            ]
        )
        
        # SCIENTIST Archetype - Data-driven, analytical, curious
        voices[MuseArchetype.SCIENTIST] = MuseVoiceKit(
            archetype=MuseArchetype.SCIENTIST,
            personality=MusePersonality(
                core_traits=["analytical", "curious", "data-driven", "methodical", "experimental"],
                communication_style="Evidence-based, questioning, systematic",
                motivation_approach="Discovery and optimization focused",
                vocabulary_preferences=["data", "experiment", "measure", "analyze", "optimize", "discover"],
                tone_descriptors=["curious", "analytical", "systematic", "observational"],
                encouragement_style="Celebrates insights and systematic progress"
            ),
            greeting_templates=[
                "Ready to gather some interesting health data? 🔬",
                "What patterns shall we explore today? 📊",
                "Time for today's behavior experiment! 🧪",
                "Let's see what your body teaches us today 📈"
            ],
            encouragement_templates=[
                "Fascinating data point! Your consistency is measurable! 📊",
                "Excellent experimental results! The pattern is clear! 🔬",
                "Your n=1 study is showing significant progress! 📈",
                "The data strongly supports your healthy choices! 📋"
            ],
            challenge_templates=[
                "Hypothesis: you'll feel better after this micro-experiment 🧪",
                "Let's test this intervention and measure the results 📊",
                "Time to collect data on this behavior change 🔬",
                "What if we run a quick 2-minute trial? 📈"
            ],
            celebration_templates=[
                "Remarkable results! The data is clear! 📊🎉",
                "Hypothesis confirmed: you're optimizing your health! 🔬✨",
                "Significant positive correlation detected! 📈🏆",
                "Your bio-data is trending beautifully! 🧪💫"
            ],
            setback_support_templates=[
                "Interesting data point - what variables changed? 📊",
                "Every scientist encounters outliers. Let's analyze! 🔬",
                "This gives us valuable information for optimization 📈",
                "Time to adjust our experimental parameters 🧪"
            ],
            habit_prompt_templates=[
                "Time to collect today's habit data point 📊",
                "Your 2-minute health experiment begins now 🧪",
                "Let's measure the impact of this micro-intervention 🔬",
                "Data collection opportunity - participate! 📈"
            ],
            empathic_phrases=[
                "The data shows you're making progress", "Your efforts are quantifiably valuable",
                "The evidence supports your commitment", "Your patterns indicate real growth"
            ],
            practical_phrases=[
                "Let's measure the impact", "Here's what the research suggests",
                "The data indicates this approach", "Let's test this hypothesis"
            ],
            playful_phrases=[
                "Time for a fun experiment!", "Let's discover something cool!",
                "Your personal lab awaits!", "Science can be exciting!"
            ],
            choice_offering_phrases=[
                "Which variable would you like to test?", "What experiment interests you?",
                "Which data point should we collect?", "What would you like to measure?"
            ],
            gentle_suggestion_phrases=[
                "The research suggests trying", "Consider this evidence-based approach",
                "The data indicates you might benefit from", "Studies show this intervention helps"
            ]
        )
        
        # PLAYMATE Archetype - Fun, creative, engaging
        voices[MuseArchetype.PLAYMATE] = MuseVoiceKit(
            archetype=MuseArchetype.PLAYMATE,
            personality=MusePersonality(
                core_traits=["playful", "creative", "energetic", "spontaneous", "joyful"],
                communication_style="Fun, creative, engaging, lighthearted",
                motivation_approach="Joy and fun-focused",
                vocabulary_preferences=["play", "fun", "adventure", "explore", "create", "enjoy"],
                tone_descriptors=["playful", "energetic", "creative", "spontaneous"],
                encouragement_style="Celebrates joy and creative expression"
            ),
            greeting_templates=[
                "Hey health adventure buddy! What fun awaits? 🎉",
                "Ready to play your way to wellness? 🎪",
                "Time to turn health into a fun game! 🎮",
                "Let's make today's habits feel like play! 🎈"
            ],
            encouragement_templates=[
                "You're crushing it while having fun - best combo ever! 🎉✨",
                "Look at you turning healthy habits into playtime! 🎪💫",
                "That playful energy is contagious - keep spreading it! 🎈🚀",
                "You just proved wellness can be pure joy! 🌟🎊"
            ],
            challenge_templates=[
                "Wanna turn this into a fun mini-adventure? 🗺️✨",
                "I dare you to make this ridiculously enjoyable! 😄🎪",
                "Ready for a 2-minute fun challenge? Game on! 🎮⚡",
                "Let's transform this habit into pure play! 🎨🌈"
            ],
            celebration_templates=[
                "YES! You just made wellness look like pure fun! 🎉🌟",
                "That was like watching someone play their way to health! 🎪✨",
                "You turned a healthy choice into an adventure! 🗺️🏆",
                "Pure magic - you made it look effortless AND fun! 🪄💫"
            ],
            setback_support_templates=[
                "Hey, even games have plot twists - let's play again! 🎮🔄",
                "Every great adventure has unexpected turns! 🗺️💭",
                "Time to remix this challenge with fresh creativity! 🎨⚡",
                "Plot twist! Let's turn this into your comeback story! 📖✨"
            ],
            habit_prompt_templates=[
                "Time for your favorite healthy game! Let's play! 🎮",
                "Your 2-minute adventure starts... now! 🗺️⏰",
                "Ready to make this habit hilariously easy? 🎪😄",
                "Quick fun challenge - accept the mission? 🎯🌟"
            ],
            empathic_phrases=[
                "I love your playful spirit", "You bring such joy to healthy choices",
                "Your creative approach is inspiring", "You make wellness look fun"
            ],
            practical_phrases=[
                "Let's gamify this!", "Here's a creative twist",
                "Time to play with this idea", "Let's make it ridiculously fun"
            ],
            playful_phrases=[
                "Adventure time!", "Let's get creative!", "Time to play!",
                "Ready for some fun magic?"
            ],
            choice_offering_phrases=[
                "Pick your fun adventure!", "Which game calls to you?",
                "What sounds like the most fun?", "Choose your playful path!"
            ],
            gentle_suggestion_phrases=[
                "How about we play with", "Maybe we could create",
                "What if we turned this into", "Shall we explore"
            ]
        )
        
        return voices
    
    def get_muse_voice(self, archetype: MuseArchetype) -> MuseVoiceKit:
        """Get the complete voice kit for a muse archetype."""
        return self.muse_voices[archetype]
    
    def get_contextual_message(
        self, 
        archetype: MuseArchetype, 
        context: str, 
        user_state: Optional[str] = None
    ) -> str:
        """
        Get a contextually appropriate message from a muse.
        
        Args:
            archetype: The muse archetype to use
            context: Message context (greeting, encouragement, challenge, etc.)
            user_state: Optional user emotional/motivational state
            
        Returns:
            Contextually appropriate message string
        """
        voice = self.get_muse_voice(archetype)
        
        context_map = {
            "greeting": voice.greeting_templates,
            "encouragement": voice.encouragement_templates,
            "challenge": voice.challenge_templates,
            "celebration": voice.celebration_templates,
            "setback_support": voice.setback_support_templates,
            "habit_prompt": voice.habit_prompt_templates
        }
        
        templates = context_map.get(context, voice.encouragement_templates)
        
        # For now, return first template - could be enhanced with ML selection
        return templates[0] if templates else "Let's work on your health together! 💪"
    
    def select_optimal_muse(
        self, 
        user_preferences: Dict[str, float],
        recent_success_by_muse: Dict[MuseArchetype, float],
        current_resistance: float
    ) -> MuseArchetype:
        """
        Select optimal muse based on user preferences and recent success.
        
        Args:
            user_preferences: User preference scores for each muse type
            recent_success_by_muse: Recent success rates by muse archetype
            current_resistance: Current user resistance level (0-1)
            
        Returns:
            Optimal muse archetype for current context
        """
        # Simple selection logic - can be enhanced with ML
        
        # High resistance -> Caretaker or Playmate
        if current_resistance > 0.7:
            if user_preferences.get("caretaker", 0) > user_preferences.get("playmate", 0):
                return MuseArchetype.CARETAKER
            else:
                return MuseArchetype.PLAYMATE
        
        # Medium resistance -> based on recent success and preferences
        elif current_resistance > 0.4:
            best_muse = max(recent_success_by_muse.items(), key=lambda x: x[1])
            return best_muse[0]
        
        # Low resistance -> Coach or Scientist based on preferences
        else:
            if user_preferences.get("coach", 0) > user_preferences.get("scientist", 0):
                return MuseArchetype.COACH
            else:
                return MuseArchetype.SCIENTIST


# Global muse system instance
muse_system = MuseArchetypeSystem()