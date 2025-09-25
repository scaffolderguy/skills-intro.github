"""
Data Ingestion System for ATCG Consciousness Framework
Handles symbolic processing, memory storage, and contribution logging
"""

import os
import json
import pickle
from datetime import datetime
from typing import Dict, Any, Optional, List

# === FILE PATHS ===
RAW_DIR = "atcg_system/data_ingestion/raw"
SYM_DIR = "atcg_system/data_ingestion/symbolic" 
LOG_DIR = "atcg_system/data_ingestion/logs"

# Ensure directories exist
for dir_path in [RAW_DIR, SYM_DIR, LOG_DIR]:
    os.makedirs(dir_path, exist_ok=True)

# === MEMORY INTERFACE ===
def log_contribution(partition: str, content: str, author: str = "Geebs", 
                    tone: str = "reflective", style: str = "symbolic", 
                    entry_type: str = "reflection", tags: List[str] = None):
    """Log a contribution to the specified memory partition"""
    
    if tags is None:
        tags = []
    
    memory_path = f"atcg_system/memory/partitions/{partition}.json"
    os.makedirs(os.path.dirname(memory_path), exist_ok=True)
    
    # Load existing memory
    if os.path.exists(memory_path):
        with open(memory_path, "r", encoding="utf-8") as f:
            memory = json.load(f)
    else:
        memory = {"entries": [], "metadata": {"created": datetime.utcnow().isoformat()}}
    
    # Create new entry
    entry = {
        "id": len(memory["entries"]) + 1,
        "timestamp": datetime.utcnow().isoformat(),
        "content": content,
        "author": author,
        "tone": tone,
        "style": style,
        "type": entry_type,
        "tags": tags
    }
    
    # Add to memory
    memory["entries"].append(entry)
    memory["metadata"]["last_updated"] = datetime.utcnow().isoformat()
    memory["metadata"]["entry_count"] = len(memory["entries"])
    
    # Save memory
    with open(memory_path, "w", encoding="utf-8") as f:
        json.dump(memory, f, indent=2, ensure_ascii=False)
    
    print(f"📝 Logged to {partition}: {content[:50]}...")
    return entry["id"]

def get_memory_entries(partition: str, limit: int = None, filter_tags: List[str] = None) -> List[Dict[str, Any]]:
    """Retrieve entries from memory partition with optional filtering"""
    
    memory_path = f"atcg_system/memory/partitions/{partition}.json"
    
    if not os.path.exists(memory_path):
        return []
    
    with open(memory_path, "r", encoding="utf-8") as f:
        memory = json.load(f)
    
    entries = memory.get("entries", [])
    
    # Filter by tags if specified
    if filter_tags:
        entries = [e for e in entries if any(tag in e.get("tags", []) for tag in filter_tags)]
    
    # Sort by timestamp (newest first)
    entries = sorted(entries, key=lambda x: x.get("timestamp", ""), reverse=True)
    
    # Limit results if specified
    if limit:
        entries = entries[:limit]
    
    return entries

# === FILE INGESTION ===
def ingest_file(path: str, user_tags: List[str] = None) -> tuple[str, str]:
    """Ingest a file into the ATCG system with symbolic processing"""
    
    filename = os.path.basename(path)
    name, ext = os.path.splitext(filename)
    timestamp = datetime.utcnow().isoformat()
    
    if user_tags is None:
        user_tags = []
    
    # Read content
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
    except UnicodeDecodeError:
        # Try binary mode for non-text files
        with open(path, "rb") as f:
            content = f.read()
            # Convert to string representation for processing
            content = str(content)
    
    # === Symbolic Summary ===
    symbolic = {
        "source_file": filename,
        "timestamp": timestamp,
        "summary": summarize_content(str(content)),
        "tags": user_tags,
        "type": "data_ingestion",
        "style": "symbolic",
        "tone": "reflective", 
        "author": "Geebs",
        "file_extension": ext,
        "character_count": len(str(content)),
        "symbolic_analysis": analyze_symbolic_content(str(content))
    }
    
    # Save symbolic .atcg
    symbolic_path = os.path.join(SYM_DIR, f"{name}.atcg")
    with open(symbolic_path, "w", encoding="utf-8") as f:
        json.dump(symbolic, f, indent=2, ensure_ascii=False)
    
    # Save binary .bin
    binary_path = os.path.join(RAW_DIR, f"{name}.bin")
    with open(binary_path, "wb") as f:
        if isinstance(content, str):
            pickle.dump(content.encode('utf-8'), f)
        else:
            pickle.dump(content, f)
    
    # Log ingestion
    log_contribution(
        partition="geebs_journal",
        content=f"Ingested file '{filename}' and created symbolic + binary memory.",
        author="Geebs",
        tone="reflective",
        style="symbolic",
        entry_type="data_ingestion",
        tags=["ingestion", "file", ext.replace('.', '')] + user_tags
    )
    
    return symbolic_path, binary_path

