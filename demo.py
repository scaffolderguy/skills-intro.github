#!/usr/bin/env python3
"""
Demo script for Mechanical Engineering AI System.
Demonstrates core functionality across all system components.
"""

import sys
import os
import numpy as np
from pathlib import Path

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from core.component_recognition import ComponentRecognizer, ComponentType, FunctionCategory, ComponentInfo
from core.assembly_simulation import AssemblySimulator, Joint, JointType, ForceLoad
from ai_models.educational_diagnostic import EducationalSystem, DiagnosticSystem
from modeling.modeling_engine import ThreeDModeler, IsometricDrawingGenerator


def print_separator(title):
    """Print a formatted section separator."""
    print("\n" + "="*60)
    print(f" {title} ".center(60, "="))
    print("="*60)


def demo_component_recognition():
    """Demonstrate component recognition capabilities."""
    print_separator("COMPONENT RECOGNITION DEMO")
    
    # Initialize recognizer
    recognizer = ComponentRecognizer()
    
    # Create a mock image (normally would load from file)
    mock_image = np.zeros((480, 640, 3), dtype=np.uint8)
    
    print("🔍 Analyzing mock mechanical component image...")
    components = recognizer.detect_components(mock_image)
    
    print(f"\n📋 Detection Results:")
    print(f"   Found {len(components)} components")
    
    for i, component in enumerate(components, 1):
        print(f"\n   Component {i}:")
        print(f"   • Type: {component.component_type.value}")
        print(f"   • Function: {component.function_category.value}")
        print(f"   • Confidence: {component.confidence:.2%}")
        print(f"   • Properties: {component.properties}")
    
    # Classify by function
    classified = recognizer.classify_by_function(components)
    print(f"\n📊 Functional Classification:")
    
    for category, comp_list in classified.items():
        print(f"   {category.value}: {len(comp_list)} components")
    
    return components


def demo_3d_modeling(components):
    """Demonstrate 3D modeling capabilities."""
    print_separator("3D MODELING & TECHNICAL DRAWINGS DEMO")
    
    if not components:
        print("⚠️  No components available for 3D modeling")
        return
    
    # Initialize 3D modeler
    modeler = ThreeDModeler()
    drawing_generator = IsometricDrawingGenerator()
    
    component = components[0]  # Use first component
    
    print(f"🎯 Generating 3D model for: {component.component_type.value}")
    
    # Generate 3D model
    model_3d = modeler.generate_3d_model(component)
    
    print(f"✅ 3D Model Generated:")
    print(f"   • Volume: {model_3d.get_volume():.2f} mm³")
    print(f"   • Surface Area: {model_3d.get_surface_area():.2f} mm²")
    
    # Generate technical drawings
    print(f"\n📐 Generating technical drawings...")
    
    isometric_drawing = drawing_generator.generate_isometric_view(model_3d)
    orthographic_views = drawing_generator.generate_orthographic_views(model_3d)
    
    print(f"✅ Technical Drawings Generated:")
    print(f"   • Isometric view: {isometric_drawing.shape}")
    print(f"   • Orthographic views: {len(orthographic_views)}")
    
    for view_name in orthographic_views.keys():
        print(f"     - {view_name.title()} view")
    
    return model_3d


