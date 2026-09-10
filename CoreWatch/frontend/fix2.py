lines = []
with open('app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if "export default function DashboardPage() {" in line:
        new_lines.append("import { Suspense } from 'react';\n\n")
        new_lines.append("function DashboardContent() {\n")
        continue
        
    new_lines.append(line)
    
new_lines.append("\nexport default function DashboardPage() {\n  return (\n    <Suspense fallback={<div className=\"h-screen flex items-center justify-center\">Loading Dashboard...</div>}>\n      <DashboardContent />\n    </Suspense>\n  );\n}\n")

with open('app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Suspense fix applied!')
