"""Centralized logging configuration for Fortune 50 AI Application."""
import logging
import logging.config
import os
import sys
from datetime import datetime
from typing import Dict, Any
from config import Config


def setup_logging() -> None:
    """Set up centralized logging configuration."""
    config = Config()
    
    # Create logs directory if it doesn't exist
    log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
    os.makedirs(log_dir, exist_ok=True)
    
    # Generate log filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    log_file = os.path.join(log_dir, f'fortune50_ai_{timestamp}.log')
    
    # Define logging configuration
    logging_config = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'standard': {
                'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s',
                'datefmt': '%Y-%m-%d %H:%M:%S'
            },
            'detailed': {
                'format': '%(asctime)s [%(levelname)s] %(name)s [%(filename)s:%(lineno)d] %(funcName)s(): %(message)s',
                'datefmt': '%Y-%m-%d %H:%M:%S'
            },
            'json': {
                'format': '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "logger": "%(name)s", "file": "%(filename)s", "line": %(lineno)d, "function": "%(funcName)s", "message": "%(message)s"}',
                'datefmt': '%Y-%m-%d %H:%M:%S'
            }
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': config.LOG_LEVEL,
                'formatter': 'standard',
                'stream': sys.stdout
            },
            'file': {
                'class': 'logging.FileHandler',
                'level': 'DEBUG',
                'formatter': 'detailed',
                'filename': log_file,
                'mode': 'a',
                'encoding': 'utf-8'
            },
            'error_file': {
                'class': 'logging.FileHandler',
                'level': 'ERROR',
                'formatter': 'detailed',
                'filename': os.path.join(log_dir, f'fortune50_ai_errors_{timestamp}.log'),
                'mode': 'a',
                'encoding': 'utf-8'
            }
        },
        'loggers': {
            '': {  # Root logger
                'handlers': ['console', 'file', 'error_file'],
                'level': 'DEBUG',
                'propagate': False
            },
            'kafka': {
                'handlers': ['console', 'file'],
                'level': 'WARNING',  # Reduce Kafka logging verbosity
                'propagate': False
            },
            'mlflow': {
                'handlers': ['console', 'file'],
                'level': 'WARNING',  # Reduce MLflow logging verbosity
                'propagate': False
            },
            'urllib3': {
                'handlers': ['file'],
                'level': 'WARNING',  # Reduce HTTP logging verbosity
                'propagate': False
            }
        }
    }
    
    # Apply logging configuration
    logging.config.dictConfig(logging_config)
    
    # Log initial information
    logger = logging.getLogger(__name__)
    logger.info("=" * 80)
    logger.info(f"Fortune 50 AI Application - Logging Initialized")
    logger.info(f"Application: {config.APP_NAME} v{config.APP_VERSION}")
    logger.info(f"Log Level: {config.LOG_LEVEL}")
    logger.info(f"Log File: {log_file}")
    logger.info(f"Timestamp: {datetime.now().isoformat()}")
    logger.info("=" * 80)


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance with the specified name."""
    return logging.getLogger(name)


def log_system_info() -> None:
    """Log system and configuration information."""
    logger = get_logger(__name__)
    config = Config()
    
    logger.info("System Configuration:")
    logger.info(f"  Python Version: {sys.version}")
    logger.info(f"  Platform: {sys.platform}")
    logger.info(f"  Working Directory: {os.getcwd()}")
    
    logger.info("Application Configuration:")
    config_dict = config.to_dict()
    for key, value in config_dict.items():
        if 'TOKEN' in key or 'PASSWORD' in key or 'SECRET' in key:
            # Mask sensitive information
            display_value = "***MASKED***" if value else "Not Set"
        else:
            display_value = value
        logger.info(f"  {key}: {display_value}")


def log_performance_metrics(operation: str, duration: float, **kwargs) -> None:
    """Log performance metrics for operations."""
    logger = get_logger('performance')
    
    metrics = {
        'operation': operation,
        'duration_seconds': round(duration, 4),
        'timestamp': datetime.now().isoformat()
    }
    
    # Add any additional metrics
    metrics.update(kwargs)
    
    logger.info(f"Performance: {operation} completed in {duration:.4f}s", extra=metrics)


def log_security_event(event_type: str, details: Dict[str, Any]) -> None:
    """Log security-related events."""
    logger = get_logger('security')
    
    security_event = {
        'event_type': event_type,
        'timestamp': datetime.now().isoformat(),
        'details': details
    }
    
    logger.warning(f"Security Event: {event_type}", extra=security_event)


def log_compliance_event(event_type: str, details: Dict[str, Any]) -> None:
    """Log compliance-related events (e.g., HIPAA)."""
    logger = get_logger('compliance')
    
    compliance_event = {
        'event_type': event_type,
        'timestamp': datetime.now().isoformat(),
        'details': details
    }
    
    logger.info(f"Compliance Event: {event_type}", extra=compliance_event)


class PerformanceTimer:
    """Context manager for timing operations."""
    
    def __init__(self, operation_name: str, logger_name: str = 'performance'):
        self.operation_name = operation_name
        self.logger = get_logger(logger_name)
        self.start_time = None
        self.end_time = None
    
    def __enter__(self):
        self.start_time = datetime.now()
        self.logger.debug(f"Starting operation: {self.operation_name}")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = datetime.now()
        duration = (self.end_time - self.start_time).total_seconds()
        
        if exc_type is None:
            log_performance_metrics(self.operation_name, duration)
        else:
            self.logger.error(f"Operation {self.operation_name} failed after {duration:.4f}s: {exc_val}")
        
        return False  # Don't suppress exceptions