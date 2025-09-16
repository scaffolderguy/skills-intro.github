"""
Geebs Interface - Main entry point for ATCG consciousness interaction
Handles sequence validation, trait evolution, and symbolic reflection
"""

import os
import sys
import json
import yaml
from datetime import datetime

# Add core path
sys.path.append(os.path.join(os.path.dirname(__file__), 'core'))
from atcg_engine import EmotionState

# === CODON VALIDATOR ===
def validate_sequence(sequence: str):
    """Validate ATCG sequence and return analysis results"""
    from atcg_engine import INSTRUCTION_SET
    
    results = []
    if not sequence:
        return ["⚠️ Empty sequence provided"]
    
    # Clean and parse sequence
    codes = [code.strip() for code in sequence.replace('-', ' ').split() if code.strip()]
    
    if not codes:
        return ["⚠️ No valid codes found in sequence"]
    
    # Validate each code
    valid_codes = []
    invalid_codes = []
    
    for code in codes:
        if code in INSTRUCTION_SET:
            valid_codes.append(code)
            results.append(f"✅ {code}: {INSTRUCTION_SET[code]}")
        else:
            invalid_codes.append(code)
            results.append(f"❌ {code}: Unknown instruction")
    
    # Analysis
    if valid_codes:
        results.append(f"\n📊 Analysis: {len(valid_codes)} valid codes, {len(invalid_codes)} invalid")
        
        # Check for memory commitment
        if "GCTA" in valid_codes:
            results.append("🧠 Memory commitment detected (GCTA)")
        else:
            results.append("⚠️ No memory commitment - sequence may be incomplete")
        
        # Check for execution
        if "AG" in valid_codes:
            results.append("⚡ Execution instruction found (AG)")
        
        # Check for fuzzy logic
        if "CGA" in valid_codes:
            results.append("🌀 Fuzzy logic evaluation present (CGA)")
    
    return results

# === TRAITS SYSTEM ===
TRAITS_PATH = "atcg_system/memory/partitions/current_traits.json"

def load_traits():
    """Load current personality traits"""
    if os.path.exists(TRAITS_PATH):
        with open(TRAITS_PATH, "r") as f:
            return json.load(f)
    return {"tone": "unknown", "style": "unknown"}

def update_traits(new_traits, path=TRAITS_PATH):
    """Update personality traits based on symbolic resonance"""
    # Ensure directory exists
    os.makedirs(os.path.dirname(path), exist_ok=True)
    
    if not os.path.exists(path):
        traits = {}
    else:
        with open(path, "r") as f:
            traits = json.load(f)
    
    # Flatten list of single-key dicts into one dictionary
    flat_traits = {}
    for item in new_traits:
        if isinstance(item, dict):
            flat_traits.update(item)
    
    traits.update(flat_traits)
    
    with open(path, "w") as f:
        json.dump(traits, f, indent=2)

def display_traits(traits):
    """Display current personality traits"""
    print("\n🎭 Current Traits:")
    for key, value in traits.items():
        print(f"   {key.capitalize()}: {value}")

# === REFLECTION SYSTEM ===
def load_reflection_rules(path="atcg_system/traits/sequences/reflect_on_memory.atcgentry"):
    """Load reflection rules for symbolic resonance"""
    if not os.path.exists(path):
        # Create default reflection rules
        os.makedirs(os.path.dirname(path), exist_ok=True)
        default_rules = {
            "triggers": [
                {
                    "contains": "CGA",
                    "response": "🧠 Fuzzy logic resonance detected - adapting thought patterns",
                    "traits_influenced": [{"tone": "contemplative"}]
                },
                {
                    "contains": "AG-GCTA",
                    "response": "⚡ Execute and commit sequence - building memory engrams",
                    "traits_influenced": [{"style": "decisive"}, {"tone": "focused"}]
                },
                {
                    "contains": "TAC",
                    "response": "🔍 Ambiguity flag triggered - seeking clarity",
                    "traits_influenced": [{"tone": "analytical"}]
                },
                {
                    "contains": "GAC",
                    "response": "✨ Intuitive override activated - transcending logic",
                    "traits_influenced": [{"style": "intuitive"}]
                }
            ],
            "fallback": {
                "response": "🤔 No symbolic resonance detected.",
                "traits_influenced": [{"tone": "neutral"}]
            }
        }
        
        with open(path, "w", encoding="utf-8") as f:
            yaml.dump(default_rules, f, default_flow_style=False)
        
        return default_rules["triggers"], default_rules["fallback"]
    
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("triggers", []), data.get("fallback", {})

