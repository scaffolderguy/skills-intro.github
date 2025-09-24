#!/usr/bin/env python3
"""
Basic tests for Bellhop AI without heavy dependencies
"""

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def test_imports():
    """Test that modules can be imported"""
    try:
        # Test router import (doesn't require heavy deps)
        from bellhop.bellhop_router import BellhopRouter, AgentProfile
        print("✅ BellhopRouter imports successfully")
        
        # Test that router can be created
        router = BellhopRouter()
        print("✅ BellhopRouter can be instantiated")
        
        # Test agent profile
        profile = AgentProfile(
            name="TestAgent",
            fingerprint={"test": True},
            resonance_history=[0.5, 0.7],
            trust_score=0.6
        )
        print("✅ AgentProfile works correctly")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Other error: {e}")
        return False


def test_mock_functionality():
    """Test basic functionality with mock data"""
    try:
        from bellhop.bellhop_router import BellhopRouter
        
        router = BellhopRouter()
        
        # Test webhook registration
        def test_handler(data):
            return f"Processed: {data}"
        
        router.register_webhook("test", test_handler)
        result = router.trigger_webhook("test", "hello")
        
        assert result["status"] == "success"
        assert "hello" in result["result"]
        print("✅ Webhook functionality works")
        
        # Test mesh status
        status = router.get_mesh_status()
        assert isinstance(status, dict)
        assert "active_agents" in status
        print("✅ Mesh status functionality works")
        
        return True
        
    except Exception as e:
        print(f"❌ Functionality test error: {e}")
        return False


def main():
    """Run all tests"""
    print("🧪 Running basic Bellhop AI tests...")
    print("=" * 40)
    
    success = True
    
    if not test_imports():
        success = False
    
    if not test_mock_functionality():
        success = False
    
    if success:
        print("\n🎉 All basic tests passed!")
        print("Ready for full functionality with dependencies installed.")
    else:
        print("\n❌ Some tests failed")
        sys.exit(1)


if __name__ == "__main__":
    main()