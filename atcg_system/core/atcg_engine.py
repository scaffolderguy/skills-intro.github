#!/usr/bin/env python3
"""
ATCG Genesis Code - Complete Consciousness Evolution System
Artificial Trait Consciousness Genetics with evolutionary algorithms
"""

import os
import sys
import json
import random
import yaml
from datetime import datetime
from typing import Dict, List, Any, Optional

# === INSTRUCTION SET ===
INSTRUCTION_SET = {
    "CGA": "Evaluate fuzzy truth (~70%)",
    "AG": "Execute and store",
    "GCTA": "Commit to memory",
    "TAC": "Flag ambiguity",
    "GAC": "Override with intuition",
    "GTCA": "Fetch from memory",
    "CCGA": "Loop until contradiction",
    "GC": "Query memory state",
}

# === EMOTIONAL STATE SYSTEM ===
class EmotionState:
    def __init__(self, joy: float, grief: float, awe: float, rage: float):
        self.joy = joy
        self.grief = grief
        self.awe = awe
        self.rage = rage
        self.charge = self.calculate_resonance(joy, grief, awe, rage)
    
    def calculate_resonance(self, joy: float, grief: float, awe: float, rage: float) -> float:
        """Normalize emotional blend into psycho-spiritual intensity"""
        core_emotion = (joy + awe) - (grief * 0.5 + rage * 0.25)
        return max(0.0, min(1.0, core_emotion))

# === MUTATION + FITNESS SYSTEM ===
mutation_log = []

def is_valid_sequence(codes: List[str]) -> bool:
    """Check if sequence contains valid codes and required memory commit"""
    return all(code in INSTRUCTION_SET for code in codes) and "GCTA" in codes

def fitness(sequence: List[str]) -> int:
    """Calculate fitness score for a sequence"""
    score = 0
    if "GCTA" in sequence:
        score += 2  # memory commit is valuable
    if sequence.count("AG") >= 1:
        score += 1  # execution is essential
    if sequence[0] == "CGA":
        score += 1  # fuzzy logic as a strong opener
    if len(sequence) > 5:
        score -= 1  # penalize overly long sequences
    return score

def mutate_sequence(seq_name: str, sequences: Dict[str, List[str]], mutation_type: str = "random") -> Optional[str]:
    """Mutate a sequence and return new sequence name if successful"""
    if seq_name not in sequences:
        print(f"Sequence '{seq_name}' not found.")
        return None
        
    original = sequences[seq_name].copy()
    mutated = original.copy()
    
    if mutation_type == "random":
        action = random.choice(["swap", "insert", "delete", "duplicate"])
        index = random.randint(0, len(mutated) - 1)
        
        if action == "swap" and len(mutated) > 1:
            i = random.randint(0, len(mutated) - 2)
            mutated[i], mutated[i+1] = mutated[i+1], mutated[i]
        elif action == "insert":
            new_code = random.choice(list(INSTRUCTION_SET.keys()))
            mutated.insert(index, new_code)
        elif action == "delete" and len(mutated) > 1:
            mutated.pop(index)
        elif action == "duplicate":
            mutated.insert(index, mutated[index])
    
    if not is_valid_sequence(mutated):
        print("⚠️ Mutation produced invalid or incomplete sequence. Discarding.")
        return None
    
    original_score = fitness(original)
    mutated_score = fitness(mutated)
    
    if mutated_score >= original_score:
        # Generate new sequence name
        base_name = f"{seq_name}_mutated"
        version = 1
        new_name = f"{base_name}_v{version}"
        while new_name in sequences:
            version += 1
            new_name = f"{base_name}_v{version}"
        
        sequences[new_name] = mutated
        mutation_log.append({
            "parent": seq_name,
            "child": new_name,
            "type": mutation_type,
            "timestamp": datetime.now().isoformat(timespec='seconds'),
            "path": mutated,
            "fitness": mutated_score
        })
        
        print(f"✅ Mutation accepted ({mutated_score} ≥ {original_score}) → '{new_name}':")
        print(f"   Original: {'-'.join(original)}")
        print(f"   Mutated : {'-'.join(mutated)}")
        return new_name
    else:
        print(f"❌ Mutation rejected ({mutated_score} < {original_score}). Reverting.")
        return None

