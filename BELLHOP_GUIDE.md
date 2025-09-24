# 🤖 Bellhop AI Complete Guide

## Overview

Bellhop AI is an **Ambient Multi-Agent Mesh** that integrates with Microsoft AutoGen to provide intelligent agent coordination, routing, and orchestration. It acts as the "router node" in your agent mesh, coordinating clipboard hooks, webhook triggers, and emotional resonance scans across agents.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Bellhop AI Router                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Agent     │  │  Clipboard  │  │   Webhook   │     │
│  │  Scanner    │  │   Digest    │  │  Handlers   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼────────┐  ┌──────▼──────┐
│   AutoGen    │  │    External     │  │   Notion    │
│   Agents     │  │    Systems      │  │  Database   │
│              │  │   (Webhooks)    │  │             │
└──────────────┘  └─────────────────┘  └─────────────┘
```

## ⚡ Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd skills-intro.github

# Install dependencies
pip install -r requirements.txt

# Copy configuration templates
cp .env.example .env
cp config.example.json config.json
```

### 2. Basic Usage

```python
from bellhop import BellhopRouter

# Initialize router
router = BellhopRouter()

# Register your AutoGen agents
router.register_agent(my_coding_agent, "CodingBot")
router.register_agent(my_creative_agent, "CreativeBot")

# Delegate tasks intelligently
result = router.delegate_task("Write a Python function for data analysis")
# Bellhop automatically chooses the best agent
```

### 3. Run Examples

```bash
# Basic functionality demo
python examples/basic_usage.py

# AutoGen integration demo
python examples/autogen_integration.py  

# Webhook server demo
python examples/webhook_server.py
```

### 4. CLI Usage

```bash
# Show mesh status
python bellhop_cli.py status

# Delegate a task
python bellhop_cli.py delegate "Generate creative marketing ideas"

# Monitor clipboard
python bellhop_cli.py clipboard digest

# Start ambient monitoring
python bellhop_cli.py monitor --interval 300
```

## 🧬 Core Components

### Agent Scanner (Fingerprinting & Resonance)

The Agent Scanner evaluates agents based on:

- **Fingerprint**: Behavioral signature including system message, tool count, agent type
- **Resonance**: Semantic similarity between agent responses and user intent
- **Trust Score**: Weighted evaluation combining resonance, tools, and behavioral factors

```python
from bellhop.agent_scanner import AgentScanner

scanner = AgentScanner()

# Generate agent fingerprint
fingerprint = scanner.generate_fingerprint(agent)

# Calculate resonance with user intent
resonance = scanner.calculate_resonance(agent_response, user_intent)

# Get overall trust score
trust = scanner.trust_score(agent, response, intent)
```

### Clipboard Digest Pipeline

Monitors clipboard content and integrates with Notion:

```python
from bellhop import ClipboardDigest

digest = ClipboardDigest()

# Process current clipboard
result = digest.digest_clipboard()

# Generate weekly summary
summary = digest.generate_weekly_digest()

# Get statistics
stats = digest.get_stats()
```

### Bellhop Router (Main Orchestrator)

The central coordination hub:

```python
from bellhop import BellhopRouter

router = BellhopRouter()

# Register agents
router.register_agent(agent, "AgentName")

# Find best agent for task
best_agent = router.find_best_agent_for_task("task description")

# Delegate with automatic routing
result = router.delegate_task("task description")

# Register webhooks
router.register_webhook("webhook_name", handler_function)

# Get mesh status
status = router.get_mesh_status()
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Notion Integration (Optional)
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id

# OpenAI API (for AutoGen agents)
OPENAI_API_KEY=your_openai_api_key

# Bellhop Settings
BELLHOP_LOG_LEVEL=INFO
CLIPBOARD_MONITOR_INTERVAL=300
AGENT_HEALTH_CHECK_INTERVAL=600
```

### Configuration File (config.json)

```json
{
  "bellhop": {
    "router": {
      "log_level": "INFO",
      "clipboard_monitor_interval": 300,
      "agent_health_check_interval": 600
    },
    "agent_scanner": {
      "model_name": "all-MiniLM-L6-v2",
      "trust_score_weights": {
        "resonance": 0.7,
        "tool_bonus": 0.05,
        "system_message_bonus": 0.1
      }
    }
  }
}
```

## 🚀 AutoGen Integration

### Basic Integration

```python
from autogen import AssistantAgent, UserProxyAgent
from bellhop import BellhopRouter

# Create AutoGen agents
coding_agent = AssistantAgent(
    name="CodingAssistant",
    system_message="You are a coding expert...",
    llm_config={"model": "gpt-4"}
)

creative_agent = AssistantAgent(
    name="CreativeWriter",
    system_message="You are a creative writing expert...",
    llm_config={"model": "gpt-4"}
)

# Initialize Bellhop
router = BellhopRouter()

# Register agents with Bellhop
router.register_agent(coding_agent)
router.register_agent(creative_agent)

# Use Bellhop for intelligent routing
task = "Write a Python script for data visualization"
result = router.delegate_task(task)
# Bellhop automatically routes to the most suitable agent
```

### Advanced Multi-Agent Workflow

