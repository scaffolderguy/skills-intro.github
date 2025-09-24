"""
🧬 Fingerprint + Resonance Scanner (Agent Identity Verifier)

This module evaluates agents based on:
- Fingerprint: Behavioral signature (e.g., system message, response style, tool use)
- Resonance: Emotional and semantic alignment with user intent
"""

import time
from typing import Dict, Any, Optional
import hashlib

# Optional dependency - will be imported when needed
try:
    from sentence_transformers import SentenceTransformer, util
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False
    SentenceTransformer = None
    util = None


class AgentScanner:
    """Scanner for evaluating agent fingerprints and resonance"""
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        if not HAS_SENTENCE_TRANSFORMERS:
            self.model = None
            print("⚠️ sentence-transformers not installed. Resonance calculation will use fallback method.")
        else:
            self.model = SentenceTransformer(model_name)
        self.fingerprint_cache = {}
        
    def generate_fingerprint(self, agent: Any) -> Dict[str, Any]:
        """Generate behavioral signature for an agent"""
        fingerprint = {
            "name": getattr(agent, 'name', 'Unknown'),
            "system_message": getattr(agent, 'system_message', ''),
            "tool_count": len(getattr(agent, 'tools', [])),
            "streaming": getattr(agent, 'model_client_stream', False),
            "timestamp": int(time.time()),
            "agent_type": type(agent).__name__
        }
        
        # Create a hash of the core behavioral attributes
        behavior_string = f"{fingerprint['name']}-{fingerprint['system_message']}-{fingerprint['tool_count']}"
        fingerprint["behavior_hash"] = hashlib.sha256(behavior_string.encode()).hexdigest()[:16]
        
        return fingerprint

    def calculate_resonance(self, agent_response: str, user_intent: str) -> float:
        """Calculate semantic similarity between agent response and user intent"""
        if not agent_response or not user_intent:
            return 0.0
            
        if not self.model:
            # Fallback: simple keyword matching for demo purposes
            response_words = set(agent_response.lower().split())
            intent_words = set(user_intent.lower().split())
            if not intent_words:
                return 0.0
            overlap = len(response_words.intersection(intent_words))
            return min(overlap / len(intent_words), 1.0)
            
        try:
            agent_embedding = self.model.encode(agent_response)
            intent_embedding = self.model.encode(user_intent)
            score = util.cos_sim(agent_embedding, intent_embedding)
            return float(score[0][0])
        except Exception as e:
            print(f"Error calculating resonance: {e}")
            return 0.0

    def trust_score(self, agent: Any, agent_response: str, user_intent: str) -> float:
        """Calculate overall trust score for an agent"""
        fingerprint = self.generate_fingerprint(agent)
        resonance = self.calculate_resonance(agent_response, user_intent)
        
        # Weighted trust calculation
        base_score = resonance * 0.7
        tool_bonus = min(fingerprint["tool_count"] * 0.05, 0.2)  # Cap tool bonus at 0.2
        system_message_bonus = 0.1 if fingerprint["system_message"] else 0.0
        
        trust = base_score + tool_bonus + system_message_bonus
        return round(min(trust, 1.0), 3)  # Cap at 1.0

    def evaluate_agent(self, agent: Any, test_prompt: str = "Hello, how can you help me?") -> Dict[str, Any]:
        """Comprehensive agent evaluation"""
        fingerprint = self.generate_fingerprint(agent)
        
        # If agent has a generate method, test it
        response = ""
        if hasattr(agent, 'generate') or hasattr(agent, 'chat'):
            try:
                if hasattr(agent, 'generate'):
                    response = str(agent.generate(test_prompt))
                elif hasattr(agent, 'chat'):
                    response = str(agent.chat(test_prompt))
            except Exception as e:
                response = f"Error: {e}"
        
        resonance = self.calculate_resonance(response, test_prompt)
        trust = self.trust_score(agent, response, test_prompt)
        
        return {
            "fingerprint": fingerprint,
            "test_response": response,
            "resonance_score": resonance,
            "trust_score": trust,
            "evaluation_timestamp": int(time.time())
        }


# Module-level convenience functions for backward compatibility
_scanner = None

def get_scanner() -> AgentScanner:
    """Get or create global scanner instance"""
    global _scanner
    if _scanner is None:
        _scanner = AgentScanner()
    return _scanner

def generate_fingerprint(agent: Any) -> Dict[str, Any]:
    """Generate behavioral signature for an agent"""
    return get_scanner().generate_fingerprint(agent)

def calculate_resonance(agent_response: str, user_intent: str) -> float:
    """Calculate semantic similarity between agent response and user intent"""
    return get_scanner().calculate_resonance(agent_response, user_intent)

def trust_score(agent: Any, agent_response: str, user_intent: str) -> float:
    """Calculate overall trust score for an agent"""
    return get_scanner().trust_score(agent, agent_response, user_intent)