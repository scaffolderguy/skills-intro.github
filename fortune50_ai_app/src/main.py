import logging
from data_pipeline import DataPipeline
from model_management import ModelManager
from logging_config import setup_logging


def main():
    """Entry point for the Fortune 50 AI Application."""
    setup_logging()
    logging.info("Starting Fortune 50 AI Application")

    try:
        # Initialize data pipeline
        logging.info("Initializing data pipeline...")
        data_pipeline = DataPipeline()
        
        # Initialize model manager
        logging.info("Initializing model manager...")
        model_manager = ModelManager()
        
        # Start data pipeline processing
        logging.info("Starting data processing...")
        data_pipeline.run()
        
        # Train/load models
        logging.info("Starting model training/loading...")
        model_manager.train_model()
        
        logging.info("Fortune 50 AI Application started successfully")
        
    except Exception as e:
        logging.error(f"Error starting application: {str(e)}")
        raise


if __name__ == "__main__":
    main()