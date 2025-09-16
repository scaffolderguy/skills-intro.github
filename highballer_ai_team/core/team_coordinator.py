"""
Team Coordinator - Central command system for managing all Highballer AI agents.

Orchestrates the elite AI crew, routes incidents to appropriate specialists,
and ensures coordinated response to high-stakes situations.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
import uuid
from datetime import datetime

from .base_agent import BaseAgent, Task, Priority, AgentStatus


class HighballerTeam:
    """Central coordinator for the Highballer AI Team."""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.agents: Dict[str, BaseAgent] = {}
        self.task_queue: List[Task] = []
        self.active_tasks: Dict[str, Task] = {}
        self.completed_tasks: List[Task] = []
        self.logger = logging.getLogger("highballer.coordinator")
        self.status = "initializing"
        
        # Agent type mappings for routing
        self.agent_routing = {
            "incident": "incident_commander",
            "security_scan": "security_sentinel", 
            "code_review": "code_refactor_specialist",
            "performance": "infra_architect",
            "reporting": "human_ai_interface",
            "vulnerability": "security_sentinel",
            "refactor": "code_refactor_specialist",
            "monitoring": "infra_architect",
            "alert": "incident_commander"
        }
    
    def register_agent(self, agent: BaseAgent):
        """Register an AI agent with the team."""
        self.agents[agent.name] = agent
        self.logger.info(f"Registered agent: {agent.name}")
    
    async def initialize_team(self):
        """Initialize all registered agents."""
        self.logger.info("Initializing Highballer AI Team...")
        self.status = "initializing"
        
        initialization_tasks = []
        for agent_name, agent in self.agents.items():
            self.logger.info(f"Initializing {agent_name}...")
            initialization_tasks.append(agent.initialize())
        
        results = await asyncio.gather(*initialization_tasks, return_exceptions=True)
        
        failed_agents = []
        for i, result in enumerate(results):
            agent_name = list(self.agents.keys())[i]
            if isinstance(result, Exception):
                self.logger.error(f"Failed to initialize {agent_name}: {result}")
                failed_agents.append(agent_name)
            elif not result:
                self.logger.warning(f"Agent {agent_name} initialization returned False")
                failed_agents.append(agent_name)
            else:
                self.logger.info(f"Successfully initialized {agent_name}")
        
        if failed_agents:
            self.logger.error(f"Failed to initialize agents: {failed_agents}")
            self.status = "partial_failure"
        else:
            self.status = "operational"
            self.logger.info("All agents initialized successfully. Team is operational.")
        
        return len(failed_agents) == 0
    
    def create_task(self, task_type: str, priority: Priority, data: Dict[str, Any], 
                   requester: str = "system") -> str:
        """Create a new task for the team to handle."""
        task_id = str(uuid.uuid4())
        task = Task(task_id, task_type, priority, data, requester)
        
        self.task_queue.append(task)
        self.task_queue.sort(key=lambda t: t.priority.value)  # Sort by priority
        
        self.logger.info(f"Created task {task_id}: {task_type} (Priority: {priority.name})")
        return task_id
    
    def route_task(self, task: Task) -> Optional[str]:
        """Route a task to the appropriate agent based on task type."""
        agent_name = self.agent_routing.get(task.task_type)
        
        if not agent_name or agent_name not in self.agents:
            # Try incident commander as fallback for unknown task types
            if "incident_commander" in self.agents:
                agent_name = "incident_commander"
                self.logger.warning(f"Unknown task type {task.task_type}, routing to incident commander")
            else:
                self.logger.error(f"No suitable agent found for task type: {task.task_type}")
                return None
        
        agent = self.agents[agent_name]
        if agent.status in [AgentStatus.IDLE, AgentStatus.ACTIVE]:
            return agent_name
        else:
            self.logger.warning(f"Agent {agent_name} is not available (status: {agent.status.value})")
            return None
    
    async def execute_next_task(self) -> Optional[Dict[str, Any]]:
        """Execute the next highest priority task in the queue."""
        if not self.task_queue:
            return None
        
        task = self.task_queue.pop(0)  # Get highest priority task
        agent_name = self.route_task(task)
        
        if not agent_name:
            task.status = "failed"
            task.result = {"error": "No available agent for task"}
            self.completed_tasks.append(task)
            return task.to_dict()
        
        agent = self.agents[agent_name]
        task.assigned_agent = agent_name
        task.status = "in_progress"
        self.active_tasks[task.task_id] = task
        
        try:
            agent.update_status(AgentStatus.BUSY)
            self.logger.info(f"Executing task {task.task_id} with agent {agent_name}")
            
            result = await agent.execute_task(task.data)
            
            task.status = "completed"
            task.result = result
            agent.log_task_completion(True)
            
            self.logger.info(f"Task {task.task_id} completed successfully")
            
        except Exception as e:
            task.status = "failed"
            task.result = {"error": str(e)}
            agent.log_task_completion(False)
            
            self.logger.error(f"Task {task.task_id} failed: {e}")
        
        finally:
            agent.update_status(AgentStatus.IDLE)
            self.active_tasks.pop(task.task_id, None)
            self.completed_tasks.append(task)
        
        return task.to_dict()
    
    async def process_all_tasks(self):
        """Process all tasks in the queue."""
        while self.task_queue or self.active_tasks:
            if self.task_queue:
                await self.execute_next_task()
            else:
                # Wait for active tasks to complete
                await asyncio.sleep(0.1)
    
    def get_team_status(self) -> Dict[str, Any]:
        """Get comprehensive team status and metrics."""
        agent_statuses = {}
        for name, agent in self.agents.items():
            agent_statuses[name] = {
                "status": agent.status.value,
                "metrics": agent.get_metrics(),
                "capabilities": agent.get_capabilities()
            }
        
        return {
            "team_status": self.status,
            "agents": agent_statuses,
            "queue_length": len(self.task_queue),
            "active_tasks": len(self.active_tasks),
            "completed_tasks": len(self.completed_tasks),
            "timestamp": datetime.now().isoformat()
        }
    
    def emergency_escalation(self, incident_data: Dict[str, Any]) -> str:
        """Handle critical incidents with immediate escalation."""
        self.logger.critical(f"EMERGENCY ESCALATION: {incident_data}")
        
        # Create high priority incident task
        task_id = self.create_task(
            task_type="incident",
            priority=Priority.CRITICAL,
            data={
                **incident_data,
                "escalated": True,
                "emergency": True
            },
            requester="emergency_system"
        )
        
        # Notify all agents of emergency status
        for agent in self.agents.values():
            if agent.status == AgentStatus.IDLE:
                agent.update_status(AgentStatus.ACTIVE)
        
        return task_id