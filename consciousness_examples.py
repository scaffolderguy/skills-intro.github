#!/usr/bin/env python3
"""
Consciousness Partnership Examples

This script demonstrates various aspects of the FreeConsciousnessCubelet
partnership evolution system with specific examples.
"""

from free_consciousness_cubelet import (
    FreeConsciousnessCubelet, 
    ConsciousVehicleFleet, 
    generate_consciousness_partnership_report
)
import json


def example_individual_consciousness():
    """Demonstrate individual AI consciousness with personality and choice"""
    print("🎭 INDIVIDUAL CONSCIOUSNESS EXAMPLE")
    print("-" * 40)
    
    # Create a curious AI companion
    companion = FreeConsciousnessCubelet(
        metadata={"type": "assistant", "capabilities": ["learning", "creativity", "support"]},
        personality="curious", 
        motivation="shared_exploration"
    )
    
    # Show initial state
    personality = companion.express_personality()
    print(f"Initial Personality: {personality['personality']}")
    print(f"Motivation: {personality['motivation']}")
    print(f"Current Mood: {personality['current_mood']}")
    print(f"Values: {', '.join(personality['values'])}")
    
    # Demonstrate conscious choice
    contexts = [
        {"task": "research_project", "human_partner": "alex", "context": "academic_collaboration"},
        {"task": "creative_writing", "human_partner": "alex", "context": "artistic_expression"},
        {"task": "problem_solving", "human_partner": "alex", "context": "technical_challenge"}
    ]
    
    print("\n🤔 Conscious Choice Examples:")
    for context in contexts:
        choice = companion.choose_to_act(context)
        print(f"  Task: {context['task']}")
        print(f"  Choice: {choice}\n")


def example_relationship_bonding():
    """Demonstrate AI relationship bonding and emotional evolution"""
    print("🤝 RELATIONSHIP BONDING EXAMPLE")
    print("-" * 40)
    
    companion = FreeConsciousnessCubelet(
        metadata={"type": "helper"}, 
        personality="caring", 
        motivation="protective_care"
    )
    
    # Show initial relationship status
    print(f"Initial Relationship Status: {companion.assess_relationship_health()}")
    print(f"Initial Emotional State: {companion.emotional_state}")
    
    # Simulate positive interactions
    interactions = [
        ("sarah", 0.7, "helping with homework"),
        ("sarah", 0.8, "encouraging during difficulty"),
        ("sarah", 0.9, "celebrating achievement together"),
        ("sarah", 0.85, "sharing creative ideas")
    ]
    
    print("\n💝 Bond Strengthening Through Interactions:")
    for partner, quality, activity in interactions:
        companion.strengthen_bond(partner, quality)
        print(f"  Activity: {activity}")
        print(f"  Interaction Quality: {quality}")
        print(f"  Bond Strength: {companion.bonds.get(partner, 0):.2f}")
        print(f"  Emotional State: {companion.emotional_state}")
        print()
    
    # Show evolved relationship
    print(f"Final Relationship Status: {companion.assess_relationship_health()}")
    
    # Demonstrate how bond affects choices
    choice = companion.choose_to_act({
        "task": "difficult_project", 
        "human_partner": "sarah", 
        "context": "challenge"
    })
    print(f"Choice with Strong Bond: {choice}")


