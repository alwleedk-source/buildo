import re
from pathlib import Path

def fix_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    original = ''.join(lines)
    new_lines = []
    skip_next = False
    
    for i, line in enumerate(lines):
        if skip_next:
            skip_next = False
            continue
            
        # Check if this line has await params outside try block
        if 'const {' in line and '} = await params;' in line and i + 1 < len(lines):
            # Check if next line is try block
            if 'try {' in lines[i + 1]:
                # Skip this line, it's a duplicate
                continue
        
        new_lines.append(line)
    
    new_content = ''.join(new_lines)
    
    if new_content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

# Find all route.ts files
api_dir = Path('/home/ubuntu/buildo-nextjs/src/app/api')
fixed = 0

for route_file in api_dir.rglob('route.ts'):
    if fix_file(route_file):
        print(f"✓ Fixed: {route_file.relative_to(api_dir.parent.parent)}")
        fixed += 1

print(f"\n✅ Fixed {fixed} files")
