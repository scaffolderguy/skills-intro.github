"""Base AI agent class and core framework components."""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from enum import Enum
import logging
import datetime


class Priority(Enum):
    """Incident priority levels."""
    CRITICAL = 1
    HIGH = 2
    MEDIUM = 3
    LOW = 4


class AgentStatus(Enum):
    """Agent operational status."""
    IDLE = "idle"
    ACTIVE = "active"
    BUSY = "busy"
    ERROR = "error"
    OFFLINE = "offline"


class BaseAgent(ABC):
    """Base class for all Highballer AI agents."""
    
    def __init__(self, name: str, config: Optional[Dict[str, Any]] = None):
        self.name = name
        self.config = config or {}
        self.status = AgentStatus.IDLE
        self.logger = logging.getLogger(f"highballer.{name}")
        self.metrics = {
            "tasks_completed": 0,
            "tasks_failed": 0,
            "uptime_start": datetime.datetime.now(),
            "last_activity": None
        }
    
    @abstractmethod
    async def initialize(self) -> bool:
        """Initialize the agent. Must be implemented by subclasses."""
        pass
    
    @abstractmethod
    async def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a task. Must be implemented by subclasses."""
        pass
    
    @abstractmethod
    def get_capabilities(self) -> List[str]:
        """Return list of agent capabilities."""
        pass
    
    def update_status(self, status: AgentStatus):
        """Update agent status."""
        self.status = status
        self.metrics["last_activity"] = datetime.datetime.now()
        self.logger.info(f"Status updated to: {status.value}")
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get agent performance metrics."""
        uptime = datetime.datetime.now() - self.metrics["uptime_start"]
        return {
            **self.metrics,
            "uptime_seconds": uptime.total_seconds(),
            "status": self.status.value
        }
    
    def log_task_completion(self, success: bool):
        """Log task completion statistics."""
        if success:
            self.metrics["tasks_completed"] += 1
        else:
            self.metrics["tasks_failed"] += 1
        self.metrics["last_activity"] = datetime.datetime.now()


class Task:
    """Represents a task for agents to execute."""
    
    def __init__(self, task_id: str, task_type: str, priority: Priority, 
                 data: Dict[str, Any], requester: str):
        self.task_id = task_id
        self.task_type = task_type
        self.priority = priority
        self.data = data
        self.requester = requester
        self.created_at = datetime.datetime.now()
        self.assigned_agent = None
        self.status = "pending"
        self.result = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert task to dictionary representation."""
        return {
            "task_id": self.task_id,
            "task_type": self.task_type,
            "priority": self.priority.value,
            "data": self.data,
            "requester": self.requester,
            "created_at": self.created_at.isoformat(),
            "assigned_agent": self.assigned_agent,
            "status": self.status,
            "result": self.result
        }