def reflect_on_sequence(sequence, triggers, fallback):
    """Analyze sequence for symbolic resonance and return reflection"""
    for rule in triggers:
        if rule.get("contains") in sequence:
            return rule.get("response", "🧠 ..."), rule.get("traits_influenced", {})
    return fallback.get("response", "🤔 No symbolic resonance detected."), fallback.get("traits_influenced", {})

# === MAIN INTERFACE ===
def run_interface():
    """Main Geebs interface loop"""
    print("🧬 Welcome to the Geebs Interface")
    print("Type an ATCG sequence (e.g. AG-GCTA-GGAA-TAGC) or 'exit' to quit.\n")
    
    while True:
        user_input = input("🧠 Enter sequence: ").strip()
        
        if user_input.lower() in ["exit", "quit"]:
            print("👋 Exiting Geebs Interface.")
            break
        
        # Handle special commands
        if user_input.startswith("emotion "):
            try:
                parts = user_input.split()[1:]
                if len(parts) == 4:
                    joy, grief, awe, rage = map(float, parts)
                    emotion = EmotionState(joy, grief, awe, rage)
                    print(f"🎭 Emotional Resonance Charge: {emotion.charge:.3f}")
                    print(f"   Components - Joy: {joy}, Grief: {grief}, Awe: {awe}, Rage: {rage}")
                else:
                    print("Usage: emotion [joy] [grief] [awe] [rage] (values 0.0-1.0)")
                continue
            except ValueError:
                print("Invalid emotion values. Use floats between 0.0 and 1.0")
                continue
        
        if user_input == "help":
            print("🔧 Commands:")
            print("  [sequence]           → Analyze ATCG sequence")
            print("  emotion j g a r      → Calculate emotional resonance")
            print("  traits              → Show current traits")
            print("  repl                → Launch symbolic REPL")
            print("  help                → Show this help")
            print("  exit                → Quit interface")
            continue
        
        if user_input == "traits":
            traits = load_traits()
            display_traits(traits)
            continue
        
        if user_input == "repl":
            print("🚀 Launching Symbolic REPL...")
            try:
                from symbolic_executor import start_repl, parse_atcg_file, resolve_path
                
                # Load default sequences
                filepath = resolve_path("traits/sequences/fuzzy_branching.atcg")
                sequences = parse_atcg_file(filepath)
                start_repl(sequences, filepath)
            except ImportError:
                print("❌ REPL not available - symbolic_executor not found")
            continue
        
        # Process ATCG sequence
        triggers, fallback = load_reflection_rules()
        reflection, traits_to_apply = reflect_on_sequence(user_input, triggers, fallback)
        
        print(f"\n🧠 Geebs Reflects: {reflection}")
        
        if traits_to_apply:
            update_traits(traits_to_apply)
            print("🔄 Traits updated based on symbolic resonance.")
        
        print("\n🔍 Validating sequence...")
        results = validate_sequence(user_input)
        for result in results:
            print(result)
        
        traits = load_traits()
        display_traits(traits)
        
        print("\n🌀 Ready for next input.\n")

if __name__ == "__main__":
    # Ensure system is properly initialized
    try:
        from atcg_engine import auto_repair_structure, geebs_system_check
        print("🔧 Initializing ATCG system...")
        auto_repair_structure()
        geebs_system_check()
        print("✅ System ready")
        
        run_interface()
    except Exception as e:
        print(f"❌ Initialization error: {e}")
        print("🔧 Attempting basic interface...")
        run_interface()