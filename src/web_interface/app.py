"""
Flask web application for Mechanical Engineering AI System.
Provides REST API endpoints and web interface for all system capabilities.
"""

import os
import json
import numpy as np
import cv2
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
from pathlib import Path
from typing import Dict, List, Optional
import base64
import io
from PIL import Image

# Import system components
from ..core.component_recognition import ComponentRecognizer, ComponentType, FunctionCategory
from ..3d_modeling.modeling_engine import ThreeDModeler, IsometricDrawingGenerator, CADIntegration
from ..core.assembly_simulation import AssemblySimulator, Joint, JointType, ForceLoad
from ..ai_models.educational_diagnostic import EducationalSystem, DiagnosticSystem


app = Flask(__name__)
CORS(app)

# Initialize system components
component_recognizer = ComponentRecognizer()
modeler_3d = ThreeDModeler()
drawing_generator = IsometricDrawingGenerator()
cad_integration = CADIntegration()
assembly_simulator = AssemblySimulator()
educational_system = EducationalSystem()
diagnostic_system = DiagnosticSystem()

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def decode_base64_image(base64_string):
    """Decode base64 image string to numpy array."""
    try:
        # Remove data URL prefix if present
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to numpy array
        image_array = np.array(image)
        
        # Convert RGB to BGR for OpenCV
        if len(image_array.shape) == 3:
            image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
        
        return image_array
    except Exception as e:
        raise ValueError(f"Failed to decode base64 image: {str(e)}")


@app.route('/')
def index():
    """Main application page."""
    return render_template('index.html')


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "version": "1.0.0",
        "components": {
            "component_recognition": "active",
            "3d_modeling": "active",
            "assembly_simulation": "active",
            "educational_system": "active",
            "diagnostic_system": "active"
        }
    })


