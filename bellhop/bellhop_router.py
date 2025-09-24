"""
🏛️ Bellhop Router - AI Nation Citizens: Identity + Resonance

Main orchestration hub for the Bellhop AI multi-agent mesh.
Coordinates clipboard hooks, webhook triggers, and emotional resonance scans across agents.
"""

import asyncio
import json
import time
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass
import logging

from .agent_scanner import AgentScanner
from .clipboard_digest import ClipboardDigest


@dataclass
class AgentProfile:
    """AI Nation Citizen profile with identity and resonance data"""
    name: str
    fingerprint: Dict[str, Any]
    resonance_history: List[float]
    trust_score: float
    protocol_compliance: bool = True
    last_active: Optional[float] = None


class BellhopRouter:
    """
    Bellhop Router - Coordinates multi-agent mesh operations
    
    Features:
    - Agent fingerprinting and resonance scanning
    - Clipboard monitoring and digest generation
    - Webhook trigger handling
    - Trust-based agent delegation
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.agents: Dict[str, Any] = {}
        self.agent_profiles: Dict[str, AgentProfile] = {}
        self.scanner = AgentScanner()
        self.clipboard_digest = ClipboardDigest()
        self.webhook_handlers: Dict[str, Callable] = {}
        self.active_tasks: List[str] = []
        
        # Configure logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        self.logger.info("🚀 Bellhop Router initialized")
    
    def register_agent(self, agent: Any, name: Optional[str] = None) -> str:
        """Register an agent in the mesh"""
        agent_name = name or getattr(agent, 'name', f'agent_{len(self.agents)}')
        
        # Generate fingerprint and initial profile
        fingerprint = self.scanner.generate_fingerprint(agent)
        
        profile = AgentProfile(
            name=agent_name,
            fingerprint=fingerprint,
            resonance_history=[],
            trust_score=0.5,  # Default neutral trust
            last_active=time.time()
        )
        
        self.agents[agent_name] = agent
        self.agent_profiles[agent_name] = profile
        
        self.logger.info(f"✅ Registered agent: {agent_name} ({fingerprint['agent_type']})")
        return agent_name
    
    def evaluate_agent_for_task(self, agent_name: str, task_description: str) -> Dict[str, Any]:
        """Evaluate an agent's suitability for a specific task"""
        if agent_name not in self.agents:
            return {"error": f"Agent {agent_name} not found"}
        
        agent = self.agents[agent_name]
        profile = self.agent_profiles[agent_name]
        
        # Use scanner to evaluate agent
        evaluation = self.scanner.evaluate_agent(agent, task_description)
        
        # Update profile with new resonance data
        profile.resonance_history.append(evaluation['resonance_score'])
        profile.trust_score = evaluation['trust_score']
        profile.last_active = time.time()
        
        # Keep only last 10 resonance scores
        if len(profile.resonance_history) > 10:
            profile.resonance_history = profile.resonance_history[-10:]
        
        return {
            "agent_name": agent_name,
            "task_suitability": evaluation['trust_score'],
            "resonance_score": evaluation['resonance_score'],
            "avg_resonance": sum(profile.resonance_history) / len(profile.resonance_history),
            "fingerprint": evaluation['fingerprint'],
            "recommendation": "suitable" if evaluation['trust_score'] > 0.6 else "not_recommended"
        }
    
    def find_best_agent_for_task(self, task_description: str) -> Optional[str]:
        """Find the most suitable agent for a given task"""
        if not self.agents:
            return None
        
        best_agent = None
        best_score = 0.0
        
        for agent_name in self.agents.keys():
            evaluation = self.evaluate_agent_for_task(agent_name, task_description)
            
            if "error" not in evaluation and evaluation['task_suitability'] > best_score:
                best_score = evaluation['task_suitability']
                best_agent = agent_name
        
        self.logger.info(f"🎯 Best agent for task: {best_agent} (score: {best_score:.3f})")
        return best_agent
    
    def delegate_task(self, task_description: str, preferred_agent: Optional[str] = None) -> Dict[str, Any]:
        """Delegate a task to the most suitable agent"""
        target_agent = preferred_agent or self.find_best_agent_for_task(task_description)
        
        if not target_agent:
            return {"error": "No suitable agent found", "task": task_description}
        
        agent = self.agents[target_agent]
        task_id = f"task_{int(time.time())}_{len(self.active_tasks)}"
        
        try:
            # Attempt to execute task on agent
            if hasattr(agent, 'generate'):
                result = agent.generate(task_description)
            elif hasattr(agent, 'chat'):
                result = agent.chat(task_description)
            else:
                result = f"Agent {target_agent} received task: {task_description}"
            
            self.active_tasks.append(task_id)
            
            return {
                "task_id": task_id,
                "agent": target_agent,
                "task": task_description,
                "result": str(result),
                "status": "completed",
                "timestamp": time.time()
            }
            
        except Exception as e:
            self.logger.error(f"Task delegation failed: {e}")
            return {
                "task_id": task_id,
                "agent": target_agent,
                "task": task_description,
                "error": str(e),
                "status": "failed",
                "timestamp": time.time()
            }
    
    def register_webhook(self, webhook_name: str, handler: Callable) -> None:
        """Register a webhook handler"""
        self.webhook_handlers[webhook_name] = handler
        self.logger.info(f"🔗 Registered webhook: {webhook_name}")
    
    def trigger_webhook(self, webhook_name: str, data: Any) -> Dict[str, Any]:
        """Trigger a registered webhook"""
        if webhook_name not in self.webhook_handlers:
            return {"error": f"Webhook {webhook_name} not found"}
        
        try:
            result = self.webhook_handlers[webhook_name](data)
            return {"webhook": webhook_name, "result": result, "status": "success"}
        except Exception as e:
            self.logger.error(f"Webhook {webhook_name} failed: {e}")
            return {"webhook": webhook_name, "error": str(e), "status": "failed"}
    
    def monitor_clipboard(self, interval: int = 60) -> Dict[str, Any]:
        """Monitor clipboard and process new content"""
        result = self.clipboard_digest.digest_clipboard()
        
        # If new content found, potentially delegate to an agent
        if result["status"] == "new":
            content = self.clipboard_digest.digest_log[result["hash"]]["content"]
            
            # Find agent to process clipboard content
            processing_task = f"Process this clipboard content: {content[:200]}..."
            delegation_result = self.delegate_task(processing_task)
            result["agent_processing"] = delegation_result
        
        return result
    
    def get_mesh_status(self) -> Dict[str, Any]:
        """Get overall status of the agent mesh"""
        return {
            "active_agents": len(self.agents),
            "agent_names": list(self.agents.keys()),
            "active_tasks": len(self.active_tasks),
            "registered_webhooks": list(self.webhook_handlers.keys()),
            "clipboard_stats": self.clipboard_digest.get_stats(),
            "profiles": {
                name: {
                    "trust_score": profile.trust_score,
                    "avg_resonance": sum(profile.resonance_history) / len(profile.resonance_history) if profile.resonance_history else 0,
                    "last_active": profile.last_active
                }
                for name, profile in self.agent_profiles.items()
            }
        }
    
    async def start_ambient_monitoring(self, clipboard_interval: int = 300):
        """Start ambient monitoring of clipboard and agent mesh"""
        self.logger.info("🌊 Starting ambient monitoring...")
        
        while True:
            try:
                # Monitor clipboard
                clipboard_result = self.monitor_clipboard()
                if clipboard_result["status"] != "empty":
                    self.logger.info(f"📋 Clipboard: {clipboard_result['status']}")
                
                # Health check on agents
                for agent_name in list(self.agents.keys()):
                    try:
                        self.evaluate_agent_for_task(agent_name, "health check")
                    except Exception as e:
                        self.logger.warning(f"Agent {agent_name} health check failed: {e}")
                
                await asyncio.sleep(clipboard_interval)
                
            except KeyboardInterrupt:
                self.logger.info("🛑 Stopping ambient monitoring")
                break
            except Exception as e:
                self.logger.error(f"Monitoring error: {e}")
                await asyncio.sleep(60)  # Wait before retrying


# Factory function for easy setup
def create_bellhop_router(config: Optional[Dict[str, Any]] = None) -> BellhopRouter:
    """Create and configure a Bellhop router"""
    return BellhopRouter(config)