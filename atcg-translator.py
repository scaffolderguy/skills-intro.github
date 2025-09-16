#!/usr/bin/env python3
"""
ATCG Language Translator

This script translates basic programming concepts into ATCG format
without using the restricted terms: "helix bridge", "glyph part", or "lexicon"
"""

import re
import json

class ATCGTranslator:
    def __init__(self):
        # Basic mappings from common programming concepts to ATCG
        self.type_mappings = {
            'int': 'AAAA',
            'integer': 'AAAA', 
            'bool': 'TTTT',
            'boolean': 'TTTT',
            'string': 'CCCC',
            'str': 'CCCC',
            'array': 'GGGG',
            'list': 'GGGG'
        }
        
        self.operation_mappings = {
            '=': 'AT',
            '==': 'CG',
            '!=': 'GC',
            '+': 'AC',
            '-': 'TG',
            '*': 'AG',
            '/': 'CT',
            '&&': 'CCAT',
            '||': 'TTAG'
        }
        
        self.control_mappings = {
            'if': 'CAAT',
            'while': 'CGGT',
            'for': 'TGCA',
            'function': 'GCTA',
            'def': 'GCTA',
            'class': 'ATCG',
            'return': 'TGCA'
        }
        
        self.git_mappings = {
            'git init': 'GCTA repo-create',
            'git add': 'GCTA changes-track',
            'git commit': 'GCTA commit-sequence',
            'git push': 'GCTA remote-sync',
            'git pull': 'GCTA remote-fetch',
            'git branch': 'GCTA branch-grow',
            'git checkout': 'GCTA branch-switch',
            'git merge': 'GCTA branch-combine',
            'git status': 'GCTA status-check',
            'git log': 'GCTA history-view'
        }
    
    def translate_line(self, line):
        """Translate a single line of code to ATCG format"""
        line = line.strip()
        if not line or line.startswith('//') or line.startswith('#'):
            return line
        
        # Handle git commands
        for git_cmd, atcg_cmd in self.git_mappings.items():
            if line.startswith(git_cmd):
                rest = line[len(git_cmd):].strip()
                if rest:
                    return f"{atcg_cmd} AT {rest}"
                return atcg_cmd
        
        # Handle variable declarations
        for prog_type, atcg_type in self.type_mappings.items():
            pattern = rf'\b{prog_type}\s+(\w+)\s*=\s*(.+)'
            match = re.search(pattern, line)
            if match:
                var_name = match.group(1)
                value = match.group(2)
                return f"{atcg_type} {var_name} AT {value}"
        
        # Handle operations
        for op, atcg_op in self.operation_mappings.items():
            if op in line:
                line = line.replace(op, atcg_op)
        
        # Handle control structures
        for control, atcg_control in self.control_mappings.items():
            if line.startswith(control):
                rest = line[len(control):].strip()
                if rest:
                    return f"{atcg_control} {rest}"
                return atcg_control
        
        return line
    
    def translate_code_block(self, code):
        """Translate a block of code to ATCG format"""
        lines = code.split('\n')
        translated = []
        
        for line in lines:
            translated.append(self.translate_line(line))
        
        return '\n'.join(translated)
    
    def translate_github_workflow(self, yaml_content):
        """Translate GitHub Actions workflow to ATCG format"""
        # Simple translation for demonstration
        atcg_workflow = []
        lines = yaml_content.split('\n')
        
        for line in lines:
            stripped = line.strip()
            if stripped.startswith('name:'):
                name = stripped[5:].strip()
                atcg_workflow.append(f"GCTA workflow-name AT {name}")
            elif stripped.startswith('on:'):
                trigger = stripped[3:].strip()
                atcg_workflow.append(f"CAAT event AT {trigger}")
            elif stripped.startswith('runs-on:'):
                env = stripped[8:].strip()
                atcg_workflow.append(f"AAAA environment AT {env}")
            elif stripped.startswith('- uses:'):
                action = stripped[7:].strip()
                atcg_workflow.append(f"GCTA action AT {action}")
            else:
                atcg_workflow.append(line)
        
        return '\n'.join(atcg_workflow)

def main():
    """Example usage of the ATCG translator"""
    translator = ATCGTranslator()
    
    # Example code translations
    examples = [
        "int x = 5;",
        "boolean flag = true;",
        "if (x > 5) { print('hello'); }",
        "git add .",
        "git commit -m 'Initial commit'",
        "for (int i = 0; i < 10; i++)"
    ]
    
    print("ATCG Language Translation Examples:")
    print("=" * 50)
    
    for example in examples:
        translated = translator.translate_line(example)
        print(f"Original:  {example}")
        print(f"ATCG:      {translated}")
        print("-" * 30)

if __name__ == "__main__":
    main()