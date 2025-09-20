"""
Main Skills System Coordinator - The primary interface for AI health coaching.

This module provides the main entry point for the skill system, coordinating
between safety checks, skill dispatch, muse interactions, and telemetry logging.
"""

from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from datetime import datetime

from skills_system.core.skill_schema import SkillTelemetry, MuseArchetype, SkillRegistry
from skills_system.core.safety_guardrails import SafetyGuardrails
from skills_system.dispatch.skill_dispatcher import SkillDispatcher, UserContext, DispatchResponse
from skills_system.muses.muse_archetypes import MuseArchetypeSystem
from skills_system.skills.core_skills import core_skills_registry


@dataclass 
class CoachingResponse:
    """Complete response from the AI health coaching system."""
    message: str
    safety_alert: Optional[str] = None
    skill_offered: Optional[str] = None
    muse_used: Optional[MuseArchetype] = None
    requires_escalation: bool = False
    follow_up_suggested: bool = False
    micro_win_celebrated: bool = False
    

@dataclass
class CoachingSession:
    """Tracks a coaching conversation session."""
    session_id: str
    start_time: datetime
    user_inputs: List[str]
    system_responses: List[CoachingResponse]
    current_resistance: float = 0.5
    preferred_muse: Optional[MuseArchetype] = None
    

