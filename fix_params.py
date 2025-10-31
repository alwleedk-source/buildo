import re
from pathlib import Path

def fix_params_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Find lines like: const { id } = params;
    # Replace with: const { id } = await params;
    pattern = r'(\s+)(const \{ [^}]+ \} = )(params;)'
    
    def replacer(match):
        indent = match.group(1)
        const_part = match.group(2)
        params_part = match.group(3)
        return f"{indent}{const_part}await {params_part}"
    
    content = re.sub(pattern, replacer, content)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

files_to_fix = [
    'src/app/api/services/[slug]/route.ts',
    'src/app/api/projects/[id]/route.ts',
    'src/app/api/blog/[slug]/route.ts',
    'src/app/api/team/department/[department]/route.ts',
    'src/app/api/admin/content-backups/type/[contentType]/route.ts',
    'src/app/api/company-initiatives/[id]/route.ts',
    'src/app/api/comments/[articleId]/route.ts',
    'src/app/api/legal-pages/[slug]/route.ts',
    'src/app/api/site-setting/[key]/route.ts',
]

base_path = Path('/home/ubuntu/buildo-nextjs')
fixed = 0

for file_rel in files_to_fix:
    file_path = base_path / file_rel
    if file_path.exists():
        if fix_params_in_file(file_path):
            print(f"✓ Fixed: {file_rel}")
            fixed += 1

print(f"\n✅ Fixed {fixed} files")