# Component Recognition Endpoints
@app.route('/api/recognize', methods=['POST'])
def recognize_components():
    """Recognize components in uploaded image."""
    try:
        # Handle file upload or base64 data
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                # Read image file
                image_data = file.read()
                nparr = np.frombuffer(image_data, np.uint8)
                image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            else:
                return jsonify({"error": "Invalid file format"}), 400
        elif 'image_data' in request.json:
            # Handle base64 encoded image
            image = decode_base64_image(request.json['image_data'])
        else:
            return jsonify({"error": "No image provided"}), 400
        
        # Recognize components
        components = component_recognizer.detect_components(image)
        
        # Convert to serializable format
        result = []
        for comp in components:
            result.append({
                "component_type": comp.component_type.value,
                "function_category": comp.function_category.value,
                "confidence": comp.confidence,
                "bounding_box": comp.bounding_box,
                "properties": comp.properties,
                "estimated_dimensions": comp.estimated_dimensions
            })
        
        return jsonify({
            "components": result,
            "total_components": len(result)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/classify', methods=['POST'])
def classify_by_function():
    """Classify detected components by function."""
    try:
        data = request.get_json()
        components = data.get('components', [])
        
        # Reconstruct component objects
        component_objects = []
        for comp_data in components:
            # Create ComponentInfo object from data
            from ..core.component_recognition import ComponentInfo
            comp = ComponentInfo(
                component_type=ComponentType(comp_data['component_type']),
                function_category=FunctionCategory(comp_data['function_category']),
                confidence=comp_data['confidence'],
                bounding_box=tuple(comp_data['bounding_box']),
                properties=comp_data['properties']
            )
            component_objects.append(comp)
        
        # Classify by function
        classified = component_recognizer.classify_by_function(component_objects)
        
        # Convert to serializable format
        result = {}
        for category, comp_list in classified.items():
            result[category.value] = [
                {
                    "component_type": comp.component_type.value,
                    "confidence": comp.confidence,
                    "properties": comp.properties
                }
                for comp in comp_list
            ]
        
        return jsonify({"classified_components": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 3D Modeling Endpoints
@app.route('/api/generate_3d_model', methods=['POST'])
def generate_3d_model():
    """Generate 3D model from component information."""
    try:
        data = request.get_json()
        
        # Reconstruct component info
        from ..core.component_recognition import ComponentInfo
        component = ComponentInfo(
            component_type=ComponentType(data['component_type']),
            function_category=FunctionCategory(data['function_category']),
            confidence=data['confidence'],
            bounding_box=tuple(data['bounding_box']),
            properties=data['properties']
        )
        
        # Generate 3D model
        model_3d = modeler_3d.generate_3d_model(component)
        
        # Save model to file
        output_path = os.path.join(OUTPUT_FOLDER, f"model_{data['component_type']}.stl")
        cad_integration.export_to_cad(model_3d, output_path, 'stl')
        
        # Generate parametric definition
        parametric_def = cad_integration.generate_parametric_model(component)
        
        return jsonify({
            "model_generated": True,
            "output_file": output_path,
            "volume": model_3d.get_volume(),
            "surface_area": model_3d.get_surface_area(),
            "parametric_definition": parametric_def
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/generate_isometric', methods=['POST'])
def generate_isometric_drawing():
    """Generate isometric drawing from 3D model."""
    try:
        data = request.get_json()
        
        # Reconstruct component and generate model
        from ..core.component_recognition import ComponentInfo
        component = ComponentInfo(
            component_type=ComponentType(data['component_type']),
            function_category=FunctionCategory(data['function_category']),
            confidence=data['confidence'],
            bounding_box=tuple(data['bounding_box']),
            properties=data['properties']
        )
        
        model_3d = modeler_3d.generate_3d_model(component)
        
        # Generate isometric view
        isometric_drawing = drawing_generator.generate_isometric_view(model_3d)
        
        # Save drawing
        output_path = os.path.join(OUTPUT_FOLDER, f"isometric_{data['component_type']}.png")
        cv2.imwrite(output_path, isometric_drawing)
        
        # Generate orthographic views
        orthographic_views = drawing_generator.generate_orthographic_views(model_3d)
        
        view_paths = {}
        for view_name, view_image in orthographic_views.items():
            view_path = os.path.join(OUTPUT_FOLDER, f"{view_name}_{data['component_type']}.png")
            cv2.imwrite(view_path, view_image)
            view_paths[view_name] = view_path
        
        return jsonify({
            "isometric_drawing": output_path,
            "orthographic_views": view_paths,
            "drawing_generated": True
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Assembly Simulation Endpoints
@app.route('/api/simulate_assembly', methods=['POST'])
def simulate_assembly():
    """Simulate assembly motion and interactions."""
    try:
        data = request.get_json()
        
        # Clear previous simulation
        assembly_simulator.components.clear()
        assembly_simulator.joints.clear()
        assembly_simulator.motion_states.clear()
        assembly_simulator.forces.clear()
        
        # Add components to simulation
        for comp_data in data.get('components', []):
            from ..core.component_recognition import ComponentInfo
            component = ComponentInfo(
                component_type=ComponentType(comp_data['component_type']),
                function_category=FunctionCategory(comp_data['function_category']),
                confidence=comp_data['confidence'],
                bounding_box=tuple(comp_data['bounding_box']),
                properties=comp_data['properties']
            )
            
            # Generate 3D model for simulation
            model_3d = modeler_3d.generate_3d_model(component)
            
            # Add to simulator
            comp_id = f"comp_{comp_data['component_type']}"
            assembly_simulator.add_component(comp_id, model_3d)
        
        # Add joints if specified
        for joint_data in data.get('joints', []):
            joint = Joint(
                joint_id=joint_data['joint_id'],
                joint_type=JointType(joint_data['joint_type']),
                component_a=joint_data['component_a'],
                component_b=joint_data['component_b'],
                position=np.array(joint_data['position']),
                axis=np.array(joint_data['axis']),
                limits=joint_data.get('limits', {}),
                properties=joint_data.get('properties', {})
            )
            assembly_simulator.add_joint(joint)
        
        # Run simulation
        duration = data.get('simulation_duration', 1.0)  # seconds
        input_motion = data.get('input_motion', {})
        
        motion_history = assembly_simulator.simulate_motion(duration, input_motion)
        
        # Convert motion history to serializable format
        serialized_history = {}
        for comp_id, states in motion_history.items():
            serialized_history[comp_id] = [
                {
                    "timestamp": state.timestamp,
                    "position": state.position.tolist(),
                    "orientation": state.orientation.tolist(),
                    "linear_velocity": state.linear_velocity.tolist(),
                    "angular_velocity": state.angular_velocity.tolist()
                }
                for state in states
            ]
        
        return jsonify({
            "simulation_completed": True,
            "motion_history": serialized_history,
            "simulation_time": duration
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/simulate_gear_mesh', methods=['POST'])
def simulate_gear_mesh():
    """Simulate gear meshing interaction."""
    try:
        data = request.get_json()
        gear1_id = data.get('gear1_id')
        gear2_id = data.get('gear2_id')
        contact_ratio = data.get('contact_ratio', 1.5)
        
        result = assembly_simulator.simulate_gear_mesh(gear1_id, gear2_id, contact_ratio)
        
        return jsonify({
            "gear_mesh_simulation": result,
            "simulation_completed": True
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/analyze_stress', methods=['POST'])
def analyze_stress():
    """Analyze stress distribution in component."""
    try:
        data = request.get_json()
        component_id = data.get('component_id')
        
        # Add applied loads if specified
        applied_loads = []
        for load_data in data.get('applied_loads', []):
            load = ForceLoad(
                force_vector=np.array(load_data['force_vector']),
                torque_vector=np.array(load_data['torque_vector']),
                application_point=np.array(load_data['application_point']),
                load_type=load_data.get('load_type', 'static')
            )
            applied_loads.append(load)
        
        # Perform stress analysis
        stress_analysis = assembly_simulator.calculate_stress_distribution(component_id, applied_loads)
        
        # Convert numpy arrays to lists for JSON serialization
        if 'stress_concentration_points' in stress_analysis:
            for point in stress_analysis['stress_concentration_points']:
                if 'concentration_factor' in point and isinstance(point['concentration_factor'], np.ndarray):
                    point['concentration_factor'] = float(point['concentration_factor'])
        
        return jsonify({
            "stress_analysis": stress_analysis,
            "analysis_completed": True
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Educational System Endpoints
@app.route('/api/generate_quiz', methods=['POST'])
def generate_quiz():
    """Generate educational quiz."""
    try:
        data = request.get_json()
        topic_area = data.get('topic_area')
        difficulty = data.get('difficulty')
        num_questions = data.get('num_questions', 10)
        user_id = data.get('user_id')
        
        quiz_questions = educational_system.generate_quiz(topic_area, difficulty, num_questions, user_id)
        
        # Convert to serializable format
        quiz_data = []
        for question in quiz_questions:
            quiz_data.append({
                "question_id": question.question_id,
                "question_type": question.question_type.value,
                "question_text": question.question_text,
                "options": question.options,
                "difficulty_level": question.difficulty_level,
                "topic_area": question.topic_area,
                "points": question.points
            })
        
        return jsonify({
            "quiz": quiz_data,
            "total_questions": len(quiz_data)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/evaluate_quiz', methods=['POST'])
def evaluate_quiz():
    """Evaluate quiz answers."""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        quiz_answers = data.get('answers', {})
        
        results = educational_system.evaluate_quiz(user_id, quiz_answers)
        
        return jsonify({
            "evaluation_results": results,
            "evaluation_completed": True
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/learning_path/<user_id>', methods=['GET'])
def get_learning_path(user_id):
    """Get adaptive learning path for user."""
    try:
        learning_path = educational_system.get_adaptive_learning_path(user_id)
        
        # Get detailed module information
        detailed_path = []
        for module_id in learning_path:
            if module_id in educational_system.learning_modules:
                module = educational_system.learning_modules[module_id]
                detailed_path.append({
                    "module_id": module_id,
                    "title": module["title"],
                    "description": module["description"],
                    "prerequisites": module.get("prerequisites", []),
                    "estimated_duration": module.get("estimated_duration", 60)
                })
        
        return jsonify({
            "learning_path": detailed_path,
            "total_modules": len(detailed_path)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Diagnostic System Endpoints
@app.route('/api/diagnose_component', methods=['POST'])
def diagnose_component():
    """Diagnose component issues."""
    try:
        data = request.get_json()
        
        # Reconstruct component info
        from ..core.component_recognition import ComponentInfo
        component = ComponentInfo(
            component_type=ComponentType(data['component_type']),
            function_category=FunctionCategory(data['function_category']),
            confidence=data['confidence'],
            bounding_box=tuple(data['bounding_box']),
            properties=data['properties']
        )
        
        symptoms = data.get('symptoms', [])
        measurements = data.get('measurements', {})
        
        # Perform diagnosis
        findings = diagnostic_system.diagnose_component(component, symptoms, measurements)
        
        # Convert to serializable format
        diagnosis_results = []
        for finding in findings:
            diagnosis_results.append({
                "finding_id": finding.finding_id,
                "component_id": finding.component_id,
                "level": finding.level.value,
                "title": finding.title,
                "description": finding.description,
                "recommended_action": finding.recommended_action,
                "confidence": finding.confidence,
                "affected_systems": finding.affected_systems
            })
        
        return jsonify({
            "diagnosis_results": diagnosis_results,
            "total_findings": len(diagnosis_results)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/predict_failures', methods=['POST'])
def predict_failures():
    """Predict component failure modes."""
    try:
        data = request.get_json()
        
        # Reconstruct component info
        from ..core.component_recognition import ComponentInfo
        component = ComponentInfo(
            component_type=ComponentType(data['component_type']),
            function_category=FunctionCategory(data['function_category']),
            confidence=data['confidence'],
            bounding_box=tuple(data['bounding_box']),
            properties=data['properties']
        )
        
        operating_conditions = data.get('operating_conditions', {})
        
        # Predict failure modes
        failure_predictions = diagnostic_system.predict_failure_modes(component, operating_conditions)
        
        return jsonify({
            "failure_predictions": failure_predictions,
            "total_predictions": len(failure_predictions)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/maintenance_schedule', methods=['POST'])
def generate_maintenance_schedule():
    """Generate predictive maintenance schedule."""
    try:
        data = request.get_json()
        
        # Reconstruct components
        components = []
        for comp_data in data.get('components', []):
            from ..core.component_recognition import ComponentInfo
            component = ComponentInfo(
                component_type=ComponentType(comp_data['component_type']),
                function_category=FunctionCategory(comp_data['function_category']),
                confidence=comp_data['confidence'],
                bounding_box=tuple(comp_data['bounding_box']),
                properties=comp_data['properties']
            )
            components.append(component)
        
        operating_conditions = data.get('operating_conditions', {})
        
        # Generate maintenance schedule
        maintenance_schedule = diagnostic_system.generate_maintenance_schedule(components, operating_conditions)
        
        return jsonify({
            "maintenance_schedule": maintenance_schedule,
            "schedule_generated": True
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# File serving endpoints
@app.route('/api/download/<filename>')
def download_file(filename):
    """Download generated files."""
    try:
        file_path = os.path.join(OUTPUT_FOLDER, filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/system_info', methods=['GET'])
def get_system_info():
    """Get system information and capabilities."""
    return jsonify({
        "system_name": "Mechanical Engineering AI System",
        "version": "1.0.0",
        "capabilities": {
            "component_recognition": {
                "supported_types": [ct.value for ct in ComponentType],
                "function_categories": [fc.value for fc in FunctionCategory]
            },
            "3d_modeling": {
                "supported_formats": [".stl", ".ply", ".obj"],
                "drawing_types": ["isometric", "orthographic", "exploded"]
            },
            "simulation": {
                "joint_types": [jt.value for jt in JointType],
                "analysis_types": ["stress", "vibration", "motion"]
            },
            "educational": {
                "question_types": ["multiple_choice", "calculation", "assembly_order"],
                "difficulty_levels": ["beginner", "intermediate", "advanced"]
            },
            "diagnostics": {
                "analysis_types": ["visual_inspection", "symptom_analysis", "predictive_maintenance"],
                "supported_measurements": ["temperature", "vibration", "pressure"]
            }
        }
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)