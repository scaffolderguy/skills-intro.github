#!/usr/bin/env python3
"""
Example implementations of the five quick, shippable experiments from the Atomic Habits NOVA integration.

This module demonstrates practical usage of each experiment with real-world scenarios.
"""

from atomic_habits_integration import AtomicHabitsNOVA, integrate_atomic_habits
from datetime import datetime
import json


def experiment_1_rule_of_three():
    """
    Experiment 1: Rule-of-Three ritual
    At first turn each day, ask for the top 3 outcomes and convert them to micro-tasks with 2-minute starters.
    """
    print("🧪 EXPERIMENT 1: Rule-of-Three Ritual")
    print("=" * 50)
    
    habits = AtomicHabitsNOVA()
    
    # Simulate first session of the day
    daily_three = habits.daily_three_ritual({
        "time_of_day": "morning",
        "energy_level": "high",
        "context": "starting workday"
    })
    
    print(f"Cue: {daily_three['cue']}")
    print(f"Question: {daily_three['craving']}")
    print("\nTemplate:")
    for template in daily_three['response_template']:
        print(f"  {template}")
    
    # Simulate user completing the ritual
    sample_outcomes = [
        "Finish project proposal draft",
        "Respond to client emails", 
        "Review team feedback"
    ]
    
    sample_starters = [
        "Open document and write the executive summary header",
        "Open email and reply to Sarah's question",
        "Open feedback document and read first comment"
    ]
    
    completion = habits.track_daily_three_completion(sample_outcomes, sample_starters)
    print(f"\n✅ {completion['message']}")
    print(f"Next step: {completion['next_step']}")
    
    return habits


def experiment_2_habit_stacking():
    """
    Experiment 2: Habit stacking in suggestions
    After a successful micro-task, suggest a paired follow-up.
    """
    print("\n🧪 EXPERIMENT 2: Habit Stacking")
    print("=" * 50)
    
    habits = AtomicHabitsNOVA()
    
    # Simulate completing a task
    completed_task = "Wrote project summary paragraph"
    context = {
        "project": "Website Redesign",
        "energy_level": "high",
        "time_remaining": 30
    }
    
    stack_suggestion = habits.habit_stack_suggestion(completed_task, context)
    
    print(f"{stack_suggestion['trigger']}")
    print(f"{stack_suggestion['stack_action']}")
    print(f"💡 {stack_suggestion['reward_preview']}")
    
    # Show the habit chain being formed
    print(f"\n🔗 Habit Chain: {stack_suggestion['habit_chain']}")
    
    # Demonstrate friction reduction
    friction_help = stack_suggestion['friction_reducer']
    if friction_help.get('suggestions'):
        print(f"🛠️  Friction Reducers:")
        for suggestion in friction_help['suggestions']:
            print(f"   • {suggestion}")
    
    return habits


def experiment_3_friction_design():
    """
    Experiment 3: Friction design
    If the user pauses on a task, offer one-tap setup to lower friction.
    """
    print("\n🧪 EXPERIMENT 3: Friction Design")
    print("=" * 50)
    
    habits = AtomicHabitsNOVA()
    
    # Test various task types
    tasks = [
        "Write team meeting agenda",
        "Research competitor pricing", 
        "Send project update email",
        "Create wireframe mockup"
    ]
    
    for task in tasks:
        starter = habits.two_minute_starter(task)
        print(f"\n📋 Task: {task}")
        print(f"⚡ 2-min starter: {starter['two_minute_starter']}")
        print(f"🧠 Principle: {starter['principle']}")
        print(f"➡️  Next: {starter['next_step']}")


def experiment_4_immediate_rewards():
    """
    Experiment 4: Immediate reward hooks  
    On completion, reflect a visible win and feed +reward into the bandit.
    """
    print("\n🧪 EXPERIMENT 4: Immediate Reward Hooks")
    print("=" * 50)
    
    habits = AtomicHabitsNOVA()
    
    # Simulate a series of completions with different resistance levels
    scenarios = [
        {
            "action": "Started daily planning session",
            "resistance": 0.8,
            "outcome": "Created prioritized task list"
        },
        {
            "action": "Responded to client email", 
            "resistance": 0.3,
            "outcome": "Clarified project requirements"
        },
        {
            "action": "Reviewed code changes",
            "resistance": 0.6, 
            "outcome": "Provided constructive feedback"
        }
    ]
    
    for scenario in scenarios:
        reward = habits.resistance_bandit_reward(
            scenario['action'],
            scenario['resistance'], 
            scenario['outcome']
        )
        
        print(f"\n🎯 Action: {scenario['action']}")
        print(f"📊 Resistance: {scenario['resistance']} → {reward['resistance_after']}")
        print(f"📈 Momentum boost: +{reward['momentum_boost']:.1f}")
        print(f"🎉 Outcome: {scenario['outcome']}")
        
        # Show celebration message
        celebrations = [
            "One less decision today! 🎉",
            "Progress compounds! 📈", 
            "Small win = big momentum! ⚡"
        ]
        import random
        print(f"🏆 {random.choice(celebrations)}")


