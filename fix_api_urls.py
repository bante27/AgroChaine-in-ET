import re
import os

# Files to update
files_to_update = [
    r'Client\src\pages\Dashboard.jsx',
    r'Client\src\pages\Orders.jsx',
    r'Client\src\pages\ForgotPassword.jsx',
    r'Client\src\pages\Contact.jsx',
    r'Client\src\pages\About.jsx',
    r'Client\src\pages\SellerProfile.jsx',
    r'Client\src\components\PaymentModal.jsx',
    r'Client\src\components\market\ProductModal.jsx',
    r'Client\src\components\market\CheckoutModal.jsx',
    r'Client\src\components\LiveChat.jsx',
]

# Pattern to replace
old_pattern = r'\$\{import\.meta\.env\.VITE_API_URL \|\| [\'"]http://localhost:5000[\'"]\}'
new_pattern = '${API_URL}'

base_dir = r'd:\1115\Agrochain-Ethiopia'

for file_path in files_to_update:
    full_path = os.path.join(base_dir, file_path)
    
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        continue
    
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the pattern
        new_content = re.sub(old_pattern, new_pattern, content)
        
        # Check if API_URL import exists
        if 'API_URL' in new_content and "from '../utils/apiConfig'" not in new_content and "from '../../utils/apiConfig'" not in new_content:
            # Add import based on file location
            if 'components\\market\\' in file_path or 'components/market/' in file_path:
                import_line = "import { API_URL } from '../../utils/apiConfig';\n"
            else:
                import_line = "import { API_URL } from '../utils/apiConfig';\n"
            
            # Find the last import statement
            import_match = list(re.finditer(r'^import .+;$', new_content, re.MULTILINE))
            if import_match:
                last_import_end = import_match[-1].end()
                new_content = new_content[:last_import_end] + '\n' + import_line + new_content[last_import_end:]
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated: {file_path}")
    except Exception as e:
        print(f"✗ Error updating {file_path}: {e}")

print("\nDone!")
