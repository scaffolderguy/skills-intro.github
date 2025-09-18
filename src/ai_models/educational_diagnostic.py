"""
Educational and diagnostic utilities for mechanical engineering AI system.
Provides interactive quizzes, knowledge assessment, and fault diagnosis capabilities.
"""

import numpy as np
from typing import Dict, List, Tuple, Optional, Union
from dataclasses import dataclass, field
from enum import Enum
import random
import json
from pathlib import Path

from ..core.component_recognition import ComponentInfo, ComponentType, FunctionCategory
from ..3d_modeling.modeling_engine import Model3D


class QuestionType(Enum):
    """Types of educational questions."""
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    IDENTIFICATION = "identification"
    CALCULATION = "calculation"
    ASSEMBLY_ORDER = "assembly_order"
    FAULT_DIAGNOSIS = "fault_diagnosis"


class DiagnosticLevel(Enum):
    """Levels of diagnostic severity."""
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"
    FAILURE = "failure"


@dataclass
class QuizQuestion:
    """Educational quiz question structure."""
    question_id: str
    question_type: QuestionType
    question_text: str
    options: List[str] = field(default_factory=list)
    correct_answer: Union[str, List[str], int] = None
    explanation: str = ""
    difficulty_level: str = "intermediate"  # beginner, intermediate, advanced
    topic_area: str = "general"
    points: int = 1
    image_path: Optional[str] = None
    component_reference: Optional[ComponentInfo] = None


@dataclass
class DiagnosticFinding:
    """Diagnostic finding from component analysis."""
    finding_id: str
    component_id: str
    level: DiagnosticLevel
    title: str
    description: str
    recommended_action: str
    confidence: float
    affected_systems: List[str] = field(default_factory=list)
    estimated_repair_time: Optional[float] = None  # hours
    estimated_cost: Optional[float] = None  # USD


@dataclass
class LearningProgress:
    """Track user learning progress."""
    user_id: str
    completed_quizzes: List[str] = field(default_factory=list)
    correct_answers: Dict[str, int] = field(default_factory=dict)
    total_answers: Dict[str, int] = field(default_factory=dict)
    skill_levels: Dict[str, float] = field(default_factory=dict)  # 0-1 scale
    learning_path: List[str] = field(default_factory=list)
    last_activity: str = ""