def experiment_5_environment_cues():
    """
    Experiment 5: Environment cues
    If a query happens in a known context, surface context-specific "obvious next step".
    """
    print("\n🧪 EXPERIMENT 5: Environment Cues")  
    print("=" * 50)
    
    habits = AtomicHabitsNOVA()
    
    # Test different contexts
    contexts = [
        {
            "project": "Mobile App Launch",
            "location": "desk",
            "time_of_day": "morning"
        },
        {
            "energy_level": "low",
            "time_remaining": 15,
            "context": "between meetings"
        },
        {
            "just_completed_task": True,
            "energy_level": "high", 
            "workspace": "focused"
        },
        {
            "location": "mobile",
            "time_of_day": "commute",
            "energy_level": "medium"
        }
    ]
    
    for i, context in enumerate(contexts, 1):
        cue = habits.environment_cue_detection(context)
        print(f"\n📍 Context {i}: {', '.join(f'{k}={v}' for k, v in context.items())}")
        
        if cue:
            print(f"💡 Cue: {cue['cue']}")
            print(f"➡️  Suggestion: {cue['suggestion']}")
        else:
            print("No specific environmental cue detected")


def full_integration_demo():
    """Demonstrate full integration with enhanced knowledge base search."""
    print("\n🧪 FULL INTEGRATION DEMO")
    print("=" * 50)
    
    # Create enhanced knowledge base
    enhanced_kb = integrate_atomic_habits()
    
    # Simulate different types of searches with context
    searches = [
        {
            "query": "how to start a new project efficiently",
            "context": {"time_of_day": "morning", "energy_level": "high"}
        },
        {
            "query": "task management best practices",
            "context": {"completed_task": "Organized project files", "project": "Website Redesign"}
        },
        {
            "query": "productivity tips for low energy days", 
            "context": {"energy_level": "low", "time_of_day": "afternoon"}
        }
    ]
    
    for i, search in enumerate(searches, 1):
        print(f"\n🔍 Search {i}: '{search['query']}'")
        print(f"📋 Context: {search['context']}")
        
        result = enhanced_kb.knowledge_base_search(
            search['query'],
            user_context=search['context']
        )
        
        # Show enhanced results
        if 'habit_suggestion' in result:
            print(f"🌅 Daily ritual: {result['habit_suggestion']['cue']}")
            
        if 'two_minute_starter' in result:
            print(f"⚡ 2-min starter: {result['two_minute_starter']['two_minute_starter']}")
            
        if 'habit_stack' in result:
            print(f"🔗 Stack suggestion: {result['habit_stack']['stack_action']}")
            
        if 'environment_cue' in result:
            print(f"💡 Environment cue: {result['environment_cue']['cue']}")
            
        # Show user stats
        stats = result['user_stats']
        print(f"📊 Stats: {stats['total_micro_wins']} wins, streak: {stats['daily_three_streak']}")


def demonstrate_compound_effects():
    """Show how the system creates compound effects over time."""
    print("\n🧪 COMPOUND EFFECTS DEMONSTRATION")
    print("=" * 50)
    
    habits = AtomicHabitsNOVA()
    
    # Simulate a week of habit building
    print("📅 Simulating one week of habit building...")
    
    # Day 1: Start with high resistance
    print("\n📅 Day 1 - Starting out")
    daily_three = habits.daily_three_ritual()
    habits.track_daily_three_completion(
        ["Write blog post", "Review feedback", "Plan next sprint"],
        ["Open doc and write title", "Read first comment", "List 3 priorities"]
    )
    
    reward1 = habits.resistance_bandit_reward("Completed daily planning", 0.9, "Created clear priorities")
    print(f"   Resistance: 0.9 → {reward1['resistance_after']}")
    
    # Day 3: Lower resistance
    print("\n📅 Day 3 - Building momentum")  
    reward2 = habits.resistance_bandit_reward("Completed daily planning", 0.5, "Finished priorities faster")
    print(f"   Resistance: 0.5 → {reward2['resistance_after']}")
    
    # Day 7: Much lower resistance 
    print("\n📅 Day 7 - In the flow")
    reward3 = habits.resistance_bandit_reward("Completed daily planning", 0.1, "Planning feels automatic")
    print(f"   Resistance: 0.1 → {reward3['resistance_after']}")
    
    # Show user progress
    stats = habits.get_user_stats()
    print(f"\n📊 Week Summary:")
    print(f"   • Total micro-wins: {stats['total_micro_wins']}")
    print(f"   • Average resistance reduction: {stats['avg_resistance_reduction']}")
    print(f"   • Momentum score: {stats['momentum_score']}")
    print(f"   • Next milestone: {stats['next_milestone']['encouragement']}")


if __name__ == "__main__":
    print("🧠 Atomic Habits NOVA Integration - Five Experiments")
    print("=" * 60)
    print("Demonstrating how to turn knowledge work into compound habits")
    
    # Run all experiments
    experiment_1_rule_of_three()
    experiment_2_habit_stacking()
    experiment_3_friction_design()
    experiment_4_immediate_rewards() 
    experiment_5_environment_cues()
    full_integration_demo()
    demonstrate_compound_effects()
    
    print("\n" + "=" * 60)
    print("🎯 All experiments completed! Ready for production deployment.")
    print("💡 Each experiment creates compound effects that improve over time.")
    print("🚀 Start with Experiment 1 (Daily Three) for immediate impact.")