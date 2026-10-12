import re, base64, os, sys

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
jpg = open('tools/_gen/tpl_v2.jpg', 'rb').read()
b64 = base64.b64encode(jpg).decode('ascii')
html = open('index.html', encoding='utf-8').read()
new, n = re.subn(r'(window\.A\s*=\s*\{\s*tpl:")data:image/jpeg;base64,[^"]*(")',
                 lambda m: m.group(1) + 'data:image/jpeg;base64,' + b64 + m.group(2),
                 html, count=1, flags=re.DOTALL)
assert n == 1, 'tpl entry not found'
open('index.html', 'w', encoding='utf-8').write(new)
print('re-embedded tpl:', len(jpg), 'bytes jpeg ->', len(b64), 'b64 chars')
