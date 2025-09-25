#!/usr/bin/env python3
"""
Command-line interface for the Atomic Habits NOVA Integration.

This CLI tool allows users to interact with the habit-forming knowledge system
through simple commands that implement the five core experiments.

Usage:
    python cli.py daily-three        # Start daily three ritual
    python cli.py starter "task"     # Get 2-minute starter for any task
    python cli.py complete "task"    # Mark task complete and get habit stack suggestion
    python cli.py stats             # View progress and statistics
    python cli.py search "query"    # Enhanced knowledge search
"""

import argparse
import json
import sys
from datetime import datetime
from atomic_habits_integration import AtomicHabitsNOVA, integrate_atomic_habits


class AtomicHabitsCLI:
    """Command-line interface for Atomic Habits NOVA integration."""
    
    def __init__(self, data_file="habit_data.json"):
        self.data_file = data_file
        self.habits = AtomicHabitsNOVA()
        self.enhanced_kb = integrate_atomic_habits()
        self.load_data()
    
    def load_data(self):
        """Load saved habit data from file."""
        try:
            with open(self.data_file, 'r') as f:
                data = json.load(f)
                self.habits.daily_three_tracker = data.get('daily_three_tracker', [])
                self.habits.habit_stacks = data.get('habit_stacks', {})
                self.habits.micro_wins = data.get('micro_wins', [])
        except FileNotFoundError:
            print(f"📝 Creating new habit tracking file: {self.data_file}")
        except Exception as e:
            print(f"⚠️  Error loading data: {e}")
    
    def save_data(self):
        """Save habit data to file."""
        try:
            data = {
                'daily_three_tracker': self.habits.daily_three_tracker,
                'habit_stacks': dict(self.habits.habit_stacks),
                'micro_wins': self.habits.micro_wins,
                'last_updated': datetime.now(timezone.utc).isoformat()
            }
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"⚠️  Error saving data: {e}")
    
    def daily_three(self):
        """Execute the daily three ritual."""
        print("🌅 Daily Three Ritual")
        print("=" * 40)
        
        daily_three = self.habits.daily_three_ritual()
        
        if daily_three.get('status') == 'completed':
            print(f"✅ {daily_three['message']}")
            print(f"🎉 {daily_three['celebration']}")
            return
        
        print(f"\n{daily_three['cue']}")
        print(f"{daily_three['craving']}")
        print("\nInstructions:")
        for instruction in daily_three['instructions']:
            print(f"  • {instruction}")
        
        print(f"\nTemplate:")
        for template in daily_three['response_template']:
            print(f"  {template}")
        
        print("\n" + "-" * 40)
        print("Please enter your three outcomes and 2-minute starters:")
        
        outcomes = []
        starters = []
        
        for i in range(3):
            print(f"\n🎯 Outcome {i+1}:")
            outcome = input("  What do you want to achieve? ").strip()
            if not outcome:
                print("  ⚠️  Please enter an outcome")
                return
            
            starter = input("  2-minute starter (how to begin): ").strip()
            if not starter:
                # Auto-generate starter if not provided
                starter = self.habits.two_minute_starter(outcome)['two_minute_starter']
                print(f"  💡 Auto-generated starter: {starter}")
            
            outcomes.append(outcome)
            starters.append(starter)
        
        # Track completion
        result = self.habits.track_daily_three_completion(outcomes, starters)
        print(f"\n✅ {result['message']}")
        print(f"💪 {result['encouragement']}")
        print(f"👉 {result['next_step']}")
        
        self.save_data()
    
    def two_minute_starter(self, task):
        """Get a 2-minute starter for any task."""
        if not task:
            task = input("What task would you like to break down? ").strip()
            if not task:
                print("⚠️  Please provide a task")
                return
        
        print(f"⚡ Two-Minute Starter for: '{task}'")
        print("=" * 50)
        
        starter = self.habits.two_minute_starter(task)
        
        print(f"🎯 Original task: {starter['original_task']}")
        print(f"⏱️  2-minute starter: {starter['two_minute_starter']}")
        print(f"🧠 Principle: {starter['principle']}")
        print(f"➡️  Next step: {starter['next_step']}")
        print(f"🔬 Why this works: {starter['psychological_trick']}")
        print(f"✅ Success metric: {starter['success_metric']}")
        
        # Ask if they want to start now
        response = input("\n👉 Ready to start this 2-minute task now? (y/n): ").strip().lower()
        if response in ['y', 'yes']:
            print("🚀 Great! Start your timer and begin...")
            print("⏰ Remember: 2 minutes only, then you can stop or continue.")
    
    def complete_task(self, task):
        """Mark a task as complete and get habit stacking suggestion."""
        if not task:
            task = input("What task did you just complete? ").strip()
            if not task:
                print("⚠️  Please specify the completed task")
                return
        
        print(f"🎉 Task Completed: {task}")
        print("=" * 40)
        
        # Get current context
        context = self._get_current_context()
        
        # Get habit stacking suggestion
        stack = self.habits.habit_stack_suggestion(task, context)
        
        print(f"{stack['trigger']}")
        print(f"{stack['stack_action']}")
        print(f"💡 {stack['reward_preview']}")
        print(f"\n🔗 {stack['habit_chain']}")
        
        # Show friction reducers
        friction = stack['friction_reducer']
        if friction.get('suggestions'):
            print(f"\n🛠️  To make it easier:")
            for suggestion in friction['suggestions']:
                print(f"   • {suggestion}")
        
        # Record micro-win
        resistance = self._estimate_resistance_level(task)
        reward = self.habits.resistance_bandit_reward(
            f"Completed: {task}",
            resistance,
            "Task successfully finished"
        )
        
        print(f"\n📊 Resistance reduced: {resistance:.1f} → {reward['resistance_after']:.1f}")
        print(f"📈 Momentum boost: +{reward['momentum_boost']:.1f}")
        
        # Ask about habit stacking
        response = input("\n👉 Want to do the suggested follow-up? (y/n): ").strip().lower()
        if response in ['y', 'yes']:
            print("🚀 Excellent! Building habit momentum...")
            # Record stack acceptance
            stack_entry = self.habits.habit_stacks[task][-1]
            stack_entry['accepted'] = True
        
        self.save_data()
    
    def show_stats(self):
        """Display user progress and statistics."""
        stats = self.habits.get_user_stats()
        
        print("📊 Your Atomic Habits Progress")
        print("=" * 40)
        
        print(f"🔥 Daily Three Streak: {stats['daily_three_streak']} days")
        print(f"🏆 Total Micro-Wins: {stats['total_micro_wins']}")
        print(f"📉 Avg Resistance Reduction: {stats['avg_resistance_reduction']}")
        print(f"🔗 Habit Stacks Created: {stats['habit_stacks_created']}")
        print(f"⚡ Momentum Score: {stats['momentum_score']}/1.0")
        
        if stats['today_completed']:
            print("✅ Daily Three completed today!")
        else:
            print("⏳ Daily Three pending for today")
        
        # Show next milestone
        milestone = stats['next_milestone']
        if milestone['days_to_go'] > 0:
            print(f"\n🎯 Next Milestone: {milestone['milestone']} days")
            print(f"   {milestone['encouragement']}")
            print(f"   Reward: {milestone['reward']}")
        else:
            print(f"\n🏆 {milestone['reward']}")
        
        # Show recent micro-wins
        if self.habits.micro_wins:
            print(f"\n📈 Recent Wins:")
            for win in self.habits.micro_wins[-3:]:
                date = datetime.fromisoformat(win['timestamp'].replace('Z', '+00:00')).strftime("%m/%d")
                print(f"   • {date}: {win['action']} (resistance: -{win['resistance_reduction']:.1f})")
    
    def enhanced_search(self, query):
        """Perform enhanced knowledge search with habit suggestions."""
        if not query:
            query = input("What would you like to search for? ").strip()
            if not query:
                print("⚠️  Please provide a search query")
                return
        
        print(f"🔍 Enhanced Search: '{query}'")
        print("=" * 50)
        
        # Get current context for personalized results
        context = self._get_current_context()
        
        result = self.enhanced_kb.knowledge_base_search(query, user_context=context)
        
        # Show basic search results
        print("📚 Knowledge Results:")
        for i, res in enumerate(result['results'][:3], 1):
            print(f"   {i}. {res['title']} (relevance: {res['relevance']:.1f})")
        
        # Show habit-enhanced results
        if 'habit_suggestion' in result:
            print(f"\n🌅 Daily Ritual Available:")
            print(f"   {result['habit_suggestion']['cue']}")
        
        if 'two_minute_starter' in result:
            print(f"\n⚡ 2-Minute Starter:")
            print(f"   {result['two_minute_starter']['two_minute_starter']}")
        
        if 'habit_stack' in result:
            print(f"\n🔗 Habit Stack Suggestion:")
            print(f"   {result['habit_stack']['stack_action']}")
        
        if 'environment_cue' in result:
            print(f"\n💡 Environment Cue:")
            print(f"   {result['environment_cue']['cue']}")
        
        # Show user stats
        stats = result['user_stats']
        print(f"\n📊 Your Progress: {stats['total_micro_wins']} wins, {stats['daily_three_streak']} day streak")
    
    def _get_current_context(self):
        """Get current context for personalized suggestions."""
        current_hour = datetime.now().hour
        
        context = {}
        
        # Time-based context
        if 6 <= current_hour <= 10:
            context['time_of_day'] = 'morning'
        elif 11 <= current_hour <= 14:
            context['time_of_day'] = 'midday'
        elif 15 <= current_hour <= 18:
            context['time_of_day'] = 'afternoon'
        else:
            context['time_of_day'] = 'evening'
        
        # Simple energy estimation based on time
        if current_hour in [9, 10, 11, 15, 16]:
            context['energy_level'] = 'high'
        elif current_hour in [13, 14, 17, 18]:
            context['energy_level'] = 'medium' 
        else:
            context['energy_level'] = 'low'
        
        context['workspace'] = 'focused'
        
        return context
    
    def _estimate_resistance_level(self, task):
        """Estimate resistance level based on task complexity."""
        task_lower = task.lower()
        
        # Higher resistance tasks
        if any(word in task_lower for word in ['write', 'create', 'plan', 'design']):
            return 0.7
        
        # Medium resistance tasks  
        elif any(word in task_lower for word in ['review', 'organize', 'research']):
            return 0.5
        
        # Lower resistance tasks
        elif any(word in task_lower for word in ['email', 'call', 'read', 'check']):
            return 0.3
        
        # Default medium resistance
        return 0.5


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Atomic Habits NOVA Integration CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python cli.py daily-three              # Start your daily three ritual
  python cli.py starter "write proposal" # Get 2-minute starter
  python cli.py complete "sent emails"   # Mark task complete
  python cli.py stats                    # View your progress
  python cli.py search "productivity"    # Enhanced search
        """
    )
    
    parser.add_argument('command', 
                       choices=['daily-three', 'starter', 'complete', 'stats', 'search'],
                       help='Command to execute')
    
    parser.add_argument('task_or_query', nargs='?', 
                       help='Task description or search query')
    
    if len(sys.argv) == 1:
        parser.print_help()
        return
    
    args = parser.parse_args()
    cli = AtomicHabitsCLI()
    
    try:
        if args.command == 'daily-three':
            cli.daily_three()
        elif args.command == 'starter':
            cli.two_minute_starter(args.task_or_query)
        elif args.command == 'complete':
            cli.complete_task(args.task_or_query)
        elif args.command == 'stats':
            cli.show_stats()
        elif args.command == 'search':
            cli.enhanced_search(args.task_or_query)
    
    except KeyboardInterrupt:
        print("\n\n👋 Keep building those atomic habits!")
    except Exception as e:
        print(f"\n⚠️  Error: {e}")
        print("Please try again or check your input.")


if __name__ == "__main__":
    main()