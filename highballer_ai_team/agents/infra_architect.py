"""
Infra Architect AI - Elite infrastructure monitoring and optimization system.

Monitors system performance and predicts bottlenecks, allocates resources dynamically 
to maintain stability, suggests infrastructure upgrades and optimizations.
"""

import asyncio
import json
import statistics
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timedelta
from enum import Enum

# Optional dependency for system monitoring
try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False

from ..core.base_agent import BaseAgent, AgentStatus


class ResourceType(Enum):
    """Types of infrastructure resources."""
    CPU = "cpu"
    MEMORY = "memory"
    DISK = "disk"
    NETWORK = "network"
    DATABASE = "database"
    CACHE = "cache"
    QUEUE = "queue"
    STORAGE = "storage"


class AlertSeverity(Enum):
    """Infrastructure alert severity levels."""
    CRITICAL = 1
    WARNING = 2
    INFO = 3


class InfraArchitectAI(BaseAgent):
    """
    Infrastructure Architect AI - Advanced infrastructure monitoring and optimization agent.
    
    Responsibilities:
    - Real-time system performance monitoring
    - Predictive analytics for bottleneck identification
    - Dynamic resource allocation and scaling
    - Infrastructure optimization recommendations
    - Capacity planning and forecasting
    - Performance analysis and tuning
    - Cost optimization strategies
    - Disaster recovery planning
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__("infra_architect", config)
        self.performance_metrics = {}
        self.resource_allocations = {}
        self.optimization_history = []
        self.capacity_forecasts = {}
        self.performance_baselines = {}
        
        # Performance thresholds and targets
        self.performance_thresholds = {
            ResourceType.CPU: {"warning": 70, "critical": 85, "optimal": 60},
            ResourceType.MEMORY: {"warning": 75, "critical": 90, "optimal": 65},
            ResourceType.DISK: {"warning": 80, "critical": 95, "optimal": 70},
            ResourceType.NETWORK: {"warning": 70, "critical": 85, "optimal": 50},
            ResourceType.DATABASE: {"warning": 60, "critical": 80, "optimal": 40},
            ResourceType.CACHE: {"warning": 80, "critical": 95, "optimal": 70}
        }
        
        # Scaling policies and rules
        self.scaling_policies = {
            "web_servers": {
                "min_instances": 2,
                "max_instances": 10,
                "scale_up_threshold": 70,
                "scale_down_threshold": 30,
                "cooldown_period": 300  # 5 minutes
            },
            "database": {
                "read_replicas": {"min": 1, "max": 5},
                "connection_pool": {"min": 10, "max": 100},
                "cache_size": {"min": "1GB", "max": "8GB"}
            },
            "storage": {
                "auto_scaling": True,
                "backup_frequency": "daily",
                "retention_period": "30 days"
            }
        }
        
        # Cost optimization parameters
        self.cost_optimization = {
            "instance_right_sizing": True,
            "reserved_instance_recommendations": True,
            "unused_resource_detection": True,
            "scheduled_scaling": True
        }
    
    async def initialize(self) -> bool:
        """Initialize the Infrastructure Architect AI."""
        self.logger.info("Initializing Infrastructure Architect AI...")
        self.update_status(AgentStatus.ACTIVE)
        
        # Initialize monitoring systems
        await self._initialize_monitoring_systems()
        
        # Establish performance baselines
        await self._establish_performance_baselines()
        
        # Setup resource monitoring
        await self._setup_resource_monitoring()
        
        self.logger.info("Infrastructure Architect AI initialized and monitoring systems")
        return True
    
    async def _initialize_monitoring_systems(self):
        """Initialize infrastructure monitoring systems."""
        monitoring_systems = [
            "performance_monitor",
            "resource_tracker",
            "capacity_planner",
            "cost_analyzer",
            "network_monitor",
            "database_monitor",
            "cache_monitor",
            "queue_monitor",
            "storage_monitor",
            "application_performance_monitor"
        ]
        
        for system in monitoring_systems:
            await asyncio.sleep(0.1)  # Simulate initialization
            self.logger.info(f"Initialized monitoring system: {system}")
    
    async def _establish_performance_baselines(self):
        """Establish baseline performance metrics."""
        # Collect baseline metrics over time
        baseline_period = 7  # days
        
        for resource_type in ResourceType:
            baseline_data = await self._collect_baseline_data(resource_type, baseline_period)
            self.performance_baselines[resource_type.value] = {
                "average": statistics.mean(baseline_data) if baseline_data else 0,
                "median": statistics.median(baseline_data) if baseline_data else 0,
                "p95": self._calculate_percentile(baseline_data, 95) if baseline_data else 0,
                "p99": self._calculate_percentile(baseline_data, 99) if baseline_data else 0,
                "baseline_period": baseline_period,
                "last_updated": datetime.now().isoformat()
            }
        
        self.logger.info(f"Established baselines for {len(ResourceType)} resource types")
    
    async def _collect_baseline_data(self, resource_type: ResourceType, period_days: int) -> List[float]:
        """Collect baseline performance data for a resource type."""
        # Simulate collecting historical data
        await asyncio.sleep(0.1)
        
        # Mock baseline data based on resource type
        baseline_patterns = {
            ResourceType.CPU: [45, 52, 38, 61, 47, 55, 42, 49, 53, 46],
            ResourceType.MEMORY: [58, 62, 55, 67, 59, 64, 57, 61, 65, 60],
            ResourceType.DISK: [23, 27, 21, 32, 25, 29, 22, 26, 31, 24],
            ResourceType.NETWORK: [34, 42, 31, 48, 36, 44, 33, 41, 47, 35],
            ResourceType.DATABASE: [28, 35, 26, 41, 30, 37, 27, 34, 40, 29],
            ResourceType.CACHE: [67, 72, 64, 78, 69, 74, 66, 71, 77, 68]
        }
        
        return baseline_patterns.get(resource_type, [50, 55, 45, 60, 50])
    
    def _calculate_percentile(self, data: List[float], percentile: int) -> float:
        """Calculate percentile for data set."""
        if not data:
            return 0.0
        
        sorted_data = sorted(data)
        index = (percentile / 100) * (len(sorted_data) - 1)
        
        if index.is_integer():
            return sorted_data[int(index)]
        else:
            lower = sorted_data[int(index)]
            upper = sorted_data[int(index) + 1]
            return lower + (upper - lower) * (index - int(index))
    
    async def _setup_resource_monitoring(self):
        """Setup continuous resource monitoring."""
        # Configure monitoring intervals and alerts
        monitoring_config = {
            "cpu_monitoring": {"interval": 60, "enabled": True},
            "memory_monitoring": {"interval": 60, "enabled": True},
            "disk_monitoring": {"interval": 300, "enabled": True},
            "network_monitoring": {"interval": 120, "enabled": True},
            "database_monitoring": {"interval": 300, "enabled": True},
            "application_monitoring": {"interval": 60, "enabled": True}
        }
        
        self.logger.info(f"Setup monitoring for {len(monitoring_config)} resource categories")
    
    def get_capabilities(self) -> List[str]:
        """Return list of Infrastructure Architect capabilities."""
        return [
            "performance_monitoring",
            "resource_optimization", 
            "capacity_planning",
            "auto_scaling",
            "bottleneck_prediction",
            "cost_optimization",
            "disaster_recovery_planning",
            "infrastructure_assessment",
            "performance_tuning",
            "resource_allocation",
            "system_health_analysis",
            "predictive_analytics"
        ]
    
    async def execute_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute infrastructure management tasks."""
        task_type = task_data.get("type", "performance_check")
        
        if task_type == "monitor_performance":
            return await self._monitor_system_performance(task_data)
        elif task_type == "predict_bottlenecks":
            return await self._predict_bottlenecks(task_data)
        elif task_type == "optimize_resources":
            return await self._optimize_resource_allocation(task_data)
        elif task_type == "scale_infrastructure":
            return await self._handle_scaling_decision(task_data)
        elif task_type == "capacity_planning":
            return await self._perform_capacity_planning(task_data)
        elif task_type == "cost_optimization":
            return await self._optimize_infrastructure_costs(task_data)
        elif task_type == "health_assessment":
            return await self._assess_system_health(task_data)
        elif task_type == "disaster_recovery":
            return await self._plan_disaster_recovery(task_data)
        else:
            # Default: comprehensive infrastructure analysis
            return await self._monitor_system_performance(task_data)
    
    async def _monitor_system_performance(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Monitor real-time system performance metrics."""
        monitoring_duration = data.get("duration_minutes", 60)
        resource_types = data.get("resources", [rt.value for rt in ResourceType])
        
        monitoring_id = self._generate_monitoring_id()
        
        self.logger.info(f"Starting performance monitoring {monitoring_id} for {monitoring_duration} minutes")
        
        performance_data = {
            "monitoring_id": monitoring_id,
            "start_time": datetime.now().isoformat(),
            "duration_minutes": monitoring_duration,
            "resource_metrics": await self._collect_performance_metrics(resource_types),
            "performance_analysis": await self._analyze_performance_data(resource_types),
            "alerts_generated": await self._generate_performance_alerts(resource_types),
            "recommendations": await self._generate_performance_recommendations(resource_types)
        }
        
        self.performance_metrics[monitoring_id] = performance_data
        
        return {
            "status": "completed",
            "monitoring_id": monitoring_id,
            "summary": self._create_performance_summary(performance_data),
            "detailed_metrics": performance_data
        }
    
    async def _collect_performance_metrics(self, resource_types: List[str]) -> Dict[str, Any]:
        """Collect current performance metrics for specified resources."""
        await asyncio.sleep(1)  # Simulate data collection
        
        current_time = datetime.now().isoformat()
        metrics = {"timestamp": current_time, "resources": {}}
        
        for resource_type in resource_types:
            resource_data = await self._get_resource_metrics(resource_type)
            metrics["resources"][resource_type] = resource_data
        
        return metrics
    
    async def _get_resource_metrics(self, resource_type: str) -> Dict[str, Any]:
        """Get metrics for a specific resource type."""
        # In a real implementation, this would collect actual system metrics
        # For demonstration, we'll generate realistic mock data
        
        current_time = datetime.now()
        
        if resource_type == ResourceType.CPU.value:
            return {
                "utilization_percent": 65.4,
                "load_average": {"1min": 2.3, "5min": 2.1, "15min": 1.9},
                "cores": 8,
                "frequency_mhz": 2800,
                "temperature_celsius": 68,
                "processes": 156
            }
        elif resource_type == ResourceType.MEMORY.value:
            return {
                "utilization_percent": 72.1,
                "total_gb": 16.0,
                "used_gb": 11.5,
                "available_gb": 4.5,
                "swap_used_percent": 12.3,
                "page_faults": 2340,
                "cache_hit_ratio": 0.89
            }
        elif resource_type == ResourceType.DISK.value:
            return {
                "utilization_percent": 43.2,
                "total_gb": 500.0,
                "used_gb": 216.0,
                "available_gb": 284.0,
                "read_iops": 145,
                "write_iops": 89,
                "read_latency_ms": 12.4,
                "write_latency_ms": 8.7
            }
        elif resource_type == ResourceType.NETWORK.value:
            return {
                "utilization_percent": 34.7,
                "bandwidth_mbps": 1000,
                "inbound_mbps": 156.3,
                "outbound_mbps": 189.7,
                "packet_loss_percent": 0.02,
                "latency_ms": 23.1,
                "connections": 234
            }
        elif resource_type == ResourceType.DATABASE.value:
            return {
                "utilization_percent": 38.9,
                "connections": {"active": 45, "max": 100},
                "query_performance": {"avg_response_ms": 89.4, "slow_queries": 3},
                "cache_hit_ratio": 0.94,
                "lock_waits": 12,
                "deadlocks": 0
            }
        elif resource_type == ResourceType.CACHE.value:
            return {
                "utilization_percent": 76.3,
                "hit_ratio": 0.87,
                "memory_used_mb": 3052,
                "memory_total_mb": 4000,
                "operations_per_sec": 1250,
                "evictions_per_sec": 23
            }
        else:
            return {"utilization_percent": 50.0, "status": "unknown"}
    
    async def _analyze_performance_data(self, resource_types: List[str]) -> Dict[str, Any]:
        """Analyze collected performance data for patterns and issues."""
        await asyncio.sleep(0.5)
        
        analysis = {
            "overall_health": "good",
            "performance_score": 78,
            "bottlenecks_identified": [],
            "trending_issues": [],
            "optimization_opportunities": []
        }
        
        # Analyze each resource type
        for resource_type in resource_types:
            resource_analysis = await self._analyze_resource_performance(resource_type)
            
            if resource_analysis["has_issues"]:
                analysis["bottlenecks_identified"].extend(resource_analysis["issues"])
            
            if resource_analysis["optimization_potential"] > 0.2:
                analysis["optimization_opportunities"].append({
                    "resource": resource_type,
                    "potential": resource_analysis["optimization_potential"],
                    "suggestions": resource_analysis["suggestions"]
                })
        
        # Determine overall health
        if len(analysis["bottlenecks_identified"]) > 2:
            analysis["overall_health"] = "poor"
            analysis["performance_score"] = 45
        elif len(analysis["bottlenecks_identified"]) > 0:
            analysis["overall_health"] = "fair"
            analysis["performance_score"] = 62
        
        return analysis
    
    async def _analyze_resource_performance(self, resource_type: str) -> Dict[str, Any]:
        """Analyze performance for a specific resource."""
        resource_metrics = await self._get_resource_metrics(resource_type)
        utilization = resource_metrics.get("utilization_percent", 0)
        
        threshold = self.performance_thresholds.get(ResourceType(resource_type), {})
        
        has_issues = utilization > threshold.get("warning", 70)
        optimization_potential = max(0, (utilization - threshold.get("optimal", 60)) / 100)
        
        issues = []
        suggestions = []
        
        if utilization > threshold.get("critical", 85):
            issues.append(f"Critical {resource_type} utilization: {utilization}%")
            suggestions.append(f"Immediately scale {resource_type} resources")
        elif utilization > threshold.get("warning", 70):
            issues.append(f"High {resource_type} utilization: {utilization}%")
            suggestions.append(f"Consider scaling {resource_type} resources")
        
        return {
            "resource_type": resource_type,
            "utilization": utilization,
            "has_issues": has_issues,
            "optimization_potential": optimization_potential,
            "issues": issues,
            "suggestions": suggestions
        }
    
    async def _generate_performance_alerts(self, resource_types: List[str]) -> List[Dict[str, Any]]:
        """Generate performance alerts based on thresholds."""
        alerts = []
        
        for resource_type in resource_types:
            resource_metrics = await self._get_resource_metrics(resource_type)
            utilization = resource_metrics.get("utilization_percent", 0)
            
            threshold = self.performance_thresholds.get(ResourceType(resource_type), {})
            
            if utilization > threshold.get("critical", 85):
                alerts.append({
                    "alert_id": self._generate_alert_id(),
                    "severity": AlertSeverity.CRITICAL.name,
                    "resource_type": resource_type,
                    "message": f"Critical {resource_type} utilization: {utilization}%",
                    "threshold_exceeded": threshold.get("critical", 85),
                    "current_value": utilization,
                    "timestamp": datetime.now().isoformat(),
                    "action_required": True
                })
            elif utilization > threshold.get("warning", 70):
                alerts.append({
                    "alert_id": self._generate_alert_id(),
                    "severity": AlertSeverity.WARNING.name,
                    "resource_type": resource_type,
                    "message": f"High {resource_type} utilization: {utilization}%",
                    "threshold_exceeded": threshold.get("warning", 70),
                    "current_value": utilization,
                    "timestamp": datetime.now().isoformat(),
                    "action_required": False
                })
        
        return alerts
    
    async def _generate_performance_recommendations(self, resource_types: List[str]) -> List[Dict[str, Any]]:
        """Generate performance optimization recommendations."""
        recommendations = []
        
        for resource_type in resource_types:
            resource_analysis = await self._analyze_resource_performance(resource_type)
            
            if resource_analysis["optimization_potential"] > 0.1:  # 10% improvement potential
                recommendations.append({
                    "resource": resource_type,
                    "priority": "high" if resource_analysis["optimization_potential"] > 0.3 else "medium",
                    "improvement_potential": f"{resource_analysis['optimization_potential']:.1%}",
                    "recommendations": resource_analysis["suggestions"],
                    "estimated_cost": self._estimate_optimization_cost(resource_type, resource_analysis["optimization_potential"]),
                    "estimated_benefit": self._estimate_optimization_benefit(resource_type, resource_analysis["optimization_potential"])
                })
        
        return recommendations
    
    def _estimate_optimization_cost(self, resource_type: str, potential: float) -> str:
        """Estimate cost of optimization."""
        cost_factors = {
            ResourceType.CPU.value: "medium",
            ResourceType.MEMORY.value: "low",
            ResourceType.DISK.value: "low",
            ResourceType.NETWORK.value: "high",
            ResourceType.DATABASE.value: "medium",
            ResourceType.CACHE.value: "low"
        }
        
        base_cost = cost_factors.get(resource_type, "medium")
        
        if potential > 0.4:  # High optimization potential
            return "high" if base_cost == "medium" else base_cost
        
        return base_cost
    
    def _estimate_optimization_benefit(self, resource_type: str, potential: float) -> str:
        """Estimate benefit of optimization."""
        if potential > 0.4:
            return "significant performance improvement"
        elif potential > 0.2:
            return "moderate performance improvement"
        else:
            return "minor performance improvement"
    
    async def _predict_bottlenecks(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict future system bottlenecks using performance trends."""
        prediction_horizon = data.get("horizon_hours", 24)
        confidence_threshold = data.get("confidence_threshold", 0.7)
        
        prediction_id = self._generate_prediction_id()
        
        self.logger.info(f"Predicting bottlenecks {prediction_id} for next {prediction_horizon} hours")
        
        predictions = {
            "prediction_id": prediction_id,
            "timestamp": datetime.now().isoformat(),
            "prediction_horizon_hours": prediction_horizon,
            "bottleneck_predictions": await self._analyze_performance_trends(prediction_horizon),
            "risk_assessment": await self._assess_bottleneck_risks(prediction_horizon),
            "prevention_recommendations": await self._recommend_bottleneck_prevention(),
            "confidence_scores": await self._calculate_prediction_confidence()
        }
        
        return {
            "status": "completed",
            "prediction_id": prediction_id,
            "summary": self._create_prediction_summary(predictions),
            "detailed_predictions": predictions
        }
    
    async def _analyze_performance_trends(self, horizon_hours: int) -> List[Dict[str, Any]]:
        """Analyze performance trends to predict bottlenecks."""
        await asyncio.sleep(0.8)  # Simulate trend analysis
        
        # Mock trend analysis - in reality this would use historical data and ML models
        trend_predictions = [
            {
                "resource_type": ResourceType.MEMORY.value,
                "predicted_bottleneck_time": (datetime.now() + timedelta(hours=8)).isoformat(),
                "confidence": 0.82,
                "current_utilization": 72.1,
                "predicted_peak_utilization": 88.5,
                "trend": "increasing",
                "growth_rate": "3.2% per hour",
                "trigger_events": ["daily_batch_processing", "increased_user_activity"]
            },
            {
                "resource_type": ResourceType.DATABASE.value,
                "predicted_bottleneck_time": (datetime.now() + timedelta(hours=18)).isoformat(),
                "confidence": 0.75,
                "current_utilization": 38.9,
                "predicted_peak_utilization": 76.3,
                "trend": "gradual_increase",
                "growth_rate": "2.1% per hour",
                "trigger_events": ["weekend_traffic_spike", "report_generation"]
            },
            {
                "resource_type": ResourceType.NETWORK.value,
                "predicted_bottleneck_time": (datetime.now() + timedelta(hours=6)).isoformat(),
                "confidence": 0.68,
                "current_utilization": 34.7,
                "predicted_peak_utilization": 82.4,
                "trend": "sharp_increase",
                "growth_rate": "8.0% per hour",
                "trigger_events": ["backup_operations", "data_sync"]
            }
        ]
        
        return trend_predictions
    
    async def _assess_bottleneck_risks(self, horizon_hours: int) -> Dict[str, Any]:
        """Assess risks associated with predicted bottlenecks."""
        return {
            "overall_risk": "medium",
            "high_risk_resources": ["memory", "network"],
            "risk_factors": [
                "Insufficient monitoring coverage",
                "Limited auto-scaling capability",
                "Peak usage patterns not well understood"
            ],
            "business_impact": {
                "availability_risk": "moderate",
                "performance_degradation_risk": "high",
                "user_experience_impact": "moderate_to_high",
                "revenue_impact": "low_to_medium"
            },
            "mitigation_urgency": "next_4_hours"
        }
    
    async def _recommend_bottleneck_prevention(self) -> List[Dict[str, Any]]:
        """Recommend actions to prevent predicted bottlenecks."""
        return [
            {
                "action": "proactive_memory_scaling",
                "priority": "high",
                "description": "Increase memory allocation before predicted peak",
                "estimated_time": "30 minutes",
                "estimated_cost": "$50/month additional",
                "effectiveness": 0.85
            },
            {
                "action": "optimize_database_queries",
                "priority": "medium",
                "description": "Optimize slow queries identified in analysis",
                "estimated_time": "4 hours",
                "estimated_cost": "engineering_time_only",
                "effectiveness": 0.70
            },
            {
                "action": "schedule_backup_operations",
                "priority": "medium",
                "description": "Reschedule backup operations to off-peak hours",
                "estimated_time": "1 hour",
                "estimated_cost": "none",
                "effectiveness": 0.60
            },
            {
                "action": "implement_caching_layer",
                "priority": "low",
                "description": "Implement additional caching to reduce database load",
                "estimated_time": "2 days",
                "estimated_cost": "$200/month additional",
                "effectiveness": 0.75
            }
        ]
    
    async def _calculate_prediction_confidence(self) -> Dict[str, float]:
        """Calculate confidence scores for predictions."""
        return {
            "memory_prediction": 0.82,
            "database_prediction": 0.75,
            "network_prediction": 0.68,
            "cpu_prediction": 0.91,
            "overall_confidence": 0.79
        }
    
    async def _optimize_resource_allocation(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize resource allocation across the infrastructure."""
        optimization_scope = data.get("scope", "full")
        optimization_goals = data.get("goals", ["performance", "cost"])
        
        optimization_id = self._generate_optimization_id()
        
        self.logger.info(f"Starting resource optimization {optimization_id}")
        
        optimization_results = {
            "optimization_id": optimization_id,
            "timestamp": datetime.now().isoformat(),
            "scope": optimization_scope,
            "goals": optimization_goals,
            "current_allocation": await self._analyze_current_allocation(),
            "optimization_opportunities": await self._identify_optimization_opportunities(),
            "recommended_changes": await self._recommend_allocation_changes(),
            "impact_analysis": await self._analyze_optimization_impact(),
            "implementation_plan": await self._create_implementation_plan()
        }
        
        self.optimization_history.append(optimization_results)
        
        return {
            "status": "completed",
            "optimization_id": optimization_id,
            "summary": self._create_optimization_summary(optimization_results),
            "detailed_results": optimization_results
        }
    
    async def _analyze_current_allocation(self) -> Dict[str, Any]:
        """Analyze current resource allocation."""
        await asyncio.sleep(0.6)
        
        return {
            "compute_resources": {
                "web_servers": {"instances": 4, "type": "t3.medium", "utilization": 65},
                "app_servers": {"instances": 2, "type": "t3.large", "utilization": 78},
                "worker_servers": {"instances": 3, "type": "t3.small", "utilization": 43}
            },
            "database_resources": {
                "primary_db": {"type": "db.r5.large", "utilization": 62},
                "read_replicas": {"count": 2, "type": "db.r5.medium", "utilization": 34},
                "cache_cluster": {"nodes": 3, "type": "cache.r6g.large", "utilization": 76}
            },
            "storage_resources": {
                "primary_storage": {"size": "500GB", "type": "gp3", "utilization": 43},
                "backup_storage": {"size": "1TB", "type": "glacier", "utilization": 67}
            },
            "network_resources": {
                "load_balancers": {"count": 2, "type": "application", "utilization": 35},
                "cdn": {"enabled": True, "hit_ratio": 0.87}
            }
        }
    
    async def _identify_optimization_opportunities(self) -> List[Dict[str, Any]]:
        """Identify resource optimization opportunities."""
        await asyncio.sleep(0.4)
        
        return [
            {
                "opportunity_id": "OPT_001",
                "type": "right_sizing",
                "resource": "worker_servers",
                "description": "Worker servers are under-utilized (43%), consider downsizing",
                "potential_savings": "$180/month",
                "performance_impact": "minimal",
                "confidence": 0.89
            },
            {
                "opportunity_id": "OPT_002",
                "type": "auto_scaling",
                "resource": "web_servers", 
                "description": "Implement auto-scaling to handle traffic variations",
                "potential_savings": "$120/month",
                "performance_impact": "improved",
                "confidence": 0.92
            },
            {
                "opportunity_id": "OPT_003",
                "type": "reserved_instances",
                "resource": "database",
                "description": "Use reserved instances for predictable database workload",
                "potential_savings": "$350/month",
                "performance_impact": "none",
                "confidence": 0.95
            },
            {
                "opportunity_id": "OPT_004",
                "type": "storage_optimization",
                "resource": "primary_storage",
                "description": "Migrate infrequently accessed data to cheaper storage tier",
                "potential_savings": "$75/month",
                "performance_impact": "minimal",
                "confidence": 0.78
            }
        ]
    
    async def _recommend_allocation_changes(self) -> List[Dict[str, Any]]:
        """Recommend specific allocation changes."""
        return [
            {
                "change_id": "CHG_001",
                "priority": "high",
                "resource": "worker_servers",
                "action": "downsize",
                "from": "t3.small x 3",
                "to": "t3.micro x 2",
                "timeline": "immediate",
                "risk": "low",
                "rollback_plan": "automatic_scaling_if_utilization_exceeds_80%"
            },
            {
                "change_id": "CHG_002",
                "priority": "medium",
                "resource": "web_servers",
                "action": "implement_auto_scaling",
                "configuration": {
                    "min_instances": 2,
                    "max_instances": 8,
                    "scale_up_threshold": 70,
                    "scale_down_threshold": 30
                },
                "timeline": "next_week",
                "risk": "low",
                "rollback_plan": "disable_auto_scaling_keep_current_instances"
            },
            {
                "change_id": "CHG_003",
                "priority": "medium",
                "resource": "database",
                "action": "purchase_reserved_instances",
                "commitment": "1_year_partial_upfront",
                "timeline": "next_billing_cycle",
                "risk": "none",
                "rollback_plan": "not_applicable"
            }
        ]
    
    async def _analyze_optimization_impact(self) -> Dict[str, Any]:
        """Analyze impact of proposed optimizations."""
        return {
            "cost_impact": {
                "monthly_savings": "$725",
                "annual_savings": "$8,700",
                "roi_percentage": 340,
                "payback_period": "immediate"
            },
            "performance_impact": {
                "response_time_change": "-5%",  # 5% improvement
                "throughput_change": "+8%",  # 8% increase
                "availability_change": "+2%",  # 2% improvement
                "overall_score": "+12 points"
            },
            "operational_impact": {
                "complexity_change": "slightly_reduced",
                "maintenance_effort": "reduced",
                "monitoring_requirements": "enhanced_auto_scaling_monitoring"
            },
            "risk_assessment": {
                "implementation_risk": "low",
                "performance_risk": "minimal",
                "cost_risk": "none",
                "rollback_complexity": "low"
            }
        }
    
    async def _create_implementation_plan(self) -> Dict[str, Any]:
        """Create implementation plan for optimizations."""
        return {
            "plan_id": "IMPL_001",
            "total_duration": "2 weeks",
            "phases": [
                {
                    "phase": "preparation",
                    "duration": "2 days",
                    "tasks": [
                        "Setup monitoring for new metrics",
                        "Create rollback procedures",
                        "Schedule maintenance windows"
                    ]
                },
                {
                    "phase": "implementation",
                    "duration": "1 week",
                    "tasks": [
                        "Implement auto-scaling configuration",
                        "Downsize worker servers gradually",
                        "Purchase reserved instances"
                    ]
                },
                {
                    "phase": "validation",
                    "duration": "3 days",
                    "tasks": [
                        "Monitor performance metrics",
                        "Validate cost savings",
                        "Fine-tune configurations"
                    ]
                }
            ],
            "success_criteria": [
                "No performance degradation",
                "Cost savings achieved as projected",
                "All systems remain stable"
            ],
            "rollback_triggers": [
                "Response time increases > 20%",
                "Error rate increases > 5%",
                "Any critical system failure"
            ]
        }
    
    async def _handle_scaling_decision(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle automatic scaling decisions."""
        resource_type = data.get("resource_type")
        scaling_direction = data.get("direction", "up")  # up or down
        trigger_metric = data.get("trigger_metric", {})
        
        scaling_id = self._generate_scaling_id()
        
        self.logger.info(f"Processing scaling decision {scaling_id}: {scaling_direction} for {resource_type}")
        
        scaling_decision = await self._evaluate_scaling_decision(resource_type, scaling_direction, trigger_metric)
        
        if scaling_decision["should_scale"]:
            scaling_result = await self._execute_scaling_action(resource_type, scaling_direction, scaling_decision)
        else:
            scaling_result = {"action": "no_scaling", "reason": scaling_decision["reason"]}
        
        scaling_record = {
            "scaling_id": scaling_id,
            "timestamp": datetime.now().isoformat(),
            "resource_type": resource_type,
            "direction": scaling_direction,
            "trigger_metric": trigger_metric,
            "decision": scaling_decision,
            "result": scaling_result
        }
        
        return {
            "status": "completed",
            "scaling_id": scaling_id,
            "scaling_record": scaling_record
        }
    
    async def _evaluate_scaling_decision(self, resource_type: str, direction: str, trigger_metric: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate whether to proceed with scaling."""
        await asyncio.sleep(0.3)
        
        current_utilization = trigger_metric.get("value", 0)
        policy = self.scaling_policies.get(resource_type, {})
        
        if direction == "up":
            threshold = policy.get("scale_up_threshold", 70)
            should_scale = current_utilization > threshold
            reason = f"Utilization {current_utilization}% exceeds scale-up threshold {threshold}%"
        else:  # direction == "down"
            threshold = policy.get("scale_down_threshold", 30)
            should_scale = current_utilization < threshold
            reason = f"Utilization {current_utilization}% below scale-down threshold {threshold}%"
        
        # Check cooldown period
        if should_scale:
            cooldown_check = await self._check_cooldown_period(resource_type)
            if not cooldown_check["can_scale"]:
                should_scale = False
                reason = f"Cooldown period active: {cooldown_check['remaining_seconds']}s remaining"
        
        return {
            "should_scale": should_scale,
            "reason": reason,
            "confidence": 0.95 if should_scale else 0.85,
            "estimated_impact": await self._estimate_scaling_impact(resource_type, direction)
        }
    
    async def _check_cooldown_period(self, resource_type: str) -> Dict[str, Any]:
        """Check if resource is in cooldown period."""
        # Mock cooldown check - in reality would check last scaling action timestamp
        cooldown_period = self.scaling_policies.get(resource_type, {}).get("cooldown_period", 300)
        
        # Simulate that no recent scaling happened
        return {
            "can_scale": True,
            "remaining_seconds": 0,
            "last_scaling_time": None
        }
    
    async def _estimate_scaling_impact(self, resource_type: str, direction: str) -> Dict[str, Any]:
        """Estimate impact of scaling action."""
        if direction == "up":
            return {
                "performance_improvement": "15-25%",
                "cost_increase": "$50-80/month",
                "capacity_increase": "33%",
                "timeline": "5-10 minutes"
            }
        else:  # direction == "down"
            return {
                "cost_savings": "$40-60/month",
                "capacity_reduction": "25%", 
                "risk_level": "low",
                "timeline": "5-10 minutes"
            }
    
    async def _execute_scaling_action(self, resource_type: str, direction: str, decision: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the scaling action."""
        await asyncio.sleep(1)  # Simulate scaling execution time
        
        # Mock scaling execution
        if direction == "up":
            return {
                "action": "scale_up_completed",
                "instances_before": 3,
                "instances_after": 4,
                "new_capacity": "+33%",
                "execution_time_seconds": 420,
                "status": "successful"
            }
        else:
            return {
                "action": "scale_down_completed",
                "instances_before": 4,
                "instances_after": 3,
                "capacity_reduction": "-25%",
                "execution_time_seconds": 180,
                "status": "successful"
            }
    
    async def _perform_capacity_planning(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform capacity planning analysis."""
        planning_horizon = data.get("horizon_months", 6)
        growth_assumptions = data.get("growth_assumptions", {})
        
        planning_id = self._generate_planning_id()
        
        self.logger.info(f"Performing capacity planning {planning_id} for {planning_horizon} months")
        
        capacity_plan = {
            "planning_id": planning_id,
            "timestamp": datetime.now().isoformat(),
            "planning_horizon_months": planning_horizon,
            "current_capacity": await self._assess_current_capacity(),
            "growth_projections": await self._project_capacity_needs(planning_horizon, growth_assumptions),
            "resource_requirements": await self._calculate_resource_requirements(planning_horizon),
            "cost_projections": await self._project_infrastructure_costs(planning_horizon),
            "investment_timeline": await self._create_investment_timeline(planning_horizon),
            "risk_analysis": await self._analyze_capacity_risks()
        }
        
        self.capacity_forecasts[planning_id] = capacity_plan
        
        return {
            "status": "completed",
            "planning_id": planning_id,
            "summary": self._create_capacity_summary(capacity_plan),
            "detailed_plan": capacity_plan
        }
    
    async def _assess_current_capacity(self) -> Dict[str, Any]:
        """Assess current infrastructure capacity."""
        await asyncio.sleep(0.5)
        
        return {
            "compute_capacity": {
                "total_vcpus": 32,
                "total_memory_gb": 128,
                "current_utilization": 0.67,
                "peak_utilization": 0.84,
                "headroom_percentage": 16
            },
            "storage_capacity": {
                "total_storage_tb": 2.5,
                "current_utilization": 0.43,
                "growth_rate_per_month": "8%",
                "time_to_full_months": 14
            },
            "network_capacity": {
                "total_bandwidth_gbps": 10,
                "current_utilization": 0.35,
                "peak_utilization": 0.78,
                "capacity_buffer": "22%"
            },
            "database_capacity": {
                "max_connections": 500,
                "avg_concurrent_connections": 145,
                "peak_connections": 287,
                "connection_utilization": 0.57
            }
        }
    
    async def _project_capacity_needs(self, horizon_months: int, growth_assumptions: Dict[str, Any]) -> Dict[str, Any]:
        """Project future capacity needs."""
        await asyncio.sleep(0.7)
        
        # Default growth assumptions if not provided
        default_growth = {
            "user_growth_monthly": 15,  # 15% monthly growth
            "data_growth_monthly": 20,  # 20% monthly data growth
            "compute_growth_monthly": 12,  # 12% monthly compute growth
            "network_growth_monthly": 10   # 10% monthly network growth
        }
        
        growth = {**default_growth, **growth_assumptions}
        
        return {
            "compute_projections": {
                "month_3": {"vcpus_needed": 42, "memory_gb_needed": 168},
                "month_6": {"vcpus_needed": 58, "memory_gb_needed": 232},
                "month_12": {"vcpus_needed": 96, "memory_gb_needed": 384}
            },
            "storage_projections": {
                "month_3": {"storage_tb_needed": 4.3},
                "month_6": {"storage_tb_needed": 7.8},
                "month_12": {"storage_tb_needed": 18.2}
            },
            "network_projections": {
                "month_3": {"bandwidth_gbps_needed": 13},
                "month_6": {"bandwidth_gbps_needed": 17},
                "month_12": {"bandwidth_gbps_needed": 25}
            },
            "database_projections": {
                "month_3": {"max_connections_needed": 720},
                "month_6": {"max_connections_needed": 1040},
                "month_12": {"max_connections_needed": 1850}
            },
            "growth_assumptions_used": growth
        }
    
    async def _calculate_resource_requirements(self, horizon_months: int) -> List[Dict[str, Any]]:
        """Calculate specific resource requirements."""
        return [
            {
                "timeline": "Month 1-2",
                "priority": "high",
                "resource_type": "compute",
                "action": "add_web_servers",
                "requirement": "2 additional t3.large instances",
                "cost_estimate": "$280/month",
                "justification": "Handle 25% user growth"
            },
            {
                "timeline": "Month 3-4",
                "priority": "medium",
                "resource_type": "database",
                "action": "upgrade_database_instance",
                "requirement": "Upgrade to db.r5.xlarge",
                "cost_estimate": "$450/month additional",
                "justification": "Support increased connection load"
            },
            {
                "timeline": "Month 4-6",
                "priority": "high",
                "resource_type": "storage",
                "action": "expand_storage_tier",
                "requirement": "5TB additional SSD storage",
                "cost_estimate": "$500/month",
                "justification": "Handle data growth projections"
            },
            {
                "timeline": "Month 6-8",
                "priority": "medium",
                "resource_type": "network",
                "action": "upgrade_bandwidth",
                "requirement": "Increase to 20Gbps bandwidth",
                "cost_estimate": "$800/month additional",
                "justification": "Support projected traffic growth"
            }
        ]
    
    async def _project_infrastructure_costs(self, horizon_months: int) -> Dict[str, Any]:
        """Project infrastructure costs over time."""
        return {
            "current_monthly_cost": "$2,340",
            "projected_costs": {
                "month_3": "$3,120",
                "month_6": "$4,680",
                "month_12": "$8,450"
            },
            "cost_breakdown": {
                "compute": {"current": "$1,200", "month_12": "$3,800"},
                "storage": {"current": "$320", "month_12": "$1,450"},
                "network": {"current": "$480", "month_12": "$1,650"},
                "database": {"current": "$340", "month_12": "$1,550"}
            },
            "cost_optimization_opportunities": [
                "Reserved instance savings: $450/month by month 6",
                "Auto-scaling efficiency: $280/month by month 3",
                "Storage tiering: $180/month by month 4"
            ],
            "total_investment_needed": "$74,200 over 12 months"
        }
    
    async def _create_investment_timeline(self, horizon_months: int) -> List[Dict[str, Any]]:
        """Create investment timeline for capacity expansion."""
        return [
            {
                "quarter": "Q1",
                "investment": "$15,600",
                "focus": "compute_expansion",
                "key_deliverables": ["Auto-scaling setup", "Additional web servers"],
                "roi_timeline": "immediate"
            },
            {
                "quarter": "Q2",
                "investment": "$22,800",
                "focus": "database_scaling",
                "key_deliverables": ["Database upgrade", "Read replicas"],
                "roi_timeline": "2-3 months"
            },
            {
                "quarter": "Q3",
                "investment": "$18,400",
                "focus": "storage_expansion",
                "key_deliverables": ["Storage tier expansion", "Backup optimization"],
                "roi_timeline": "1-2 months"
            },
            {
                "quarter": "Q4",
                "investment": "$17,400",
                "focus": "network_optimization",
                "key_deliverables": ["Bandwidth upgrade", "CDN enhancement"],
                "roi_timeline": "3-4 months"
            }
        ]
    
    async def _analyze_capacity_risks(self) -> Dict[str, Any]:
        """Analyze risks in capacity planning."""
        return {
            "high_risk_areas": [
                "Database scaling complexity",
                "Storage migration challenges",
                "Network bandwidth bottlenecks"
            ],
            "mitigation_strategies": [
                "Implement database sharding strategy",
                "Gradual storage migration with rollback plan",
                "CDN expansion to reduce bandwidth needs"
            ],
            "risk_timeline": {
                "month_2": "Database connection limits may be reached",
                "month_4": "Storage capacity constraints likely",
                "month_6": "Network bandwidth bottlenecks probable"
            },
            "contingency_plans": {
                "emergency_scaling": "Cloud burst capability available",
                "temporary_measures": "Traffic throttling and optimization",
                "budget_overrun": "Reserved instance conversion options"
            }
        }
    
    def _create_performance_summary(self, performance_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create summary of performance monitoring results."""
        metrics = performance_data["resource_metrics"]["resources"]
        analysis = performance_data["performance_analysis"]
        alerts = performance_data["alerts_generated"]
        
        return {
            "monitoring_duration": performance_data["duration_minutes"],
            "overall_health": analysis["overall_health"],
            "performance_score": analysis["performance_score"],
            "resources_monitored": len(metrics),
            "alerts_generated": len(alerts),
            "critical_alerts": sum(1 for alert in alerts if alert["severity"] == AlertSeverity.CRITICAL.name),
            "optimization_opportunities": len(analysis["optimization_opportunities"]),
            "top_issue": self._identify_top_performance_issue(analysis)
        }
    
    def _identify_top_performance_issue(self, analysis: Dict[str, Any]) -> str:
        """Identify the most critical performance issue."""
        bottlenecks = analysis.get("bottlenecks_identified", [])
        if bottlenecks:
            # Return the first (most critical) bottleneck
            return bottlenecks[0] if isinstance(bottlenecks[0], str) else str(bottlenecks[0])
        return "No critical issues identified"
    
    def _create_prediction_summary(self, predictions: Dict[str, Any]) -> Dict[str, Any]:
        """Create summary of bottleneck predictions."""
        bottleneck_predictions = predictions["bottleneck_predictions"]
        risk_assessment = predictions["risk_assessment"]
        
        return {
            "prediction_horizon": predictions["prediction_horizon_hours"],
            "bottlenecks_predicted": len(bottleneck_predictions),
            "highest_confidence_prediction": max(bottleneck_predictions, key=lambda x: x["confidence"])["resource_type"] if bottleneck_predictions else "none",
            "overall_risk": risk_assessment["overall_risk"],
            "immediate_action_required": risk_assessment["mitigation_urgency"] == "next_4_hours",
            "most_urgent_bottleneck": self._find_most_urgent_bottleneck(bottleneck_predictions)
        }
    
    def _find_most_urgent_bottleneck(self, predictions: List[Dict[str, Any]]) -> str:
        """Find the most urgent predicted bottleneck."""
        if not predictions:
            return "none"
        
        # Find prediction with earliest bottleneck time
        earliest_prediction = min(predictions, key=lambda x: x["predicted_bottleneck_time"])
        return f"{earliest_prediction['resource_type']} in {self._calculate_hours_until(earliest_prediction['predicted_bottleneck_time'])} hours"
    
    def _calculate_hours_until(self, future_time: str) -> int:
        """Calculate hours until a future timestamp."""
        future_dt = datetime.fromisoformat(future_time.replace('Z', '+00:00'))
        now = datetime.now(future_dt.tzinfo) if future_dt.tzinfo else datetime.now()
        delta = future_dt - now
        return max(0, int(delta.total_seconds() / 3600))
    
    def _create_optimization_summary(self, optimization_results: Dict[str, Any]) -> Dict[str, Any]:
        """Create summary of optimization results."""
        opportunities = optimization_results["optimization_opportunities"]
        impact = optimization_results["impact_analysis"]
        
        return {
            "optimization_scope": optimization_results["scope"],
            "opportunities_identified": len(opportunities),
            "potential_monthly_savings": impact["cost_impact"]["monthly_savings"],
            "performance_improvement": impact["performance_impact"]["overall_score"],
            "implementation_timeline": optimization_results["implementation_plan"]["total_duration"],
            "implementation_risk": impact["risk_assessment"]["implementation_risk"],
            "top_opportunity": self._find_top_optimization_opportunity(opportunities)
        }
    
    def _find_top_optimization_opportunity(self, opportunities: List[Dict[str, Any]]) -> str:
        """Find the top optimization opportunity."""
        if not opportunities:
            return "none"
        
        # Find opportunity with highest confidence and savings
        def score_opportunity(opp):
            # Extract numeric value from potential_savings string
            savings_str = opp.get("potential_savings", "$0")
            savings = int(''.join(filter(str.isdigit, savings_str))) if savings_str else 0
            confidence = opp.get("confidence", 0)
            return savings * confidence
        
        top_opportunity = max(opportunities, key=score_opportunity)
        return f"{top_opportunity['type']}: {top_opportunity['description']}"
    
    def _create_capacity_summary(self, capacity_plan: Dict[str, Any]) -> Dict[str, Any]:
        """Create summary of capacity planning results."""
        current_capacity = capacity_plan["current_capacity"]
        cost_projections = capacity_plan["cost_projections"]
        
        return {
            "planning_horizon": capacity_plan["planning_horizon_months"],
            "current_compute_utilization": f"{current_capacity['compute_capacity']['current_utilization']:.0%}",
            "current_monthly_cost": cost_projections["current_monthly_cost"],
            "projected_12_month_cost": cost_projections["projected_costs"]["month_12"],
            "total_investment_needed": cost_projections["total_investment_needed"],
            "first_capacity_constraint": self._identify_first_constraint(capacity_plan),
            "key_investment_priority": capacity_plan["investment_timeline"][0]["focus"] if capacity_plan["investment_timeline"] else "none"
        }
    
    def _identify_first_constraint(self, capacity_plan: Dict[str, Any]) -> str:
        """Identify the first capacity constraint likely to be hit."""
        current = capacity_plan["current_capacity"]
        
        # Check which resource will hit constraint first
        constraints = []
        
        # Storage constraint
        storage_months = current["storage_capacity"].get("time_to_full_months", 999)
        if storage_months < 999:
            constraints.append(("storage", storage_months))
        
        # Compute constraint (assume 85% is constraint threshold)
        compute_util = current["compute_capacity"]["current_utilization"]
        if compute_util > 0.8:
            constraints.append(("compute", 2))  # Assume 2 months if already high
        
        # Network constraint
        network_util = current["network_capacity"]["peak_utilization"] 
        if network_util > 0.8:
            constraints.append(("network", 3))  # Assume 3 months if peak is high
        
        if constraints:
            constraints.sort(key=lambda x: x[1])  # Sort by months
            return f"{constraints[0][0]} in {constraints[0][1]} months"
        
        return "No immediate constraints identified"
    
    # ID generation methods
    def _generate_monitoring_id(self) -> str:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"MONITOR_{timestamp}_{len(self.performance_metrics):04d}"
    
    def _generate_prediction_id(self) -> str:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"PREDICT_{timestamp}"
    
    def _generate_optimization_id(self) -> str:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S") 
        return f"OPTIMIZE_{timestamp}_{len(self.optimization_history):04d}"
    
    def _generate_scaling_id(self) -> str:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"SCALE_{timestamp}"
    
    def _generate_planning_id(self) -> str:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"PLAN_{timestamp}_{len(self.capacity_forecasts):04d}"
    
    def _generate_alert_id(self) -> str:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"ALERT_{timestamp}"