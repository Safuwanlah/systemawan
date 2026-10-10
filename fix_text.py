import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all classNames
    def replacer(match):
        class_str = match.group(1)
        
        # Don't replace if it's a solid colored background that needs white text
        solid_bgs = ['bg-[#E53935]', 'bg-[#EF4444]', 'bg-[#22C55E]', 'bg-[#3867FF]', 'bg-primary', 'bg-indigo-600', 'bg-[#DC2626]', 'bg-indigo-500']
        if any(bg in class_str for bg in solid_bgs):
            return f'className="{class_str}"'
            
        # Replace text-white with text-foreground
        new_class_str = re.sub(r'\btext-white\b', 'text-foreground', class_str)
        # Replace hover:text-white with hover:text-foreground
        new_class_str = re.sub(r'\bhover:text-white\b', 'hover:text-foreground', new_class_str)
        
        return f'className="{new_class_str}"'

    new_content = re.sub(r'className="([^"]+)"', replacer, content)
    
    # Also handle template literals className={`...`}
    def replacer_template(match):
        class_str = match.group(1)
        solid_bgs = ['bg-[#E53935]', 'bg-[#EF4444]', 'bg-[#22C55E]', 'bg-[#3867FF]', 'bg-primary', 'bg-indigo-600', 'bg-[#DC2626]', 'bg-indigo-500']
        if any(bg in class_str for bg in solid_bgs):
            return f'className={{`{class_str}`}}'
            
        new_class_str = re.sub(r'\btext-white\b', 'text-foreground', class_str)
        new_class_str = re.sub(r'\bhover:text-white\b', 'hover:text-foreground', new_class_str)
        return f'className={{`{new_class_str}`}}'

    new_content = re.sub(r'className=\{`([^`]+)`\}', replacer_template, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def walk_dir(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    walk_dir("src/app/(dashboard)")
    walk_dir("src/components")
