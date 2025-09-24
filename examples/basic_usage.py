#!/usr/bin/env python3
"""
🧪 Bellhop Multi-Agent Example: Basic Usage

This example demonstrates how to set up and use the Bellhop AI multi-agent mesh
with AutoGen agents for delegation and coordination.
"""

import sys
import os
import asyncio

# Add parent directory to path to import bellhop
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from bellhop import BellhopRouter, ClipboardDigest
from bellhop.agent_scanner import AgentScanner


class MockAgent:
    """Mock agent for demonstration purposes"""
    
    def __init__(self, name: str, system_message: str, tools: list = None):
        self.name = name
        self.system_message = system_message
        self.tools = tools or []
        self.model_client_stream = False
    
    def generate(self, prompt: str) -> str:
        return f"[{self.name}] Processing: {prompt[:100]}... -> Mock response from {self.name}"
    
    def chat(self, message: str) -> str:
        return self.generate(message)


def create_example_agents():
    """Create example agents for the demo"""
    agents = [
        MockAgent(
            name="Nova",
            system_message="I am Nova, a creative AI assistant specializing in ideation and brainstorming.",
            tools=["idea_generator", "creativity_booster"]
        ),
        MockAgent(
            name="Copilot",
            system_message="I am Copilot, a coding assistant that helps with programming tasks.",
            tools=["code_generator", "bug_fixer", "test_writer", "documentation"]
        ),
        MockAgent(
            name="DataAnalyst",
            system_message="I am a data analysis specialist focused on insights and visualization.",
            tools=["data_processor", "chart_generator"]
        )
    ]
    return agents


def demonstrate_fingerprinting():
    """Demonstrate agent fingerprinting and resonance scanning"""
    print("🧬 Demonstrating Agent Fingerprinting & Resonance")
    print("=" * 50)
    
    scanner = AgentScanner()
    agents = create_example_agents()
    
    for agent in agents:
        print(f"\n🤖 Agent: {agent.name}")
        evaluation = scanner.evaluate_agent(agent, "Help me write a Python function")
        
        print(f"  Fingerprint: {evaluation['fingerprint']['behavior_hash']}")
        print(f"  Trust Score: {evaluation['trust_score']}")
        print(f"  Resonance: {evaluation['resonance_score']:.3f}")
        print(f"  Response: {evaluation['test_response'][:80]}...")


def demonstrate_delegation():
    """Demonstrate task delegation through Bellhop router"""
    print("\n🎯 Demonstrating Task Delegation")
    print("=" * 50)
    
    # Create router and register agents
    router = BellhopRouter()
    agents = create_example_agents()
    
    for agent in agents:
        router.register_agent(agent)
    
    # Test different types of tasks
    tasks = [
        "Write a Python function to calculate fibonacci numbers",
        "Generate creative ideas for a mobile app",
        "Analyze sales data and create visualizations",
        "Help me debug this JavaScript code"
    ]
    
    for task in tasks:
        print(f"\n📋 Task: {task}")
        result = router.delegate_task(task)
        print(f"  ✅ Assigned to: {result.get('agent', 'None')}")
        print(f"  📊 Result: {result.get('result', 'No result')[:80]}...")


def demonstrate_clipboard_digest():
    """Demonstrate clipboard monitoring and digest"""
    print("\n📋 Demonstrating Clipboard Digest")
    print("=" * 50)
    
    digest = ClipboardDigest()
    
    # Simulate clipboard content (since we can't access real clipboard in demo)
    import pyperclip
    
    sample_content = [
        "def hello_world():\n    print('Hello, World!')",
        "Remember to buy milk and eggs",
        "Meeting at 3 PM with the team",
        "https://github.com/microsoft/autogen"
    ]
    
    for content in sample_content:
        try:
            pyperclip.copy(content)
            result = digest.digest_clipboard(auto_log_notion=False)  # Don't try Notion in demo
            print(f"  📄 Content: {content[:50]}...")
            print(f"  🔄 Status: {result['status']}")
        except Exception as e:
            print(f"  ⚠️  Clipboard demo skipped: {e}")
            break
    
    # Show stats
    stats = digest.get_stats()
    print(f"\n📊 Digest Stats: {stats['total_items']} items, {stats['total_characters']} chars")


def demonstrate_mesh_coordination():
    """Demonstrate full mesh coordination"""
    print("\n🌐 Demonstrating Mesh Coordination")
    print("=" * 50)
    
    router = BellhopRouter()
    agents = create_example_agents()
    
    # Register all agents
    for agent in agents:
        router.register_agent(agent)
    
    # Register a webhook
    def process_webhook_data(data):
        return f"Processed webhook data: {data}"
    
    router.register_webhook("data_processor", process_webhook_data)
    
    # Trigger webhook
    webhook_result = router.trigger_webhook("data_processor", {"user_id": 123, "action": "login"})
    print(f"🔗 Webhook result: {webhook_result}")
    
    # Show mesh status
    status = router.get_mesh_status()
    print(f"\n🏛️  Mesh Status:")
    print(f"  Active agents: {status['active_agents']}")
    print(f"  Registered webhooks: {len(status['registered_webhooks'])}")
    print(f"  Agent profiles: {list(status['profiles'].keys())}")


async def demonstrate_ambient_monitoring():
    """Demonstrate ambient monitoring (brief demo)"""
    print("\n🌊 Demonstrating Ambient Monitoring")
    print("=" * 50)
    print("Starting 10-second ambient monitoring demo...")
    
    router = BellhopRouter()
    agents = create_example_agents()
    
    for agent in agents:
        router.register_agent(agent)
    
    # Run monitoring for just 10 seconds as demo
    monitoring_task = asyncio.create_task(router.start_ambient_monitoring(clipboard_interval=5))
    
    try:
        await asyncio.wait_for(monitoring_task, timeout=10)
    except asyncio.TimeoutError:
        monitoring_task.cancel()
        print("✅ Ambient monitoring demo completed")


def main():
    """Run all demonstrations"""
    print("🚀 Bellhop AI Multi-Agent Mesh Demo")
    print("AutoGen + Bellhop AI = Ambient Multi-Agent Coordination")
    print("=" * 60)
    
    # Run synchronous demos
    demonstrate_fingerprinting()
    demonstrate_delegation()
    demonstrate_clipboard_digest()
    demonstrate_mesh_coordination()
    
    # Run async demo
    print("\n" + "=" * 60)
    asyncio.run(demonstrate_ambient_monitoring())
    
    print("\n🎉 Demo completed! The Bellhop AI mesh is ready for your agents.")
    print("\nNext steps:")
    print("1. Install dependencies: pip install -r requirements.txt")
    print("2. Configure Notion integration (optional)")
    print("3. Replace MockAgent with real AutoGen agents")
    print("4. Start building your ambient AI mesh!")


if __name__ == "__main__":
    main()