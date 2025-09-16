#!/usr/bin/env python3
"""
ATCG Symbolic Execution Engine
Handles sequence parsing, execution, and REPL interface
"""

import os
import sys
import json
import yaml
from datetime import datetime
from typing import Dict, List, Any, Optional

# Import from core engine
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'core'))
from atcg_engine import (
    INSTRUCTION_SET, mutate_sequence, mutation_log, 
    load_memory, save_memory, log_mutation, resolve_path
)

# === EXECUTION ENGINE ===
def execute_sequence(sequence_name: str, sequences: Dict[str, List[str]], source_file: Optional[str] = None):
    """Execute an ATCG sequence"""
    if sequence_name not in sequences:
        print(f"Sequence '{sequence_name}' not found.")
        return
    
    print(f"\n🧬 Executing sequence: {sequence_name}")
    path_codes = []
    
    for code in sequences[sequence_name]:
        instruction = INSTRUCTION_SET.get(code)
        path_codes.append(code)
        if instruction:
            print(f"   → {code}: {instruction}")
        else:
            print(f"   ⚠️ Unknown instruction: {code}")
    
    if source_file:
        log_mutation(sequence_name, path_codes, source_file)

# === FILE PARSER ===
def parse_atcg_file(filepath: str) -> Dict[str, List[str]]:
    """Parse .atcg file and extract sequences"""
    sequences = {}
    current_sequence = None
    
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or line.startswith("@"):
                    continue
                
                if line.startswith("sequence"):
                    # Extract sequence name
                    current_sequence = line.split()[1].strip(":")
                    sequences[current_sequence] = []
                elif line.startswith("branch "):
                    # Handle branching logic
                    try:
                        condition_part, actions = line[len("branch "):].split("->")
                        true_seq, false_seq = actions.strip().split("|")
                        condition = condition_part.strip()
                        true_seq = true_seq.strip()
                        false_seq = false_seq.strip()
                        
                        print(f"\n🌿 Branching on {condition}: if true → {true_seq}, else → {false_seq}")
                        # For now, assume condition is always true
                        execute_sequence(true_seq, sequences, filepath)
                    except ValueError:
                        print(f"⚠️ Malformed branch line: {line}")
                elif current_sequence:
                    # Parse sequence codes
                    codes = [c.strip() for c in line.split("-")]
                    sequences[current_sequence].extend(codes)
    
    except FileNotFoundError:
        print(f"File not found: {filepath}")
        return {}
    
    return sequences

# === REPL INTERFACE ===
def start_repl(sequences: Dict[str, List[str]], source_file: str):
    """Start the ATCG REPL interface"""
    print("\n🧠 Geebs Symbolic REPL — type 'help' for commands, 'exit' to quit.")
    
    while True:
        try:
            cmd = input("geebs> ").strip()
            
            if cmd in ("exit", "quit"):
                print("👋 Exiting REPL.")
                break
            
            elif cmd == "help":
                print("Commands:")
                print("  run [sequence]        → Execute a symbolic sequence")
                print("  list                  → Show all loaded sequences")
                print("  log                   → Show last mutation log entry")
                print("  define [name]: CODE-CODE-CODE")
                print("                        → Define a new symbolic sequence")
                print("  save [sequence]       → Save a sequence to user_defined.atcg")
                print("  check                 → Run system health check")
                print("  index                 → Build symbolic sequence index")
                print("  memory                → View symbolic memory")
                print("  memory set key: CODE-CODE")
                print("  memory delete key     → Delete a memory key")
                print("  mutate [sequence]     → Mutate a symbolic sequence")
                print("  mutations             → Show recent mutation history")
                print("  emotion [j] [g] [a] [r] → Calculate emotion state")
                print("  exit                  → Quit the REPL")
            
            elif cmd.startswith("mutate "):
                seq = cmd.split(" ", 1)[1]
                new_seq = mutate_sequence(seq, sequences)
                if new_seq:
                    print(f"🧬 New sequence '{new_seq}' created")
            
            elif cmd == "mutations":
                if not mutation_log:
                    print("No mutations recorded.")
                else:
                    print("🧬 Mutation History:")
                    for entry in mutation_log[-5:]:
                        print(f"   {entry['timestamp']}: {entry['parent']} → {entry['child']} (fitness: {entry['fitness']})")
            
            elif cmd == "memory":
                memory = load_memory()
                if memory:
                    print("🧠 Current symbolic memory:")
                    for key, codes in memory.items():
                        if isinstance(codes, list):
                            print(f"   {key}: {'-'.join(codes)}")
                        else:
                            print(f"   {key}: {codes}")
                else:
                    print("No memory found.")
            
            elif cmd.startswith("memory set "):
                try:
                    key_part, code_part = cmd[len("memory set "):].split(":")
                    key = key_part.strip()
                    codes = [c.strip() for c in code_part.strip().split("-")]
                    
                    memory = load_memory()
                    memory[key] = codes
                    save_memory(memory)
                    
                    print(f"💾 Set memory key '{key}' to: {'-'.join(codes)}")
                except ValueError:
                    print("Invalid format. Use: memory set key: CODE-CODE")
            
            elif cmd.startswith("memory delete "):
                key = cmd[len("memory delete "):].strip()
                memory = load_memory()
                if key in memory:
                    del memory[key]
                    save_memory(memory)
                    print(f"🗑️ Deleted memory key: {key}")
                else:
                    print(f"Key '{key}' not found.")
            
            elif cmd.startswith("run "):
                seq = cmd.split(" ", 1)[1]
                execute_sequence(seq, sequences, source_file)
            
            elif cmd == "list":
                print("📋 Loaded sequences:")
                for name in sequences:
                    codes = '-'.join(sequences[name])
                    print(f"   - {name}: {codes}")
            
            elif cmd == "log":
                log_path = resolve_path("geebs_state/mutation_log.atcg")
                if os.path.exists(log_path):
                    with open(log_path, "r", encoding="utf-8") as f:
                        lines = f.readlines()
                    print("📜 Last mutation:")
                    for line in lines[-5:]:
                        print("   " + line.strip())
                else:
                    print("No mutation log found.")
            
            elif cmd.startswith("define "):
                try:
                    name_part, code_part = cmd[len("define "):].split(":")
                    name = name_part.strip()
                    codes = [c.strip() for c in code_part.strip().split("-")]
                    sequences[name] = codes
                    print(f"✨ Defined new sequence: {name}")
                    print(f"   → {', '.join(codes)}")
                except ValueError:
                    print("Invalid format. Use: define sequence_name: CODE-CODE-CODE")
            
            elif cmd.startswith("save "):
                seq = cmd.split(" ", 1)[1]
                save_sequence_to_file(seq, sequences)
            
            elif cmd == "check":
                from atcg_engine import geebs_system_check
                geebs_system_check()
                print("✅ System health check complete")
            
            elif cmd == "index":
                build_symbolic_index()
            
            elif cmd.startswith("emotion "):
                try:
                    from atcg_engine import EmotionState
                    parts = cmd.split()[1:]
                    if len(parts) == 4:
                        joy, grief, awe, rage = map(float, parts)
                        emotion = EmotionState(joy, grief, awe, rage)
                        print(f"🎭 Emotional Resonance Charge: {emotion.charge:.3f}")
                        print(f"   Joy: {joy}, Grief: {grief}, Awe: {awe}, Rage: {rage}")
                    else:
                        print("Usage: emotion [joy] [grief] [awe] [rage] (values 0.0-1.0)")
                except ValueError:
                    print("Invalid emotion values. Use floats between 0.0 and 1.0")
            
            else:
                print(f"Unknown command: {cmd}")
        
        except KeyboardInterrupt:
            print("\n👋 Exiting REPL.")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