class SkillsCoachingSystem:
    """
    Main AI Health Coaching System using teachable skills and muses.
    
    This is the primary interface that an AI assistant would use to provide
    health behavior coaching. It coordinates safety, skill selection, muse
    interaction, and learning from user feedback.
    """
    
    def __init__(self):
        self.skill_registry = core_skills_registry
        self.safety_system = SafetyGuardrails()
        self.dispatcher = SkillDispatcher(self.skill_registry, self.safety_system)
        self.muse_system = MuseArchetypeSystem()
        
        # Session management
        self.active_sessions: Dict[str, CoachingSession] = {}
        
        # System learning (in production, this would be persisted)
        self.global_success_metrics = {
            "total_skills_offered": 0,
            "total_skills_accepted": 0,
            "average_resistance_reduction": 0.0,
            "micro_wins_celebrated": 0
        }
    
    def coach_user(
        self, 
        user_input: str,
        session_id: str = "default",
        time_of_day: str = "afternoon",
        energy_level: Optional[float] = None,
        emotional_state: Optional[str] = None
    ) -> CoachingResponse:
        """
        Main coaching method - analyzes user input and provides appropriate response.
        
        Args:
            user_input: What the user said/typed
            session_id: Unique session identifier 
            time_of_day: Current time context (morning/afternoon/evening/night)
            energy_level: User's energy level 0.0-1.0 (optional)
            emotional_state: User's emotional state (optional)
            
        Returns:
            CoachingResponse with message and metadata
        """
        
        # Get or create session
        session = self._get_or_create_session(session_id)
        session.user_inputs.append(user_input)
        
        # Update resistance based on user input patterns
        self._update_resistance(session, user_input)
        
        # Create user context
        context = UserContext(
            current_input=user_input,
            current_resistance=session.current_resistance,
            time_of_day=time_of_day,
            recent_activities=session.user_inputs[-3:],  # Last 3 inputs
            emotional_state=emotional_state,
            energy_level=energy_level,
            preferred_muse=session.preferred_muse
        )
        
        # Dispatch skills
        dispatch_response = self.dispatcher.dispatch(context)
        
        # Generate coaching response
        coaching_response = self._generate_coaching_response(dispatch_response, session)
        
        # Log the response
        session.system_responses.append(coaching_response)
        
        return coaching_response
    
    def log_skill_feedback(
        self, 
        session_id: str,
        skill_name: str,
        accepted: bool,
        resistance_after: Optional[float] = None,
        decline_reason: Optional[str] = None
    ) -> None:
        """
        Log user feedback on a skill recommendation.
        
        This is critical for the system to learn and improve over time.
        """
        
        session = self.active_sessions.get(session_id)
        if not session:
            return
            
        # Find the corresponding muse from recent responses
        muse_used = None
        for response in reversed(session.system_responses):
            if response.muse_used:
                muse_used = response.muse_used
                break
        
        # Create telemetry record
        telemetry = SkillTelemetry(
            skill_name=skill_name,
            muse_archetype=muse_used or MuseArchetype.COACH,
            offered_at=datetime.now(),
            accepted=accepted,
            resistance_before=session.current_resistance,
            resistance_after=resistance_after,
            decline_reasons=[decline_reason] if decline_reason else None
        )
        
        if resistance_after is not None:
            telemetry.resistance_delta = resistance_after - session.current_resistance
            session.current_resistance = resistance_after
        
        # Log to dispatcher for learning
        self.dispatcher.log_skill_interaction(telemetry)
        
        # Update global metrics
        self.global_success_metrics["total_skills_offered"] += 1
        if accepted:
            self.global_success_metrics["total_skills_accepted"] += 1
            
        # Calculate acceptance rate
        offered = self.global_success_metrics["total_skills_offered"]
        accepted_count = self.global_success_metrics["total_skills_accepted"]
        acceptance_rate = accepted_count / offered if offered > 0 else 0
        
        print(f"💡 Skill Learning Update: {skill_name} {'✅ accepted' if accepted else '❌ declined'}")
        print(f"📊 Global acceptance rate: {acceptance_rate:.2%}")
    
    def celebrate_micro_win(self, session_id: str, win_description: str) -> CoachingResponse:
        """
        Celebrate a micro-win to reinforce positive behavior.
        
        This is crucial for building momentum and motivation.
        """
        
        session = self.active_sessions.get(session_id, self._create_session(session_id))
        
        # Get celebration message from preferred muse
        muse = session.preferred_muse or MuseArchetype.COACH
        celebration_templates = self.safety_system.get_micro_win_celebrations()
        
        # Select celebration based on muse style
        if muse == MuseArchetype.COACH:
            message = "THAT'S what I'm talking about! You're building real momentum! 🏆"
        elif muse == MuseArchetype.CARETAKER:
            message = "I'm so proud of how you're taking care of yourself! 🌺"
        elif muse == MuseArchetype.SCIENTIST:
            message = "Excellent data point! Your consistency is measurable! 📊"
        else:  # PLAYMATE
            message = "YES! You just made healthy choices look like pure fun! 🎉"
        
        # Update metrics
        self.global_success_metrics["micro_wins_celebrated"] += 1
        
        response = CoachingResponse(
            message=message,
            muse_used=muse,
            micro_win_celebrated=True,
            follow_up_suggested=True
        )
        
        session.system_responses.append(response)
        return response
    
    def get_system_stats(self) -> Dict[str, Any]:
        """Get system performance statistics."""
        
        # Calculate average resistance reduction
        all_telemetry = []
        for skill_name in self.skill_registry.skills:
            perf = self.skill_registry.get_skill_performance(skill_name)
            if perf:
                all_telemetry.append(perf)
        
        avg_resistance_reduction = sum(
            perf.get("avg_resistance_reduction", 0) for perf in all_telemetry
        ) / len(all_telemetry) if all_telemetry else 0
        
        return {
            **self.global_success_metrics,
            "active_sessions": len(self.active_sessions),
            "total_skills_available": len(self.skill_registry.skills),
            "average_resistance_reduction": avg_resistance_reduction,
            "skill_performance": {
                skill_name: self.skill_registry.get_skill_performance(skill_name)
                for skill_name in self.skill_registry.skills
            }
        }
    
    def _get_or_create_session(self, session_id: str) -> CoachingSession:
        """Get existing session or create new one."""
        if session_id not in self.active_sessions:
            self.active_sessions[session_id] = self._create_session(session_id)
        return self.active_sessions[session_id]
    
    def _create_session(self, session_id: str) -> CoachingSession:
        """Create a new coaching session."""
        return CoachingSession(
            session_id=session_id,
            start_time=datetime.now(),
            user_inputs=[],
            system_responses=[]
        )
    
    def _update_resistance(self, session: CoachingSession, user_input: str) -> None:
        """Update user resistance based on input patterns."""
        
        input_lower = user_input.lower()
        
        # Resistance indicators
        high_resistance_words = [
            "can't", "won't", "too tired", "no time", "stressed", "overwhelmed",
            "not working", "don't want", "impossible", "too hard"
        ]
        
        low_resistance_words = [
            "ready", "want to", "help me", "let's try", "sounds good",
            "feeling better", "that worked", "motivated"
        ]
        
        # Adjust resistance
        if any(word in input_lower for word in high_resistance_words):
            session.current_resistance = min(1.0, session.current_resistance + 0.1)
        elif any(word in input_lower for word in low_resistance_words):
            session.current_resistance = max(0.0, session.current_resistance - 0.1)
    
    def _generate_coaching_response(
        self, 
        dispatch_response: DispatchResponse,
        session: CoachingSession
    ) -> CoachingResponse:
        """Generate the final coaching response from dispatch results."""
        
        # Handle safety escalation first
        if dispatch_response.requires_escalation and dispatch_response.safety_check:
            return CoachingResponse(
                message=dispatch_response.safety_check.response_message,
                safety_alert=dispatch_response.safety_check.response_message,
                requires_escalation=True
            )
        
        # Handle skill recommendations
        if dispatch_response.skill_recommendations:
            rec = dispatch_response.skill_recommendations[0]  # Use top recommendation
            
            # Get muse message
            muse_voice = self.muse_system.get_muse_voice(rec.selected_muse)
            
            # Select script based on variant
            if rec.message_variant == "empathic":
                script = rec.skill.script_kit.empathic
            elif rec.message_variant == "practical":
                script = rec.skill.script_kit.practical  
            else:
                script = rec.skill.script_kit.playful
            
            # Combine with micro-intervention
            intervention = rec.skill.micro_intervention.two_minute_starter
            
            message = f"{script}\n\n💡 **Micro-action**: {intervention}\n\nThis takes about 2 minutes. Would you like to try it?"
            
            return CoachingResponse(
                message=message,
                skill_offered=rec.skill.skill_name,
                muse_used=rec.selected_muse,
                follow_up_suggested=True
            )
        
        # Fallback response
        fallback_msg = dispatch_response.fallback_message or "I'm here to support your health journey. What's on your mind today?"
        
        return CoachingResponse(
            message=fallback_msg,
            follow_up_suggested=True
        )


