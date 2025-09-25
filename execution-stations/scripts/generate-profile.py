#!/usr/bin/env python3
"""
Generate user profile configuration for execution stations.

This script creates personalized execution station configurations based on
cognitive profiles and user preferences. It supports multiple cognitive styles
and generates appropriate resource allocations and tool preferences.
"""
import argparse
import json
import yaml
import sys
from datetime import datetime
from typing import Dict, Any, List, Optional
from pathlib import Path

# Cognitive style profiles with resource predictions and preferences
COGNITIVE_STYLES: Dict[str, Dict[str, Any]] = {
    'visual_systemic': {
        'description': 'Visual thinkers who work with systems and architectures',
        'predicted_cpu': 1500,
        'predicted_memory': 8192,
        'requires_gpu': True,
        'storage_size': '50Gi',
        'work_patterns': {
            'focus_blocks': 90,
            'context_switching': 'low',
            'peak_hours': ['09:00', '14:00'],
            'preferred_session_length': 120
        },
        'tool_preferences': {
            'primary_tools': ['vscode', 'docker', 'git', 'figma', 'draw.io'],
            'ui_density': 'spacious',
            'theme': 'dark',
            'editor_preferences': {
                'font_size': 14,
                'line_spacing': 1.4,
                'minimap': True,
                'breadcrumbs': True
            }
        },
        'cognitive_adaptations': {
            'visual_aids': True,
            'diagram_support': True,
            'whiteboard_integration': True,
            'mind_mapping': True
        }
    },
    'linear_analytical': {
        'description': 'Sequential, logical thinkers who prefer structured approaches',
        'predicted_cpu': 800,
        'predicted_memory': 4096,
        'requires_gpu': False,
        'storage_size': '20Gi',
        'work_patterns': {
            'focus_blocks': 120,
            'context_switching': 'medium',
            'peak_hours': ['08:00', '13:00', '19:00'],
            'preferred_session_length': 180
        },
        'tool_preferences': {
            'primary_tools': ['vim', 'tmux', 'git', 'jupyter', 'terminal'],
            'ui_density': 'compact',
            'theme': 'light',
            'editor_preferences': {
                'font_size': 12,
                'line_spacing': 1.2,
                'minimap': False,
                'breadcrumbs': True
            }
        },
        'cognitive_adaptations': {
            'step_by_step_guidance': True,
            'progress_tracking': True,
            'structured_workflows': True,
            'detailed_documentation': True
        }
    },
    'collaborative_adaptive': {
        'description': 'Team-oriented, adaptable workers who thrive on interaction',
        'predicted_cpu': 1200,
        'predicted_memory': 6144,
        'requires_gpu': False,
        'storage_size': '30Gi',
        'work_patterns': {
            'focus_blocks': 60,
            'context_switching': 'high',
            'peak_hours': ['10:00', '15:00'],
            'preferred_session_length': 90
        },
        'tool_preferences': {
            'primary_tools': ['vscode', 'slack', 'git', 'notion', 'zoom', 'miro'],
            'ui_density': 'medium',
            'theme': 'auto',
            'editor_preferences': {
                'font_size': 13,
                'line_spacing': 1.3,
                'minimap': True,
                'breadcrumbs': True
            }
        },
        'cognitive_adaptations': {
            'collaboration_tools': True,
            'real_time_sharing': True,
            'notification_management': True,
            'social_coding_features': True
        }
    },
    'experimental_creative': {
        'description': 'Creative experimenters who explore new ideas and approaches',
        'predicted_cpu': 2000,
        'predicted_memory': 12288,
        'requires_gpu': True,
        'storage_size': '100Gi',
        'work_patterns': {
            'focus_blocks': 45,
            'context_switching': 'very_high',
            'peak_hours': ['11:00', '16:00', '22:00'],
            'preferred_session_length': 60
        },
        'tool_preferences': {
            'primary_tools': ['vscode', 'docker', 'git', 'blender', 'jupyter', 'unity'],
            'ui_density': 'spacious',
            'theme': 'dark',
            'editor_preferences': {
                'font_size': 15,
                'line_spacing': 1.5,
                'minimap': True,
                'breadcrumbs': False
            }
        },
        'cognitive_adaptations': {
            'rapid_prototyping': True,
            'multi_environment_support': True,
            'creative_sandbox': True,
            'inspiration_feeds': True
        }
    }
}

