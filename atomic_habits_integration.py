#!/usr/bin/env python3
"""
NOVA Atomic Habits Integration - Transform knowledge work into compound habits
Maps Clear's 4 Laws to NOVA's adaptive intelligence loop

This module implements the core framework for integrating James Clear's Atomic Habits
principles into the NOVA adaptive learning system, creating compound intelligence loops
that improve both system performance and user habit formation.
"""

from collections import defaultdict
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any
import json
import re


class AtomicHabitsNOVA:
    """
    Main class for integrating Atomic Habits principles into NOVA's adaptive loop.
    
    Maps the four laws of behavior change:
    - Cues → "Observe" signals: surface lightweight prompts at session start or after idle
    - Cravings → Lens detection: identify user intent drivers (autonomy, belonging, competence)  
    - Response → 2-minute starter: always propose the smallest next action
    - Reward → Resistance bandit reward: immediate micro-wins reduce resistance
    """
    
    def __init__(self, kb_search=None):
        self.kb = kb_search
        self.daily_three_tracker = []
        self.habit_stacks = defaultdict(list)
        self.micro_wins = []
        self.user_context = {}
        self.session_data = {}
        
    def daily_three_ritual(self, user_context: Dict = None) -> Dict:
        """
        Rule-of-Three ritual: Start each day with 3 micro-outcomes
        
        At first turn each day, ask for the top 3 outcomes and convert them
        to micro-tasks with 2-minute starters.
        
        Args:
            user_context: Optional context about user's current situation
            
        Returns:
            Dictionary with cue, craving, response template, and reward hook
        """
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        # Check if daily three already completed today
        today_completed = any(
            entry.get('date') == current_date 
            for entry in self.daily_three_tracker
        )
        
        if today_completed:
            return {
                "status": "completed",
                "message": "Daily Three already completed for today!",
                "celebration": "🎯 You're building momentum!"
            }
        
        prompt = {
            "cue": "🌅 Daily Three Ritual",
            "craving": "What are your top 3 outcomes for today?",
            "context": user_context or {},
            "response_template": [
                "Outcome 1: ____________ [2-minute starter: ___________]",
                "Outcome 2: ____________ [2-minute starter: ___________]", 
                "Outcome 3: ____________ [2-minute starter: ___________]"
            ],
            "reward_hook": "track_daily_three_completion",
            "instructions": [
                "Think small: Each outcome should be achievable today",
                "Start tiny: Each 2-minute starter should feel almost too easy",
                "Be specific: 'Write email' not 'communicate better'"
            ]
        }
        
        return prompt
    
    def habit_stack_suggestion(self, completed_task: str, context: Dict = None) -> Dict:
        """
        After X, do Y for 2 minutes - build compound habits
        
        After a successful micro-task, suggest a paired follow-up and log
        the pair as a stack for future reinforcement.
        
        Args:
            completed_task: The task that was just completed
            context: Current context and user state
            
        Returns:
            Dictionary with habit stacking suggestion
        """
        context = context or {}
        
        # Analyze context for logical next steps
        next_actions = self._predict_next_action(completed_task, context)
        
        if not next_actions:
            next_actions = ["Take a 2-minute break and celebrate this win"]
        
        # Record the successful completion for future stacking
        stack_entry = {
            "trigger_task": completed_task,
            "suggested_action": next_actions[0],
            "context": context,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "accepted": False  # Will be updated if user accepts
        }
        
        self.habit_stacks[completed_task].append(stack_entry)
        
        suggestion = {
            "trigger": f"✅ Great! You just finished: {completed_task}",
            "stack_action": f"🚀 Now do this for 2 minutes: {next_actions[0]}",
            "friction_reducer": self._suggest_friction_reduction(next_actions[0]),
            "reward_preview": "One step closer to your bigger goal! 🎯",
            "habit_chain": f"When I finish {completed_task}, I will {next_actions[0]} for 2 minutes",
            "acceptance_hook": "record_habit_stack_acceptance"
        }
        
        return suggestion
    
    def two_minute_starter(self, big_task: str) -> Dict:
        """
        Break any task into a 2-minute starter using the 2-minute rule.
        
        The key insight: most tasks can be started in under 2 minutes, and
        starting is often the hardest part. Once you start, momentum takes over.
        
        Args:
            big_task: The larger task to break down
            
        Returns:
            Dictionary with 2-minute starter and additional context
        """
        # Predefined starters for common task types
        starters = {
            "write": "Open document and write one sentence",
            "research": "Find and bookmark one relevant article", 
            "plan": "List 3 bullet points of what needs to happen",
            "code": "Create file and write one function signature",
            "design": "Sketch one rough wireframe on paper",
            "learn": "Read first paragraph of chosen resource",
            "email": "Open email and write subject line",
            "organize": "Pick one small area and sort 5 items",
            "exercise": "Put on workout clothes",
            "read": "Read one page",
            "call": "Look up phone number and dial",
            "clean": "Set timer for 2 minutes and tidy one surface"
        }
        
        # Use fuzzy matching to find best starter
        task_lower = big_task.lower()
        matched_starter = None
        
        for key, starter in starters.items():
            if key in task_lower:
                matched_starter = starter
                break
        
        # Default starter if no match found
        if not matched_starter:
            matched_starter = f"Spend 2 minutes defining what '{big_task}' means to you"
        
        return {
            "original_task": big_task,
            "two_minute_starter": matched_starter,
            "principle": "Start with something so easy you can't say no",
            "next_step": "After 2 minutes, you can stop or keep going - your choice!",
            "psychological_trick": "Lower the activation energy to start",
            "success_metric": "Did you start? That's 100% success!"
        }
    
    def resistance_bandit_reward(self, action: str, resistance_level: float, outcome: str) -> Dict:
        """
        Feed micro-wins back to bandit algorithm to reinforce successful patterns.
        
        Every micro-win reduces resistance and makes similar actions more likely
        in the future, creating a compound effect over time.
        
        Args:
            action: The action that was taken
            resistance_level: User's resistance level before action (0.0-1.0)
            outcome: Description of the outcome
            
        Returns:
            Dictionary with reward signal data
        """
        # Micro-wins reduce resistance by 20% (configurable)
        resistance_reduction = 0.2
        new_resistance = max(0.0, resistance_level - resistance_reduction)
        
        reward_signal = {
            "action": action,
            "resistance_before": resistance_level,
            "resistance_after": new_resistance,
            "resistance_reduction": resistance_reduction,
            "outcome": outcome,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "compound_effect": True,  # This win makes future similar actions easier
            "momentum_boost": resistance_level - new_resistance,
            "success_probability_increase": 0.1  # Each success increases future success probability
        }
        
        self.micro_wins.append(reward_signal)
        
        # Update user's resistance profile for this type of action
        self._update_resistance_profile(action, new_resistance)
        
        return reward_signal
    
    def environment_cue_detection(self, context: Dict) -> Optional[Dict]:
        """
        Surface context-specific obvious next steps based on environment.
        
        If a query happens in a known context (project, page), surface a 
        context-specific "obvious next step" at the top of suggestions.
        
        Args:
            context: Current environment and user context
            
        Returns:
            Dictionary with environmental cue or None if no specific cue detected
        """
        cues = []
        
        # Project-based cues
        if context.get("project"):
            cues.append({
                "type": "project",
                "cue": f"🎯 In {context['project']}: What's the smallest next step?",
                "suggestion": "Break your current project task into a 2-minute action"
            })
            
        # Time-based cues
        current_hour = datetime.now().hour
        if context.get("time_of_day") == "morning" or 6 <= current_hour <= 10:
            cues.append({
                "type": "morning",
                "cue": "🌅 Morning momentum: Start with your easiest win",
                "suggestion": "Pick the simplest item from your daily three"
            })
            
        # Energy-based cues  
        if context.get("energy_level") == "low" or context.get("tired"):
            cues.append({
                "type": "low_energy", 
                "cue": "⚡ Low energy detected: Pick a 2-minute task",
                "suggestion": "Choose something that requires minimal mental effort"
            })
            
        # Context switching cues
        if context.get("just_completed_task"):
            cues.append({
                "type": "momentum",
                "cue": "🚀 Riding momentum: Stack another quick win?",
                "suggestion": "Use your current energy to tackle one more small task"
            })
            
        # Location-based cues
        if context.get("location") == "desk" or context.get("workspace"):
            cues.append({
                "type": "workspace",
                "cue": "💻 At your workspace: Time to focus",
                "suggestion": "What's the one thing that would make this session successful?"
            })
        
        # Return the most relevant cue based on priority
        if cues:
            return cues[0]  # Return first/highest priority cue
            
        return None
    
    def track_daily_three_completion(self, outcomes: List[str], starters: List[str]) -> Dict:
        """
        Track completion of the daily three ritual.
        
        Args:
            outcomes: List of three outcomes user committed to
            starters: List of corresponding 2-minute starters
            
        Returns:
            Dictionary with tracking data and encouragement
        """
        if len(outcomes) != 3 or len(starters) != 3:
            return {
                "error": "Daily Three requires exactly 3 outcomes and 3 starters",
                "status": "incomplete"
            }
        
        entry = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "outcomes": outcomes,
            "starters": starters,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "completed_starters": [],
            "status": "committed"
        }
        
        self.daily_three_tracker.append(entry)
        
        return {
            "status": "success",
            "message": "Daily Three committed! 🎯",
            "encouragement": "Remember: focus on starting, not finishing. Progress compounds!",
            "next_step": "Pick your easiest 2-minute starter and begin right now.",
            "tracking_id": len(self.daily_three_tracker) - 1
        }
    
    def _predict_next_action(self, completed_task: str, context: Dict) -> List[str]:
        """
        Predict logical next actions based on completed task and context.
        
        Args:
            completed_task: The task that was just completed
            context: Current context and state
            
        Returns:
            List of suggested next actions
        """
        task_lower = completed_task.lower()
        suggestions = []
        
        # Task-type based predictions
        if "write" in task_lower or "draft" in task_lower:
            suggestions.extend([
                "Review what you just wrote for 2 minutes",
                "Write one more sentence to build momentum",
                "Save and share your draft with someone"
            ])
        elif "research" in task_lower or "read" in task_lower:
            suggestions.extend([
                "Take 2 minutes to summarize what you learned",
                "Find one more related resource",
                "Apply one insight you just gained"
            ])
        elif "plan" in task_lower or "organize" in task_lower:
            suggestions.extend([
                "Pick the first item from your plan and start it",
                "Review your plan and pick the easiest next step",
                "Share your plan with someone for accountability"
            ])
        elif "email" in task_lower or "message" in task_lower:
            suggestions.extend([
                "Send one follow-up message",
                "Clear 5 more emails from your inbox",
                "Set a reminder for any required responses"
            ])
        
        # Context-based predictions
        if context.get("project"):
            suggestions.append(f"Find the next smallest step for {context['project']}")
            
        if context.get("energy_level") == "high":
            suggestions.append("Tackle your most challenging 2-minute starter while energy is high")
        
        # Default suggestions if nothing specific matches
        if not suggestions:
            suggestions = [
                "Take a 2-minute break and celebrate this win",
                "Pick another item from your daily three",
                "Do something creative for 2 minutes"
            ]
        
        return suggestions[:3]  # Return top 3 suggestions
    
    def _suggest_friction_reduction(self, action: str) -> Dict:
        """
        Suggest ways to reduce friction for the next action.
        
        Args:
            action: The action to reduce friction for
            
        Returns:
            Dictionary with friction reduction suggestions
        """
        action_lower = action.lower()
        suggestions = []
        
        if "write" in action_lower:
            suggestions = [
                "Open your document now",
                "Have your outline ready",
                "Set a 2-minute timer"
            ]
        elif "email" in action_lower:
            suggestions = [
                "Open your email client",
                "Pre-fill the recipient field",
                "Draft the subject line first"
            ]
        elif "research" in action_lower:
            suggestions = [
                "Bookmark useful websites",
                "Open relevant browser tabs",
                "Prepare your note-taking tool"
            ]
        
        return {
            "principle": "Make it as easy as possible to start",
            "suggestions": suggestions or ["Remove any barriers between you and starting"],
            "setup_time": "Spend 30 seconds setting up to save 5 minutes later"
        }
    
    def _update_resistance_profile(self, action: str, new_resistance: float):
        """Update user's resistance profile for different types of actions."""
        if not hasattr(self, 'resistance_profile'):
            self.resistance_profile = defaultdict(list)
        
        self.resistance_profile[action].append({
            "resistance": new_resistance,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
    
    def get_user_stats(self) -> Dict:
        """Get comprehensive stats about user's habit formation progress."""
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        # Calculate streak
        streak = self._calculate_daily_three_streak()
        
        # Get completion rates
        total_micro_wins = len(self.micro_wins)
        avg_resistance_reduction = 0
        if self.micro_wins:
            avg_resistance_reduction = sum(
                win['resistance_reduction'] for win in self.micro_wins
            ) / len(self.micro_wins)
        
        return {
            "daily_three_streak": streak,
            "total_micro_wins": total_micro_wins,
            "avg_resistance_reduction": round(avg_resistance_reduction, 3),
            "habit_stacks_created": sum(len(stacks) for stacks in self.habit_stacks.values()),
            "today_completed": any(
                entry.get('date') == current_date 
                for entry in self.daily_three_tracker
            ),
            "momentum_score": self._calculate_momentum_score(),
            "next_milestone": self._get_next_milestone(streak)
        }
    
    def _calculate_daily_three_streak(self) -> int:
        """Calculate current streak of daily three completions."""
        if not self.daily_three_tracker:
            return 0
        
        # Sort by date descending
        sorted_entries = sorted(
            self.daily_three_tracker,
            key=lambda x: x['date'],
            reverse=True
        )
        
        streak = 0
        current_date = datetime.now().date()
        
        for entry in sorted_entries:
            entry_date = datetime.strptime(entry['date'], "%Y-%m-%d").date()
            expected_date = current_date - timedelta(days=streak)
            
            if entry_date == expected_date:
                streak += 1
            else:
                break
        
        return streak
    
    def _calculate_momentum_score(self) -> float:
        """Calculate user's current momentum score based on recent activity."""
        if not self.micro_wins:
            return 0.0
        
        # Weight recent wins more heavily
        recent_wins = [
            win for win in self.micro_wins 
            if (datetime.now(timezone.utc) - datetime.fromisoformat(win['timestamp'].replace('Z', '+00:00'))).days <= 7
        ]
        
        if not recent_wins:
            return 0.0
        
        # Score based on frequency and resistance reduction
        frequency_score = min(len(recent_wins) / 21, 1.0)  # 3 wins per day for a week = max
        resistance_score = sum(win['resistance_reduction'] for win in recent_wins) / len(recent_wins)
        
        return round((frequency_score + resistance_score) / 2, 3)
    
    def _get_next_milestone(self, current_streak: int) -> Dict:
        """Get information about the next milestone to encourage continued progress."""
        milestones = [1, 3, 7, 14, 21, 30, 66, 100]
        
        for milestone in milestones:
            if current_streak < milestone:
                return {
                    "days_to_go": milestone - current_streak,
                    "milestone": milestone,
                    "reward": self._get_milestone_reward(milestone),
                    "encouragement": f"Only {milestone - current_streak} days until your {milestone}-day milestone!"
                }
        
        return {
            "days_to_go": 0,
            "milestone": "legendary",
            "reward": "You're a habit formation legend! 🏆",
            "encouragement": "You've mastered the art of atomic habits!"
        }
    
    def _get_milestone_reward(self, milestone: int) -> str:
        """Get reward message for reaching a milestone."""
        rewards = {
            1: "First step taken! 🎯",
            3: "Building momentum! 🚀", 
            7: "One week strong! 💪",
            14: "Two weeks of consistency! 🔥",
            21: "Habit formation in progress! 🌱",
            30: "One month of growth! 🌿",
            66: "Habit officially formed! 🌳",
            100: "Habit mastery achieved! 👑"
        }
        return rewards.get(milestone, f"{milestone} days of excellence! ⭐")


def integrate_atomic_habits(kb_search=None):
    """
    Integration function to enhance any knowledge base search with Atomic Habits principles.
    
    This function wraps an existing knowledge base search to add habit-forming
    capabilities and micro-win tracking.
    
    Args:
        kb_search: Existing knowledge base search object to enhance
        
    Returns:
        Enhanced knowledge base search with atomic habits integration
    """
    habits = AtomicHabitsNOVA(kb_search)
    
    # Create a simple mock knowledge base if none provided
    if kb_search is None:
        kb_search = MockKnowledgeBase()
    
    # Add habit-aware search enhancement
    original_search = getattr(kb_search, 'knowledge_base_search', kb_search.search if hasattr(kb_search, 'search') else lambda q, max_results=20: {"results": []})
    
    def habit_enhanced_search(query: str, max_results: int = 20, user_context: Dict = None):
        """Enhanced search that includes habit formation suggestions."""
        result = original_search(query, max_results)
        user_context = user_context or {}
        
        # Add habit-forming suggestions to results
        if "start" in query.lower() or "begin" in query.lower():
            result["habit_suggestion"] = habits.daily_three_ritual(user_context)
            
        if "task" in query.lower() or "do" in query.lower():
            result["two_minute_starter"] = habits.two_minute_starter(query)
            
        if user_context and user_context.get("completed_task"):
            result["habit_stack"] = habits.habit_stack_suggestion(
                user_context["completed_task"], user_context
            )
        
        # Add environmental cues
        environment_cue = habits.environment_cue_detection(user_context)
        if environment_cue:
            result["environment_cue"] = environment_cue
            
        # Add user progress stats
        result["user_stats"] = habits.get_user_stats()
        
        return result
    
    # Enhance the search object
    kb_search.knowledge_base_search = habit_enhanced_search
    kb_search.atomic_habits = habits
    
    return kb_search


class MockKnowledgeBase:
    """Simple mock knowledge base for testing and examples."""
    
    def __init__(self):
        self.search_count = 0
    
    def search(self, query: str, max_results: int = 20) -> Dict:
        """Mock search that returns sample results."""
        self.search_count += 1
        return {
            "query": query,
            "results": [
                {"title": f"Sample result for: {query}", "relevance": 0.9},
                {"title": "Getting started with habits", "relevance": 0.8},
                {"title": "Productivity tips", "relevance": 0.7}
            ],
            "search_count": self.search_count
        }


if __name__ == "__main__":
    # Example usage and basic testing
    print("🧠 Atomic Habits NOVA Integration")
    print("=" * 50)
    
    # Create an enhanced knowledge base
    enhanced_kb = integrate_atomic_habits()
    
    # Test daily three ritual
    print("\n🌅 Daily Three Ritual:")
    daily_three = enhanced_kb.atomic_habits.daily_three_ritual()
    print(f"Cue: {daily_three['cue']}")
    print(f"Question: {daily_three['craving']}")
    
    # Test two-minute starter
    print("\n⚡ Two-Minute Starter:")
    starter = enhanced_kb.atomic_habits.two_minute_starter("Write a comprehensive project proposal")
    print(f"Task: {starter['original_task']}")
    print(f"2-min starter: {starter['two_minute_starter']}")
    print(f"Principle: {starter['principle']}")
    
    # Test habit stacking
    print("\n🔗 Habit Stacking:")
    stack = enhanced_kb.atomic_habits.habit_stack_suggestion("Reviewed project requirements", {"energy_level": "high"})
    print(f"Trigger: {stack['trigger']}")
    print(f"Stack: {stack['stack_action']}")
    
    # Test enhanced search
    print("\n🔍 Enhanced Search:")
    search_result = enhanced_kb.knowledge_base_search("how to start a new project", user_context={"project": "web app"})
    print(f"Found: {len(search_result['results'])} results")
    if "habit_suggestion" in search_result:
        print(f"Habit suggestion: {search_result['habit_suggestion']['cue']}")
    if "environment_cue" in search_result:
        print(f"Environment cue: {search_result['environment_cue']['cue']}")
    
    print("\n✅ Integration ready! Transform your knowledge work into compound habits.")