"""
📋 Clipboard Digest → Notion

This module captures clipboard content, deduplicates it, and logs it to Notion weekly.
"""

import hashlib
import datetime
import json
import os
from typing import Dict, List, Optional, Any

# Optional dependencies
try:
    import pyperclip
    HAS_PYPERCLIP = True
except ImportError:
    HAS_PYPERCLIP = False
    pyperclip = None

try:
    from notion_client import Client
    HAS_NOTION = True
except ImportError:
    HAS_NOTION = False
    Client = None


class ClipboardDigest:
    """Manages clipboard content capture and Notion integration"""
    
    def __init__(self, notion_token: Optional[str] = None, database_id: Optional[str] = None):
        self.notion_token = notion_token or os.getenv('NOTION_TOKEN')
        self.database_id = database_id or os.getenv('NOTION_DATABASE_ID')
        self.notion = None
        self.digest_log = {}
        self.digest_file = "clipboard_digest.json"
        
        if self.notion_token and HAS_NOTION:
            self.notion = Client(auth=self.notion_token)
        elif self.notion_token and not HAS_NOTION:
            print("⚠️ notion-client not installed. Notion integration disabled.")
        
        self._load_digest_log()
    
    def _load_digest_log(self):
        """Load existing digest log from file"""
        try:
            if os.path.exists(self.digest_file):
                with open(self.digest_file, 'r') as f:
                    self.digest_log = json.load(f)
        except Exception as e:
            print(f"Error loading digest log: {e}")
            self.digest_log = {}
    
    def _save_digest_log(self):
        """Save digest log to file"""
        try:
            with open(self.digest_file, 'w') as f:
                json.dump(self.digest_log, f, indent=2)
        except Exception as e:
            print(f"Error saving digest log: {e}")
    
    def get_clipboard(self) -> str:
        """Get current clipboard content"""
        if not HAS_PYPERCLIP:
            print("⚠️ pyperclip not installed. Cannot access clipboard.")
            return ""
        try:
            return pyperclip.paste()
        except Exception as e:
            print(f"Error accessing clipboard: {e}")
            return ""
    
    def hash_content(self, content: str) -> str:
        """Generate hash for content deduplication"""
        return hashlib.sha256(content.encode()).hexdigest()
    
    def log_to_notion(self, content: str, content_hash: str) -> bool:
        """Log content to Notion database"""
        if not self.notion or not self.database_id:
            print("Notion client or database ID not configured")
            return False
        
        try:
            # Truncate content for title (Notion has limits)
            title = content[:100] + "..." if len(content) > 100 else content
            title = title.replace('\n', ' ').replace('\r', ' ')
            
            self.notion.pages.create(
                parent={"database_id": self.database_id},
                properties={
                    "Title": {"title": [{"text": {"content": title}}]},
                    "Content": {"rich_text": [{"text": {"content": content[:2000]}}]},  # Notion limit
                    "Hash": {"rich_text": [{"text": {"content": content_hash}}]},
                    "Date": {"date": {"start": datetime.datetime.now().isoformat()}},
                    "Source": {"select": {"name": "Clipboard"}}
                }
            )
            return True
        except Exception as e:
            print(f"Error logging to Notion: {e}")
            return False
    
    def digest_clipboard(self, auto_log_notion: bool = True) -> Dict[str, Any]:
        """Process current clipboard content"""
        content = self.get_clipboard()
        if not content or not content.strip():
            return {"status": "empty", "message": "Clipboard is empty"}
        
        content_hash = self.hash_content(content)
        timestamp = datetime.datetime.now().isoformat()
        
        if content_hash in self.digest_log:
            return {
                "status": "duplicate", 
                "message": "Duplicate detected. Skipping.",
                "hash": content_hash,
                "first_seen": self.digest_log[content_hash]["timestamp"]
            }
        
        # Log new content
        self.digest_log[content_hash] = {
            "content": content,
            "timestamp": timestamp,
            "length": len(content)
        }
        
        self._save_digest_log()
        
        result = {
            "status": "new",
            "message": "Logged new clipboard content.",
            "hash": content_hash,
            "timestamp": timestamp,
            "length": len(content)
        }
        
        # Optionally log to Notion
        if auto_log_notion:
            notion_success = self.log_to_notion(content, content_hash)
            result["notion_logged"] = notion_success
        
        return result
    
    def generate_weekly_digest(self) -> Optional[str]:
        """Generate and optionally upload weekly digest to Notion"""
        if not self.digest_log:
            return None
        
        # Get items from the last 7 days
        week_ago = datetime.datetime.now() - datetime.timedelta(days=7)
        recent_items = []
        
        for content_hash, item in self.digest_log.items():
            try:
                item_date = datetime.datetime.fromisoformat(item["timestamp"].replace('Z', '+00:00'))
                if item_date >= week_ago:
                    recent_items.append(item)
            except Exception as e:
                print(f"Error parsing date for item {content_hash}: {e}")
        
        if not recent_items:
            return "No clipboard activity in the last week."
        
        # Generate summary
        summary_lines = [
            f"📋 Weekly Clipboard Digest - {datetime.datetime.now().strftime('%Y-%m-%d')}",
            f"Total items captured: {len(recent_items)}",
            "",
            "Recent clipboard activity:"
        ]
        
        for item in sorted(recent_items, key=lambda x: x["timestamp"], reverse=True):
            content_preview = item["content"][:100].replace('\n', ' ')
            summary_lines.append(f"• {item['timestamp'][:19]} - {content_preview}...")
        
        summary = "\n".join(summary_lines)
        
        # Log to Notion if configured
        if self.notion and self.database_id:
            try:
                self.notion.pages.create(
                    parent={"database_id": self.database_id},
                    properties={
                        "Title": {"title": [{"text": {"content": "Weekly Clipboard Digest"}}]},
                        "Date": {"date": {"start": datetime.datetime.now().isoformat()}},
                        "Source": {"select": {"name": "Weekly Digest"}}
                    },
                    children=[{
                        "object": "block",
                        "type": "paragraph",
                        "paragraph": {
                            "rich_text": [{"type": "text", "text": {"content": summary}}]
                        }
                    }]
                )
            except Exception as e:
                print(f"Error creating weekly digest in Notion: {e}")
        
        return summary
    
    def get_stats(self) -> Dict[str, Any]:
        """Get statistics about captured clipboard content"""
        if not self.digest_log:
            return {"total_items": 0, "total_characters": 0}
        
        total_chars = sum(item["length"] for item in self.digest_log.values())
        latest_item = max(self.digest_log.values(), key=lambda x: x["timestamp"])
        
        return {
            "total_items": len(self.digest_log),
            "total_characters": total_chars,
            "average_length": total_chars // len(self.digest_log),
            "latest_timestamp": latest_item["timestamp"]
        }


# Convenience functions
def create_clipboard_digest(notion_token: Optional[str] = None, database_id: Optional[str] = None) -> ClipboardDigest:
    """Create a new ClipboardDigest instance"""
    return ClipboardDigest(notion_token, database_id)

def quick_digest() -> Dict[str, Any]:
    """Quick clipboard digest with default settings"""
    digest = ClipboardDigest()
    return digest.digest_clipboard()