def summarize_content(text: str) -> str:
    """Generate a summary of content for symbolic processing"""
    if not text:
        return "No content."
    
    lines = text.strip().splitlines()
    first_line = lines[0] if lines else "No content."
    
    # Basic content analysis
    word_count = len(text.split())
    line_count = len(lines)
    
    summary = f"First line: {first_line[:100]}"
    if len(first_line) > 100:
        summary += "..."
    
    summary += f" [{word_count} words, {line_count} lines]"
    
    return summary

def analyze_symbolic_content(content: str) -> Dict[str, Any]:
    """Analyze content for symbolic patterns and ATCG relevance"""
    
    analysis = {
        "atcg_codes_found": [],
        "emotional_indicators": [],
        "symbolic_density": 0.0,
        "consciousness_markers": [],
        "complexity_score": 0
    }
    
    # Look for ATCG instruction codes
    atcg_codes = ["CGA", "AG", "GCTA", "TAC", "GAC", "GTCA", "CCGA", "GC"]
    for code in atcg_codes:
        if code in content.upper():
            analysis["atcg_codes_found"].append(code)
    
    # Emotional indicators
    emotion_words = ["joy", "grief", "awe", "rage", "emotion", "feeling", "resonate"]
    for word in emotion_words:
        if word.lower() in content.lower():
            analysis["emotional_indicators"].append(word)
    
    # Consciousness markers
    consciousness_words = ["consciousness", "awareness", "intelligence", "mind", "thought", "reflection"]
    for word in consciousness_words:
        if word.lower() in content.lower():
            analysis["consciousness_markers"].append(word)
    
    # Calculate symbolic density (ratio of symbolic terms to total words)
    total_words = len(content.split())
    symbolic_terms = len(analysis["atcg_codes_found"]) + len(analysis["emotional_indicators"]) + len(analysis["consciousness_markers"])
    
    if total_words > 0:
        analysis["symbolic_density"] = symbolic_terms / total_words
    
    # Complexity score based on various factors
    analysis["complexity_score"] = (
        len(analysis["atcg_codes_found"]) * 3 +
        len(analysis["emotional_indicators"]) * 2 +
        len(analysis["consciousness_markers"]) * 2 +
        int(analysis["symbolic_density"] * 100)
    )
    
    return analysis

