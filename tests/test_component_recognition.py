"""
Test suite for Component Recognition system
"""

import pytest
import numpy as np
import sys
import os

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from core.component_recognition import (
    ComponentRecognizer, ComponentType, FunctionCategory, 
    ComponentInfo, ComponentDatabase
)


class TestComponentRecognizer:
    """Test cases for ComponentRecognizer class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.recognizer = ComponentRecognizer()
        self.mock_image = np.zeros((480, 640, 3), dtype=np.uint8)
    
    def test_initialization(self):
        """Test ComponentRecognizer initialization."""
        assert self.recognizer is not None
        assert self.recognizer.model is not None
        assert self.recognizer.feature_extractor is not None
        assert len(self.recognizer.type_to_function) > 0
    
    def test_preprocess_image(self):
        """Test image preprocessing."""
        processed = self.recognizer.preprocess_image(self.mock_image)
        
        assert processed.shape == (1, 224, 224, 3)
        assert processed.dtype == np.float32
        assert np.all(processed >= 0) and np.all(processed <= 1)
    
    def test_detect_components(self):
        """Test component detection."""
        components = self.recognizer.detect_components(self.mock_image)
        
        assert isinstance(components, list)
        assert len(components) >= 0
        
        for component in components:
            assert isinstance(component, ComponentInfo)
            assert isinstance(component.component_type, ComponentType)
            assert isinstance(component.function_category, FunctionCategory)
            assert 0 <= component.confidence <= 1
    
    def test_classify_by_function(self):
        """Test functional classification."""
        # Create mock components
        components = [
            ComponentInfo(
                component_type=ComponentType.GEAR,
                function_category=FunctionCategory.POWER_TRANSMISSION,
                confidence=0.9,
                bounding_box=(0, 0, 100, 100),
                properties={}
            ),
            ComponentInfo(
                component_type=ComponentType.BEARING,
                function_category=FunctionCategory.STRUCTURAL_SUPPORT,
                confidence=0.8,
                bounding_box=(100, 100, 50, 50),
                properties={}
            )
        ]
        
        classified = self.recognizer.classify_by_function(components)
        
        assert isinstance(classified, dict)
        assert FunctionCategory.POWER_TRANSMISSION in classified
        assert FunctionCategory.STRUCTURAL_SUPPORT in classified
        assert len(classified[FunctionCategory.POWER_TRANSMISSION]) == 1
        assert len(classified[FunctionCategory.STRUCTURAL_SUPPORT]) == 1
    
    def test_extract_features(self):
        """Test feature extraction."""
        features = self.recognizer.extract_features(self.mock_image)
        
        assert isinstance(features, np.ndarray)
        assert len(features.shape) == 1  # Flattened features
        assert features.shape[0] > 0
    
    def test_estimate_dimensions(self):
        """Test dimension estimation."""
        component = ComponentInfo(
            component_type=ComponentType.GEAR,
            function_category=FunctionCategory.POWER_TRANSMISSION,
            confidence=0.9,
            bounding_box=(0, 0, 100, 100),
            properties={}
        )
        
        dimensions = self.recognizer.estimate_dimensions(component, scale_factor=0.5)
        
        assert isinstance(dimensions, dict)
        assert 'width_mm' in dimensions
        assert 'height_mm' in dimensions
        assert 'estimated_volume_mm3' in dimensions
        assert all(v > 0 for v in dimensions.values())


class TestComponentDatabase:
    """Test cases for ComponentDatabase class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.database = ComponentDatabase()
    
    def test_initialization(self):
        """Test database initialization."""
        assert self.database is not None
        assert len(self.database.components) > 0
        assert "standard_gears" in self.database.components
    
    def test_add_component(self):
        """Test adding components to database."""
        component = ComponentInfo(
            component_type=ComponentType.SHAFT,
            function_category=FunctionCategory.POWER_TRANSMISSION,
            confidence=0.95,
            bounding_box=(0, 0, 50, 200),
            properties={"diameter": 20, "length": 100}
        )
        
        initial_count = len(self.database.components)
        self.database.add_component("test_shaft", component)
        
        assert len(self.database.components) == initial_count + 1
        assert "test_shaft" in self.database.components
        assert self.database.components["test_shaft"] == component
    
    def test_get_similar_components(self):
        """Test finding similar components."""
        component = ComponentInfo(
            component_type=ComponentType.GEAR,
            function_category=FunctionCategory.POWER_TRANSMISSION,
            confidence=0.9,
            bounding_box=(0, 0, 100, 100),
            properties={"tooth_count": 20}
        )
        
        similar = self.database.get_similar_components(component)
        assert isinstance(similar, list)


class TestComponentTypes:
    """Test cases for component type enums and structures."""
    
    def test_component_type_enum(self):
        """Test ComponentType enum."""
        assert ComponentType.GEAR.value == "gear"
        assert ComponentType.BEARING.value == "bearing"
        assert ComponentType.UNKNOWN.value == "unknown"
        
        # Test all enum values are strings
        for component_type in ComponentType:
            assert isinstance(component_type.value, str)
    
    def test_function_category_enum(self):
        """Test FunctionCategory enum."""
        assert FunctionCategory.POWER_TRANSMISSION.value == "power_transmission"
        assert FunctionCategory.FLUID_CONTROL.value == "fluid_control"
        assert FunctionCategory.UNKNOWN.value == "unknown"
        
        # Test all enum values are strings
        for category in FunctionCategory:
            assert isinstance(category.value, str)
    
    def test_component_info_structure(self):
        """Test ComponentInfo dataclass."""
        component = ComponentInfo(
            component_type=ComponentType.GEAR,
            function_category=FunctionCategory.POWER_TRANSMISSION,
            confidence=0.95,
            bounding_box=(10, 20, 100, 80),
            properties={"tooth_count": 24, "material": "steel"}
        )
        
        assert component.component_type == ComponentType.GEAR
        assert component.function_category == FunctionCategory.POWER_TRANSMISSION
        assert component.confidence == 0.95
        assert component.bounding_box == (10, 20, 100, 80)
        assert component.properties["tooth_count"] == 24
        assert component.estimated_dimensions is None


if __name__ == "__main__":
    pytest.main([__file__])