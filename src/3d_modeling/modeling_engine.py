"""
3D modeling and isometric drawing generation system.
Converts 2D diagrams or photos into 3D models and generates technical drawings.
"""

import numpy as np
import open3d as o3d
import trimesh
from typing import Dict, List, Tuple, Optional, Union
from dataclasses import dataclass
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import cv2
from pathlib import Path

from .component_recognition import ComponentInfo, ComponentType


@dataclass
class ModelingParameters:
    """Parameters for 3D model generation."""
    resolution: float = 0.1  # mm per voxel
    smoothing_factor: float = 0.5
    material_properties: Dict[str, any] = None
    scale_factor: float = 1.0


@dataclass
class DrawingSettings:
    """Settings for technical drawing generation."""
    drawing_scale: float = 1.0
    line_weight: float = 1.0
    show_dimensions: bool = True
    show_annotations: bool = True
    projection_type: str = "isometric"  # isometric, orthographic, perspective


class Model3D:
    """3D model representation with associated metadata."""
    
    def __init__(self, mesh: Union[o3d.geometry.TriangleMesh, trimesh.Trimesh], 
                 component_info: ComponentInfo):
        self.mesh = mesh
        self.component_info = component_info
        self.material_properties = {}
        self.assembly_connections = []
    
    def get_volume(self) -> float:
        """Calculate volume of the 3D model."""
        if isinstance(self.mesh, o3d.geometry.TriangleMesh):
            return self.mesh.get_volume()
        elif isinstance(self.mesh, trimesh.Trimesh):
            return self.mesh.volume
        return 0.0
    
    def get_surface_area(self) -> float:
        """Calculate surface area of the 3D model."""
        if isinstance(self.mesh, o3d.geometry.TriangleMesh):
            return self.mesh.get_surface_area()
        elif isinstance(self.mesh, trimesh.Trimesh):
            return self.mesh.area
        return 0.0


