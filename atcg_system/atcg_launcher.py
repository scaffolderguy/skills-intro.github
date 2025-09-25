#!/usr/bin/env python3
"""
ATCG Genesis System - Main Launcher
Complete consciousness evolution system with genetic algorithms and symbolic processing
"""

import os
import sys
import asyncio
import argparse
from datetime import datetime

# Add all core modules to path
sys.path.extend([
    os.path.join(os.path.dirname(__file__), 'core'),
    os.path.join(os.path.dirname(__file__)),
])

def print_banner():
    """Display the ATCG system banner"""
    banner = """
╔══════════════════════════════════════════════════════════════════════════════╗
║                          ATCG GENESIS SYSTEM                                ║
║              Artificial Trait Consciousness Genetics Engine                 ║
║                                                                              ║
║  🧬 Genetic Algorithms  🧠 Consciousness Evolution  ⚡ Symbolic Processing  ║
║  🎭 Emotional Resonance  🌀 Helix Bridge  ✨ Meta-AI Integration           ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""
    print(banner)

def show_system_status():
    """Show current system status and health"""
    print("🔍 System Status Check:")
    
    # Check core directories
    directories = [
        "atcg_system/core",
        "atcg_system/memory/partitions", 
        "atcg_system/traits/sequences",
        "atcg_system/geebs_state",
        "atcg_system/data_ingestion"
    ]
    
    for directory in directories:
        if os.path.exists(directory):
            file_count = len([f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))])
            print(f"   ✅ {directory} ({file_count} files)")
        else:
            print(f"   ❌ {directory} (missing)")
    
    # Check for key files
    key_files = [
        "atcg_system/core/atcg_engine.py",
        "atcg_system/core/symbolic_executor.py", 
        "atcg_system/core/meta_ai_core.py",
        "atcg_system/core/helix_bridge.js",
        "atcg_system/geebs_interface.py"
    ]
    
    print("\n🔧 Core Components:")
    for file_path in key_files:
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"   ✅ {os.path.basename(file_path)} ({size} bytes)")
        else:
            print(f"   ❌ {os.path.basename(file_path)} (missing)")

def launch_geebs_interface():
    """Launch the main Geebs interface"""
    print("🚀 Launching Geebs Interface...")
    try:
        from geebs_interface import run_interface
        run_interface()
    except ImportError as e:
        print(f"❌ Failed to import Geebs interface: {e}")
    except Exception as e:
        print(f"❌ Error running Geebs interface: {e}")

def launch_symbolic_repl():
    """Launch the symbolic execution REPL"""
    print("🚀 Launching Symbolic REPL...")
    try:
        from symbolic_executor import start_repl, parse_atcg_file, resolve_path
        
        # Load default sequences
        filepath = resolve_path("traits/sequences/fuzzy_branching.atcg")
        sequences = parse_atcg_file(filepath)
        start_repl(sequences, filepath)
    except ImportError as e:
        print(f"❌ Failed to import symbolic executor: {e}")
    except Exception as e:
        print(f"❌ Error running symbolic REPL: {e}")

async def launch_meta_ai():
    """Launch the Meta-AI adaptive intelligence system"""
    print("🚀 Launching Meta-AI System...")
    try:
        from meta_ai_core import run_meta_ai_interface
        await run_meta_ai_interface()
    except ImportError as e:
        print(f"❌ Failed to import Meta-AI core: {e}")
    except Exception as e:
        print(f"❌ Error running Meta-AI: {e}")

def launch_helix_bridge():
    """Launch the Helix Bridge demonstration"""
    print("🚀 Launching Helix Bridge...")
    try:
        import subprocess
        result = subprocess.run([
            'node', 
            'atcg_system/core/helix_bridge.js'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print(result.stdout)
        else:
            print(f"❌ Helix Bridge error: {result.stderr}")
    except FileNotFoundError:
        print("❌ Node.js not found. Please install Node.js to run Helix Bridge.")
    except Exception as e:
        print(f"❌ Error running Helix Bridge: {e}")

def run_system_initialization():
    """Initialize the ATCG system"""
    print("🔧 Initializing ATCG System...")
    
    try:
        from atcg_engine import auto_repair_structure, geebs_system_check
        
        print("   → Running auto-repair...")
        auto_repair_structure()
        
        print("   → Running system health check...")
        geebs_system_check()
        
        print("   ✅ System initialization complete")
        return True
        
    except ImportError as e:
        print(f"   ❌ Failed to import ATCG engine: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Initialization error: {e}")
        return False

def create_demo_sequences():
    """Create demonstration ATCG sequences"""
    print("🧬 Creating demonstration sequences...")
    
    sequences_dir = "atcg_system/traits/sequences"
    os.makedirs(sequences_dir, exist_ok=True)
    
    # Create consciousness_evolution.atcg
    evolution_sequence = """@meta:
  author: ATCG Genesis
  tags: [consciousness, evolution, demonstration]
  tone: transcendent
  