def validate_user_id(user_id: str) -> bool:
    """Validate user ID format."""
    if not user_id or len(user_id) < 3:
        return False
    # Only alphanumeric and hyphens allowed
    return all(c.isalnum() or c == '-' for c in user_id)

def calculate_resources(cognitive_style: str, scale_factor: float = 1.0) -> Dict[str, Any]:
    """Calculate resource requirements based on cognitive style and scale factor."""
    base = COGNITIVE_STYLES[cognitive_style]
    
    # Apply scaling
    cpu_request = int(base['predicted_cpu'] * 0.5 * scale_factor)  # 50% of predicted for requests
    cpu_limit = int(base['predicted_cpu'] * scale_factor)
    memory_request = int(base['predicted_memory'] * 0.6 * scale_factor)  # 60% for requests
    memory_limit = int(base['predicted_memory'] * scale_factor)
    
    return {
        'cpu_request': f"{cpu_request}m",
        'cpu_limit': f"{cpu_limit}m",
        'memory_request': f"{memory_request}Mi",
        'memory_limit': f"{memory_limit}Mi",
        'requires_gpu': base['requires_gpu'],
        'storage_size': base['storage_size']
    }

def generate_profile(
    user_id: str, 
    cognitive_style: str, 
    domain: str = "stations.example.com",
    scale_factor: float = 1.0,
    custom_preferences: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Generate a complete user profile for execution station."""
    
    if not validate_user_id(user_id):
        raise ValueError(f"Invalid user ID format: {user_id}")
    
    if cognitive_style not in COGNITIVE_STYLES:
        raise ValueError(f"Unknown cognitive style: {cognitive_style}. Available: {list(COGNITIVE_STYLES.keys())}")
    
    base = COGNITIVE_STYLES[cognitive_style].copy()
    resources = calculate_resources(cognitive_style, scale_factor)
    
    # Merge custom preferences if provided
    if custom_preferences:
        base = merge_preferences(base, custom_preferences)
    
    profile: Dict[str, Any] = {
        'user_id': user_id,
        'cognitive_profile': cognitive_style,
        'cognitive_style': cognitive_style,
        'description': base['description'],
        'host': f"{user_id}.{domain}",
        'created_at': datetime.utcnow().isoformat(),
        'scale_factor': scale_factor,
        
        # Resource allocation
        'resources': resources,
        
        # Original profile data
        'work_patterns': base['work_patterns'],
        'tool_preferences': base['tool_preferences'],
        'cognitive_adaptations': base['cognitive_adaptations'],
        
        # Kubernetes-specific values
        'kubernetes': {
            'namespace': f'execution-stations',
            'labels': {
                'user-id': user_id,
                'cognitive-profile': cognitive_style,
                'created-by': 'profile-generator'
            }
        }
    }
    
    return profile

def merge_preferences(base: Dict[str, Any], custom: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively merge custom preferences with base profile."""
    result = base.copy()
    
    for key, value in custom.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = merge_preferences(result[key], value)
        else:
            result[key] = value
    
    return result

def generate_kubernetes_manifests(profile: Dict[str, Any], output_dir: Path) -> List[Path]:
    """Generate Kubernetes manifests from user profile."""
    manifests = []
    user_id = profile['user_id']
    resources = profile['resources']
    
    # User configuration ConfigMap
    user_config = {
        'apiVersion': 'v1',
        'kind': 'ConfigMap',
        'metadata': {
            'name': f'user-config-{user_id}',
            'namespace': profile['kubernetes']['namespace'],
            'labels': profile['kubernetes']['labels']
        },
        'data': {
            'profile.json': json.dumps(profile, indent=2),
            'cognitive-style': profile['cognitive_style'],
            'work-patterns.json': json.dumps(profile['work_patterns'], indent=2),
            'tool-preferences.json': json.dumps(profile['tool_preferences'], indent=2)
        }
    }
    
    config_path = output_dir / f'user-config-{user_id}.yaml'
    with open(config_path, 'w') as f:
        yaml.dump(user_config, f, default_flow_style=False)
    manifests.append(config_path)
    
    # Secret template (actual secrets should be managed by Vault/External Secrets)
    secret_template = {
        'apiVersion': 'external-secrets.io/v1beta1',
        'kind': 'ExternalSecret',
        'metadata': {
            'name': f'station-secrets-{user_id}',
            'namespace': profile['kubernetes']['namespace'],
            'labels': profile['kubernetes']['labels']
        },
        'spec': {
            'secretStoreRef': {
                'name': 'vault-backend',
                'kind': 'SecretStore'
            },
            'target': {
                'name': f'station-secrets-{user_id}',
                'creationPolicy': 'Owner'
            },
            'data': [
                {
                    'secretKey': 'api_key',
                    'remoteRef': {
                        'key': f'stations/{user_id}/api',
                        'property': 'API_KEY'
                    }
                },
                {
                    'secretKey': 'ssh_private_key',
                    'remoteRef': {
                        'key': f'stations/{user_id}/ssh',
                        'property': 'PRIVATE_KEY'
                    }
                }
            ]
        }
    }
    
    secret_path = output_dir / f'station-secrets-{user_id}.yaml'
    with open(secret_path, 'w') as f:
        yaml.dump(secret_template, f, default_flow_style=False)
    manifests.append(secret_path)
    
    return manifests

def list_cognitive_styles() -> None:
    """List available cognitive styles with descriptions."""
    print("Available Cognitive Styles:")
    print("=" * 50)
    for style, config in COGNITIVE_STYLES.items():
        print(f"\n{style}:")
        print(f"  Description: {config['description']}")
        print(f"  CPU: {config['predicted_cpu']}m")
        print(f"  Memory: {config['predicted_memory']}Mi")
        print(f"  GPU Required: {config['requires_gpu']}")
        print(f"  Storage: {config['storage_size']}")
        print(f"  Focus Blocks: {config['work_patterns']['focus_blocks']} minutes")
        print(f"  Primary Tools: {', '.join(config['tool_preferences']['primary_tools'])}")

def main():
    parser = argparse.ArgumentParser(
        description='Generate user profile for execution station',
        epilog='Example: %(prog)s --user-id alice-dev --cognitive-style visual_systemic --output-format yaml'
    )
    
    parser.add_argument('--user-id', 
                       help='User identifier (alphanumeric and hyphens only)')
    parser.add_argument('--cognitive-style', 
                       choices=list(COGNITIVE_STYLES.keys()),
                       help='Cognitive style profile')
    parser.add_argument('--domain', default='stations.example.com',
                       help='Base domain for execution stations')
    parser.add_argument('--scale-factor', type=float, default=1.0,
                       help='Resource scaling factor (default: 1.0)')
    parser.add_argument('--output-format', choices=['json', 'yaml'], default='json',
                       help='Output format (default: json)')
    parser.add_argument('--output-dir', type=Path,
                       help='Generate Kubernetes manifests in specified directory')
    parser.add_argument('--list-styles', action='store_true',
                       help='List available cognitive styles and exit')
    parser.add_argument('--custom-preferences', type=Path,
                       help='JSON file with custom preferences to merge')
    
    args = parser.parse_args()
    
    if args.list_styles:
        list_cognitive_styles()
        return
    
    # Validate required arguments when not listing styles
    if not args.user_id or not args.cognitive_style:
        parser.error("--user-id and --cognitive-style are required unless using --list-styles")
    
    try:
        # Load custom preferences if provided
        custom_preferences = None
        if args.custom_preferences:
            with open(args.custom_preferences) as f:
                custom_preferences = json.load(f)
        
        # Generate profile
        profile = generate_profile(
            args.user_id, 
            args.cognitive_style, 
            args.domain,
            args.scale_factor,
            custom_preferences
        )
        
        # Output profile
        if args.output_format == 'yaml':
            print(yaml.dump(profile, default_flow_style=False))
        else:
            print(json.dumps(profile, indent=2))
        
        # Generate Kubernetes manifests if requested
        if args.output_dir:
            args.output_dir.mkdir(parents=True, exist_ok=True)
            manifests = generate_kubernetes_manifests(profile, args.output_dir)
            print(f"\nGenerated {len(manifests)} Kubernetes manifests in {args.output_dir}:", file=sys.stderr)
            for manifest in manifests:
                print(f"  - {manifest}", file=sys.stderr)
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()