class ThreeDModeler:
    """3D modeling system for mechanical components."""
    
    def __init__(self):
        self.component_templates = self._load_component_templates()
        self.modeling_parameters = ModelingParameters()
    
    def _load_component_templates(self) -> Dict[ComponentType, any]:
        """Load 3D templates for different component types."""
        templates = {}
        
        # Basic geometric templates for different component types
        templates[ComponentType.GEAR] = self._create_gear_template
        templates[ComponentType.SHAFT] = self._create_shaft_template
        templates[ComponentType.BEARING] = self._create_bearing_template
        templates[ComponentType.HOUSING] = self._create_housing_template
        
        return templates
    
    def generate_3d_model(self, component: ComponentInfo, 
                         parameters: Optional[ModelingParameters] = None) -> Model3D:
        """Generate 3D model from component information."""
        if parameters is None:
            parameters = self.modeling_parameters
        
        # Get appropriate template function
        template_func = self.component_templates.get(component.component_type)
        
        if template_func is None:
            # Create generic box model for unknown components
            mesh = self._create_generic_model(component, parameters)
        else:
            # Use specific template
            mesh = template_func(component, parameters)
        
        return Model3D(mesh, component)
    
    def _create_gear_template(self, component: ComponentInfo, 
                            parameters: ModelingParameters) -> o3d.geometry.TriangleMesh:
        """Create 3D model of a gear."""
        # Extract gear-specific parameters
        tooth_count = component.properties.get("tooth_count", 20)
        diameter = component.properties.get("estimated_diameter", 50.0)
        thickness = component.properties.get("thickness", 10.0)
        
        # Generate gear geometry
        mesh = self._generate_gear_mesh(tooth_count, diameter, thickness)
        
        return mesh
    
    def _generate_gear_mesh(self, tooth_count: int, diameter: float, 
                          thickness: float) -> o3d.geometry.TriangleMesh:
        """Generate gear mesh geometry."""
        # Create basic cylindrical shape for gear
        cylinder = o3d.geometry.TriangleMesh.create_cylinder(
            radius=diameter/2, height=thickness, resolution=tooth_count*2
        )
        
        # Add gear teeth (simplified representation)
        # In production, this would generate proper involute gear teeth
        vertices = np.asarray(cylinder.vertices)
        
        # Modify outer vertices to create tooth profile
        for i, vertex in enumerate(vertices):
            x, y, z = vertex
            radius = np.sqrt(x*x + y*y)
            
            if radius > diameter/2 * 0.8:  # Outer region
                angle = np.arctan2(y, x)
                tooth_angle = 2 * np.pi / tooth_count
                local_angle = (angle % tooth_angle) / tooth_angle
                
                # Simple triangular tooth profile
                if 0.3 < local_angle < 0.7:
                    radius *= 1.1  # Tooth tip
                
                vertices[i] = [radius * np.cos(angle), radius * np.sin(angle), z]
        
        cylinder.vertices = o3d.utility.Vector3dVector(vertices)
        cylinder.compute_vertex_normals()
        
        return cylinder
    
    def _create_shaft_template(self, component: ComponentInfo, 
                             parameters: ModelingParameters) -> o3d.geometry.TriangleMesh:
        """Create 3D model of a shaft."""
        diameter = component.properties.get("diameter", 20.0)
        length = component.properties.get("length", 100.0)
        
        # Create cylindrical shaft
        shaft = o3d.geometry.TriangleMesh.create_cylinder(
            radius=diameter/2, height=length, resolution=20
        )
        
        return shaft
    
    def _create_bearing_template(self, component: ComponentInfo, 
                               parameters: ModelingParameters) -> o3d.geometry.TriangleMesh:
        """Create 3D model of a bearing."""
        inner_diameter = component.properties.get("inner_diameter", 20.0)
        outer_diameter = component.properties.get("outer_diameter", 40.0)
        width = component.properties.get("width", 12.0)
        
        # Create bearing as torus-like shape
        outer_ring = o3d.geometry.TriangleMesh.create_cylinder(
            radius=outer_diameter/2, height=width, resolution=30
        )
        inner_ring = o3d.geometry.TriangleMesh.create_cylinder(
            radius=inner_diameter/2, height=width*1.1, resolution=20
        )
        
        # Subtract inner from outer (simplified boolean operation)
        bearing = outer_ring
        
        return bearing
    
    def _create_housing_template(self, component: ComponentInfo, 
                               parameters: ModelingParameters) -> o3d.geometry.TriangleMesh:
        """Create 3D model of a housing."""
        # Create box-like housing
        x, y, w, h = component.bounding_box
        depth = min(w, h) * 0.8  # Estimate depth
        
        housing = o3d.geometry.TriangleMesh.create_box(
            width=w, height=h, depth=depth
        )
        
        return housing
    
    def _create_generic_model(self, component: ComponentInfo, 
                            parameters: ModelingParameters) -> o3d.geometry.TriangleMesh:
        """Create generic 3D model for unknown components."""
        x, y, w, h = component.bounding_box
        depth = min(w, h) * 0.5
        
        generic_box = o3d.geometry.TriangleMesh.create_box(
            width=w, height=h, depth=depth
        )
        
        return generic_box


