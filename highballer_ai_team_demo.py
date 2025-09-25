#!/usr/bin/env python3
"""
Highballer AI Team - Main execution example and demonstration.

This script demonstrates how to use the Highballer AI Team system for
elite AI-powered incident response and system management.
"""

import asyncio
import logging
from typing import Dict, Any

from highballer_ai_team import HighballerTeam
from highballer_ai_team.agents import (
    IncidentCommanderAI,
    CodeRefactorSpecialist,
    SecuritySentinel,
    InfraArchitectAI,
    HumanAIInterfaceStrategist
)
from highballer_ai_team.core.base_agent import Priority
from highballer_ai_team.config import HighballerConfig
from highballer_ai_team.utils import setup_logging, MetricsCollector


async def main():
    """Main demonstration of Highballer AI Team capabilities."""
    
    # Setup logging
    logger = setup_logging("highballer_demo", "INFO")
    logger.info("🚀 Starting Highballer AI Team Demonstration")
    
    # Initialize configuration
    config = HighballerConfig()
    
    # Initialize metrics collection
    metrics = MetricsCollector()
    
    # Create the team coordinator
    team = HighballerTeam(config.get('team'))
    
    # Initialize and register AI agents
    logger.info("🤖 Initializing AI Agents...")
    
    # 1. Incident AI Commander
    incident_commander = IncidentCommanderAI(config.get_agent_config('incident_commander'))
    team.register_agent(incident_commander)
    
    # 2. Code Refactor Specialist  
    code_specialist = CodeRefactorSpecialist(config.get_agent_config('code_refactor_specialist'))
    team.register_agent(code_specialist)
    
    # 3. Security Sentinel
    security_sentinel = SecuritySentinel(config.get_agent_config('security_sentinel'))
    team.register_agent(security_sentinel)
    
    # 4. Infrastructure Architect AI
    infra_architect = InfraArchitectAI(config.get_agent_config('infra_architect'))
    team.register_agent(infra_architect)
    
    # 5. Human-AI Interface Strategist
    interface_strategist = HumanAIInterfaceStrategist(config.get_agent_config('human_ai_interface'))
    team.register_agent(interface_strategist)
    
    # Initialize the team
    logger.info("⚡ Initializing Highballer AI Team...")
    success = await team.initialize_team()
    
    if not success:
        logger.error("❌ Failed to initialize team")
        return
    
    logger.info("✅ Highballer AI Team is operational!")
    
    # Demonstrate core capabilities
    await demonstrate_incident_response(team, metrics, logger)
    await demonstrate_code_analysis(team, metrics, logger)
    await demonstrate_security_assessment(team, metrics, logger)
    await demonstrate_infrastructure_optimization(team, metrics, logger)
    await demonstrate_stakeholder_communication(team, metrics, logger)
    
    # Show team status and metrics
    await show_team_status(team, metrics, logger)
    
    logger.info("🎯 Highballer AI Team demonstration completed successfully!")


async def demonstrate_incident_response(team: HighballerTeam, metrics: MetricsCollector, logger: logging.Logger):
    """Demonstrate incident response capabilities."""
    logger.info("\n🚨 DEMONSTRATING INCIDENT RESPONSE")
    
    with metrics.timer("incident_response"):
        # Create a critical incident
        incident_task_id = team.create_task(
            task_type="incident",
            priority=Priority.CRITICAL,
            data={
                "description": "Database connection pool exhausted, users unable to login",
                "affected_systems": ["database", "authentication", "user_portal"],
                "impact_scope": "all_users",
                "severity": "critical",
                "reported_by": "monitoring_system"
            },
            requester="automated_monitoring"
        )
        
        logger.info(f"📋 Created critical incident task: {incident_task_id}")
        
        # Execute the task
        result = await team.execute_next_task()
        logger.info(f"✅ Incident response completed: {result['status']}")
        
        metrics.increment("incidents_handled")
        metrics.increment("tasks_completed", tags={"type": "incident", "priority": "critical"})


async def demonstrate_code_analysis(team: HighballerTeam, metrics: MetricsCollector, logger: logging.Logger):
    """Demonstrate code analysis and refactoring capabilities."""
    logger.info("\n🔍 DEMONSTRATING CODE ANALYSIS")
    
    with metrics.timer("code_analysis"):
        # Create a code review task
        code_task_id = team.create_task(
            task_type="code_review",
            priority=Priority.HIGH,
            data={
                "codebase_path": "/home/runner/work/skills-intro.github/skills-intro.github",
                "scope": "full",
                "analysis_type": "comprehensive"
            },
            requester="development_team"
        )
        
        logger.info(f"📋 Created code analysis task: {code_task_id}")
        
        # Execute the task
        result = await team.execute_next_task()
        logger.info(f"✅ Code analysis completed: {result['status']}")
        
        metrics.increment("code_reviews_completed")
        metrics.increment("tasks_completed", tags={"type": "code_review", "priority": "high"})