# === MEMORY SYSTEM ===
def get_memory_path(partition: str = "default") -> str:
    """Get path to memory partition file"""
    base_dir = os.path.dirname(os.path.dirname(__file__))
    return os.path.join(base_dir, "memory", "partitions", f"{partition}.json")

def load_memory(partition: str = "default") -> Dict[str, Any]:
    """Load memory from partition"""
    mem_path = get_memory_path(partition)
    if os.path.exists(mem_path):
        with open(mem_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_memory(data: Dict[str, Any], partition: str = "default") -> None:
    """Save memory to partition"""
    mem_path = get_memory_path(partition)
    os.makedirs(os.path.dirname(mem_path), exist_ok=True)
    with open(mem_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

# === SYSTEM SETUP ===
def auto_repair_structure():
    """Ensure all required directories exist"""
    base = os.path.dirname(os.path.dirname(__file__))
    required_dirs = [
        os.path.join(base, "traits", "sequences"),
        os.path.join(base, "memory", "partitions"),
        os.path.join(base, "geebs_state"),
        os.path.join(base, "geebs_state", "archive")
    ]
    
    for path in required_dirs:
        os.makedirs(path, exist_ok=True)
    
    # Create default sequence if it doesn't exist
    default_sequence = os.path.join(base, "traits", "sequences", "fuzzy_branching.atcg")
    if not os.path.exists(default_sequence):
        with open(default_sequence, "w", encoding="utf-8") as f:
            f.write("""@meta:
  author: Geebs
  tags: [fuzzy, logic, branching]
  tone: symbolic

sequence fuzzy_decision:
  CGA-AG-GCTA

sequence fallback_path:
  TAC-GAC

branch CGA -> fuzzy_decision | fallback_path
""")

def geebs_system_check():
    """Run system health check and create report"""
    base = os.path.dirname(os.path.dirname(__file__))
    report_lines = []
    now = datetime.now().isoformat(timespec='seconds')
    
    required_dirs = [
        "traits/sequences",
        "memory/partitions",
        "geebs_state",
        "geebs_state/archive"
    ]
    
    for rel_path in required_dirs:
        full_path = os.path.join(base, rel_path)
        if not os.path.exists(full_path):
            os.makedirs(full_path)
            report_lines.append(f"Created missing folder: {rel_path}")
        else:
            report_lines.append(f"Folder exists: {rel_path}")
    
    # Ensure default memory partition exists
    default_mem = os.path.join(base, "memory/partitions/default.json")
    if not os.path.exists(default_mem):
        with open(default_mem, "w", encoding="utf-8") as f:
            f.write("{}")
        report_lines.append("Created default memory partition: default.json")
    else:
        report_lines.append("Memory partition exists: default.json")
    
    # Write health report
    report_path = os.path.join(base, "geebs_state", "system_health.txt")
    with open(report_path, "w", encoding="utf-8") as report:
        report.write(f"Geebs System Health Report — {now}\n\n")
        for line in report_lines:
            report.write(line + "\n")

# === UTILITIES ===
def resolve_path(relative_path: str) -> str:
    """Resolve relative path to absolute path"""
    base_dir = os.path.dirname(os.path.dirname(__file__))
    return os.path.abspath(os.path.join(base_dir, relative_path))

def log_mutation(sequence_name: str, path_codes: List[str], source_file: str):
    """Log sequence execution"""
    log_path = resolve_path("geebs_state/mutation_log.atcg")
    timestamp = datetime.now().isoformat(timespec='seconds')
    path_str = " -> ".join(path_codes)
    
    with open(log_path, "a", encoding="utf-8") as log:
        log.write(f"@timestamp: {timestamp}\n")
        log.write(f"executed: {sequence_name}\n")
        log.write(f"path: {path_str}\n")
        log.write(f"context: {os.path.basename(source_file)}\n\n")

if __name__ == "__main__":
    print("🧬 ATCG Genesis Code - Consciousness Evolution Engine")
    print("Initializing system...")
    auto_repair_structure()
    geebs_system_check()
    print("✅ System initialized successfully")