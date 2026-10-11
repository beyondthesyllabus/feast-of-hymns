import os
import re
import subprocess

def main():
    print("Building Feast of Hymns website...")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Read index.html to extract window.A
    with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
        html_content = f.read()
        
    match = re.search(r'(window\.A\s*=\s*\{.+?\};)\s*</script>', html_content, re.DOTALL)
    if not match:
        raise Exception("Could not find window.A block in index.html")
    window_a_block = match.group(1)
    print(f"Extracted window.A block (length: {len(window_a_block)})")
    
    # Compile src/app.jsx with esbuild
    app_jsx = os.path.join(base_dir, "src", "app.jsx")
    app_js_out = os.path.join(base_dir, "src", "app.min.js")
    
    cmd = ["npx", "esbuild", app_jsx, "--minify", "--target=es2019", f"--outfile={app_js_out}"]
    print("Running:", " ".join(cmd))
    subprocess.run(cmd, check=True, shell=True)
    
    with open(app_js_out, "r", encoding="utf-8") as f:
        app_js_code = f.read()
    print(f"Compiled app.min.js (length: {len(app_js_code)})")
    
    # Read src/styles.css
    with open(os.path.join(base_dir, "src", "styles.css"), "r", encoding="utf-8") as f:
        css_code = f.read()
    print(f"Read src/styles.css (length: {len(css_code)})")
    
    # Assemble index.html
    new_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>I Will Be Attending | Feast of Hymns 2026</title>
  <meta name="description" content="Feast of Hymns 2026 - God's House of Refuge · House of Praise. Sunday 25th October 2026. Create and download your custom 'I Will Be Attending' flyer!">
  <meta name="theme-color" content="#030f45">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
{css_code}
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
  <script>
{window_a_block}
  </script>
  <script>
{app_js_code}
  </script>
</body>
</html>'''

    with open(os.path.join(base_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(new_html)
        
    # Clean up app.min.js
    if os.path.exists(app_js_out):
        os.remove(app_js_out)
        
    print("Successfully built index.html!")

if __name__ == "__main__":
    main()