async def demonstrate_security_assessment(team: HighballerTeam, metrics: MetricsCollector, logger: logging.Logger):
    """Demonstrate security scanning and assessment capabilities."""
    logger.info("\n🛡️ DEMONSTRATING SECURITY ASSESSMENT")
    
    with metrics.timer("security_assessment"):
        # Create a security scan task
        security_task_id = team.create_task(
            task_type="security_scan",
            priority=Priority.HIGH,
            data={
                "targets": ["web_application", "database", "api_endpoints"],
                "scan_type": "comprehensive",
                "include_penetration_testing": True
            },
            requester="security_team"
        )
        
        logger.info(f"📋 Created security assessment task: {security_task_id}")
        
        # Execute the task
        result = await team.execute_next_task()
        logger.info(f"✅ Security assessment completed: {result['status']}")
        
        metrics.increment("security_scans_completed")
        metrics.increment("tasks_completed", tags={"type": "security_scan", "priority": "high"})


async def demonstrate_infrastructure_optimization(team: HighballerTeam, metrics: MetricsCollector, logger: logging.Logger):
    """Demonstrate infrastructure monitoring and optimization."""
    logger.info("\n🏗️ DEMONSTRATING INFRASTRUCTURE OPTIMIZATION")
    
    with metrics.timer("infrastructure_optimization"):
        # Create a performance monitoring task
        infra_task_id = team.create_task(
            task_type="performance",
            priority=Priority.MEDIUM,
            data={
                "duration_minutes": 60,
                "resources": ["cpu", "memory", "disk", "network", "database"],
                "optimization_goals": ["performance", "cost"]
            },
            requester="operations_team"
        )
        
        logger.info(f"📋 Created infrastructure optimization task: {infra_task_id}")
        
        # Execute the task
        result = await team.execute_next_task()
        logger.info(f"✅ Infrastructure optimization completed: {result['status']}")
        
        metrics.increment("infrastructure_optimizations")
        metrics.increment("tasks_completed", tags={"type": "performance", "priority": "medium"})


async def demonstrate_stakeholder_communication(team: HighballerTeam, metrics: MetricsCollector, logger: logging.Logger):
    """Demonstrate stakeholder communication and reporting."""
    logger.info("\n📊 DEMONSTRATING STAKEHOLDER COMMUNICATION")
    
    with metrics.timer("stakeholder_communication"):
        # Create a reporting task
        reporting_task_id = team.create_task(
            task_type="reporting",
            priority=Priority.MEDIUM,
            data={
                "stakeholder_id": "cto",
                "report_type": "executive_summary",
                "time_period": "last_24_hours",
                "include_recommendations": True
            },
            requester="executive_team"
        )
        
        logger.info(f"📋 Created stakeholder communication task: {reporting_task_id}")
        
        # Execute the task
        result = await team.execute_next_task()
        logger.info(f"✅ Stakeholder communication completed: {result['status']}")
        
        metrics.increment("reports_generated")
        metrics.increment("tasks_completed", tags={"type": "reporting", "priority": "medium"})


async def show_team_status(team: HighballerTeam, metrics: MetricsCollector, logger: logging.Logger):
    """Show overall team status and metrics."""
    logger.info("\n📈 TEAM STATUS AND METRICS")
    
    # Get team status
    team_status = team.get_team_status()
    
    logger.info("🤖 Agent Status:")
    for agent_name, status_info in team_status["agents"].items():
        status = status_info["status"]
        completed_tasks = status_info["metrics"]["tasks_completed"]
        logger.info(f"  • {agent_name}: {status} ({completed_tasks} tasks completed)")
    
    logger.info(f"\n📋 Task Queue Status:")
    logger.info(f"  • Queue length: {team_status['queue_length']}")
    logger.info(f"  • Active tasks: {team_status['active_tasks']}")
    logger.info(f"  • Completed tasks: {team_status['completed_tasks']}")
    
    # Show collected metrics
    all_metrics = metrics.get_metrics()
    logger.info(f"\n📊 Performance Metrics:")
    for metric_name, metric_data in all_metrics.items():
        if metric_data["type"] == "histogram":
            logger.info(f"  • {metric_name}: {metric_data['avg']:.2f}s avg, {metric_data['count']} calls")
        elif metric_data["type"] == "counter":
            logger.info(f"  • {metric_name}: {metric_data['value']} total")


def create_sample_config():
    """Create a sample configuration file."""
    config = HighballerConfig()
    
    # Customize some settings for demo
    config.set('team.name', 'Elite Highballer AI Team')
    config.set('team.max_concurrent_tasks', 5)
    config.set('agents.security_sentinel.threat_sensitivity', 'maximum')
    config.set('agents.incident_commander.escalation_threshold_minutes', 15)
    
    # Save configuration
    config.save_config()
    print("📝 Sample configuration saved to config.json")


def handle_emergency_escalation():
    """Demonstrate emergency escalation capabilities."""
    
    async def emergency_demo():
        team = HighballerTeam()
        
        # Simulate critical security breach
        emergency_task_id = team.emergency_escalation({
            "incident_type": "security_breach",
            "description": "Potential data exfiltration detected",
            "affected_systems": ["user_database", "payment_system"],
            "severity": "critical",
            "immediate_action_required": True
        })
        
        print(f"🚨 EMERGENCY ESCALATION ACTIVATED: {emergency_task_id}")
        
        # Show team status after emergency
        status = team.get_team_status()
        print(f"Team status: {status['team_status']}")
        
        return emergency_task_id
    
    return asyncio.run(emergency_demo())


if __name__ == "__main__":
    # You can run different demos based on command line arguments
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "config":
            create_sample_config()
        elif sys.argv[1] == "emergency":
            handle_emergency_escalation()
        else:
            print("Usage: python demo.py [config|emergency]")
    else:
        # Run the full demonstration
        asyncio.run(main())