def save_sequence_to_file(seq_name: str, sequences: Dict[str, List[str]]):
    """Save sequence to user_defined.atcg file"""
    if seq_name not in sequences:
        print(f"Sequence '{seq_name}' not found.")
        return
    
    user_file = resolve_path("traits/sequences/user_defined.atcg")
    os.makedirs(os.path.dirname(user_file), exist_ok=True)
    
    with open(user_file, "a", encoding="utf-8") as f:
        f.write(f"\nsequence {seq_name}:\n")
        f.write("  " + "-".join(sequences[seq_name]) + "\n")
    
    print(f"💾 Saved sequence '{seq_name}' to user_defined.atcg")

def build_symbolic_index():
    """Build index of all symbolic sequences"""
    sequences_dir = resolve_path("traits/sequences")
    index = {}
    
    if not os.path.exists(sequences_dir):
        print("No sequences directory found.")
        return
    
    for filename in os.listdir(sequences_dir):
        if filename.endswith(".atcg"):
            filepath = os.path.join(sequences_dir, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                current_seq = None
                for line in f:
                    line = line.strip()
                    if line.startswith("sequence"):
                        current_seq = line.split()[1].strip(":")
                        index[current_seq] = {
                            "file": filename,
                            "codes": []
                        }
                    elif current_seq and "-" in line and not line.startswith("@"):
                        codes = [c.strip() for c in line.split("-")]
                        index[current_seq]["codes"].extend(codes)
    
    print("\n📚 Symbolic Sequence Index:")
    for name, data in index.items():
        print(f"   {name} ({data['file']}): {'-'.join(data['codes'])}")

# === ENTRY POINT ===
if __name__ == "__main__":
    print("🧬 Geebs booting...")
    try:
        print("→ Running system check...")
        from atcg_engine import geebs_system_check, auto_repair_structure
        geebs_system_check()
        print("→ System check complete.")
        
        print("→ Running auto-repair...")
        auto_repair_structure()
        print("→ Auto-repair complete.")
        
        # Load default sequence file
        relative_path = sys.argv[1] if len(sys.argv) > 1 else "traits/sequences/fuzzy_branching.atcg"
        filepath = resolve_path(relative_path)
        print(f"→ Attempting to load: {filepath}")
        
        sequences = parse_atcg_file(filepath)
        print(f"→ Sequences loaded: {len(sequences)}")
        
        if sequences:
            print("→ Launching REPL...")
            start_repl(sequences, filepath)
        else:
            print("→ No sequences found. Check your .atcg file.")
    
    except Exception as e:
        print(f"❌ Crash during startup: {e}")
        import traceback
        traceback.print_exc()