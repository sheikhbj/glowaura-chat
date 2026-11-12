"""Build public/widget.js from the chat section source (src/ga2-ai-chat.liquid).

The theme only loads this file, so every change to the chat window ships with a
git push. Run: python3 tools/build-widget.py
"""
import re
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent
src = (root / 'src' / 'ga2-ai-chat.liquid').read_text()

css = re.search(r'\{% stylesheet %\}(.*?)\{% endstylesheet %\}', src, re.S).group(1).strip()
markup = re.search(r'<ga2-ai-chat[^>]*>(.*?)</ga2-ai-chat>', src, re.S).group(1).strip('\n')
js = re.search(r'<script>\s*(.*?)\s*</script>', src, re.S).group(1)

for name, part in (('css', css), ('markup', markup)):
    assert '`' not in part and '${' not in part, name

# Liquid values in the markup become data attributes on the element.
values = {
    's.teaser': 'd.teaser', 's.launcher_text': 'd.launcher', 's.title': 'd.heading', 's.whatsapp': 'd.wa',
}
def sub(m):
    key = m.group(1)
    assert key in values, key
    return '${e(' + values[key] + ' || \'\')}'
markup = re.sub(r'\{\{\s*([\w.]+)\s*\|\s*escape\s*\}\}', sub, markup)
assert '{{' not in markup and '{%' not in markup, markup

head = "(() => {\n  if (customElements.get('ga2-ai-chat')) return;\n"
assert js.startswith(head), js[:80]
inject = (
    "  if (!document.getElementById('gac-style')) {\n"
    "    const st = document.createElement('style');\n"
    "    st.id = 'gac-style';\n"
    "    st.textContent = `" + css + "`;\n"
    "    document.head.appendChild(st);\n"
    "  }\n"
    "  const TEMPLATE = (d, e) => `" + markup + "`;\n"
)
js = js.replace(head, head + inject, 1)
anchor = "    connectedCallback() {\n"
assert js.count(anchor) == 1
js = js.replace(anchor, anchor + "      if (!this.querySelector('.gac-panel')) this.innerHTML = TEMPLATE(this.dataset, esc);\n", 1)

banner = '/* GlowAura AI chat widget. Built from src/ga2-ai-chat.liquid by tools/build-widget.py. Do not edit by hand. */\n'
(root / 'public' / 'widget.js').write_text(banner + js + '\n')
print('widget.js', len(js), 'bytes')
