lines = []
with open('app/globals.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "/* CRM Brand Colors */" in line:
        break
    new_lines.append(line)

with open('app/globals.css', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Removed CRM colors from globals.css')
