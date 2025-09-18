"""
Assembly simulation system for mechanical components.
Handles real-time interaction simulation, motion analysis, and stress distribution.
"""

import numpy as np
from typing import Dict, List, Tuple, Optional, Union
from dataclasses import dataclass, field
from enum import Enum
import time
from scipy.spatial.transform import Rotation

from ..core.component_recognition import ComponentInfo, ComponentType
from ..3d_modeling.modeling_engine import Model3D


class JointType(Enum):
    """Types of mechanical joints."""
    REVOLUTE = "revolute"  # Rotation about single axis
    PRISMATIC = "prismatic"  # Linear motion along axis
    FIXED = "fixed"  # No relative motion
    BALL = "ball"  # Rotation about point
    CYLINDRICAL = "cylindrical"  # Rotation + translation along axis
    GEAR_MESH = "gear_mesh"  # Gear teeth interaction


class MotionType(Enum):
    """Types of motion in mechanical systems."""
    ROTATION = "rotation"
    TRANSLATION = "translation"
    OSCILLATION = "oscillation"
    COMPLEX = "complex"


@dataclass
class Joint:
    """Mechanical joint between components."""
    joint_id: str
    joint_type: JointType
    component_a: str  # Component ID
    component_b: str  # Component ID
    position: np.ndarray  # Joint position in 3D space
    axis: np.ndarray  # Joint axis vector
    limits: Dict[str, float] = field(default_factory=dict)  # Motion limits
    properties: Dict[str, any] = field(default_factory=dict)


@dataclass
class MotionState:
    """Current motion state of a component."""
    position: np.ndarray
    orientation: np.ndarray  # Quaternion
    linear_velocity: np.ndarray
    angular_velocity: np.ndarray
    acceleration: np.ndarray
    timestamp: float


@dataclass
class ForceLoad:
    """Applied force or load on a component."""
    force_vector: np.ndarray  # Force in Newtons
    torque_vector: np.ndarray  # Torque in Newton-meters
    application_point: np.ndarray  # Point of application
    load_type: str = "static"  # static, dynamic, cyclic


