import re, base64, os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
html = open('index.html', encoding='utf-8').read()
m = re.search(r'window\.A\s*=\s*(\{.*?\});\s*</script>', html, re.DOTALL)
block = m.group(1)
os.makedirs('tools/_gen', exist_ok=True)
found = False
for mm in re.finditer(r'(\w+)\s*:\s*"data:image/(\w+);base64,([^"]+)"', block):
    key, ext, b64 = mm.group(1), mm.group(2), mm.group(3)
    data = base64.b64decode(b64)
    fn = f'tools/_gen/{key}.{ext}'
    open(fn, 'wb').write(data)
    print(fn, len(data))
    found = True
if not found:
    print('KEYS:', re.findall(r'"(\w+)"\s*:', block))
