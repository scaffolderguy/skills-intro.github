"""Configuration settings for Fortune 50 AI Application."""
import os
from typing import Dict, Any


class Config:
    """Configuration class for application settings."""
    
    # Kafka Configuration
    KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
    KAFKA_DATA_TOPIC = os.getenv('KAFKA_DATA_TOPIC', 'data_topic')
    KAFKA_CONSUMER_GROUP = os.getenv('KAFKA_CONSUMER_GROUP', 'fortune50_ai_group')
    
    # MLflow Configuration
    MLFLOW_TRACKING_URI = os.getenv('MLFLOW_TRACKING_URI', 'http://localhost:5000')
    MLFLOW_EXPERIMENT_NAME = os.getenv('MLFLOW_EXPERIMENT_NAME', 'fortune50_ai_experiment')
    
    # Vault Configuration
    VAULT_URL = os.getenv('VAULT_URL', 'http://localhost:8200')
    VAULT_TOKEN = os.getenv('VAULT_TOKEN', '')
    
    # Security Configuration
    VAULT_SECRET_PATH = os.getenv('VAULT_SECRET_PATH', 'secret/fortune50')
    
    # Application Configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    APP_NAME = 'Fortune50AIApp'
    APP_VERSION = '1.0.0'
    
    # Data Processing Configuration
    BATCH_SIZE = int(os.getenv('BATCH_SIZE', '100'))
    PROCESSING_INTERVAL = int(os.getenv('PROCESSING_INTERVAL', '30'))  # seconds
    
    # Model Configuration
    MODEL_REGISTRY_URI = os.getenv('MODEL_REGISTRY_URI', 'mlflow')
    MODEL_NAME = os.getenv('MODEL_NAME', 'fortune50_model')
    MODEL_STAGE = os.getenv('MODEL_STAGE', 'Production')
    
    @classmethod
    def to_dict(cls) -> Dict[str, Any]:
        """Convert configuration to dictionary."""
        return {
            attr: getattr(cls, attr)
            for attr in dir(cls)
            if not attr.startswith('_') and not callable(getattr(cls, attr))
        }
    
    @classmethod
    def validate(cls) -> bool:
        """Validate required configuration parameters."""
        required_configs = [
            'KAFKA_BOOTSTRAP_SERVERS',
            'MLFLOW_TRACKING_URI',
            'VAULT_URL'
        ]
        
        for config in required_configs:
            if not getattr(cls, config):
                raise ValueError(f"Required configuration {config} is not set")
        
        return True