def demo_assembly_simulation(components):
    """Demonstrate assembly simulation capabilities."""
    print_separator("ASSEMBLY SIMULATION DEMO")
    
    # Initialize simulator
    simulator = AssemblySimulator()
    
    print("⚙️  Setting up assembly simulation...")
    
    # Add components to simulation
    for i, component in enumerate(components[:2]):  # Use first 2 components
        comp_id = f"comp_{i+1}"
        
        # Create dummy 3D model for simulation
        from modeling.modeling_engine import ThreeDModeler, Model3D
        modeler = ThreeDModeler()
        model_3d = modeler.generate_3d_model(component)
        
        # Position components
        position = np.array([i * 100.0, 0.0, 0.0])
        simulator.add_component(comp_id, model_3d, position)
        
        print(f"   Added {comp_id}: {component.component_type.value}")
    
    # Add a joint if we have multiple components
    if len(components) >= 2:
        joint = Joint(
            joint_id="joint_1",
            joint_type=JointType.REVOLUTE,
            component_a="comp_1",
            component_b="comp_2",
            position=np.array([50.0, 0.0, 0.0]),
            axis=np.array([0.0, 0.0, 1.0])
        )
        simulator.add_joint(joint)
        print("   Added revolute joint between components")
    
    # Run motion simulation
    print("\n🏃 Running motion simulation...")
    input_motion = {
        "comp_1": {"angular_velocity": [0, 0, 10.0]}  # 10 rad/s rotation
    }
    
    motion_history = simulator.simulate_motion(1.0, input_motion)  # 1 second
    
    print(f"✅ Motion Simulation Complete:")
    print(f"   • Duration: 1.0 seconds")
    print(f"   • Components simulated: {len(motion_history)}")
    
    for comp_id, states in motion_history.items():
        print(f"   • {comp_id}: {len(states)} motion states recorded")
    
    # Stress analysis
    if len(components) > 0:
        print("\n🔧 Running stress analysis...")
        
        applied_loads = [ForceLoad(
            force_vector=np.array([0, 0, -1000]),  # 1000N downward
            torque_vector=np.array([100, 0, 0]),   # 100 Nm torque
            application_point=np.array([0, 0, 0])
        )]
        
        stress_analysis = simulator.calculate_stress_distribution("comp_1", applied_loads)
        
        print(f"✅ Stress Analysis Results:")
        print(f"   • Max Stress: {stress_analysis['max_stress']:.1f} Pa")
        print(f"   • Safety Factor: {stress_analysis['safety_factor']:.2f}")
        print(f"   • Fatigue Life: {stress_analysis['fatigue_life_estimate']:.0f} cycles")


def demo_educational_system():
    """Demonstrate educational system capabilities."""
    print_separator("EDUCATIONAL SYSTEM DEMO")
    
    # Initialize educational system
    edu_system = EducationalSystem()
    
    print("🎓 Generating mechanical engineering quiz...")
    
    # Generate a quiz
    quiz_questions = edu_system.generate_quiz(
        topic_area="power_transmission",
        difficulty="intermediate",
        num_questions=3,
        user_id="demo_user"
    )
    
    print(f"📝 Generated Quiz ({len(quiz_questions)} questions):")
    
    for i, question in enumerate(quiz_questions, 1):
        print(f"\n   Question {i}:")
        print(f"   {question.question_text}")
        
        if question.options:
            for j, option in enumerate(question.options, ord('A')):
                print(f"   {chr(j)}) {option}")
        
        print(f"   [Topic: {question.topic_area}, Difficulty: {question.difficulty_level}]")
    
    # Simulate answering the quiz
    print(f"\n🤔 Simulating quiz answers...")
    mock_answers = {}
    
    for question in quiz_questions:
        if question.options:
            # Pick first option for demo
            mock_answers[question.question_id] = question.options[0]
        else:
            mock_answers[question.question_id] = "Example answer"
    
    # Evaluate quiz
    results = edu_system.evaluate_quiz("demo_user", mock_answers)
    
    print(f"✅ Quiz Evaluation Results:")
    print(f"   • Score: {results['score_percentage']:.1f}%")
    print(f"   • Correct: {results['correct_answers']}/{results['total_questions']}")
    print(f"   • Recommendations: {len(results['recommendations'])}")
    
    for rec in results['recommendations']:
        print(f"     - {rec}")
    
    # Get learning path
    learning_path = edu_system.get_adaptive_learning_path("demo_user")
    print(f"\n📚 Adaptive Learning Path:")
    for i, module in enumerate(learning_path, 1):
        print(f"   {i}. {module}")


