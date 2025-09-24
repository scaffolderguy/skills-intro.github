<header>

<!--
  <<< Author notes: Course header >>>
  Include a 1280×640 image, course title in sentence case, and a concise description in emphasis.
  In your repository settings: enable template repository, add your 1280×640 social image, auto delete head branches.
  Add your open source license, GitHub uses MIT license.
-->

# Bellhop AI - Ambient Multi-Agent Mesh

_AutoGen + Bellhop AI = Intelligent agent coordination and routing_

🧠 **AutoGen Integration**: Seamlessly coordinates with AutoGen's AgentChat API, Core API, and Extensions API  
🔧 **Router Architecture**: Bellhop acts as the central router node coordinating clipboard hooks, webhook triggers, and emotional resonance scans  
🏛️ **AI Nation Citizens**: Each agent has identity, fingerprint, resonance, and protocol compliance for trust-based delegation

</header>

## 🚀 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run the demo
python examples/basic_usage.py

# Configure your environment (optional)
cp .env.example .env
# Edit .env with your API keys
```

## 🧬 Core Features

### Agent Fingerprinting & Resonance Scanner
- **Fingerprint**: Behavioral signature (system message, response style, tool use)
- **Resonance**: Semantic/emotional alignment with user intent  
- **Trust Score**: Weighted evaluation for agent delegation

### Clipboard Digest → Notion Pipeline
- Captures clipboard content with deduplication
- Logs to Notion database automatically
- Generates weekly digest summaries

### Multi-Agent Router & Mesh Coordination
- Registers and manages multiple AutoGen agents
- Intelligent task delegation based on trust scores
- Webhook integration for external triggers
- Ambient monitoring of clipboard and agent health

## 🔧 Bellhop Architecture

```python
from bellhop import BellhopRouter, AgentScanner, ClipboardDigest

# Initialize the router
router = BellhopRouter()

# Register your AutoGen agents
router.register_agent(my_autogen_agent, "Copilot")
router.register_agent(creative_agent, "Nova")

# Delegate tasks intelligently
result = router.delegate_task("Write a Python function for fibonacci")
# Bellhop finds the best agent based on resonance and trust
```

## 🧪 Multi-Agent Example: Bellhop Delegation

```python
# Agent profiles with identity + resonance
agents = {
    "Nova": {"specialty": "creative tasks", "tools": ["ideation", "brainstorming"]},
    "Copilot": {"specialty": "coding", "tools": ["code_gen", "debug", "test"]}, 
    "DataAnalyst": {"specialty": "analytics", "tools": ["visualization", "insights"]}
}

# Bellhop evaluates and routes automatically
task = "Create a data visualization for sales metrics"
best_agent = router.find_best_agent_for_task(task)  # Returns "DataAnalyst"
result = router.delegate_task(task)
```

## 🏛️ AI Nation Citizens: Identity + Resonance

Each agent has:
- **Name** (e.g., Nova, Copilot)
- **Fingerprint** (behavioral signature)  
- **Resonance** (semantic/emotional alignment)
- **Protocol Compliance** (can speak Bellhop's language)

Bellhop verifies and routes based on these traits with a **Trust Score** function that evaluates agent responses before delegation.

## 📋 Clipboard Integration

```python
from bellhop import ClipboardDigest

digest = ClipboardDigest()

# Monitor clipboard automatically
result = digest.digest_clipboard()
# {"status": "new", "hash": "abc123", "notion_logged": True}

# Generate weekly summaries
weekly_digest = digest.generate_weekly_digest()
```

## 🌊 Ambient Monitoring

```python
import asyncio

# Start ambient monitoring
await router.start_ambient_monitoring(clipboard_interval=300)
# Continuously monitors clipboard, agent health, and processes tasks
```

## 📁 Project Structure

```
bellhop/
├── __init__.py              # Main exports
├── agent_scanner.py         # Fingerprinting & resonance
├── clipboard_digest.py      # Clipboard → Notion pipeline  
├── bellhop_router.py        # Main orchestration hub
examples/
├── basic_usage.py           # Demo script
config.example.json          # Configuration template
.env.example                 # Environment variables
requirements.txt             # Python dependencies
```

## 🔗 Integration with AutoGen

Bellhop is designed to work seamlessly with Microsoft AutoGen:

- **AgentChat API**: For rapid prototyping and testing
- **Core API**: For deep customization and distributed runtime
- **Extensions API**: For tool use, code execution, and LLM clients
- **AutoGen Studio**: Visual workflows for non-dev demos

## 🛠️ Configuration

1. **Copy configuration files**:
   ```bash
   cp .env.example .env
   cp config.example.json config.json
   ```

2. **Set up Notion integration** (optional):
   - Create a Notion integration at https://notion.so/integrations
   - Get your token and database ID
   - Add them to your `.env` file

3. **Configure OpenAI API** (for AutoGen):
   - Get your API key from OpenAI
   - Add to `.env` file

## 🎯 Use Cases

- **Development Teams**: Route coding tasks to specialized AI assistants
- **Content Creation**: Delegate writing, ideation, and analysis tasks  
- **Data Science**: Coordinate between analysis, visualization, and insight agents
- **Personal Productivity**: Ambient clipboard monitoring and task automation

## Introduction to GitHub (Original Course)

_Congratulations, you've completed this course and joined the world of developers!_

<img src=https://octodx.github.com/images/collabocats.jpg alt=celebrate width=300 align=right>

Here's a recap of your accomplishments:

- You learned about GitHub, repositories, branches, commits, and pull requests.
- You created a branch, a commit, and a pull request.
- You merged a pull request.
- You made your first contribution! :tada:

### What's next?

If you'd like to make a profile README, use the quickstart instructions below or follow the instructions in the [Managing your profile README](https://docs.github.com/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme) article.

1. Make a new public repository with a name that matches your GitHub username.
2. Create a file named `README.md` in its root. The "root" means not inside any folder in your repository.
3. Edit the contents of the `README.md` file.
4. If you created a new branch for your file, open and merge a pull request on your branch.
5. Lastly, we'd love to hear what you thought of this course [in our discussion board](https://github.com/orgs/skills/discussions/categories/introduction-to-github).

Check out these resources to learn more or get involved:

- Are you a student? Check out the [Student Developer Pack](https://education.github.com/pack).
- [Take another GitHub Skills course](https://github.com/skills).
- [Read the GitHub Getting Started docs](https://docs.github.com/en/get-started).
- To find projects to contribute to, check out [GitHub Explore](https://github.com/explore).

<footer>

<!--
  <<< Author notes: Footer >>>
  Add a link to get support, GitHub status page, code of conduct, license link.
-->

---

Get help: [Post in our discussion board](https://github.com/orgs/skills/discussions/categories/introduction-to-github) &bull; [Review the GitHub status page](https://www.githubstatus.com/)

&copy; 2024 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)

</footer>