class AssemblySimulator:
    """Main assembly simulation engine."""
    
    def __init__(self):
        self.components = {}  # component_id -> Model3D
        self.joints = {}  # joint_id -> Joint
        self.motion_states = {}  # component_id -> MotionState
        self.forces = {}  # component_id -> List[ForceLoad]
        self.simulation_time = 0.0
        self.time_step = 0.01  # seconds
        self.is_running = False
        
        # Material properties database
        self.material_properties = self._initialize_material_database()
    
    def add_component(self, component_id: str, model: Model3D, 
                     initial_position: np.ndarray = None, 
                     initial_orientation: np.ndarray = None):
        """Add a component to the assembly."""
        self.components[component_id] = model
        
        # Initialize motion state
        if initial_position is None:
            initial_position = np.array([0.0, 0.0, 0.0])
        if initial_orientation is None:
            initial_orientation = np.array([1.0, 0.0, 0.0, 0.0])  # Identity quaternion
        
        self.motion_states[component_id] = MotionState(
            position=initial_position,
            orientation=initial_orientation,
            linear_velocity=np.zeros(3),
            angular_velocity=np.zeros(3),
            acceleration=np.zeros(3),
            timestamp=self.simulation_time
        )
        
        self.forces[component_id] = []
    
    def add_joint(self, joint: Joint):
        """Add a joint between components."""
        self.joints[joint.joint_id] = joint
    
    def add_force(self, component_id: str, force: ForceLoad):
        """Apply force to a component."""
        if component_id in self.forces:
            self.forces[component_id].append(force)
    
    def simulate_gear_mesh(self, gear1_id: str, gear2_id: str, 
                          contact_ratio: float = 1.5) -> Dict[str, any]:
        """Simulate gear meshing interaction."""
        if gear1_id not in self.components or gear2_id not in self.components:
            return {"error": "Components not found"}
        
        gear1 = self.components[gear1_id]
        gear2 = self.components[gear2_id]
        
        # Extract gear parameters
        teeth1 = gear1.component_info.properties.get("tooth_count", 20)
        teeth2 = gear2.component_info.properties.get("tooth_count", 30)
        diameter1 = gear1.component_info.properties.get("estimated_diameter", 50)
        diameter2 = gear2.component_info.properties.get("estimated_diameter", 75)
        
        # Calculate gear ratio
        gear_ratio = teeth2 / teeth1
        
        # Simulate meshing forces and contact stresses
        simulation_result = {
            "gear_ratio": gear_ratio,
            "contact_force": self._calculate_gear_contact_force(gear1, gear2),
            "contact_stress": self._calculate_contact_stress(diameter1, diameter2, contact_ratio),
            "power_transmission_efficiency": 0.98,  # Typical gear efficiency
            "angular_velocity_ratio": 1.0 / gear_ratio
        }
        
        return simulation_result
    
    def simulate_motion(self, duration: float, input_motion: Dict[str, any] = None) -> Dict[str, List[MotionState]]:
        """Simulate assembly motion over time."""
        motion_history = {comp_id: [] for comp_id in self.components.keys()}
        
        start_time = self.simulation_time
        end_time = start_time + duration
        
        while self.simulation_time < end_time:
            # Apply input motion if specified
            if input_motion:
                self._apply_input_motion(input_motion)
            
            # Update component states based on joints and forces
            self._update_component_states()
            
            # Store current states
            for comp_id, state in self.motion_states.items():
                motion_history[comp_id].append(MotionState(
                    position=state.position.copy(),
                    orientation=state.orientation.copy(),
                    linear_velocity=state.linear_velocity.copy(),
                    angular_velocity=state.angular_velocity.copy(),
                    acceleration=state.acceleration.copy(),
                    timestamp=self.simulation_time
                ))
            
            self.simulation_time += self.time_step
        
        return motion_history
    
    def calculate_stress_distribution(self, component_id: str, 
                                    applied_loads: List[ForceLoad] = None) -> Dict[str, any]:
        """Calculate stress distribution in a component."""
        if component_id not in self.components:
            return {"error": "Component not found"}
        
        component = self.components[component_id]
        
        if applied_loads is None:
            applied_loads = self.forces.get(component_id, [])
        
        # Get material properties
        material = component.component_info.properties.get("material", "steel")
        material_props = self.material_properties.get(material, self.material_properties["steel"])
        
        # Simplified stress calculation (in production, use FEA)
        stress_analysis = {
            "max_stress": self._calculate_max_stress(component, applied_loads, material_props),
            "safety_factor": self._calculate_safety_factor(component, applied_loads, material_props),
            "stress_concentration_points": self._identify_stress_concentrations(component),
            "fatigue_life_estimate": self._estimate_fatigue_life(component, applied_loads, material_props),
            "material_properties": material_props
        }
        
        return stress_analysis
    
    def simulate_vibration_analysis(self, component_id: str, 
                                  frequency_range: Tuple[float, float] = (0, 1000)) -> Dict[str, any]:
        """Simulate vibration analysis of component."""
        if component_id not in self.components:
            return {"error": "Component not found"}
        
        component = self.components[component_id]
        material = component.component_info.properties.get("material", "steel")
        material_props = self.material_properties.get(material)
        
        # Calculate natural frequencies (simplified)
        natural_frequencies = self._calculate_natural_frequencies(component, material_props)
        
        vibration_analysis = {
            "natural_frequencies": natural_frequencies,
            "resonance_risk": self._assess_resonance_risk(natural_frequencies, frequency_range),
            "damping_ratio": material_props.get("damping_ratio", 0.02),
            "critical_speeds": self._calculate_critical_speeds(component)
        }
        
        return vibration_analysis
    
    def _initialize_material_database(self) -> Dict[str, Dict[str, float]]:
        """Initialize material properties database."""
        return {
            "steel": {
                "density": 7850,  # kg/m³
                "young_modulus": 200e9,  # Pa
                "poisson_ratio": 0.3,
                "yield_strength": 250e6,  # Pa
                "ultimate_strength": 400e6,  # Pa
                "fatigue_strength": 200e6,  # Pa
                "damping_ratio": 0.02
            },
            "aluminum": {
                "density": 2700,
                "young_modulus": 70e9,
                "poisson_ratio": 0.33,
                "yield_strength": 240e6,
                "ultimate_strength": 310e6,
                "fatigue_strength": 120e6,
                "damping_ratio": 0.01
            },
            "cast_iron": {
                "density": 7200,
                "young_modulus": 120e9,
                "poisson_ratio": 0.28,
                "yield_strength": 200e6,
                "ultimate_strength": 350e6,
                "fatigue_strength": 150e6,
                "damping_ratio": 0.05
            },
            "plastic": {
                "density": 1200,
                "young_modulus": 3e9,
                "poisson_ratio": 0.4,
                "yield_strength": 30e6,
                "ultimate_strength": 50e6,
                "fatigue_strength": 15e6,
                "damping_ratio": 0.1
            }
        }
    
    def _calculate_gear_contact_force(self, gear1: Model3D, gear2: Model3D) -> float:
        """Calculate contact force between meshing gears."""
        # Simplified calculation based on torque and pitch radius
        torque = 100.0  # Assume 100 Nm torque
        pitch_radius = gear1.component_info.properties.get("estimated_diameter", 50) / 2
        
        contact_force = torque / pitch_radius
        return contact_force
    
    def _calculate_contact_stress(self, diameter1: float, diameter2: float, 
                                contact_ratio: float) -> float:
        """Calculate Hertzian contact stress between gears."""
        # Simplified Hertz stress calculation
        force = 1000.0  # Assume 1000 N contact force
        effective_radius = (diameter1 * diameter2) / (diameter1 + diameter2) / 4
        
        # Hertz stress formula (simplified)
        contact_stress = np.sqrt(force / (np.pi * effective_radius * contact_ratio))
        
        return contact_stress
    
    def _apply_input_motion(self, input_motion: Dict[str, any]):
        """Apply specified input motion to components."""
        for comp_id, motion in input_motion.items():
            if comp_id in self.motion_states:
                state = self.motion_states[comp_id]
                
                if "angular_velocity" in motion:
                    state.angular_velocity = np.array(motion["angular_velocity"])
                
                if "linear_velocity" in motion:
                    state.linear_velocity = np.array(motion["linear_velocity"])
    
    def _update_component_states(self):
        """Update all component states based on physics simulation."""
        for comp_id, state in self.motion_states.items():
            # Update position based on velocity
            state.position += state.linear_velocity * self.time_step
            
            # Update orientation based on angular velocity
            if np.linalg.norm(state.angular_velocity) > 0:
                rotation = Rotation.from_rotvec(state.angular_velocity * self.time_step)
                current_rotation = Rotation.from_quat(state.orientation)
                new_rotation = rotation * current_rotation
                state.orientation = new_rotation.as_quat()
            
            # Apply constraints from joints
            self._apply_joint_constraints(comp_id)
            
            state.timestamp = self.simulation_time
    
    def _apply_joint_constraints(self, component_id: str):
        """Apply joint constraints to component motion."""
        for joint in self.joints.values():
            if joint.component_a == component_id or joint.component_b == component_id:
                if joint.joint_type == JointType.REVOLUTE:
                    self._apply_revolute_constraint(component_id, joint)
                elif joint.joint_type == JointType.GEAR_MESH:
                    self._apply_gear_mesh_constraint(component_id, joint)
    
    def _apply_revolute_constraint(self, component_id: str, joint: Joint):
        """Apply revolute joint constraint."""
        state = self.motion_states[component_id]
        
        # Constrain motion to rotation about joint axis only
        axis = joint.axis / np.linalg.norm(joint.axis)
        angular_velocity_component = np.dot(state.angular_velocity, axis)
        state.angular_velocity = angular_velocity_component * axis
        
        # Position constraint (keep at joint position)
        state.position = joint.position.copy()
    
    def _apply_gear_mesh_constraint(self, component_id: str, joint: Joint):
        """Apply gear mesh constraint."""
        # For gear mesh, angular velocities are related by gear ratio
        other_component = joint.component_b if joint.component_a == component_id else joint.component_a
        
        if other_component in self.motion_states:
            gear_ratio = joint.properties.get("gear_ratio", 1.0)
            other_state = self.motion_states[other_component]
            current_state = self.motion_states[component_id]
            
            # Apply gear ratio constraint
            if joint.component_a == component_id:
                current_state.angular_velocity = -other_state.angular_velocity / gear_ratio
            else:
                current_state.angular_velocity = -other_state.angular_velocity * gear_ratio
    
    def _calculate_max_stress(self, component: Model3D, loads: List[ForceLoad], 
                            material_props: Dict[str, float]) -> float:
        """Calculate maximum stress in component."""
        if not loads:
            return 0.0
        
        # Simplified stress calculation
        total_force = sum(np.linalg.norm(load.force_vector) for load in loads)
        
        # Estimate cross-sectional area from component dimensions
        volume = component.get_volume()
        area = (volume / 100) if volume > 0 else 1000  # mm² estimate
        
        stress = total_force / area  # Pa
        return stress
    
    def _calculate_safety_factor(self, component: Model3D, loads: List[ForceLoad], 
                               material_props: Dict[str, float]) -> float:
        """Calculate safety factor."""
        max_stress = self._calculate_max_stress(component, loads, material_props)
        yield_strength = material_props.get("yield_strength", 250e6)
        
        if max_stress > 0:
            return yield_strength / max_stress
        return float('inf')
    
    def _identify_stress_concentrations(self, component: Model3D) -> List[Dict[str, any]]:
        """Identify potential stress concentration points."""
        # Simplified identification based on component type
        concentrations = []
        
        if component.component_info.component_type == ComponentType.GEAR:
            concentrations.append({
                "location": "gear_tooth_root",
                "concentration_factor": 1.8,
                "description": "High stress at tooth root due to bending"
            })
        
        return concentrations
    
    def _estimate_fatigue_life(self, component: Model3D, loads: List[ForceLoad], 
                             material_props: Dict[str, float]) -> float:
        """Estimate fatigue life in cycles."""
        fatigue_strength = material_props.get("fatigue_strength", 200e6)
        max_stress = self._calculate_max_stress(component, loads, material_props)
        
        if max_stress < fatigue_strength:
            # Use S-N curve approximation
            stress_ratio = max_stress / fatigue_strength
            fatigue_cycles = 1e6 * (1 / stress_ratio) ** 3  # Simplified S-N relationship
            return fatigue_cycles
        
        return 0.0  # Infinite life region
    
    def _calculate_natural_frequencies(self, component: Model3D, 
                                     material_props: Dict[str, float]) -> List[float]:
        """Calculate natural frequencies of component."""
        # Simplified calculation for beam-like structures
        density = material_props.get("density", 7850)
        young_modulus = material_props.get("young_modulus", 200e9)
        
        # Estimate dimensions
        volume = component.get_volume()
        length = (volume / 1000) ** (1/3) * 10  # Rough length estimate
        
        # First natural frequency approximation
        frequency = (1 / (2 * np.pi)) * np.sqrt(young_modulus / density) / length
        
        # Return first few modes
        return [frequency, frequency * 2.76, frequency * 5.40]
    
    def _assess_resonance_risk(self, natural_frequencies: List[float], 
                             frequency_range: Tuple[float, float]) -> str:
        """Assess risk of resonance in operating frequency range."""
        min_freq, max_freq = frequency_range
        
        for freq in natural_frequencies:
            if min_freq <= freq <= max_freq:
                return "HIGH"
        
        # Check if natural frequency is close to operating range
        for freq in natural_frequencies:
            if abs(freq - min_freq) < 0.1 * min_freq or abs(freq - max_freq) < 0.1 * max_freq:
                return "MEDIUM"
        
        return "LOW"
    
    def _calculate_critical_speeds(self, component: Model3D) -> List[float]:
        """Calculate critical speeds for rotating components."""
        if component.component_info.component_type in [ComponentType.SHAFT, ComponentType.GEAR]:
            natural_frequencies = self._calculate_natural_frequencies(
                component, self.material_properties.get("steel", {})
            )
            # Critical speeds are natural frequencies converted to RPM
            critical_speeds = [freq * 60 for freq in natural_frequencies]  # RPM
            return critical_speeds
        
        return []