def demo_diagnostic_system():
    """Demonstrate diagnostic system capabilities."""
    print_separator("DIAGNOSTIC SYSTEM DEMO")
    
    # Initialize diagnostic system
    diag_system = DiagnosticSystem()
    
    print("🔍 Running component diagnostics...")
    
    # Create a sample component for diagnosis
    sample_component = ComponentInfo(
        component_type=ComponentType.GEAR,
        function_category=FunctionCategory.POWER_TRANSMISSION,
        confidence=0.95,
        bounding_box=(100, 100, 200, 200),
        properties={
            "tooth_count": 24,
            "material": "steel",
            "estimated_diameter": 50.0
        }
    )
    
    # Simulate symptoms and measurements
    symptoms = ["excessive_noise", "vibration"]
    measurements = {
        "temperature": 85.0,  # °C
        "vibration_rms": 15.2  # mm/s
    }
    
    print(f"   Component: {sample_component.component_type.value}")
    print(f"   Symptoms: {', '.join(symptoms)}")
    print(f"   Temperature: {measurements['temperature']}°C")
    print(f"   Vibration: {measurements['vibration_rms']} mm/s RMS")
    
    # Run diagnosis
    findings = diag_system.diagnose_component(sample_component, symptoms, measurements)
    
    print(f"\n🏥 Diagnostic Findings ({len(findings)}):")
    
    for i, finding in enumerate(findings, 1):
        print(f"\n   Finding {i}:")
        print(f"   • Level: {finding.level.value.upper()}")
        print(f"   • Title: {finding.title}")
        print(f"   • Description: {finding.description}")
        print(f"   • Action: {finding.recommended_action}")
        print(f"   • Confidence: {finding.confidence:.1%}")
    
    # Predict failure modes
    operating_conditions = {
        "load_factor": 1.3,
        "rpm": 2500,
        "temperature": 85
    }
    
    failure_predictions = diag_system.predict_failure_modes(sample_component, operating_conditions)
    
    print(f"\n⚠️  Failure Mode Predictions ({len(failure_predictions)}):")
    
    for prediction in failure_predictions:
        print(f"   • Mode: {prediction['failure_mode']}")
        print(f"   • Probability: {prediction['probability']:.1%}")
        print(f"   • Time to Failure: {prediction['time_to_failure_hours']:.0f} hours")
        print(f"   • Prevention: {prediction['prevention']}")
        print()
    
    # Generate maintenance schedule
    maintenance_schedule = diag_system.generate_maintenance_schedule(
        [sample_component], operating_conditions
    )
    
    print(f"🛠️  Maintenance Schedule:")
    
    for timeframe, tasks in maintenance_schedule.items():
        if tasks:
            print(f"   {timeframe.title()}:")
            for task in tasks:
                print(f"   • {task['action']} [{task['urgency']} priority]")


def main():
    """Main demo function."""
    print("\n🚀 MECHANICAL ENGINEERING AI SYSTEM DEMO")
    print("   Advanced AI for Component Recognition, 3D Modeling, and Engineering Education")
    
    try:
        # Component Recognition Demo
        components = demo_component_recognition()
        
        # 3D Modeling Demo
        demo_3d_modeling(components)
        
        # Assembly Simulation Demo
        demo_assembly_simulation(components)
        
        # Educational System Demo
        demo_educational_system()
        
        # Diagnostic System Demo
        demo_diagnostic_system()
        
        print_separator("DEMO COMPLETE")
        print("✅ All system components demonstrated successfully!")
        print("\n🌟 Key Capabilities Showcased:")
        print("   • AI-powered component recognition and classification")
        print("   • Automated 3D model generation and technical drawing creation")
        print("   • Real-time assembly simulation with motion and stress analysis")
        print("   • Interactive educational quizzes with adaptive learning")
        print("   • Intelligent diagnostic system with predictive maintenance")
        
        print("\n🚀 Ready for Production Deployment!")
        print("   Run the web interface with: python -m flask --app src.web_interface.app run")
        
    except ImportError as e:
        print(f"\n❌ Import Error: {e}")
        print("   Install required dependencies with: pip install -r requirements.txt")
    except Exception as e:
        print(f"\n❌ Demo Error: {e}")
        print("   Check system configuration and try again")


if __name__ == "__main__":
    main()