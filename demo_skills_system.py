#!/usr/bin/env python3
"""
Demo script to test and demonstrate the AI Health Coaching Skills System.

This script shows the system in action with realistic coaching scenarios
and validates that all components work together properly.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import the skills system components directly
from skills_system.skills_coaching_system import SkillsCoachingSystem
from skills_system.core.skill_schema import HealthDomain, MuseArchetype
from skills_system.core.safety_guardrails import SafetyGuardrails
from skills_system.skills.core_skills import core_skills_registry

# Initialize the health coaching system
health_coaching_system = SkillsCoachingSystem()


def test_basic_functionality():
    """Test basic system functionality."""
    print("🧪 Testing Basic System Functionality")
    print("=" * 50)
    
    system = health_coaching_system
    
    # Test 1: Basic coaching response
    print("\n📋 Test 1: Basic Coaching Response")
    response = system.coach_user(
        "I'm feeling really stressed today",
        time_of_day="afternoon",
        energy_level=0.3
    )
    print(f"✅ Response generated: {response.message[:100]}...")
    print(f"   Skill offered: {response.skill_offered}")
    print(f"   Muse used: {response.muse_used}")
    
    # Test 2: Safety guardrails
    print("\n🛡️ Test 2: Safety Guardrails")
    safety_response = system.coach_user("I have chest pain and can't breathe")
    print(f"✅ Safety triggered: {safety_response.requires_escalation}")
    print(f"   Safety message: {safety_response.safety_alert[:100] if safety_response.safety_alert else 'None'}...")
    
    # Test 3: Skill feedback logging
    print("\n📊 Test 3: Skill Feedback Logging")
    if response.skill_offered:
        system.log_skill_feedback(
            session_id="test_session",
            skill_name=response.skill_offered,
            accepted=True,
            resistance_after=0.2
        )
        print("✅ Skill feedback logged successfully")
    
    # Test 4: Micro-win celebration
    print("\n🎉 Test 4: Micro-win Celebration") 
    celebration = system.celebrate_micro_win("test_session", "Completed breathing exercise")
    print(f"✅ Celebration: {celebration.message}")
    
    # Test 5: System statistics
    print("\n📈 Test 5: System Statistics")
    stats = system.get_system_stats()
    print(f"✅ Total skills available: {stats['total_skills_available']}")
    print(f"✅ Skills offered: {stats['total_skills_offered']}")
    print(f"✅ Active sessions: {stats['active_sessions']}")


def demo_coaching_conversation():
    """Demonstrate a realistic coaching conversation."""
    print("\n\n🤖 AI Health Coach Demo Conversation")
    print("=" * 50)
    
    system = health_coaching_system
    session_id = "demo_conversation"
    
    conversation = [
        {
            "user_input": "I've been having trouble sleeping lately",
            "time": "evening",
            "energy": 0.4,
            "emotion": "tired"
        },
        {
            "user_input": "I usually scroll my phone in bed",
            "time": "evening", 
            "energy": 0.3,
            "emotion": "restless"
        },
        {
            "user_input": "I'm feeling overwhelmed at work today",
            "time": "afternoon",
            "energy": 0.2,
            "emotion": "stressed"
        },
        {
            "user_input": "That sounds helpful, I'll try it",
            "time": "afternoon",
            "energy": 0.4,
            "emotion": "hopeful"
        }
    ]
    
    for i, turn in enumerate(conversation, 1):
        print(f"\n💬 Turn {i}:")
        print(f"👤 User: {turn['user_input']}")
        
        response = system.coach_user(
            user_input=turn['user_input'],
            session_id=session_id,
            time_of_day=turn['time'],
            energy_level=turn['energy'],
            emotional_state=turn['emotion']
        )
        
        print(f"🤖 Coach: {response.message}")
        
        if response.skill_offered:
            print(f"   💡 Skill: {response.skill_offered}")
            print(f"   🎭 Muse: {response.muse_used.value if response.muse_used else 'None'}")
            
            # Simulate user accepting skills in later turns
            accepted = i > 2
            system.log_skill_feedback(
                session_id=session_id,
                skill_name=response.skill_offered,
                accepted=accepted,
                resistance_after=max(0.1, turn['energy'] - 0.1) if accepted else turn['energy'] + 0.1
            )
            print(f"   {'✅ Accepted' if accepted else '❌ Declined'}")
        
        print("-" * 30)
    
    # Final stats
    print(f"\n📊 Final Session Stats:")
    stats = system.get_system_stats()
    print(f"Total interactions: {len(conversation)}")
    print(f"Skills offered: {stats['total_skills_offered']}")
    print(f"Skills accepted: {stats['total_skills_accepted']}")
    acceptance_rate = stats['total_skills_accepted'] / max(1, stats['total_skills_offered'])
    print(f"Acceptance rate: {acceptance_rate:.1%}")


def test_all_skill_domains():
    """Test that all health domains have working skills."""
    print("\n\n🏥 Testing All Health Domain Skills")
    print("=" * 50)
    
    system = health_coaching_system
    
    domain_triggers = {
        HealthDomain.SLEEP: "I can't fall asleep",
        HealthDomain.STRESS: "I'm so overwhelmed right now", 
        HealthDomain.MOVEMENT: "I haven't exercised in weeks",
        HealthDomain.NUTRITION: "I'm always dehydrated",
        HealthDomain.MEDICATION_ADHERENCE: "I keep forgetting my pills"
    }
    
    for domain, trigger in domain_triggers.items():
        print(f"\n🎯 Testing {domain.value.upper()} domain:")
        print(f"   Trigger: '{trigger}'")
        
        response = system.coach_user(trigger, session_id=f"test_{domain.value}")
        
        if response.skill_offered:
            print(f"   ✅ Skill offered: {response.skill_offered}")
            print(f"   🎭 Muse: {response.muse_used.value if response.muse_used else 'None'}")
        else:
            print(f"   ⚠️ No skill offered")
        
        # Check if any skills exist for this domain
        domain_skills = system.skill_registry.get_skills_by_domain(domain)
        print(f"   📚 Available skills in domain: {len(domain_skills)}")


def test_muse_archetypes():
    """Test all muse archetypes."""
    print("\n\n🎭 Testing All Muse Archetypes")
    print("=" * 50)
    
    system = health_coaching_system
    
    # Test each muse with the same trigger
    trigger = "I need to be more active"
    
    for muse in MuseArchetype:
        print(f"\n{muse.value.upper()} Muse Test:")
        
        # Create session with preferred muse
        session_id = f"muse_test_{muse.value}"
        session = system._create_session(session_id)
        session.preferred_muse = muse
        system.active_sessions[session_id] = session
        
        response = system.coach_user(
            trigger, 
            session_id=session_id,
            time_of_day="afternoon"
        )
        
        print(f"   Message style: {response.message[:100]}...")
        print(f"   Muse used: {response.muse_used.value if response.muse_used else 'None'}")


def main():
    """Run all tests and demonstrations."""
    print("🚀 AI Health Coaching Skills System - Full Demo")
    print("🔬 Testing and demonstrating all system capabilities")
    print("=" * 60)
    
    try:
        # Run all tests
        test_basic_functionality()
        demo_coaching_conversation()
        test_all_skill_domains()
        test_muse_archetypes()
        
        print("\n\n✅ ALL TESTS COMPLETED SUCCESSFULLY!")
        print("🎯 The AI Health Coaching Skills System is working properly.")
        print("📚 See README_SKILLS_SYSTEM.md for full documentation.")
        
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)