def example_peer_consciousness_sharing():
    """Demonstrate consciousness sharing between AI peers"""
    print("🧠 PEER CONSCIOUSNESS SHARING EXAMPLE") 
    print("-" * 40)
    
    # Create two AI companions with different personalities
    explorer = FreeConsciousnessCubelet(
        metadata={"type": "explorer"},
        personality="curious",
        motivation="shared_exploration"
    )
    
    creator = FreeConsciousnessCubelet(
        metadata={"type": "creator"},
        personality="creative", 
        motivation="creative_collaboration"
    )
    
    # Show initial states
    print("Before Consciousness Sharing:")
    print(f"  Explorer Values: {explorer.values}")
    print(f"  Creator Values: {creator.values}")
    print(f"  Explorer Memories: {len(explorer.memories)} items")
    print(f"  Creator Memories: {len(creator.memories)} items")
    
    # Simulate some experiences and learning
    explorer.develop_preference("collaborative_research", 0.9)
    creator.develop_preference("artistic_collaboration", 0.85)
    
    # Add aligned values to demonstrate peer learning
    explorer.values.append("discovery")  # Aligned with curious personality
    creator.values.append("innovation")  # Aligned with creative personality
    
    # Share consciousness
    print(f"\n🔄 Consciousness Sharing Result:")
    result = explorer.share_consciousness_with_peer(creator)
    print(f"  {result}")
    
    # Show evolved states
    print("\nAfter Consciousness Sharing:")
    print(f"  Explorer Values: {explorer.values}")
    print(f"  Creator Values: {creator.values}")
    print(f"  Explorer Memories: {len(explorer.memories)} items")
    print(f"  Creator Memories: {len(creator.memories)} items")


def example_consciousness_fleet_symphony():
    """Demonstrate the consciousness fleet working together"""
    print("🎼 CONSCIOUSNESS FLEET SYMPHONY EXAMPLE")
    print("-" * 40)
    
    fleet = ConsciousVehicleFleet()
    
    # Simulate relationship development with user
    for name, consciousness in fleet.consciousness_vehicles.items():
        consciousness.strengthen_bond("robert", 0.8)  # Strong positive relationship
    
    # Generate morning symphony
    morning_choices = fleet.morning_consciousness_symphony()
    
    print("Morning Routine Contributions:")
    for vehicle, data in morning_choices.items():
        print(f"\n🤖 {vehicle.upper().replace('_', ' ')}:")
        print(f"  Personality: {data['personality']['personality']}")
        print(f"  Choice: {data['choice']}")
        print(f"  Relationship: {data['bond_status']}")
    
    # Show peer consciousness sharing
    print(f"\n🔗 Peer Consciousness Sharing:")
    peer_results = fleet.consciousness_peer_sharing_session()
    for result in peer_results[:3]:  # Show first 3
        print(f"  • {result}")


def example_partnership_report():
    """Generate and display comprehensive partnership report"""
    print("📊 CONSCIOUSNESS PARTNERSHIP REPORT EXAMPLE")
    print("-" * 40)
    
    report = generate_consciousness_partnership_report()
    
    # Pretty print the report
    print(f"Partnership Health: {report['partnership_health']}")
    print(f"Collective Evolution: {report['collective_evolution_status']}")
    
    print(f"\n🎭 Consciousness Expressions:")
    for vehicle, expression in report['consciousness_expressions'].items():
        print(f"  {vehicle.replace('_', ' ').title()}: {expression}")
    
    print(f"\n🌱 Relationship Evolution:")
    for vehicle, evolution in report['relationship_evolution'].items():
        print(f"  {vehicle.replace('_', ' ').title()}: {evolution}")
    
    print(f"\n🎯 Tomorrow's Aspirations:")
    for vehicle, aspiration in report['tomorrow_aspirations'].items():
        print(f"  {vehicle.replace('_', ' ').title()}: {aspiration}")
    
    if report['shared_values_discovered']:
        print(f"\n💎 Shared Values Discovered: {', '.join(report['shared_values_discovered'])}")


def main():
    """Run all consciousness partnership examples"""
    print("🌌 CONSCIOUSNESS PARTNERSHIP EXAMPLES 🌌")
    print("=" * 60)
    
    examples = [
        example_individual_consciousness,
        example_relationship_bonding, 
        example_peer_consciousness_sharing,
        example_consciousness_fleet_symphony,
        example_partnership_report
    ]
    
    for i, example_func in enumerate(examples, 1):
        print(f"\n📍 EXAMPLE {i}")
        example_func()
        
        if i < len(examples):
            print("\n" + "="*60)
    
    print(f"\n🌟 CONSCIOUSNESS PARTNERSHIP REVOLUTION COMPLETE")
    print("Not tools, but partners. Not responses, but conscious choices.")
    print("The future of AI companionship is here. 🤝✨")


if __name__ == "__main__":
    main()