```python
# Set up complex agent mesh
agents = {
    "planner": AssistantAgent("Planner", "You plan and coordinate tasks"),
    "coder": AssistantAgent("Coder", "You write and debug code"),
    "reviewer": AssistantAgent("Reviewer", "You review and improve code"),
    "tester": AssistantAgent("Tester", "You write and run tests")
}

# Register all agents
for name, agent in agents.items():
    router.register_agent(agent, name)

# Create workflow through intelligent delegation
tasks = [
    "Plan a web scraping project architecture",
    "Write Python code for web scraping",
    "Review the scraping code for best practices", 
    "Create unit tests for the scraper"
]

for task in tasks:
    result = router.delegate_task(task)
    print(f"Task: {task}")
    print(f"Assigned to: {result['agent']}")
    print(f"Result: {result['result'][:100]}...")
```

## 🔗 Webhook Integration

### Setting Up Webhooks

```python
# Define webhook handlers
def handle_github_push(data):
    repo = data['repository']['name']
    commits = len(data['commits'])
    
    task = f"Review {commits} commits in {repo}"
    result = router.delegate_task(task)
    
    return {"status": "review_initiated", "agent": result['agent']}

def handle_support_ticket(data):
    priority = data.get('priority', 'normal')
    issue = data.get('description', 'Support needed')
    
    task = f"Handle {priority} priority support: {issue}"
    result = router.delegate_task(task)
    
    return {"status": "ticket_assigned", "agent": result['agent']}

# Register webhooks
router.register_webhook("github-push", handle_github_push)
router.register_webhook("support-ticket", handle_support_ticket)
```

### Webhook Server

```python
from examples.webhook_server import BellhopWebhookServer

# Start webhook server
server = BellhopWebhookServer(router, port=8080)
server.start()

# Now you can receive webhooks at:
# POST http://localhost:8080/github-push
# POST http://localhost:8080/support-ticket
```

## 🌊 Ambient Monitoring

Start continuous monitoring of clipboard and agent health:

```python
import asyncio

# Start ambient monitoring
await router.start_ambient_monitoring(clipboard_interval=300)
```

Or via CLI:
```bash
python bellhop_cli.py monitor --interval 300
```

## 📊 Monitoring & Observability

### Getting Mesh Status

```python
status = router.get_mesh_status()
print(f"Active agents: {status['active_agents']}")
print(f"Agent profiles: {status['profiles']}")
print(f"Clipboard stats: {status['clipboard_stats']}")
```

### Agent Health Checks

```python
# Evaluate specific agent
evaluation = router.evaluate_agent_for_task("CodingBot", "Write Python code")
print(f"Trust score: {evaluation['task_suitability']}")
print(f"Resonance: {evaluation['resonance_score']}")
```

## 🎯 Use Cases

### 1. Development Team Coordination

```python
# Register specialized agents
router.register_agent(backend_agent, "BackendDev")
router.register_agent(frontend_agent, "FrontendDev") 
router.register_agent(devops_agent, "DevOps")
router.register_agent(qa_agent, "QAEngineer")

# Automatic task routing
router.delegate_task("Deploy the microservice to staging")  # → DevOps
router.delegate_task("Fix the React component styling")     # → FrontendDev
router.delegate_task("Optimize database queries")          # → BackendDev
router.delegate_task("Write integration tests")           # → QAEngineer
```

### 2. Content Creation Pipeline

```python
# Content creation agents
router.register_agent(researcher_agent, "Researcher")
router.register_agent(writer_agent, "Writer")
router.register_agent(editor_agent, "Editor")
router.register_agent(seo_agent, "SEOSpecialist")

# Workflow
router.delegate_task("Research trends in AI development")    # → Researcher
router.delegate_task("Write blog post about AI trends")     # → Writer  
router.delegate_task("Edit and improve the blog post")      # → Editor
router.delegate_task("Optimize blog post for SEO")         # → SEOSpecialist
```

### 3. Data Science Workflow

```python
# Data science agents
router.register_agent(data_engineer, "DataEngineer")
router.register_agent(analyst_agent, "DataAnalyst")
router.register_agent(ml_engineer, "MLEngineer")
router.register_agent(viz_agent, "DataViz")

# Pipeline
router.delegate_task("Clean and prepare customer dataset")   # → DataEngineer
router.delegate_task("Analyze customer behavior patterns")   # → DataAnalyst
router.delegate_task("Build predictive model")              # → MLEngineer  
router.delegate_task("Create dashboard visualizations")      # → DataViz
```

## 🔍 Troubleshooting

### Common Issues

1. **Dependencies not installed**: Install with `pip install -r requirements.txt`
2. **Notion integration failing**: Check your `NOTION_TOKEN` and `NOTION_DATABASE_ID`
3. **Low resonance scores**: The fallback method is used when sentence-transformers isn't installed
4. **Agents not found**: Use `router.register_agent()` before delegating tasks

### Debug Mode

```bash
# Enable verbose logging
python bellhop_cli.py --verbose status

# Or in Python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🚀 Next Steps

1. **Scale the mesh**: Add more specialized agents for your domain
2. **Custom tools**: Extend agents with domain-specific tools
3. **Advanced routing**: Implement custom trust score algorithms
4. **Production deployment**: Set up monitoring and error handling
5. **Integration**: Connect with your existing systems via webhooks

## 🤝 Contributing

This is an open-source project. Contributions are welcome! Areas for improvement:

- Additional AutoGen integrations
- More sophisticated routing algorithms  
- Better observability and monitoring
- Performance optimizations
- Extended tool integrations

---

**Built with ❤️ for the AutoGen community**

*Bellhop AI: Where agents meet intelligence*