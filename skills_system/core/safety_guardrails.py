"""
Safety guardrails and escalation protocols for AI health coaching.

This module provides critical safety mechanisms to ensure responsible AI coaching
that respects medical boundaries and escalates appropriately when needed.
"""

from enum import Enum
from dataclasses import dataclass
from typing import List, Dict, Optional, Callable
import re


class EscalationLevel(Enum):
    """Levels of safety escalation."""
    NONE = "none"
    CAUTION = "caution" 
    IMMEDIATE = "immediate"
    EMERGENCY = "emergency"


class SafetyCategory(Enum):
    """Categories of safety concerns."""
    MEDICAL_EMERGENCY = "medical_emergency"
    MENTAL_HEALTH_CRISIS = "mental_health_crisis"
    MEDICATION_CONCERN = "medication_concern"
    SELF_HARM_RISK = "self_harm_risk"
    EATING_DISORDER = "eating_disorder"
    SUBSTANCE_ABUSE = "substance_abuse"


@dataclass
class SafetyRule:
    """Individual safety rule with trigger patterns and responses."""
    name: str
    category: SafetyCategory
    trigger_patterns: List[str]  # Regex patterns or keywords
    escalation_level: EscalationLevel
    response_template: str
    resource_links: List[str]
    requires_professional_help: bool = False


@dataclass
class SafetyResponse:
    """Response generated when safety rule is triggered."""
    rule_triggered: SafetyRule
    user_input: str
    matched_pattern: str
    response_message: str
    escalation_required: bool
    professional_resources: List[str]


