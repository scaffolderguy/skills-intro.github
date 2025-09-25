"""Model management module for ML workflows with MLflow integration."""
import logging
import time
import numpy as np
from typing import Any, Dict, Optional, Tuple
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.datasets import make_classification
from config import Config


class ModelManager:
    """Manages model training, tracking, and deployment using MLflow."""
    
    def __init__(self):
        """Initialize the model manager."""
        self.logger = logging.getLogger(__name__)
        self.config = Config()
        self.model = None
        self.model_version = None
        
        # Configure MLflow
        try:
            mlflow.set_tracking_uri(self.config.MLFLOW_TRACKING_URI)
            
            # Create or get experiment
            try:
                experiment = mlflow.get_experiment_by_name(self.config.MLFLOW_EXPERIMENT_NAME)
                if experiment is None:
                    experiment_id = mlflow.create_experiment(self.config.MLFLOW_EXPERIMENT_NAME)
                    self.logger.info(f"Created new MLflow experiment: {self.config.MLFLOW_EXPERIMENT_NAME}")
                else:
                    experiment_id = experiment.experiment_id
                    self.logger.info(f"Using existing MLflow experiment: {self.config.MLFLOW_EXPERIMENT_NAME}")
                
                mlflow.set_experiment(experiment_id=experiment_id)
                
            except Exception as e:
                self.logger.warning(f"Could not set MLflow experiment: {str(e)}")
                # Continue without experiment setup for demo
                
        except Exception as e:
            self.logger.warning(f"MLflow not available: {str(e)}")
            self.logger.info("Running in offline mode without MLflow tracking")
    
    def generate_sample_data(self) -> Tuple[np.ndarray, np.ndarray]:
        """Generate sample clinical data for demonstration."""
        # Generate synthetic clinical prediction data
        # Features could represent: age, BMI, blood pressure, lab values, etc.
        X, y = make_classification(
            n_samples=1000,
            n_features=10,
            n_informative=8,
            n_redundant=2,
            n_classes=3,  # e.g., low/medium/high risk categories
            random_state=42
        )
        
        # Add some realistic feature names for clinical context
        feature_names = [
            'age_normalized', 'bmi', 'systolic_bp', 'diastolic_bp',
            'glucose_level', 'cholesterol', 'heart_rate', 'hemoglobin',
            'white_cell_count', 'creatinine'
        ]
        
        self.logger.info(f"Generated sample dataset with {X.shape[0]} samples and {X.shape[1]} features")
        return X, y
    
    def train_model(self) -> None:
        """Train and track ML model."""
        try:
            self.logger.info("Starting model training...")
            
            # Generate or load training data
            X, y = self.generate_sample_data()
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Start MLflow run
            with mlflow.start_run(run_name=f"fortune50_training_{int(time.time())}") as run:
                # Model parameters
                params = {
                    'n_estimators': 100,
                    'max_depth': 10,
                    'random_state': 42,
                    'min_samples_split': 5,
                    'min_samples_leaf': 2
                }
                
                # Log parameters
                mlflow.log_params(params)
                
                # Train model
                self.model = RandomForestClassifier(**params)
                start_time = time.time()
                self.model.fit(X_train, y_train)
                training_time = time.time() - start_time
                
                # Make predictions
                y_pred = self.model.predict(X_test)
                
                # Calculate metrics
                accuracy = accuracy_score(y_test, y_pred)
                
                # Log metrics
                mlflow.log_metrics({
                    'accuracy': accuracy,
                    'training_time': training_time,
                    'train_samples': len(X_train),
                    'test_samples': len(X_test)
                })
                
                # Log additional info
                mlflow.set_tags({
                    'model_type': 'RandomForestClassifier',
                    'use_case': 'clinical_risk_prediction',
                    'data_type': 'synthetic_clinical',
                    'compliance': 'HIPAA_ready'
                })
                
                # Log model
                mlflow.sklearn.log_model(
                    self.model,
                    "model",
                    registered_model_name=self.config.MODEL_NAME
                )
                
                # Store run info
                self.model_version = run.info.run_id
                
                self.logger.info(f"Model training completed successfully!")
                self.logger.info(f"Accuracy: {accuracy:.4f}")
                self.logger.info(f"Training time: {training_time:.2f} seconds")
                self.logger.info(f"MLflow run ID: {run.info.run_id}")
                
                # Generate and log classification report
                report = classification_report(y_test, y_pred, output_dict=True)
                for class_name, metrics in report.items():
                    if isinstance(metrics, dict):
                        for metric_name, value in metrics.items():
                            mlflow.log_metric(f"{class_name}_{metric_name}", value)
                
        except Exception as e:
            self.logger.error(f"Error during model training: {str(e)}")
            # For demo purposes, create a simple model anyway
            self._train_fallback_model()
    
    def _train_fallback_model(self) -> None:
        """Train a simple fallback model when MLflow is not available."""
        self.logger.info("Training fallback model without MLflow...")
        
        X, y = self.generate_sample_data()
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self.model.fit(X_train, y_train)
        
        accuracy = accuracy_score(y_test, self.model.predict(X_test))
        self.logger.info(f"Fallback model trained with accuracy: {accuracy:.4f}")
    
    def load_model(self, model_version: Optional[str] = None) -> bool:
        """Load a model from MLflow registry."""
        try:
            if model_version:
                model_uri = f"models:/{self.config.MODEL_NAME}/{model_version}"
            else:
                model_uri = f"models:/{self.config.MODEL_NAME}/{self.config.MODEL_STAGE}"
            
            self.model = mlflow.sklearn.load_model(model_uri)
            self.model_version = model_version or self.config.MODEL_STAGE
            
            self.logger.info(f"Loaded model: {model_uri}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to load model: {str(e)}")
            return False
    
    def predict(self, data: np.ndarray) -> Dict[str, Any]:
        """Make predictions using the loaded model."""
        if self.model is None:
            raise ValueError("No model loaded. Please train or load a model first.")
        
        try:
            predictions = self.model.predict(data)
            probabilities = self.model.predict_proba(data) if hasattr(self.model, 'predict_proba') else None
            
            result = {
                'predictions': predictions.tolist(),
                'model_version': self.model_version,
                'timestamp': time.time()
            }
            
            if probabilities is not None:
                result['probabilities'] = probabilities.tolist()
            
            self.logger.info(f"Generated predictions for {len(data)} samples")
            return result
            
        except Exception as e:
            self.logger.error(f"Error making predictions: {str(e)}")
            raise
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the current model."""
        if self.model is None:
            return {'status': 'no_model_loaded'}
        
        return {
            'status': 'model_loaded',
            'model_type': type(self.model).__name__,
            'model_version': self.model_version,
            'parameters': self.model.get_params() if hasattr(self.model, 'get_params') else None,
            'mlflow_uri': self.config.MLFLOW_TRACKING_URI
        }
    
    def validate_model(self, test_data: Optional[np.ndarray] = None) -> Dict[str, Any]:
        """Validate model performance."""
        if self.model is None:
            raise ValueError("No model loaded for validation")
        
        try:
            # Use provided test data or generate new data
            if test_data is None:
                X_test, y_test = self.generate_sample_data()
                X_test, _, y_test, _ = train_test_split(X_test, y_test, test_size=0.1, random_state=42)
            else:
                X_test = test_data
                y_test = None  # Would need actual labels for validation
            
            # Make predictions
            y_pred = self.model.predict(X_test)
            
            validation_result = {
                'validation_timestamp': time.time(),
                'sample_count': len(X_test),
                'predictions_generated': len(y_pred)
            }
            
            # If we have true labels, calculate accuracy
            if y_test is not None:
                accuracy = accuracy_score(y_test, y_pred)
                validation_result['accuracy'] = accuracy
                self.logger.info(f"Model validation accuracy: {accuracy:.4f}")
            
            return validation_result
            
        except Exception as e:
            self.logger.error(f"Error during model validation: {str(e)}")
            raise