class EducationalSystem:
    """Interactive educational system for mechanical engineering concepts."""
    
    def __init__(self):
        self.question_database = {}
        self.user_progress = {}
        self.learning_modules = {}
        self._initialize_question_database()
        self._initialize_learning_modules()
    
    def _initialize_question_database(self):
        """Initialize database with educational questions."""
        
        # Gear-related questions
        self.add_question(QuizQuestion(
            question_id="gear_001",
            question_type=QuestionType.MULTIPLE_CHOICE,
            question_text="What is the primary function of a gear in mechanical systems?",
            options=[
                "To provide sealing",
                "To transmit power and change speed/torque",
                "To absorb vibrations",
                "To store energy"
            ],
            correct_answer="To transmit power and change speed/torque",
            explanation="Gears are used to transmit power between shafts while changing speed and torque relationships according to their gear ratio.",
            topic_area="power_transmission",
            difficulty_level="beginner"
        ))
        
        self.add_question(QuizQuestion(
            question_id="gear_002",
            question_type=QuestionType.CALCULATION,
            question_text="A gear with 20 teeth meshes with a gear having 60 teeth. What is the gear ratio?",
            correct_answer="3:1 or 3.0",
            explanation="Gear ratio = Driven teeth / Driving teeth = 60/20 = 3:1. The output gear rotates 3 times slower but with 3 times more torque.",
            topic_area="power_transmission",
            difficulty_level="intermediate"
        ))
        
        # Bearing-related questions
        self.add_question(QuizQuestion(
            question_id="bearing_001",
            question_type=QuestionType.MULTIPLE_CHOICE,
            question_text="Which type of bearing is best suited for high radial loads?",
            options=[
                "Thrust bearing",
                "Ball bearing", 
                "Roller bearing",
                "Magnetic bearing"
            ],
            correct_answer="Roller bearing",
            explanation="Roller bearings have larger contact area and can handle higher radial loads compared to ball bearings.",
            topic_area="bearings",
            difficulty_level="intermediate"
        ))
        
        # Assembly-related questions
        self.add_question(QuizQuestion(
            question_id="assembly_001",
            question_type=QuestionType.ASSEMBLY_ORDER,
            question_text="Arrange the following steps in correct order for assembling a gear reducer:",
            options=[
                "Install output shaft",
                "Mount housing halves",
                "Insert gears",
                "Add lubricant",
                "Install input shaft"
            ],
            correct_answer=["Install input shaft", "Insert gears", "Install output shaft", "Mount housing halves", "Add lubricant"],
            explanation="Proper assembly sequence ensures proper gear alignment and prevents damage during assembly.",
            topic_area="assembly",
            difficulty_level="advanced"
        ))
        
        # Fault diagnosis questions
        self.add_question(QuizQuestion(
            question_id="diagnosis_001",
            question_type=QuestionType.FAULT_DIAGNOSIS,
            question_text="A gear system produces excessive noise and vibration. What are the most likely causes?",
            options=[
                "Misalignment",
                "Worn gear teeth",
                "Insufficient lubrication",
                "Loose mounting",
                "All of the above"
            ],
            correct_answer="All of the above",
            explanation="All these factors can contribute to noise and vibration in gear systems. Proper diagnosis requires systematic investigation.",
            topic_area="troubleshooting",
            difficulty_level="advanced"
        ))
    
    def _initialize_learning_modules(self):
        """Initialize structured learning modules."""
        self.learning_modules = {
            "fundamentals": {
                "title": "Mechanical Engineering Fundamentals",
                "description": "Basic concepts in mechanical engineering",
                "prerequisites": [],
                "topics": ["materials", "forces", "motion", "energy"],
                "estimated_duration": 40  # minutes
            },
            "power_transmission": {
                "title": "Power Transmission Systems",
                "description": "Gears, belts, chains, and power transmission",
                "prerequisites": ["fundamentals"],
                "topics": ["gears", "gear_ratios", "efficiency", "torque"],
                "estimated_duration": 60
            },
            "bearings_supports": {
                "title": "Bearings and Support Systems",
                "description": "Types of bearings and their applications",
                "prerequisites": ["fundamentals"],
                "topics": ["ball_bearings", "roller_bearings", "lubrication", "mounting"],
                "estimated_duration": 45
            },
            "assembly_design": {
                "title": "Assembly Design and Analysis",
                "description": "Mechanical assembly principles and design",
                "prerequisites": ["power_transmission", "bearings_supports"],
                "topics": ["tolerances", "fits", "assembly_sequence", "maintenance"],
                "estimated_duration": 75
            },
            "troubleshooting": {
                "title": "System Troubleshooting",
                "description": "Diagnostic techniques and fault finding",
                "prerequisites": ["assembly_design"],
                "topics": ["vibration_analysis", "wear_patterns", "failure_modes"],
                "estimated_duration": 90
            }
        }
    
    def add_question(self, question: QuizQuestion):
        """Add question to database."""
        self.question_database[question.question_id] = question
    
    def generate_quiz(self, topic_area: str = None, difficulty: str = None, 
                     num_questions: int = 10, user_id: str = None) -> List[QuizQuestion]:
        """Generate a customized quiz."""
        available_questions = list(self.question_database.values())
        
        # Filter by topic area
        if topic_area:
            available_questions = [q for q in available_questions if q.topic_area == topic_area]
        
        # Filter by difficulty
        if difficulty:
            available_questions = [q for q in available_questions if q.difficulty_level == difficulty]
        
        # Consider user progress for personalization
        if user_id and user_id in self.user_progress:
            progress = self.user_progress[user_id]
            # Prioritize questions from weaker areas
            available_questions = self._prioritize_by_skill_level(available_questions, progress)
        
        # Select random questions
        selected_questions = random.sample(available_questions, min(num_questions, len(available_questions)))
        
        return selected_questions
    
    def evaluate_quiz(self, user_id: str, quiz_answers: Dict[str, any]) -> Dict[str, any]:
        """Evaluate quiz answers and update user progress."""
        results = {
            "total_questions": len(quiz_answers),
            "correct_answers": 0,
            "score_percentage": 0,
            "question_results": {},
            "recommendations": []
        }
        
        for question_id, user_answer in quiz_answers.items():
            if question_id in self.question_database:
                question = self.question_database[question_id]
                is_correct = self._check_answer(question, user_answer)
                
                results["question_results"][question_id] = {
                    "correct": is_correct,
                    "user_answer": user_answer,
                    "correct_answer": question.correct_answer,
                    "explanation": question.explanation
                }
                
                if is_correct:
                    results["correct_answers"] += 1
        
        # Calculate score
        results["score_percentage"] = (results["correct_answers"] / results["total_questions"]) * 100
        
        # Update user progress
        self._update_user_progress(user_id, quiz_answers, results)
        
        # Generate recommendations
        results["recommendations"] = self._generate_learning_recommendations(user_id, results)
        
        return results
    
    def get_adaptive_learning_path(self, user_id: str) -> List[str]:
        """Generate adaptive learning path based on user performance."""
        if user_id not in self.user_progress:
            # Default path for new users
            return ["fundamentals", "power_transmission", "bearings_supports", "assembly_design", "troubleshooting"]
        
        progress = self.user_progress[user_id]
        skill_levels = progress.skill_levels
        
        # Determine next modules based on skill levels and prerequisites
        learning_path = []
        
        for module_id, module in self.learning_modules.items():
            # Check if prerequisites are met
            prerequisites_met = all(
                skill_levels.get(prereq, 0) >= 0.7 
                for prereq in module.get("prerequisites", [])
            )
            
            # Check if module needs improvement
            current_skill = skill_levels.get(module_id, 0)
            
            if prerequisites_met and current_skill < 0.8:
                learning_path.append(module_id)
        
        return learning_path
    
    def _check_answer(self, question: QuizQuestion, user_answer: any) -> bool:
        """Check if user answer is correct."""
        if question.question_type == QuestionType.MULTIPLE_CHOICE:
            return user_answer == question.correct_answer
        elif question.question_type == QuestionType.TRUE_FALSE:
            return user_answer == question.correct_answer
        elif question.question_type == QuestionType.CALCULATION:
            # Allow some tolerance for numerical answers
            try:
                correct_value = float(question.correct_answer.split()[0])
                user_value = float(user_answer)
                return abs(user_value - correct_value) / correct_value < 0.05  # 5% tolerance
            except:
                return str(user_answer).lower() in str(question.correct_answer).lower()
        elif question.question_type == QuestionType.ASSEMBLY_ORDER:
            return list(user_answer) == list(question.correct_answer)
        else:
            return str(user_answer).lower() in str(question.correct_answer).lower()
    
    def _update_user_progress(self, user_id: str, quiz_answers: Dict[str, any], results: Dict[str, any]):
        """Update user learning progress."""
        if user_id not in self.user_progress:
            self.user_progress[user_id] = LearningProgress(user_id=user_id)
        
        progress = self.user_progress[user_id]
        
        # Update answer statistics by topic
        for question_id in quiz_answers.keys():
            if question_id in self.question_database:
                question = self.question_database[question_id]
                topic = question.topic_area
                
                if topic not in progress.correct_answers:
                    progress.correct_answers[topic] = 0
                    progress.total_answers[topic] = 0
                
                progress.total_answers[topic] += 1
                if results["question_results"][question_id]["correct"]:
                    progress.correct_answers[topic] += 1
                
                # Update skill level (weighted average)
                accuracy = progress.correct_answers[topic] / progress.total_answers[topic]
                progress.skill_levels[topic] = accuracy
    
    def _prioritize_by_skill_level(self, questions: List[QuizQuestion], 
                                 progress: LearningProgress) -> List[QuizQuestion]:
        """Prioritize questions based on user skill levels."""
        # Sort questions by skill level in topic (ascending - weakest areas first)
        def priority_score(question):
            return progress.skill_levels.get(question.topic_area, 0.5)
        
        return sorted(questions, key=priority_score)
    
    def _generate_learning_recommendations(self, user_id: str, quiz_results: Dict[str, any]) -> List[str]:
        """Generate personalized learning recommendations."""
        recommendations = []
        
        if quiz_results["score_percentage"] < 60:
            recommendations.append("Review fundamental concepts before advancing")
        elif quiz_results["score_percentage"] < 80:
            recommendations.append("Practice more problems in weaker areas")
        else:
            recommendations.append("Excellent work! Ready for advanced topics")
        
        # Analyze weak areas
        weak_topics = []
        topic_performance = {}
        
        for question_id, result in quiz_results["question_results"].items():
            if question_id in self.question_database:
                topic = self.question_database[question_id].topic_area
                if topic not in topic_performance:
                    topic_performance[topic] = {"correct": 0, "total": 0}
                
                topic_performance[topic]["total"] += 1
                if result["correct"]:
                    topic_performance[topic]["correct"] += 1
        
        for topic, performance in topic_performance.items():
            accuracy = performance["correct"] / performance["total"]
            if accuracy < 0.7:
                weak_topics.append(topic)
        
        if weak_topics:
            recommendations.append(f"Focus on improving: {', '.join(weak_topics)}")
        
        return recommendations


