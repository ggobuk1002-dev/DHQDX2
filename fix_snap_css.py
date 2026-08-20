import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add snap scrolling to view-main
snap_css = """
#view-main {
  position: relative;
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

#view-main .scrolly-step,
#view-main .scrolly-footer-cta {
  height: 100vh;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}

/* Hide scrollbar for cleaner look in snap mode */
#view-main::-webkit-scrollbar {
  display: none;
}
#view-main {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
"""

css = css.replace('#view-main {\n  position: relative;\n  padding-top: var(--header-height);\n}', snap_css)

# Also ensure .scrolly-step min-height is reset
css = css.replace('min-height: 100vh;', 'min-height: 100vh; /* fallback */')

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print('Applied scroll snap to CSS')
