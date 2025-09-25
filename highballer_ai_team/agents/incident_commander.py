"""
Incident AI Commander - Elite incident detection and triage system.

Detects and triages issues immediately, routes incidents to appropriate specialists,
and coordinates response efforts while logging all actions.
"""

import asyncio
from typing import Dict, Any, List, Optional
import json
from datetime import datetime

from ..core.base_agent import BaseAgent, AgentStatus, Priority


class IncidentCommanderAI(BaseAgent):
    """
    Incident AI Commander - Central incident management and triage system.
    
    Responsibilities:
    - Detect and classify incidents
    - Triage based on severity and impact
    - Route to appropriate specialist agents
    - Coordinate multi-agent responses
    - Maintain incident logs and status
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__("incident_commander", config)
        self.incident_log = []
        self.active_incidents = {}
        self.triage_rules = {
            "critical": {
                "keywords": ["outage", "down", "critical", "emergency", "security breach", "data loss"],
                "response_time": 300,  # 5 minutes
                "escalation_threshold": 1800  # 30 minutes
            },
            "high": {
                "keywords": ["error", "failure", "performance", "slow", "timeout"],
                "response_time": 900,  # 15 minutes
                "escalation_threshold": 3600  # 1 hour
            },
            "medium": {
                "keywords": ["warning", "issue", "problem", "concern"],
                "response_time": 1800,  # 30 minutes
                "escalation_threshold": 7200  # 2 hours
            },
            "low": {
                "keywords": ["info", "notice", "minor", "cosmetic"],
                "response_time": 3600,  # 1 hour
                "escalation_threshold": 86400  # 24 hours
            }
        }
    
    async def initialize(self) -> bool:
        """Initialize the Incident Commander AI."""
        self.logger.info("Initializing Incident Commander AI...")
        self.update_status(AgentStatus.ACTIVE)
        
        # Initialize incident monitoring systems
        await self._initialize_monitoring()
        
        self.logger.info("Incident Commander AI initialized and ready for action")
        return True
    
    async def _initialize_monitoring(self):
        """Initialize various monitoring systems and integrations."""
        # Simulate initialization of monitoring systems
        monitoring_systems = [
            "system_health_monitor",
            "security_event_collector", 
            "performance_analyzer",
            "error_log_aggregator",
            "user_feedback_monitor"
        ]
        
        for system in monitoring_systems:
            await asyncio.sleep(0.1)  # Simulate initialization time
            self.logger.info(f"Initialized monitoring system: {system}")
    
    def get_capabilities(self) -> List[str]:
        """Return list of Incident Commander capabilities."""
        return [
            "incident_detection",
            "severity_classification", 
            "automated_triage",
            "agent_coordination",
            "escalation_management",
            "incident_logging",
            "response_tracking",
            "post_incident_analysis"
        ]
    
    async def execute_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute incident management tasks."""
        task_type = task_data.get("type", "unknown")
        
        if task_type == "detect_incident":
            return await self._detect_and_classify_incident(task_data)
        elif task_type == "triage_incident":
            return await self._triage_incident(task_data)
        elif task_type == "coordinate_response":
            return await self._coordinate_response(task_data)
        elif task_type == "escalate_incident":
            return await self._escalate_incident(task_data)
        elif task_type == "log_incident":
            return await self._log_incident(task_data)
        else:
            # Default: treat as new incident report
            return await self._handle_incident_report(task_data)
    
    async def _detect_and_classify_incident(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Detect and classify incoming incidents."""
        incident_data = data.get("incident_data", {})
        description = incident_data.get("description", "").lower()
        
        # Classify severity based on keywords and context
        severity = self._classify_severity(description, incident_data)
        
        # Extract key information
        affected_systems = incident_data.get("affected_systems", [])
        impact_scope = incident_data.get("impact_scope", "unknown")
        
        classification = {
            "incident_id": self._generate_incident_id(),
            "severity": severity,
            "classification": self._determine_incident_type(description),
            "affected_systems": affected_systems,
            "impact_scope": impact_scope,
            "estimated_response_time": self.triage_rules[severity]["response_time"],
            "escalation_threshold": self.triage_rules[severity]["escalation_threshold"],
            "timestamp": datetime.now().isoformat()
        }
        
        self.logger.info(f"Classified incident {classification['incident_id']}: {severity} severity")
        return {
            "status": "classified",
            "classification": classification,
            "recommended_agents": self._recommend_agents(classification)
        }
    
    def _classify_severity(self, description: str, incident_data: Dict[str, Any]) -> str:
        """Classify incident severity based on description and context."""
        # Check for explicit severity markers
        explicit_severity = incident_data.get("severity", "").lower()
        if explicit_severity in self.triage_rules:
            return explicit_severity
        
        # Classify based on keywords
        for severity, rules in self.triage_rules.items():
            for keyword in rules["keywords"]:
                if keyword in description:
                    return severity
        
        # Default to medium if no classification found
        return "medium"
    
    def _determine_incident_type(self, description: str) -> str:
        """Determine the type of incident for proper routing."""
        incident_types = {
            "security": ["breach", "attack", "unauthorized", "malware", "vulnerability"],
            "performance": ["slow", "timeout", "latency", "performance", "response time"],
            "infrastructure": ["server", "database", "network", "hardware", "outage"],
            "application": ["bug", "error", "crash", "exception", "failure"],
            "data": ["corruption", "loss", "backup", "sync", "integrity"],
            "user": ["access", "login", "permission", "account", "authentication"]
        }
        
        for inc_type, keywords in incident_types.items():
            if any(keyword in description for keyword in keywords):
                return inc_type
        
        return "general"
    
    def _recommend_agents(self, classification: Dict[str, Any]) -> List[str]:
        """Recommend which agents should handle this incident."""
        incident_type = classification["classification"]
        severity = classification["severity"]
        
        agent_recommendations = {
            "security": ["security_sentinel", "human_ai_interface"],
            "performance": ["infra_architect", "code_refactor_specialist"],
            "infrastructure": ["infra_architect", "security_sentinel"],
            "application": ["code_refactor_specialist", "infra_architect"],
            "data": ["security_sentinel", "infra_architect"],
            "user": ["human_ai_interface", "security_sentinel"]
        }
        
        recommended = agent_recommendations.get(incident_type, ["human_ai_interface"])
        
        # Add additional agents for critical incidents
        if severity == "critical":
            recommended.extend(["security_sentinel", "human_ai_interface"])
        
        return list(set(recommended))  # Remove duplicates
    
    async def _triage_incident(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform detailed triage of an incident."""
        incident_id = data.get("incident_id")
        
        # Perform triage analysis
        triage_result = {
            "incident_id": incident_id,
            "triage_timestamp": datetime.now().isoformat(),
            "priority_score": self._calculate_priority_score(data),
            "resource_requirements": self._assess_resource_needs(data),
            "estimated_resolution_time": self._estimate_resolution_time(data),
            "communication_plan": self._create_communication_plan(data)
        }
        
        self.logger.info(f"Completed triage for incident {incident_id}")
        return {"status": "triaged", "triage_result": triage_result}
    
    def _calculate_priority_score(self, data: Dict[str, Any]) -> int:
        """Calculate numerical priority score for incident."""
        severity_scores = {"critical": 100, "high": 75, "medium": 50, "low": 25}
        base_score = severity_scores.get(data.get("severity", "medium"), 50)
        
        # Adjust based on additional factors
        affected_users = data.get("affected_users", 0)
        if affected_users > 1000:
            base_score += 20
        elif affected_users > 100:
            base_score += 10
        
        # Adjust for business hours
        current_hour = datetime.now().hour
        if 9 <= current_hour <= 17:  # Business hours
            base_score += 15
        
        return min(base_score, 100)
    
    def _assess_resource_needs(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Assess what resources are needed for incident resolution."""
        return {
            "agents_needed": data.get("recommended_agents", []),
            "estimated_person_hours": self._estimate_effort(data),
            "external_resources": self._identify_external_resources(data),
            "tools_required": self._identify_required_tools(data)
        }
    
    def _estimate_resolution_time(self, data: Dict[str, Any]) -> int:
        """Estimate resolution time in minutes."""
        severity = data.get("severity", "medium")
        complexity_factors = {
            "critical": 120,
            "high": 240, 
            "medium": 480,
            "low": 960
        }
        return complexity_factors.get(severity, 480)
    
    def _create_communication_plan(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create communication plan for incident."""
        severity = data.get("severity", "medium")
        
        communication_plans = {
            "critical": {
                "immediate_notification": ["management", "security_team", "on_call_engineer"],
                "update_frequency": 15,  # minutes
                "stakeholder_updates": True,
                "public_communication": True
            },
            "high": {
                "immediate_notification": ["team_lead", "on_call_engineer"],
                "update_frequency": 30,
                "stakeholder_updates": True,
                "public_communication": False
            },
            "medium": {
                "immediate_notification": ["assigned_team"],
                "update_frequency": 60,
                "stakeholder_updates": False,
                "public_communication": False
            },
            "low": {
                "immediate_notification": [],
                "update_frequency": 240,
                "stakeholder_updates": False,
                "public_communication": False
            }
        }
        
        return communication_plans.get(severity, communication_plans["medium"])
    
    async def _coordinate_response(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Coordinate multi-agent response to incident."""
        incident_id = data.get("incident_id")
        agents = data.get("assigned_agents", [])
        
        coordination_result = {
            "incident_id": incident_id,
            "coordination_start": datetime.now().isoformat(),
            "agents_coordinated": agents,
            "task_assignments": self._create_task_assignments(data),
            "coordination_status": "active"
        }
        
        self.active_incidents[incident_id] = coordination_result
        
        self.logger.info(f"Coordinating response for incident {incident_id} with agents: {agents}")
        return {"status": "coordinating", "coordination": coordination_result}
    
    def _create_task_assignments(self, data: Dict[str, Any]) -> Dict[str, List[str]]:
        """Create specific task assignments for agents."""
        incident_type = data.get("classification", "general")
        
        task_assignments = {
            "security_sentinel": [
                "security_scan",
                "vulnerability_assessment",
                "threat_analysis"
            ],
            "code_refactor_specialist": [
                "code_analysis", 
                "performance_review",
                "fix_implementation"
            ],
            "infra_architect": [
                "system_health_check",
                "resource_analysis", 
                "scaling_assessment"
            ],
            "human_ai_interface": [
                "stakeholder_notification",
                "status_reporting",
                "communication_management"
            ]
        }
        
        return task_assignments
    
    async def _escalate_incident(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Escalate incident to higher priority or additional resources."""
        incident_id = data.get("incident_id")
        escalation_reason = data.get("reason", "threshold_exceeded")
        
        escalation_result = {
            "incident_id": incident_id,
            "escalation_timestamp": datetime.now().isoformat(),
            "escalation_reason": escalation_reason,
            "new_severity": self._escalate_severity(data.get("current_severity", "medium")),
            "additional_resources": self._request_additional_resources(data),
            "escalation_path": self._determine_escalation_path(data)
        }
        
        self.logger.warning(f"Escalating incident {incident_id}: {escalation_reason}")
        return {"status": "escalated", "escalation": escalation_result}
    
    def _escalate_severity(self, current_severity: str) -> str:
        """Escalate severity to next level."""
        escalation_path = {"low": "medium", "medium": "high", "high": "critical"}
        return escalation_path.get(current_severity, "critical")
    
    async def _handle_incident_report(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle a new incident report."""
        # First classify the incident
        classification_result = await self._detect_and_classify_incident({"incident_data": data})
        
        # Then perform triage
        triage_data = {
            **classification_result["classification"],
            "recommended_agents": classification_result["recommended_agents"]
        }
        triage_result = await self._triage_incident(triage_data)
        
        # Log the incident
        log_result = await self._log_incident({
            "incident": classification_result["classification"],
            "triage": triage_result["triage_result"]
        })
        
        return {
            "status": "processed",
            "incident_id": classification_result["classification"]["incident_id"],
            "classification": classification_result,
            "triage": triage_result,
            "logged": log_result
        }
    
    async def _log_incident(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Log incident information for tracking and analysis."""
        incident_log_entry = {
            "log_timestamp": datetime.now().isoformat(),
            "incident_data": data,
            "log_id": self._generate_log_id()
        }
        
        self.incident_log.append(incident_log_entry)
        
        # Keep log size manageable (last 1000 entries)
        if len(self.incident_log) > 1000:
            self.incident_log = self.incident_log[-1000:]
        
        return {"status": "logged", "log_id": incident_log_entry["log_id"]}
    
    def _generate_incident_id(self) -> str:
        """Generate unique incident ID."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"INC_{timestamp}_{len(self.incident_log):04d}"
    
    def _generate_log_id(self) -> str:
        """Generate unique log entry ID."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"LOG_{timestamp}_{len(self.incident_log):04d}"
    
    def _estimate_effort(self, data: Dict[str, Any]) -> int:
        """Estimate effort in person-hours."""
        severity = data.get("severity", "medium")
        effort_estimates = {"critical": 8, "high": 4, "medium": 2, "low": 1}
        return effort_estimates.get(severity, 2)
    
    def _identify_external_resources(self, data: Dict[str, Any]) -> List[str]:
        """Identify any external resources that might be needed."""
        external_resources = []
        
        if data.get("classification") == "security":
            external_resources.extend(["security_vendor", "incident_response_team"])
        
        if data.get("severity") == "critical":
            external_resources.extend(["management_approval", "legal_team"])
        
        return external_resources
    
    def _identify_required_tools(self, data: Dict[str, Any]) -> List[str]:
        """Identify tools required for incident resolution."""
        tools = ["monitoring_dashboard", "log_analyzer"]
        
        incident_type = data.get("classification", "general")
        if incident_type == "security":
            tools.extend(["security_scanner", "forensics_tools"])
        elif incident_type == "performance":
            tools.extend(["performance_profiler", "load_tester"])
        elif incident_type == "infrastructure":
            tools.extend(["infrastructure_monitor", "deployment_tools"])
        
        return tools
    
    def _request_additional_resources(self, data: Dict[str, Any]) -> List[str]:
        """Request additional resources for escalated incident."""
        return [
            "senior_engineer",
            "subject_matter_expert", 
            "emergency_response_team"
        ]
    
    def _determine_escalation_path(self, data: Dict[str, Any]) -> List[str]:
        """Determine escalation path for incident."""
        return [
            "team_lead",
            "engineering_manager",
            "director_of_engineering",
            "cto"
        ]