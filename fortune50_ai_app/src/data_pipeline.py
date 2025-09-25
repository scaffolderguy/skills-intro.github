"""Data pipeline module for handling data ingestion and processing."""
import json
import logging
import time
from typing import Any, Dict, List, Optional
from kafka import KafkaConsumer
from kafka.errors import KafkaError
from config import Config


class DataPipeline:
    """Handles data ingestion and processing from Kafka streams."""
    
    def __init__(self):
        """Initialize the data pipeline."""
        self.logger = logging.getLogger(__name__)
        self.config = Config()
        self.consumer = None
        self.processed_count = 0
        
    def _create_consumer(self) -> KafkaConsumer:
        """Create and configure Kafka consumer."""
        try:
            consumer = KafkaConsumer(
                self.config.KAFKA_DATA_TOPIC,
                bootstrap_servers=self.config.KAFKA_BOOTSTRAP_SERVERS,
                group_id=self.config.KAFKA_CONSUMER_GROUP,
                auto_offset_reset='latest',
                enable_auto_commit=True,
                value_deserializer=lambda x: json.loads(x.decode('utf-8')) if x else None,
                consumer_timeout_ms=10000  # 10 seconds timeout for demo purposes
            )
            self.logger.info(f"Created Kafka consumer for topic: {self.config.KAFKA_DATA_TOPIC}")
            return consumer
        except Exception as e:
            self.logger.error(f"Failed to create Kafka consumer: {str(e)}")
            raise
    
    def process_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process incoming data from Kafka."""
        try:
            if not data:
                return {}
            
            # Example data processing logic
            processed_data = {
                'timestamp': time.time(),
                'original_data': data,
                'processed_by': 'Fortune50AIApp',
                'processing_status': 'success'
            }
            
            # Add data validation
            if 'patient_id' in data:
                # Anonymize patient data for HIPAA compliance
                processed_data['anonymized_id'] = self._anonymize_patient_id(data['patient_id'])
                del processed_data['original_data']['patient_id']
            
            # Add data enrichment
            processed_data['data_quality_score'] = self._calculate_data_quality(data)
            
            self.processed_count += 1
            self.logger.info(f"Processed data record #{self.processed_count}: {processed_data['processing_status']}")
            
            return processed_data
            
        except Exception as e:
            self.logger.error(f"Error processing data: {str(e)}")
            return {
                'timestamp': time.time(),
                'processing_status': 'error',
                'error_message': str(e)
            }
    
    def _anonymize_patient_id(self, patient_id: str) -> str:
        """Anonymize patient ID for HIPAA compliance."""
        # Simple hash-based anonymization (in production, use proper anonymization)
        import hashlib
        return hashlib.sha256(patient_id.encode()).hexdigest()[:16]
    
    def _calculate_data_quality(self, data: Dict[str, Any]) -> float:
        """Calculate data quality score."""
        if not data:
            return 0.0
        
        required_fields = ['timestamp', 'data_type']
        present_fields = sum(1 for field in required_fields if field in data)
        
        # Basic completeness score
        completeness_score = present_fields / len(required_fields)
        
        # Check for null values
        non_null_values = sum(1 for value in data.values() if value is not None)
        null_penalty = non_null_values / len(data) if data else 0
        
        return (completeness_score + null_penalty) / 2
    
    def run(self) -> None:
        """Run the data pipeline."""
        try:
            self.logger.info("Starting data pipeline...")
            self.consumer = self._create_consumer()
            
            self.logger.info("Listening for messages from Kafka...")
            for message in self.consumer:
                try:
                    # Process the message
                    processed_data = self.process_data(message.value)
                    
                    # In a real implementation, you might:
                    # - Store processed data in a database
                    # - Send to another Kafka topic
                    # - Trigger model inference
                    
                    if processed_data.get('processing_status') == 'success':
                        self.logger.debug(f"Successfully processed message from partition {message.partition}")
                    
                except Exception as e:
                    self.logger.error(f"Error processing message: {str(e)}")
                    continue
                    
        except KafkaError as e:
            self.logger.error(f"Kafka error in data pipeline: {str(e)}")
            # For demo purposes, don't raise - just log and continue
            self.logger.info("Kafka not available - running in demo mode")
            self._run_demo_mode()
        except Exception as e:
            self.logger.error(f"Unexpected error in data pipeline: {str(e)}")
            raise
        finally:
            if self.consumer:
                self.consumer.close()
                self.logger.info("Data pipeline stopped")
    
    def _run_demo_mode(self) -> None:
        """Run pipeline in demo mode without Kafka."""
        self.logger.info("Running data pipeline in demo mode...")
        
        # Simulate some data processing
        demo_data = [
            {'patient_id': 'DEMO001', 'data_type': 'vitals', 'value': 120, 'timestamp': time.time()},
            {'patient_id': 'DEMO002', 'data_type': 'labs', 'value': 7.2, 'timestamp': time.time()},
            {'patient_id': 'DEMO003', 'data_type': 'imaging', 'value': 'normal', 'timestamp': time.time()}
        ]
        
        for data in demo_data:
            processed = self.process_data(data)
            time.sleep(1)  # Simulate processing time
            
        self.logger.info(f"Demo mode completed. Processed {len(demo_data)} records.")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get pipeline statistics."""
        return {
            'processed_count': self.processed_count,
            'status': 'running' if self.consumer else 'stopped',
            'config': {
                'kafka_servers': self.config.KAFKA_BOOTSTRAP_SERVERS,
                'topic': self.config.KAFKA_DATA_TOPIC,
                'consumer_group': self.config.KAFKA_CONSUMER_GROUP
            }
        }