class AssemblyAnimator:
    """Create animations of assembly motion and interactions."""
    
    def __init__(self, simulator: AssemblySimulator):
        self.simulator = simulator
        self.animation_data = []
    
    def create_motion_animation(self, motion_history: Dict[str, List[MotionState]], 
                              output_path: str = None) -> List[Dict[str, any]]:
        """Create animation data from motion history."""
        animation_frames = []
        
        # Get time range
        if not motion_history:
            return animation_frames
        
        first_component = next(iter(motion_history.keys()))
        time_points = [state.timestamp for state in motion_history[first_component]]
        
        for i, timestamp in enumerate(time_points):
            frame = {
                "timestamp": timestamp,
                "components": {}
            }
            
            for comp_id, states in motion_history.items():
                if i < len(states):
                    state = states[i]
                    frame["components"][comp_id] = {
                        "position": state.position.tolist(),
                        "orientation": state.orientation.tolist(),
                        "velocity": state.linear_velocity.tolist(),
                        "angular_velocity": state.angular_velocity.tolist()
                    }
            
            animation_frames.append(frame)
        
        self.animation_data = animation_frames
        
        if output_path:
            self._save_animation_data(animation_frames, output_path)
        
        return animation_frames
    
    def _save_animation_data(self, frames: List[Dict[str, any]], output_path: str):
        """Save animation data to file."""
        import json
        
        with open(output_path, 'w') as f:
            json.dump(frames, f, indent=2)