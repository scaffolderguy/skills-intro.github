#!/usr/bin/env python3
"""
🎯 Bellhop AI CLI Tool

Command-line interface for managing the Bellhop AI multi-agent mesh.
"""

import argparse
import json
import sys
import os
import asyncio
from typing import Dict, Any

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from bellhop import BellhopRouter, ClipboardDigest
from bellhop.agent_scanner import AgentScanner


class BellhopCLI:
    """Command-line interface for Bellhop AI"""
    
    def __init__(self):
        self.router = None
        self.config = {}
        
    def load_config(self, config_path: str = "config.json"):
        """Load configuration from file"""
        if os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    self.config = json.load(f)
                print(f"✅ Loaded config from {config_path}")
            except Exception as e:
                print(f"⚠️ Error loading config: {e}")
        else:
            print(f"⚠️ Config file {config_path} not found, using defaults")
    
    def init_router(self):
        """Initialize Bellhop router"""
        if not self.router:
            router_config = self.config.get('bellhop', {}).get('router', {})
            self.router = BellhopRouter(router_config)
            print("🚀 Bellhop router initialized")
    
    def status(self, args):
        """Show mesh status"""
        self.init_router()
        status = self.router.get_mesh_status()
        
        print("\n🏛️ Bellhop AI Mesh Status")
        print("="*30)
        print(f"Active agents: {status['active_agents']}")
        print(f"Active tasks: {status['active_tasks']}")
        print(f"Registered webhooks: {len(status['registered_webhooks'])}")
        
        if status['active_agents'] > 0:
            print(f"\n🤖 Agent Profiles:")
            for name, profile in status['profiles'].items():
                print(f"  • {name:15} | Trust: {profile['trust_score']:.3f} | "
                      f"Avg Resonance: {profile['avg_resonance']:.3f}")
        
        if status['registered_webhooks']:
            print(f"\n🔗 Webhooks: {', '.join(status['registered_webhooks'])}")
        
        print(f"\n📋 Clipboard Stats: {status['clipboard_stats']}")
    
    def delegate(self, args):
        """Delegate a task to an agent"""
        self.init_router()
        
        if not args.task:
            print("❌ Task description required")
            return
        
        print(f"🎯 Delegating task: {args.task}")
        
        if args.agent:
            print(f"🤖 Preferred agent: {args.agent}")
            result = self.router.delegate_task(args.task, args.agent)
        else:
            # Find best agent automatically
            best_agent = self.router.find_best_agent_for_task(args.task)
            print(f"🤖 Best agent found: {best_agent}")
            result = self.router.delegate_task(args.task)
        
        if "error" in result:
            print(f"❌ Error: {result['error']}")
        else:
            print(f"✅ Task {result['task_id']} assigned to {result['agent']}")
            print(f"📊 Status: {result['status']}")
            if args.verbose:
                print(f"📄 Result: {result.get('result', 'No result')}")
    
    def clipboard(self, args):
        """Manage clipboard digest"""
        digest = ClipboardDigest()
        
        if args.action == "digest":
            result = digest.digest_clipboard(auto_log_notion=not args.no_notion)
            print(f"📋 Clipboard digest: {result['status']}")
            if result['status'] == 'new':
                print(f"   📊 Content length: {result['length']} chars")
                print(f"   🔒 Hash: {result['hash'][:12]}...")
            
        elif args.action == "stats":
            stats = digest.get_stats()
            print(f"📊 Clipboard Stats:")
            print(f"   Total items: {stats['total_items']}")
            print(f"   Total characters: {stats['total_characters']}")
            if stats['total_items'] > 0:
                print(f"   Average length: {stats['average_length']}")
                print(f"   Latest: {stats['latest_timestamp']}")
        
        elif args.action == "weekly":
            summary = digest.generate_weekly_digest()
            if summary:
                print("📅 Weekly Digest Generated")
                if args.verbose:
                    print(summary)
            else:
                print("📅 No activity for weekly digest")
    
    def scan(self, args):
        """Agent scanning and evaluation"""
        if not args.agent_name:
            print("❌ Agent name required for scanning")
            return
        
        self.init_router()
        
        if args.agent_name not in self.router.agents:
            print(f"❌ Agent '{args.agent_name}' not found")
            print(f"Available agents: {list(self.router.agents.keys())}")
            return
        
        test_prompt = args.prompt or "Hello, how can you help me?"
        
        print(f"🧬 Scanning agent: {args.agent_name}")
        print(f"🎯 Test prompt: {test_prompt}")
        
        evaluation = self.router.evaluate_agent_for_task(args.agent_name, test_prompt)
        
        if "error" in evaluation:
            print(f"❌ Error: {evaluation['error']}")
        else:
            print(f"\n📊 Agent Evaluation Results:")
            print(f"   Trust Score: {evaluation['task_suitability']:.3f}")
            print(f"   Resonance: {evaluation['resonance_score']:.3f}")
            print(f"   Recommendation: {evaluation['recommendation']}")
            
            if args.verbose:
                print(f"\n🔍 Fingerprint:")
                fingerprint = evaluation['fingerprint']
                for key, value in fingerprint.items():
                    print(f"   {key}: {value}")
    
    async def monitor(self, args):
        """Start ambient monitoring"""
        self.init_router()
        
        interval = args.interval or 300
        print(f"🌊 Starting ambient monitoring (clipboard check every {interval}s)")
        print("🔄 Press Ctrl+C to stop...")
        
        try:
            await self.router.start_ambient_monitoring(clipboard_interval=interval)
        except KeyboardInterrupt:
            print("\n🛑 Monitoring stopped")
    
    def webhook(self, args):
        """Trigger webhook for testing"""
        self.init_router()
        
        if args.action == "list":
            webhooks = list(self.router.webhook_handlers.keys())
            print(f"🔗 Registered webhooks: {webhooks}")
            
        elif args.action == "trigger":
            if not args.name:
                print("❌ Webhook name required")
                return
            
            # Parse data from command line or use default
            data = {}
            if args.data:
                try:
                    data = json.loads(args.data)
                except json.JSONDecodeError:
                    data = {"message": args.data}
            
            print(f"🔥 Triggering webhook: {args.name}")
            result = self.router.trigger_webhook(args.name, data)
            
            print(f"📊 Status: {result['status']}")
            if result['status'] == 'success' and args.verbose:
                print(f"📄 Result: {result.get('result', 'No result')}")
            elif result['status'] == 'failed':
                print(f"❌ Error: {result.get('error', 'Unknown error')}")


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(description="Bellhop AI Multi-Agent Mesh CLI")
    parser.add_argument("--config", default="config.json", help="Config file path")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Status command
    status_parser = subparsers.add_parser("status", help="Show mesh status")
    
    # Delegate command
    delegate_parser = subparsers.add_parser("delegate", help="Delegate task to agent")
    delegate_parser.add_argument("task", help="Task description")
    delegate_parser.add_argument("--agent", help="Preferred agent name")
    
    # Clipboard command
    clipboard_parser = subparsers.add_parser("clipboard", help="Clipboard operations")
    clipboard_parser.add_argument("action", choices=["digest", "stats", "weekly"], 
                                 help="Clipboard action")
    clipboard_parser.add_argument("--no-notion", action="store_true", 
                                 help="Skip Notion logging")
    
    # Scan command
    scan_parser = subparsers.add_parser("scan", help="Scan and evaluate agent")
    scan_parser.add_argument("agent_name", help="Agent name to scan")
    scan_parser.add_argument("--prompt", help="Test prompt for agent")
    
    # Monitor command
    monitor_parser = subparsers.add_parser("monitor", help="Start ambient monitoring")
    monitor_parser.add_argument("--interval", type=int, help="Check interval in seconds")
    
    # Webhook command
    webhook_parser = subparsers.add_parser("webhook", help="Webhook operations")
    webhook_parser.add_argument("action", choices=["list", "trigger"], help="Webhook action")
    webhook_parser.add_argument("--name", help="Webhook name")
    webhook_parser.add_argument("--data", help="JSON data for webhook")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    cli = BellhopCLI()
    cli.load_config(args.config)
    
    # Set global verbose flag
    if args.verbose:
        import logging
        logging.basicConfig(level=logging.DEBUG)
    
    # Execute command
    if args.command == "status":
        cli.status(args)
    elif args.command == "delegate":
        cli.delegate(args)
    elif args.command == "clipboard":
        cli.clipboard(args)
    elif args.command == "scan":
        cli.scan(args)
    elif args.command == "monitor":
        asyncio.run(cli.monitor(args))
    elif args.command == "webhook":
        cli.webhook(args)


if __name__ == "__main__":
    main()