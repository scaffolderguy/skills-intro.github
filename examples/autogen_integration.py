#!/usr/bin/env python3
"""
🧪 Bellhop + AutoGen Integration Example

This example shows how to integrate Bellhop AI with real AutoGen agents
for intelligent multi-agent coordination and task delegation.
"""

import sys
import os
import asyncio

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from bellhop import BellhopRouter


# Mock AutoGen-style agents for demonstration
class AutoGenAssistant:
    """Mock AutoGen Assistant agent"""
    
    def __init__(self, name: str, system_message: str, model_config: dict = None):
        self.name = name
        self.system_message = system_message
        self.model_config = model_config or {"model": "gpt-4"}
        self.tools = []
        self.model_client_stream = False
        
    def generate_reply(self, messages, sender=None):
        """AutoGen-style reply generation"""
        if isinstance(messages, list) and messages:
            last_message = messages[-1]["content"]
        else:
            last_message = str(messages)
            
        return f"[{self.name}] AutoGen response to: {last_message}"
    
    def chat(self, message: str) -> str:
        """Simplified chat interface"""
        return self.generate_reply([{"content": message}])


class AutoGenUserProxy:
    """Mock AutoGen UserProxy agent"""
    
    def __init__(self, name: str, system_message: str = "", code_execution_config=None):
        self.name = name
        self.system_message = system_message
        self.code_execution_config = code_execution_config or {}
        self.tools = ["code_execution"] if code_execution_config else []
        self.model_client_stream = False
        
    def generate_reply(self, messages, sender=None):
        """UserProxy typically executes code or coordinates"""
        if isinstance(messages, list) and messages:
            last_message = messages[-1]["content"]
        else:
            last_message = str(messages)
            
        return f"[{self.name}] Executing/coordinating: {last_message}"
    
    def chat(self, message: str) -> str:
        return self.generate_reply([{"content": message}])


def create_autogen_agents():
    """Create AutoGen-style agents for the mesh"""
    
    # Coding assistant
    copilot = AutoGenAssistant(
        name="CodingCopilot",
        system_message="""You are a senior software engineer AI assistant. 
        You help with code writing, debugging, testing, and architecture decisions.
        You're proficient in Python, JavaScript, TypeScript, and modern frameworks.""",
        model_config={"model": "gpt-4", "temperature": 0.1}
    )
    copilot.tools = ["code_generator", "debugger", "test_writer", "code_reviewer"]
    
    # Creative assistant  
    nova = AutoGenAssistant(
        name="CreativeNova",
        system_message="""You are a creative AI assistant specializing in ideation,
        brainstorming, content creation, and innovative problem-solving.
        You excel at thinking outside the box and generating novel ideas.""",
        model_config={"model": "gpt-4", "temperature": 0.8}
    )
    nova.tools = ["idea_generator", "brainstorming", "content_writer"]
    
    # Data analyst
    analyst = AutoGenAssistant(
        name="DataWiz",
        system_message="""You are a data analysis expert. You help with data processing,
        statistical analysis, visualization, and deriving insights from datasets.
        You're skilled in pandas, numpy, matplotlib, and machine learning.""",
        model_config={"model": "gpt-4", "temperature": 0.2}
    )
    analyst.tools = ["data_processor", "stats_analyzer", "visualizer", "ml_modeler"]
    
    # Execution coordinator
    executor = AutoGenUserProxy(
        name="TaskExecutor",
        system_message="I coordinate task execution and run code when needed.",
        code_execution_config={"work_dir": "/tmp", "use_docker": False}
    )
    
    return [copilot, nova, analyst, executor]


def demonstrate_autogen_mesh():
    """Demonstrate Bellhop coordinating AutoGen agents"""
    print("🤖 AutoGen + Bellhop AI Mesh Demo")
    print("="*50)
    
    # Initialize Bellhop router
    router = BellhopRouter({
        "clipboard_monitor_interval": 60,
        "agent_health_check_interval": 120
    })
    
    # Register AutoGen agents
    agents = create_autogen_agents()
    for agent in agents:
        agent_id = router.register_agent(agent)
        print(f"✅ Registered {agent_id} with {len(agent.tools)} tools")
    
    print("\n🎯 Task Delegation Examples")
    print("-"*30)
    
    # Test various tasks and see which agents Bellhop chooses
    tasks = [
        {
            "task": "Write a Python function to analyze CSV data and create visualizations",
            "expected_agent": "DataWiz"
        },
        {
            "task": "Generate creative ideas for a social media campaign about sustainability",
            "expected_agent": "CreativeNova"
        },
        {
            "task": "Debug this JavaScript code that's not handling async operations correctly",
            "expected_agent": "CodingCopilot"
        },
        {
            "task": "Execute a data processing pipeline and generate a report",
            "expected_agent": "TaskExecutor"
        }
    ]
    
    for i, task_info in enumerate(tasks, 1):
        task = task_info["task"]
        expected = task_info["expected_agent"]
        
        print(f"\n{i}. Task: {task}")
        
        # Find best agent
        best_agent = router.find_best_agent_for_task(task)
        print(f"   🎯 Bellhop chose: {best_agent}")
        print(f"   🔮 Expected: {expected}")
        
        # Delegate task
        result = router.delegate_task(task)
        if "error" not in result:
            print(f"   ✅ Status: {result['status']}")
            print(f"   📋 Response: {result['result'][:80]}...")
        else:
            print(f"   ❌ Error: {result['error']}")


