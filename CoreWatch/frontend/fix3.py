content = open('app/dashboard/page.tsx', 'r', encoding='utf-8').read()
import re
content = re.sub(r'className=\{lex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 \}', 'className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300"', content)
open('app/dashboard/page.tsx', 'w', encoding='utf-8').write(content)
print('Fixed typo!')