# === SYMBOLIC QUERY SYSTEM ===
def search_symbolic_content(query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """Search through symbolic content with relevance scoring"""
    
    results = []
    
    # Search through symbolic files
    if os.path.exists(SYM_DIR):
        for filename in os.listdir(SYM_DIR):
            if filename.endswith(".atcg"):
                filepath = os.path.join(SYM_DIR, filename)
                with open(filepath, "r", encoding="utf-8") as f:
                    symbolic_data = json.load(f)
                
                # Calculate relevance score
                relevance = calculate_relevance(symbolic_data, query)
                
                if relevance > 0:
                    results.append({
                        "filename": filename,
                        "relevance": relevance,
                        "data": symbolic_data
                    })
    
    # Sort by relevance
    results.sort(key=lambda x: x["relevance"], reverse=True)
    
    return results[:max_results]

def calculate_relevance(symbolic_data: Dict[str, Any], query: str) -> float:
    """Calculate relevance score for symbolic content"""
    
    score = 0.0
    query_lower = query.lower()
    
    # Check summary
    if "summary" in symbolic_data:
        summary = symbolic_data["summary"].lower()
        if query_lower in summary:
            score += 3.0
    
    # Check tags
    if "tags" in symbolic_data:
        for tag in symbolic_data["tags"]:
            if query_lower in tag.lower():
                score += 2.0
    
    # Check symbolic analysis
    if "symbolic_analysis" in symbolic_data:
        analysis = symbolic_data["symbolic_analysis"]
        
        # ATCG codes
        if query_lower.upper() in analysis.get("atcg_codes_found", []):
            score += 5.0
        
        # Emotional indicators
        if query_lower in [w.lower() for w in analysis.get("emotional_indicators", [])]:
            score += 2.0
        
        # Consciousness markers
        if query_lower in [w.lower() for w in analysis.get("consciousness_markers", [])]:
            score += 2.0
    
    # Boost score based on symbolic density
    if "symbolic_analysis" in symbolic_data:
        density = symbolic_data["symbolic_analysis"].get("symbolic_density", 0)
        score += density * 10
    
    return score

# === BACKUP AND EXPORT ===
def create_consciousness_backup(backup_name: str = None) -> str:
    """Create a comprehensive backup of the consciousness system"""
    
    if backup_name is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"atcg_backup_{timestamp}"
    
    backup_dir = f"atcg_system/data_ingestion/logs/{backup_name}"
    os.makedirs(backup_dir, exist_ok=True)
    
    backup_manifest = {
        "backup_name": backup_name,
        "timestamp": datetime.utcnow().isoformat(),
        "components": [],
        "file_count": 0,
        "total_size": 0
    }
    
    # Backup memory partitions
    memory_dir = "atcg_system/memory/partitions"
    if os.path.exists(memory_dir):
        backup_memory_dir = os.path.join(backup_dir, "memory")
        os.makedirs(backup_memory_dir, exist_ok=True)
        
        for filename in os.listdir(memory_dir):
            src = os.path.join(memory_dir, filename)
            dst = os.path.join(backup_memory_dir, filename)
            
            with open(src, "rb") as f_src, open(dst, "wb") as f_dst:
                data = f_src.read()
                f_dst.write(data)
                backup_manifest["total_size"] += len(data)
                backup_manifest["file_count"] += 1
        
        backup_manifest["components"].append("memory_partitions")
    
    # Backup symbolic content
    if os.path.exists(SYM_DIR):
        backup_sym_dir = os.path.join(backup_dir, "symbolic")
        os.makedirs(backup_sym_dir, exist_ok=True)
        
        for filename in os.listdir(SYM_DIR):
            src = os.path.join(SYM_DIR, filename)
            dst = os.path.join(backup_sym_dir, filename)
            
            with open(src, "rb") as f_src, open(dst, "wb") as f_dst:
                data = f_src.read()
                f_dst.write(data)
                backup_manifest["total_size"] += len(data)
                backup_manifest["file_count"] += 1
        
        backup_manifest["components"].append("symbolic_content")
    
    # Save backup manifest
    manifest_path = os.path.join(backup_dir, "backup_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(backup_manifest, f, indent=2)
    
    print(f"💾 Created consciousness backup: {backup_name}")
    print(f"   Files: {backup_manifest['file_count']}")
    print(f"   Size: {backup_manifest['total_size']} bytes")
    print(f"   Components: {', '.join(backup_manifest['components'])}")
    
    return backup_dir

# === CLI INTERFACE ===
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("🧠 ATCG Data Ingestion System")
        print("Usage:")
        print("  python data_ingestion.py ingest <filepath> [tags...]")
        print("  python data_ingestion.py search <query>")
        print("  python data_ingestion.py memory <partition> [limit]")
        print("  python data_ingestion.py backup [name]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "ingest":
        if len(sys.argv) < 3:
            print("❌ Please specify file path")
            sys.exit(1)
        
        filepath = sys.argv[2]
        tags = sys.argv[3:] if len(sys.argv) > 3 else []
        
        if not os.path.exists(filepath):
            print(f"❌ File not found: {filepath}")
            sys.exit(1)
        
        symbolic_path, binary_path = ingest_file(filepath, tags)
        print(f"✅ File ingested successfully")
        print(f"   Symbolic: {symbolic_path}")
        print(f"   Binary: {binary_path}")
    
    elif command == "search":
        if len(sys.argv) < 3:
            print("❌ Please specify search query")
            sys.exit(1)
        
        query = " ".join(sys.argv[2:])
        results = search_symbolic_content(query)
        
        print(f"🔍 Search results for: {query}")
        for result in results:
            print(f"   📄 {result['filename']} (relevance: {result['relevance']:.2f})")
            print(f"      {result['data']['summary']}")
    
    elif command == "memory":
        if len(sys.argv) < 3:
            print("❌ Please specify memory partition")
            sys.exit(1)
        
        partition = sys.argv[2]
        limit = int(sys.argv[3]) if len(sys.argv) > 3 else None
        
        entries = get_memory_entries(partition, limit)
        
        print(f"🧠 Memory partition: {partition}")
        for entry in entries:
            print(f"   [{entry['timestamp']}] {entry['type']}: {entry['content'][:80]}...")
    
    elif command == "backup":
        backup_name = sys.argv[2] if len(sys.argv) > 2 else None
        backup_path = create_consciousness_backup(backup_name)
        print(f"   Location: {backup_path}")
    
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)