def demonstrate_webhook_integration():
    """Show webhook integration for external triggers"""
    print("\n🔗 Webhook Integration Demo")
    print("-"*30)
    
    router = BellhopRouter()
    agents = create_autogen_agents()
    
    for agent in agents:
        router.register_agent(agent)
    
    # Register webhooks for different events
    def handle_code_review(data):
        """Handle code review webhook"""
        pr_description = data.get("pr_description", "Code review requested")
        result = router.delegate_task(f"Review this code: {pr_description}")
        return {"review_result": result, "status": "completed"}
    
    def handle_idea_request(data):
        """Handle creative idea webhook"""
        topic = data.get("topic", "general innovation")
        result = router.delegate_task(f"Generate creative ideas for: {topic}")
        return {"ideas": result, "status": "completed"}
    
    def handle_data_analysis(data):
        """Handle data analysis webhook"""
        dataset_info = data.get("dataset", "unknown dataset")
        result = router.delegate_task(f"Analyze this dataset: {dataset_info}")
        return {"analysis": result, "status": "completed"}
    
    # Register webhooks
    router.register_webhook("code_review", handle_code_review)
    router.register_webhook("idea_request", handle_idea_request)
    router.register_webhook("data_analysis", handle_data_analysis)
    
    print("✅ Registered webhooks: code_review, idea_request, data_analysis")
    
    # Test webhook triggers
    test_webhooks = [
        ("code_review", {"pr_description": "Added new authentication system"}),
        ("idea_request", {"topic": "mobile app for remote workers"}),
        ("data_analysis", {"dataset": "customer churn data from Q3"})
    ]
    
    for webhook_name, data in test_webhooks:
        print(f"\n🔥 Triggering {webhook_name} webhook...")
        result = router.trigger_webhook(webhook_name, data)
        print(f"   Status: {result['status']}")
        if result['status'] == 'success':
            print(f"   Result keys: {list(result['result'].keys())}")


def demonstrate_agent_profiles():
    """Show agent fingerprinting and trust scores"""
    print("\n🧬 Agent Profiling & Trust Scores")
    print("-"*35)
    
    router = BellhopRouter()
    agents = create_autogen_agents()
    
    for agent in agents:
        router.register_agent(agent)
    
    # Evaluate agents for different types of tasks
    evaluation_tasks = [
        "Write clean, well-documented Python code",
        "Come up with innovative product ideas",
        "Analyze trends in financial data",
        "Execute and coordinate complex workflows"
    ]
    
    for task in evaluation_tasks:
        print(f"\n📋 Task: {task}")
        print("   Agent Evaluations:")
        
        for agent_name in router.agents.keys():
            evaluation = router.evaluate_agent_for_task(agent_name, task)
            if "error" not in evaluation:
                print(f"   • {agent_name:15} | Trust: {evaluation['task_suitability']:.3f} | "
                      f"Resonance: {evaluation['resonance_score']:.3f} | "
                      f"Rec: {evaluation['recommendation']}")


async def demonstrate_ambient_mesh():
    """Show ambient monitoring capabilities"""
    print("\n🌊 Ambient Mesh Monitoring")
    print("-"*27)
    
    router = BellhopRouter()
    agents = create_autogen_agents()
    
    for agent in agents:
        router.register_agent(agent)
    
    print("🔄 Starting ambient monitoring (15 seconds)...")
    
    # Create monitoring task
    monitoring_task = asyncio.create_task(
        router.start_ambient_monitoring(clipboard_interval=5)
    )
    
    # Let it run for a short demo period
    try:
        await asyncio.wait_for(monitoring_task, timeout=15)
    except asyncio.TimeoutError:
        monitoring_task.cancel()
        print("✅ Monitoring demo completed")
    
    # Show final mesh status
    status = router.get_mesh_status()
    print(f"\n📊 Final Mesh Status:")
    print(f"   Active agents: {status['active_agents']}")
    print(f"   Completed tasks: {status['active_tasks']}")
    print(f"   Agent trust scores:")
    for name, profile in status['profiles'].items():
        print(f"   • {name:15} | Trust: {profile['trust_score']:.3f}")


def main():
    """Run the complete AutoGen integration demo"""
    print("🚀 Bellhop AI × AutoGen Integration")
    print("Multi-Agent Mesh with Intelligent Coordination")
    print("="*55)
    
    demonstrate_autogen_mesh()
    demonstrate_webhook_integration()
    demonstrate_agent_profiles()
    
    print("\n" + "="*55)
    asyncio.run(demonstrate_ambient_mesh())
    
    print("\n🎉 AutoGen Integration Demo Complete!")
    print("\n🔧 Next Steps:")
    print("1. Replace mock agents with real AutoGen agents")
    print("2. Configure OpenAI API keys for LLM backends")
    print("3. Set up Notion integration for clipboard digests")
    print("4. Deploy with proper async orchestration")
    print("5. Add custom tools and specialized agent behaviors")


if __name__ == "__main__":
    main()