#!/usr/bin/env python3
"""
🔗 Bellhop Webhook Server Example

This demonstrates how to set up a simple HTTP server that receives webhooks
and routes them through the Bellhop AI mesh for processing.
"""

import sys
import os
import json
import asyncio
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from bellhop import BellhopRouter


class WebhookHandler(BaseHTTPRequestHandler):
    """HTTP handler for webhook requests"""
    
    def __init__(self, *args, bellhop_router=None, **kwargs):
        self.bellhop_router = bellhop_router
        super().__init__(*args, **kwargs)
    
    def do_POST(self):
        """Handle POST requests (webhooks)"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            # Parse JSON payload
            try:
                data = json.loads(post_data.decode('utf-8'))
            except json.JSONDecodeError:
                data = {"raw_data": post_data.decode('utf-8')}
            
            # Extract webhook path
            path = self.path.strip('/')
            
            print(f"📨 Received webhook: {path}")
            print(f"📄 Data: {json.dumps(data, indent=2)[:200]}...")
            
            # Route through Bellhop
            result = self.bellhop_router.trigger_webhook(path, data)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                "status": "processed",
                "webhook": path,
                "result": result
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            print(f"❌ Webhook error: {e}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            error_response = {
                "status": "error",
                "message": str(e)
            }
            
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_GET(self):
        """Handle GET requests (status checks)"""
        if self.path == '/status':
            status = self.bellhop_router.get_mesh_status()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            self.wfile.write(json.dumps(status, indent=2).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        """Suppress default logging"""
        pass


class BellhopWebhookServer:
    """Webhook server integrated with Bellhop router"""
    
    def __init__(self, router: BellhopRouter, host='localhost', port=8080):
        self.router = router
        self.host = host
        self.port = port
        self.server = None
        self.server_thread = None
        
    def create_handler(self):
        """Create handler class with router injected"""
        router = self.router
        
        class BoundWebhookHandler(WebhookHandler):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, bellhop_router=router, **kwargs)
                
        return BoundWebhookHandler
    
    def start(self):
        """Start the webhook server"""
        handler_class = self.create_handler()
        self.server = HTTPServer((self.host, self.port), handler_class)
        
        self.server_thread = threading.Thread(target=self.server.serve_forever)
        self.server_thread.daemon = True
        self.server_thread.start()
        
        print(f"🌐 Bellhop webhook server running on http://{self.host}:{self.port}")
        print(f"📡 Webhook endpoints: POST /your-webhook-name")
        print(f"📊 Status endpoint: GET /status")
    
    def stop(self):
        """Stop the webhook server"""
        if self.server:
            self.server.shutdown()
            self.server_thread.join()
            print("🛑 Webhook server stopped")


# Mock agent for demo
class MockAgent:
    def __init__(self, name, specialty):
        self.name = name
        self.specialty = specialty
        self.system_message = f"I am {name}, specialized in {specialty}"
        self.tools = [specialty.lower().replace(' ', '_')]
        self.model_client_stream = False
    
    def chat(self, message):
        return f"[{self.name}] Processing {self.specialty} task: {message[:50]}..."


def setup_demo_router():
    """Set up router with demo agents and webhooks"""
    router = BellhopRouter()
    
    # Create demo agents
    agents = [
        MockAgent("CodeBot", "software development"),
        MockAgent("DataBot", "data analysis"),
        MockAgent("CreativeBot", "creative writing"),
        MockAgent("SupportBot", "customer support")
    ]
    
    for agent in agents:
        router.register_agent(agent)
    
    # Register webhook handlers
    def handle_github_push(data):
        """Handle GitHub push webhook"""
        repo = data.get('repository', {}).get('name', 'unknown')
        commits = len(data.get('commits', []))
        
        task = f"Review {commits} new commits in {repo} repository"
        result = router.delegate_task(task)
        
        return {
            "action": "code_review_triggered",
            "repository": repo,
            "commits_count": commits,
            "assigned_agent": result.get('agent'),
            "review_status": "initiated"
        }
    
    def handle_support_ticket(data):
        """Handle support ticket webhook"""
        ticket_type = data.get('type', 'general')
        priority = data.get('priority', 'normal')
        
        task = f"Handle {priority} priority {ticket_type} support ticket"
        result = router.delegate_task(task)
        
        return {
            "action": "support_ticket_assigned",
            "ticket_type": ticket_type,
            "priority": priority,
            "assigned_agent": result.get('agent'),
            "estimated_response_time": "15 minutes"
        }
    
    def handle_data_request(data):
        """Handle data analysis request"""
        dataset = data.get('dataset', 'unknown')
        analysis_type = data.get('analysis_type', 'general')
        
        task = f"Perform {analysis_type} analysis on {dataset} dataset"
        result = router.delegate_task(task)
        
        return {
            "action": "analysis_started",
            "dataset": dataset,
            "analysis_type": analysis_type,
            "assigned_agent": result.get('agent'),
            "estimated_completion": "30 minutes"
        }
    
    def handle_content_request(data):
        """Handle content creation request"""
        content_type = data.get('type', 'article')
        topic = data.get('topic', 'general')
        
        task = f"Create {content_type} content about {topic}"
        result = router.delegate_task(task)
        
        return {
            "action": "content_creation_started",
            "content_type": content_type,
            "topic": topic,
            "assigned_agent": result.get('agent'),
            "estimated_delivery": "2 hours"
        }
    
    # Register webhooks
    router.register_webhook("github-push", handle_github_push)
    router.register_webhook("support-ticket", handle_support_ticket)
    router.register_webhook("data-request", handle_data_request)
    router.register_webhook("content-request", handle_content_request)
    
    return router


def demonstrate_webhook_server():
    """Demonstrate the webhook server"""
    print("🔗 Bellhop Webhook Server Demo")
    print("="*35)
    
    # Set up router
    router = setup_demo_router()
    print(f"✅ Router initialized with {len(router.agents)} agents")
    print(f"✅ Registered {len(router.webhook_handlers)} webhook handlers")
    
    # Start server
    server = BellhopWebhookServer(router, port=8081)
    server.start()
    
    print("\n📋 Test the webhooks with curl:")
    print("="*40)
    
    test_commands = [
        {
            "name": "GitHub Push",
            "curl": """curl -X POST http://localhost:8081/github-push \\
  -H "Content-Type: application/json" \\
  -d '{"repository":{"name":"my-app"},"commits":[{"id":"abc123"}]}'"""
        },
        {
            "name": "Support Ticket",
            "curl": """curl -X POST http://localhost:8081/support-ticket \\
  -H "Content-Type: application/json" \\
  -d '{"type":"bug_report","priority":"high","description":"App crashes on startup"}'"""
        },
        {
            "name": "Data Analysis",
            "curl": """curl -X POST http://localhost:8081/data-request \\
  -H "Content-Type: application/json" \\
  -d '{"dataset":"sales_q4","analysis_type":"trend_analysis"}'"""
        },
        {
            "name": "Status Check",
            "curl": "curl http://localhost:8081/status"
        }
    ]
    
    for cmd in test_commands:
        print(f"\n{cmd['name']}:")
        print(cmd['curl'])
    
    print(f"\n🌐 Server running at http://localhost:8081")
    print("🔄 Press Ctrl+C to stop...")
    
    try:
        # Keep server running
        while True:
            import time
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping server...")
        server.stop()


if __name__ == "__main__":
    demonstrate_webhook_server()