class DiagnosticSystem:
    """Diagnostic system for mechanical component fault detection."""
    
    def __init__(self):
        self.diagnostic_rules = {}
        self.fault_patterns = {}
        self._initialize_diagnostic_rules()
        self._initialize_fault_patterns()
    
    def _initialize_diagnostic_rules(self):
        """Initialize diagnostic rules database."""
        self.diagnostic_rules = {
            "excessive_noise": {
                "symptoms": ["high_noise_level", "irregular_sound"],
                "possible_causes": ["misalignment", "worn_bearings", "loose_parts", "insufficient_lubrication"],
                "diagnosis_steps": [
                    "Check alignment",
                    "Inspect bearing condition", 
                    "Verify fastener tightness",
                    "Check lubrication levels"
                ]
            },
            "vibration": {
                "symptoms": ["excessive_vibration", "irregular_motion"],
                "possible_causes": ["unbalance", "misalignment", "resonance", "worn_components"],
                "diagnosis_steps": [
                    "Perform vibration analysis",
                    "Check balance",
                    "Verify alignment",
                    "Inspect for wear"
                ]
            },
            "overheating": {
                "symptoms": ["high_temperature", "thermal_expansion"],
                "possible_causes": ["insufficient_cooling", "excessive_load", "friction", "blocked_ventilation"],
                "diagnosis_steps": [
                    "Check cooling system",
                    "Verify load conditions",
                    "Inspect for friction sources",
                    "Clear ventilation"
                ]
            }
        }
    
    def _initialize_fault_patterns(self):
        """Initialize fault pattern recognition database."""
        self.fault_patterns = {
            ComponentType.GEAR: {
                "tooth_wear": {
                    "visual_indicators": ["worn_tooth_profile", "pitting", "scoring"],
                    "operational_symptoms": ["noise", "vibration", "power_loss"],
                    "severity": DiagnosticLevel.WARNING
                },
                "tooth_breakage": {
                    "visual_indicators": ["broken_teeth", "chipped_edges"],
                    "operational_symptoms": ["severe_noise", "irregular_motion"],
                    "severity": DiagnosticLevel.CRITICAL
                }
            },
            ComponentType.BEARING: {
                "race_wear": {
                    "visual_indicators": ["worn_tracks", "discoloration"],
                    "operational_symptoms": ["noise", "play", "heat"],
                    "severity": DiagnosticLevel.WARNING
                },
                "ball_defect": {
                    "visual_indicators": ["pitted_balls", "cracked_balls"],
                    "operational_symptoms": ["clicking", "rough_operation"],
                    "severity": DiagnosticLevel.CRITICAL
                }
            }
        }
    
    def diagnose_component(self, component: ComponentInfo, 
                          symptoms: List[str] = None,
                          measurements: Dict[str, float] = None) -> List[DiagnosticFinding]:
        """Diagnose component based on symptoms and measurements."""
        findings = []
        
        # Visual inspection-based diagnosis
        visual_findings = self._visual_inspection_diagnosis(component)
        findings.extend(visual_findings)
        
        # Symptom-based diagnosis
        if symptoms:
            symptom_findings = self._symptom_based_diagnosis(component, symptoms)
            findings.extend(symptom_findings)
        
        # Measurement-based diagnosis
        if measurements:
            measurement_findings = self._measurement_based_diagnosis(component, measurements)
            findings.extend(measurement_findings)
        
        return findings
    
    def diagnose_system(self, components: List[ComponentInfo], 
                       system_symptoms: List[str]) -> List[DiagnosticFinding]:
        """Diagnose entire mechanical system."""
        system_findings = []
        
        # System-level analysis
        for symptom in system_symptoms:
            if symptom in self.diagnostic_rules:
                rule = self.diagnostic_rules[symptom]
                
                finding = DiagnosticFinding(
                    finding_id=f"system_{symptom}",
                    component_id="system",
                    level=DiagnosticLevel.WARNING,
                    title=f"System {symptom.replace('_', ' ').title()}",
                    description=f"System exhibits {symptom.replace('_', ' ')}",
                    recommended_action=f"Follow diagnosis steps: {'; '.join(rule['diagnosis_steps'])}",
                    confidence=0.8,
                    affected_systems=[comp.component_type.value for comp in components]
                )
                
                system_findings.append(finding)
        
        return system_findings
    
    def predict_failure_modes(self, component: ComponentInfo, 
                            operating_conditions: Dict[str, any]) -> List[Dict[str, any]]:
        """Predict potential failure modes based on operating conditions."""
        failure_predictions = []
        
        component_type = component.component_type
        
        if component_type == ComponentType.GEAR:
            # Gear-specific failure predictions
            load_factor = operating_conditions.get("load_factor", 1.0)
            speed = operating_conditions.get("rpm", 1000)
            
            if load_factor > 1.5:
                failure_predictions.append({
                    "failure_mode": "tooth_breakage",
                    "probability": 0.7,
                    "time_to_failure_hours": 1000 / load_factor,
                    "prevention": "Reduce load or upgrade gear"
                })
            
            if speed > 3000:
                failure_predictions.append({
                    "failure_mode": "wear_acceleration",
                    "probability": 0.5,
                    "time_to_failure_hours": 5000 / (speed / 1000),
                    "prevention": "Improve lubrication, reduce speed"
                })
        
        elif component_type == ComponentType.BEARING:
            # Bearing-specific failure predictions
            temperature = operating_conditions.get("temperature", 60)  # Celsius
            contamination = operating_conditions.get("contamination_level", "low")
            
            if temperature > 80:
                failure_predictions.append({
                    "failure_mode": "thermal_degradation",
                    "probability": 0.8,
                    "time_to_failure_hours": 2000 / (temperature / 60),
                    "prevention": "Improve cooling, check lubrication"
                })
            
            if contamination == "high":
                failure_predictions.append({
                    "failure_mode": "contamination_wear",
                    "probability": 0.6,
                    "time_to_failure_hours": 3000,
                    "prevention": "Improve sealing, clean environment"
                })
        
        return failure_predictions
    
    def generate_maintenance_schedule(self, components: List[ComponentInfo],
                                    operating_conditions: Dict[str, any]) -> Dict[str, List[Dict[str, any]]]:
        """Generate predictive maintenance schedule."""
        maintenance_schedule = {
            "immediate": [],
            "weekly": [],
            "monthly": [],
            "quarterly": [],
            "annual": []
        }
        
        for component in components:
            # Get failure predictions
            failure_modes = self.predict_failure_modes(component, operating_conditions)
            
            for failure_mode in failure_modes:
                ttf_hours = failure_mode.get("time_to_failure_hours", 8760)  # Default 1 year
                
                # Schedule maintenance based on time to failure
                if ttf_hours < 168:  # Less than 1 week
                    maintenance_schedule["immediate"].append({
                        "component": component.component_type.value,
                        "action": failure_mode["prevention"],
                        "urgency": "critical"
                    })
                elif ttf_hours < 720:  # Less than 1 month
                    maintenance_schedule["weekly"].append({
                        "component": component.component_type.value,
                        "action": failure_mode["prevention"],
                        "urgency": "high"
                    })
                elif ttf_hours < 2160:  # Less than 3 months
                    maintenance_schedule["monthly"].append({
                        "component": component.component_type.value,
                        "action": failure_mode["prevention"],
                        "urgency": "medium"
                    })
                else:
                    maintenance_schedule["quarterly"].append({
                        "component": component.component_type.value,
                        "action": failure_mode["prevention"],
                        "urgency": "low"
                    })
        
        return maintenance_schedule
    
    def _visual_inspection_diagnosis(self, component: ComponentInfo) -> List[DiagnosticFinding]:
        """Perform visual inspection diagnosis."""
        findings = []
        
        component_type = component.component_type
        
        if component_type in self.fault_patterns:
            patterns = self.fault_patterns[component_type]
            
            # Simulate visual inspection findings
            for fault_type, pattern in patterns.items():
                # Simulate detection probability
                if random.random() < 0.3:  # 30% chance of detecting each fault type
                    finding = DiagnosticFinding(
                        finding_id=f"visual_{component_type.value}_{fault_type}",
                        component_id="component_001",  # Would be actual component ID
                        level=pattern["severity"],
                        title=f"{fault_type.replace('_', ' ').title()} Detected",
                        description=f"Visual indicators: {', '.join(pattern['visual_indicators'])}",
                        recommended_action="Schedule immediate inspection and repair",
                        confidence=0.85
                    )
                    findings.append(finding)
        
        return findings
    
    def _symptom_based_diagnosis(self, component: ComponentInfo, 
                               symptoms: List[str]) -> List[DiagnosticFinding]:
        """Diagnose based on operational symptoms."""
        findings = []
        
        for symptom in symptoms:
            if symptom in self.diagnostic_rules:
                rule = self.diagnostic_rules[symptom]
                
                finding = DiagnosticFinding(
                    finding_id=f"symptom_{symptom}",
                    component_id="component_001",
                    level=DiagnosticLevel.WARNING,
                    title=f"{symptom.replace('_', ' ').title()} Analysis",
                    description=f"Component exhibits {symptom.replace('_', ' ')}",
                    recommended_action=f"Investigate: {', '.join(rule['possible_causes'])}",
                    confidence=0.7
                )
                
                findings.append(finding)
        
        return findings
    
    def _measurement_based_diagnosis(self, component: ComponentInfo,
                                   measurements: Dict[str, float]) -> List[DiagnosticFinding]:
        """Diagnose based on quantitative measurements."""
        findings = []
        
        # Temperature analysis
        if "temperature" in measurements:
            temp = measurements["temperature"]
            if temp > 80:  # Celsius
                finding = DiagnosticFinding(
                    finding_id="high_temperature",
                    component_id="component_001",
                    level=DiagnosticLevel.CRITICAL if temp > 100 else DiagnosticLevel.WARNING,
                    title="Excessive Temperature",
                    description=f"Component temperature {temp}°C exceeds safe operating range",
                    recommended_action="Check cooling system and reduce load",
                    confidence=0.95
                )
                findings.append(finding)
        
        # Vibration analysis
        if "vibration_rms" in measurements:
            vibration = measurements["vibration_rms"]
            if vibration > 10:  # mm/s RMS
                finding = DiagnosticFinding(
                    finding_id="excessive_vibration",
                    component_id="component_001",
                    level=DiagnosticLevel.CRITICAL if vibration > 25 else DiagnosticLevel.WARNING,
                    title="Excessive Vibration",
                    description=f"Vibration level {vibration} mm/s RMS indicates potential issues",
                    recommended_action="Check alignment, balance, and bearing condition",
                    confidence=0.9
                )
                findings.append(finding)
        
        return findings