import os
import re
from pathlib import Path

def fix_route_file(file_path):
    """Fix API route file to use Promise<{ params }> for Next.js 15"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern 1: Fix function signatures with params
    # Match: function_name(request, { params }: { params: { id: string } })
    # Replace with: function_name(request, { params }: { params: Promise<{ id: string }> })
    
    # First, find all dynamic param patterns
    param_pattern = r'(\{ params \}: \{ params: )(\{[^}]+\})( \})'
    content = re.sub(param_pattern, r'\1Promise<\2>\3', content)
    
    # Pattern 2: Add await params at the start of each handler function
    # Find all HTTP method handlers
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    
    for method in methods:
        # Find the method handler
        method_pattern = rf'export async function {method}\([^)]+\{{ params \}}[^)]*\)\s*\{{'
        matches = list(re.finditer(method_pattern, content))
        
        for match in reversed(matches):  # Process in reverse to maintain positions
            # Extract parameter names from the signature
            sig_text = match.group(0)
            
            # Find what parameters are being destructured
            params_match = re.search(r'\{ params \}: \{ params: Promise<\{([^}]+)\}>', sig_text)
            if params_match:
                params_content = params_match.group(1).strip()
                # Extract parameter names
                param_names = [p.split(':')[0].strip() for p in params_content.split(',')]
                
                # Find the opening brace position
                brace_pos = match.end()
                
                # Check if await params already exists
                next_lines = content[brace_pos:brace_pos+200]
                if 'await params' not in next_lines:
                    # Add the await params line
                    param_destructure = ', '.join(param_names)
                    await_line = f"\n    const {{ {param_destructure} }} = await params;"
                    
                    # Insert after the opening brace
                    content = content[:brace_pos] + await_line + content[brace_pos:]
    
    # Only write if content changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    api_dir = Path('/home/ubuntu/buildo-nextjs/src/app/api')
    fixed_count = 0
    
    for route_file in api_dir.rglob('route.ts'):
        if fix_route_file(route_file):
            fixed_count += 1
            print(f"✓ Fixed: {route_file.relative_to(api_dir.parent.parent)}")
    
    print(f"\n✅ Fixed {fixed_count} API route files")

if __name__ == '__main__':
    main()