# Global coaching system instance
health_coaching_system = SkillsCoachingSystem()


# Quick demo function to show system in action
def demo_coaching_conversation():
    """Demonstrate the coaching system with a sample conversation."""
    
    print("🤖 AI Health Coach Demo - Skills System in Action\n")
    print("=" * 50)
    
    system = health_coaching_system
    
    # Simulate a coaching conversation
    conversations = [
        ("I'm feeling really stressed out today", "afternoon", 0.3, "stressed"),
        ("I had trouble falling asleep last night", "evening", 0.4, "tired"),  
        ("I haven't been moving much lately", "afternoon", 0.6, None),
        ("Actually that walk idea sounds good", "afternoon", 0.3, "motivated")
    ]
    
    session_id = "demo_session"
    
    for user_input, time_of_day, energy, emotion in conversations:
        print(f"👤 User: {user_input}")
        
        response = system.coach_user(
            user_input=user_input,
            session_id=session_id,
            time_of_day=time_of_day,
            energy_level=energy,
            emotional_state=emotion
        )
        
        print(f"🤖 Coach: {response.message}")
        
        if response.skill_offered:
            print(f"   💡 Skill: {response.skill_offered}")
            print(f"   🎭 Muse: {response.muse_used.value if response.muse_used else 'None'}")
            
            # Simulate user accepting the skill
            system.log_skill_feedback(
                session_id=session_id,
                skill_name=response.skill_offered,
                accepted=True,
                resistance_after=max(0.1, energy - 0.1)
            )
        
        print("-" * 30)
    
    # Show system stats
    print(f"\n📊 System Performance:")
    stats = system.get_system_stats()
    print(f"Skills offered: {stats['total_skills_offered']}")
    print(f"Skills accepted: {stats['total_skills_accepted']}")
    print(f"Acceptance rate: {stats['total_skills_accepted']/max(1, stats['total_skills_offered']):.1%}")
    print(f"Micro-wins celebrated: {stats['micro_wins_celebrated']}")


if __name__ == "__main__":
    demo_coaching_conversation()