class IsometricDrawingGenerator:
    """Generate isometric and orthographic technical drawings."""
    
    def __init__(self):
        self.drawing_settings = DrawingSettings()
    
    def generate_isometric_view(self, model: Model3D, 
                              settings: Optional[DrawingSettings] = None) -> np.ndarray:
        """Generate isometric projection of 3D model."""
        if settings is None:
            settings = self.drawing_settings
        
        # Set up isometric transformation matrix
        iso_matrix = self._get_isometric_matrix()
        
        # Project 3D points to 2D
        vertices = np.asarray(model.mesh.vertices)
        projected_points = self._project_points(vertices, iso_matrix)
        
        # Create drawing canvas
        canvas = self._create_drawing_canvas(projected_points)
        
        # Draw edges
        if hasattr(model.mesh, 'triangles'):
            triangles = np.asarray(model.mesh.triangles)
            self._draw_wireframe(canvas, projected_points, triangles)
        
        return canvas
    
    def generate_orthographic_views(self, model: Model3D) -> Dict[str, np.ndarray]:
        """Generate front, side, and top orthographic views."""
        views = {}
        
        vertices = np.asarray(model.mesh.vertices)
        
        # Front view (XY projection)
        front_points = vertices[:, :2]  # X, Y coordinates
        views['front'] = self._create_orthographic_view(front_points, "Front View")
        
        # Side view (XZ projection)
        side_points = vertices[:, [0, 2]]  # X, Z coordinates
        views['side'] = self._create_orthographic_view(side_points, "Side View")
        
        # Top view (XY projection, rotated)
        top_points = vertices[:, [0, 1]]  # X, Y coordinates
        views['top'] = self._create_orthographic_view(top_points, "Top View")
        
        return views
    
    def generate_exploded_view(self, models: List[Model3D], 
                             explosion_factor: float = 2.0) -> np.ndarray:
        """Generate exploded view of assembly."""
        exploded_positions = []
        
        # Calculate exploded positions for each component
        for i, model in enumerate(models):
            # Simple linear explosion along different axes
            offset = np.array([
                (i % 3 - 1) * explosion_factor * 50,
                ((i // 3) % 3 - 1) * explosion_factor * 50,
                (i // 9) * explosion_factor * 30
            ])
            exploded_positions.append(offset)
        
        # Create combined drawing
        canvas = np.ones((800, 1000, 3), dtype=np.uint8) * 255
        
        for i, (model, offset) in enumerate(zip(models, exploded_positions)):
            # Apply offset to model vertices
            vertices = np.asarray(model.mesh.vertices) + offset
            
            # Project and draw
            iso_matrix = self._get_isometric_matrix()
            projected = self._project_points(vertices, iso_matrix)
            
            # Draw on canvas with different colors for each component
            color = plt.cm.tab10(i % 10)[:3]  # Get color from colormap
            self._draw_component_on_canvas(canvas, projected, color)
        
        return canvas
    
    def _get_isometric_matrix(self) -> np.ndarray:
        """Get isometric projection matrix."""
        # Standard isometric angles
        alpha = np.arctan(np.sqrt(2))  # ~35.26 degrees
        beta = np.pi / 4  # 45 degrees
        
        # Rotation matrices
        Rx = np.array([
            [1, 0, 0],
            [0, np.cos(alpha), -np.sin(alpha)],
            [0, np.sin(alpha), np.cos(alpha)]
        ])
        
        Ry = np.array([
            [np.cos(beta), 0, np.sin(beta)],
            [0, 1, 0],
            [-np.sin(beta), 0, np.cos(beta)]
        ])
        
        return Ry @ Rx
    
    def _project_points(self, points_3d: np.ndarray, 
                       projection_matrix: np.ndarray) -> np.ndarray:
        """Project 3D points to 2D using projection matrix."""
        # Apply projection matrix
        projected = points_3d @ projection_matrix.T
        
        # Take only X and Y coordinates for 2D projection
        return projected[:, :2]
    
    def _create_drawing_canvas(self, points: np.ndarray, 
                             margin: int = 50) -> np.ndarray:
        """Create drawing canvas sized to fit projected points."""
        min_x, min_y = points.min(axis=0)
        max_x, max_y = points.max(axis=0)
        
        width = int(max_x - min_x + 2 * margin)
        height = int(max_y - min_y + 2 * margin)
        
        canvas = np.ones((height, width, 3), dtype=np.uint8) * 255
        return canvas
    
    def _draw_wireframe(self, canvas: np.ndarray, points: np.ndarray, 
                       triangles: np.ndarray):
        """Draw wireframe on canvas."""
        # Convert points to canvas coordinates
        min_x, min_y = points.min(axis=0)
        offset_points = points - np.array([min_x, min_y]) + 50
        
        # Draw triangle edges
        for triangle in triangles:
            for i in range(3):
                p1 = offset_points[triangle[i]].astype(int)
                p2 = offset_points[triangle[(i + 1) % 3]].astype(int)
                
                cv2.line(canvas, tuple(p1), tuple(p2), (0, 0, 0), 1)
    
    def _create_orthographic_view(self, points: np.ndarray, 
                                title: str) -> np.ndarray:
        """Create orthographic view from 2D points."""
        canvas = self._create_drawing_canvas(points)
        
        # Draw points and connections (simplified)
        min_x, min_y = points.min(axis=0)
        offset_points = points - np.array([min_x, min_y]) + 50
        
        for point in offset_points:
            cv2.circle(canvas, tuple(point.astype(int)), 2, (0, 0, 255), -1)
        
        # Add title
        cv2.putText(canvas, title, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 
                   1, (0, 0, 0), 2)
        
        return canvas
    
    def _draw_component_on_canvas(self, canvas: np.ndarray, points: np.ndarray, 
                                color: Tuple[float, float, float]):
        """Draw component on existing canvas."""
        # Convert color to BGR for OpenCV
        bgr_color = tuple((np.array(color) * 255).astype(int)[::-1])
        
        # Draw bounding box or simplified representation
        if len(points) > 0:
            min_pt = points.min(axis=0).astype(int)
            max_pt = points.max(axis=0).astype(int)
            
            # Offset to canvas coordinates
            center_x = canvas.shape[1] // 2
            center_y = canvas.shape[0] // 2
            
            min_pt += [center_x, center_y]
            max_pt += [center_x, center_y]
            
            cv2.rectangle(canvas, tuple(min_pt), tuple(max_pt), bgr_color, 2)


class CADIntegration:
    """Integration with CAD software and parametric modeling."""
    
    def __init__(self):
        self.supported_formats = ['.step', '.iges', '.stl', '.obj', '.ply']
    
    def export_to_cad(self, model: Model3D, file_path: str, format_type: str = 'stl'):
        """Export 3D model to CAD-compatible format."""
        if isinstance(model.mesh, o3d.geometry.TriangleMesh):
            if format_type.lower() == 'stl':
                o3d.io.write_triangle_mesh(file_path, model.mesh)
            elif format_type.lower() == 'ply':
                o3d.io.write_triangle_mesh(file_path, model.mesh)
        elif isinstance(model.mesh, trimesh.Trimesh):
            model.mesh.export(file_path)
    
    def generate_parametric_model(self, component: ComponentInfo) -> Dict[str, any]:
        """Generate parametric model definition."""
        # Create parametric definition based on component type
        parametric_def = {
            'component_type': component.component_type.value,
            'parameters': component.properties.copy(),
            'constraints': self._generate_constraints(component),
            'features': self._generate_features(component)
        }
        
        return parametric_def
    
    def _generate_constraints(self, component: ComponentInfo) -> List[Dict[str, any]]:
        """Generate geometric constraints for parametric model."""
        constraints = []
        
        if component.component_type == ComponentType.GEAR:
            constraints.extend([
                {'type': 'diameter_constraint', 'value': component.properties.get('estimated_diameter', 50)},
                {'type': 'tooth_count', 'value': component.properties.get('tooth_count', 20)},
                {'type': 'pressure_angle', 'value': 20}  # Standard pressure angle
            ])
        
        return constraints
    
    def _generate_features(self, component: ComponentInfo) -> List[Dict[str, any]]:
        """Generate feature list for parametric model."""
        features = []
        
        if component.component_type == ComponentType.GEAR:
            features.extend([
                {'type': 'extrude', 'profile': 'gear_profile', 'depth': 10},
                {'type': 'fillet', 'edges': 'all_edges', 'radius': 0.5}
            ])
        
        return features