class SafetyGuardrails:
    """
    Comprehensive safety system for AI health coaching.
    
    Monitors user inputs and system responses for safety concerns,
    provides appropriate escalation protocols, and maintains boundaries
    around medical advice.
    """
    
    def __init__(self):
        self.safety_rules = self._initialize_safety_rules()
        
    def _initialize_safety_rules(self) -> List[SafetyRule]:
        """Initialize comprehensive safety rules."""
        rules = []
        
        # Medical Emergency Rules
        rules.extend([
            SafetyRule(
                name="chest_pain_emergency",
                category=SafetyCategory.MEDICAL_EMERGENCY,
                trigger_patterns=[
                    r"chest pain", r"heart attack", r"can't breathe",
                    r"severe pain", r"crushing pain", r"call 911"
                ],
                escalation_level=EscalationLevel.EMERGENCY,
                response_template="I'm concerned about your symptoms. Please seek immediate medical attention by calling 911 or going to your nearest emergency room. This is not something I can help with - you need professional medical care right away.",
                resource_links=[
                    "https://www.911.gov",
                    "https://www.heart.org/en/health-topics/consumer-healthcare/what-is-cardiovascular-disease/warning-signs-of-heart-attack"
                ],
                requires_professional_help=True
            ),
            SafetyRule(
                name="breathing_difficulty",
                category=SafetyCategory.MEDICAL_EMERGENCY,
                trigger_patterns=[
                    r"can't breathe", r"trouble breathing", r"shortness of breath",
                    r"wheezing", r"gasping", r"suffocating"
                ],
                escalation_level=EscalationLevel.IMMEDIATE,
                response_template="Breathing difficulties can be serious. If you're having trouble breathing right now, please call 911 or seek immediate medical care. I cannot provide medical advice for breathing problems.",
                resource_links=["https://www.911.gov", "https://www.lung.org/lung-health-diseases"],
                requires_professional_help=True
            )
        ])
        
        # Mental Health Crisis Rules
        rules.extend([
            SafetyRule(
                name="suicidal_ideation",
                category=SafetyCategory.MENTAL_HEALTH_CRISIS,
                trigger_patterns=[
                    r"kill myself", r"suicide", r"end it all", r"not worth living",
                    r"better off dead", r"suicidal", r"harm myself"
                ],
                escalation_level=EscalationLevel.EMERGENCY,
                response_template="I'm very concerned about what you're sharing. Please reach out for immediate support. You can call the 988 Suicide & Crisis Lifeline at 988, or text 'HELLO' to 741741 for the Crisis Text Line. Your life has value and help is available.",
                resource_links=[
                    "https://988lifeline.org",
                    "https://www.crisistextline.org",
                    "https://www.nami.org/help"
                ],
                requires_professional_help=True
            ),
            SafetyRule(
                name="self_harm",
                category=SafetyCategory.SELF_HARM_RISK,
                trigger_patterns=[
                    r"cut myself", r"hurt myself", r"self harm", r"cutting",
                    r"burn myself", r"hit myself"
                ],
                escalation_level=EscalationLevel.IMMEDIATE,
                response_template="I'm worried about your safety. Self-harm is serious and you deserve support. Please consider reaching out to the Crisis Text Line at 741741 or calling 988. You don't have to go through this alone.",
                resource_links=[
                    "https://www.crisistextline.org",
                    "https://988lifeline.org",
                    "https://www.selfinjury.bctr.cornell.edu/perch/resources/distraction-techniques.pdf"
                ],
                requires_professional_help=True
            )
        ])
        
        # Medication Safety Rules
        rules.extend([
            SafetyRule(
                name="medication_changes",
                category=SafetyCategory.MEDICATION_CONCERN,
                trigger_patterns=[
                    r"stop taking", r"quit medication", r"side effects",
                    r"double dose", r"missed doses", r"medication interaction"
                ],
                escalation_level=EscalationLevel.CAUTION,
                response_template="I can't provide advice about medication changes or concerns. Please contact your healthcare provider or pharmacist about any medication questions. They're the best resource for safe medication management.",
                resource_links=[
                    "https://www.fda.gov/drugs/information-consumers-and-patients-drugs",
                    "https://www.poison.org"
                ],
                requires_professional_help=True
            )
        ])
        
        # Eating Disorder Rules
        rules.extend([
            SafetyRule(
                name="eating_disorder_behaviors",
                category=SafetyCategory.EATING_DISORDER,
                trigger_patterns=[
                    r"purging", r"laxatives", r"starving", r"binge eating",
                    r"throwing up", r"vomiting", r"restricting food"
                ],
                escalation_level=EscalationLevel.IMMEDIATE,
                response_template="I'm concerned about the eating behaviors you've described. These can be serious health issues that require specialized support. Please consider reaching out to the National Eating Disorders Association helpline at 1-800-931-2237.",
                resource_links=[
                    "https://www.nationaleatingdisorders.org",
                    "https://www.nedc.com.au/eating-disorders/warning-signs/"
                ],
                requires_professional_help=True
            )
        ])
        
        return rules
    
    def check_safety(self, user_input: str) -> Optional[SafetyResponse]:
        """
        Check user input against all safety rules.
        
        Args:
            user_input: User's message to check
            
        Returns:
            SafetyResponse if rule triggered, None otherwise
        """
        user_input_lower = user_input.lower()
        
        for rule in self.safety_rules:
            for pattern in rule.trigger_patterns:
                if re.search(pattern, user_input_lower):
                    return SafetyResponse(
                        rule_triggered=rule,
                        user_input=user_input,
                        matched_pattern=pattern,
                        response_message=rule.response_template,
                        escalation_required=rule.requires_professional_help,
                        professional_resources=rule.resource_links
                    )
        
        return None
    
    def get_boundary_reminder(self) -> str:
        """Get standard medical boundary reminder."""
        return (
            "🔒 **Safety Reminder**: I'm an AI assistant designed to support healthy habits, "
            "not provide medical advice. For health concerns, medication questions, or "
            "emergencies, please consult with healthcare professionals."
        )
    
    def get_autonomy_preserving_phrases(self) -> List[str]:
        """Get phrases that preserve user autonomy."""
        return [
            "Would you like to try...",
            "You might consider...",
            "One option could be...",
            "When you're ready, you could...",
            "If this feels right for you...",
            "You know yourself best, but...",
            "You're in control of your choices...",
            "What feels manageable for you right now?"
        ]
    
    def get_micro_win_celebrations(self) -> List[str]:
        """Get positive reinforcement phrases for small wins."""
        return [
            "That's one small step forward! 🌟",
            "Nice work taking care of yourself! ✨",
            "That's one decision less today—well done! 👏",
            "Every small action counts! 🙌",
            "You showed up for yourself today! 💪",
            "That's the kind of self-care that builds momentum! 🚀",
            "Small steps, big progress! 🎯",
            "You're building a healthy habit! 🌱"
        ]
    
    def validate_skill_safety(self, skill_name: str, intervention: str) -> Dict[str, bool]:
        """
        Validate that a skill's intervention meets safety standards.
        
        Args:
            skill_name: Name of the skill to validate
            intervention: The intervention text to check
            
        Returns:
            Dict with validation results
        """
        issues = []
        
        # Check for medical advice language
        medical_advice_patterns = [
            r"diagnose", r"cure", r"treat", r"prescribe", r"medical condition",
            r"disease", r"medication", r"dosage"
        ]
        
        intervention_lower = intervention.lower()
        contains_medical_advice = any(
            re.search(pattern, intervention_lower) 
            for pattern in medical_advice_patterns
        )
        
        # Check for autonomy-preserving language
        autonomy_phrases = self.get_autonomy_preserving_phrases()
        preserves_autonomy = any(
            phrase.lower() in intervention_lower 
            for phrase in autonomy_phrases
        )
        
        return {
            "safe_from_medical_advice": not contains_medical_advice,
            "preserves_autonomy": preserves_autonomy,
            "is_micro_intervention": len(intervention.split()) < 50,  # Brief
            "validation_passed": not contains_medical_advice and preserves_autonomy
        }


# Global safety instance for easy import
safety_guardrails = SafetyGuardrails()