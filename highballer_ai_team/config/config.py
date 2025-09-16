"""Configuration management for Highballer AI Team."""

import os
import json
from typing import Dict, Any, Optional
from pathlib import Path


class HighballerConfig:
    """Configuration management for the Highballer AI Team system."""
    
    def __init__(self, config_file: Optional[str] = None):
        self.config_file = config_file or os.getenv('HIGHBALLER_CONFIG', 'config.json')
        self.config_data = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from file or use defaults."""
        config_path = Path(self.config_file)
        
        if config_path.exists():
            try:
                with open(config_path, 'r') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                print(f"Warning: Could not load config file {self.config_file}: {e}")
                print("Using default configuration.")
        
        return self._get_default_config()
    
    def _get_default_config(self) -> Dict[str, Any]:
        """Get default configuration."""
        return {
            "team": {
                "name": "Highballer AI Team",
                "version": "1.0.0",
                "log_level": "INFO",
                "max_concurrent_tasks": 10,
                "task_timeout_seconds": 300
            },
            "agents": {
                "incident_commander": {
                    "enabled": True,
                    "priority_weight": 1.0,
                    "auto_triage": True,
                    "escalation_threshold_minutes": 30
                },
                "code_refactor_specialist": {
                    "enabled": True,
                    "priority_weight": 0.8,
                    "auto_analysis": True,
                    "quality_threshold": 75
                },
                "security_sentinel": {
                    "enabled": True,
                    "priority_weight": 1.2,
                    "continuous_monitoring": True,
                    "threat_sensitivity": "high"
                },
                "infra_architect": {
                    "enabled": True,
                    "priority_weight": 0.9,
                    "auto_scaling": True,
                    "capacity_threshold": 80
                },
                "human_ai_interface": {
                    "enabled": True,
                    "priority_weight": 0.7,
                    "auto_reporting": True,
                    "stakeholder_updates": True
                }
            },
            "monitoring": {
                "metrics_retention_days": 30,
                "performance_sampling_rate": 0.1,
                "alert_cooldown_minutes": 15,
                "dashboard_refresh_seconds": 60
            },
            "security": {
                "encrypt_communications": True,
                "audit_log_retention_days": 90,
                "require_authentication": True,
                "security_scan_interval_hours": 24
            },
            "performance": {
                "max_memory_usage_mb": 1024,
                "max_cpu_usage_percent": 80,
                "cache_size_mb": 256,
                "connection_pool_size": 20
            },
            "notifications": {
                "email": {
                    "enabled": True,
                    "smtp_server": "localhost",
                    "smtp_port": 587,
                    "use_tls": True
                },
                "slack": {
                    "enabled": True,
                    "webhook_url": "",
                    "channel": "#alerts"
                },
                "sms": {
                    "enabled": False,
                    "provider": "twilio",
                    "api_key": ""
                }
            },
            "integrations": {
                "github": {
                    "enabled": False,
                    "api_token": "",
                    "webhook_secret": ""
                },
                "jira": {
                    "enabled": False,
                    "server_url": "",
                    "username": "",
                    "api_token": ""
                },
                "datadog": {
                    "enabled": False,
                    "api_key": "",
                    "app_key": ""
                }
            }
        }
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value by dot notation key."""
        keys = key.split('.')
        current = self.config_data
        
        for k in keys:
            if isinstance(current, dict) and k in current:
                current = current[k]
            else:
                return default
        
        return current
    
    def set(self, key: str, value: Any) -> None:
        """Set configuration value by dot notation key."""
        keys = key.split('.')
        current = self.config_data
        
        for k in keys[:-1]:
            if k not in current or not isinstance(current[k], dict):
                current[k] = {}
            current = current[k]
        
        current[keys[-1]] = value
    
    def save_config(self) -> None:
        """Save current configuration to file."""
        try:
            with open(self.config_file, 'w') as f:
                json.dump(self.config_data, f, indent=2)
        except IOError as e:
            print(f"Error saving config file {self.config_file}: {e}")
    
    def is_agent_enabled(self, agent_name: str) -> bool:
        """Check if an agent is enabled."""
        return self.get(f'agents.{agent_name}.enabled', True)
    
    def get_agent_config(self, agent_name: str) -> Dict[str, Any]:
        """Get configuration for a specific agent."""
        return self.get(f'agents.{agent_name}', {})
    
    def get_notification_config(self, provider: str) -> Dict[str, Any]:
        """Get notification configuration for a provider."""
        return self.get(f'notifications.{provider}', {})
    
    def get_integration_config(self, integration: str) -> Dict[str, Any]:
        """Get integration configuration."""
        return self.get(f'integrations.{integration}', {})