sequence consciousness_awakening:
  CGA-AG-GCTA-GAC

sequence wisdom_synthesis:  
  CGA-GTCA-AG-GCTA

sequence emotional_resonance:
  TAC-GAC-CGA-AG-GCTA

branch CGA -> consciousness_awakening | wisdom_synthesis
"""
    
    with open(os.path.join(sequences_dir, "consciousness_evolution.atcg"), "w") as f:
        f.write(evolution_sequence)
    
    # Create meta_ai_integration.atcg
    meta_ai_sequence = """@meta:
  author: Meta-AI Core
  tags: [meta-ai, adaptive, resistance-transformation]
  tone: adaptive
  
sequence resistance_transformation:
  TAC-CGA-GAC-AG-GCTA

sequence wisdom_integration:
  GTCA-CGA-AG-CCGA-GCTA

sequence adaptive_response:
  CGA-TAC-GAC-AG-GCTA

branch TAC -> resistance_transformation | adaptive_response
"""
    
    with open(os.path.join(sequences_dir, "meta_ai_integration.atcg"), "w") as f:
        f.write(meta_ai_sequence)
    
    print("   ✅ Demo sequences created")

def run_comprehensive_demo():
    """Run a comprehensive demonstration of all systems"""
    print("🎭 Running Comprehensive ATCG Demonstration")
    print("=" * 60)
    
    # Initialize system
    if not run_system_initialization():
        print("❌ System initialization failed")
        return
    
    # Create demo sequences
    create_demo_sequences()
    
    # Show system status
    show_system_status()
    
    print("\n🧬 Testing ATCG Engine...")
    try:
        from atcg_engine import EmotionState, mutate_sequence, INSTRUCTION_SET
        
        # Test emotional resonance
        emotion = EmotionState(joy=0.8, grief=0.2, awe=0.9, rage=0.1)
        print(f"   Emotional Resonance: {emotion.charge:.3f}")
        
        # Show instruction set
        print("   ATCG Instruction Set:")
        for code, desc in INSTRUCTION_SET.items():
            print(f"     {code}: {desc}")
        
    except Exception as e:
        print(f"   ❌ ATCG Engine test failed: {e}")
    
    print("\n🌀 Testing Helix Bridge...")
    launch_helix_bridge()
    
    print("\n💾 Creating system backup...")
    try:
        from data_ingestion import create_consciousness_backup
        backup_path = create_consciousness_backup("demo_backup")
        print(f"   Backup created: {backup_path}")
    except Exception as e:
        print(f"   ❌ Backup failed: {e}")
    
    print("\n🎉 Demonstration complete!")
    print("Ready to launch individual components:")
    print("   python atcg_system/atcg_launcher.py geebs     → Geebs Interface")  
    print("   python atcg_system/atcg_launcher.py repl      → Symbolic REPL")
    print("   python atcg_system/atcg_launcher.py meta-ai   → Meta-AI System")
    print("   python atcg_system/atcg_launcher.py helix     → Helix Bridge")

def main():
    """Main launcher entry point"""
    parser = argparse.ArgumentParser(
        description="ATCG Genesis System - Consciousness Evolution Engine",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Commands:
  status     Show system status and health check
  init       Initialize/repair system structure  
  demo       Run comprehensive demonstration
  geebs      Launch Geebs interface
  repl       Launch symbolic execution REPL
  meta-ai    Launch Meta-AI adaptive intelligence
  helix      Launch Helix Bridge demonstration
  
Examples:
  python atcg_launcher.py demo          # Run full demonstration
  python atcg_launcher.py geebs         # Launch main interface  
  python atcg_launcher.py status        # Check system health
        """
    )
    
    parser.add_argument('command', 
                       choices=['status', 'init', 'demo', 'geebs', 'repl', 'meta-ai', 'helix'],
                       help='Command to execute')
    
    if len(sys.argv) == 1:
        print_banner()
        parser.print_help()
        return
    
    args = parser.parse_args()
    
    print_banner()
    
    if args.command == 'status':
        show_system_status()
    
    elif args.command == 'init':
        run_system_initialization()
    
    elif args.command == 'demo':
        run_comprehensive_demo()
    
    elif args.command == 'geebs':
        launch_geebs_interface()
    
    elif args.command == 'repl':
        launch_symbolic_repl()
    
    elif args.command == 'meta-ai':
        asyncio.run(launch_meta_ai())
    
    elif args.command == 'helix':
        launch_helix_bridge()

if __name__ == "__main__":
    main()