import re
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace the chat modal styles with VN styles
# Find the start of 5. MODAL section
old_css_start = css.find('/* ============================================================\n   5. MODAL')
if old_css_start != -1:
    css = css[:old_css_start]

vn_css = """/* ============================================================
   5. MODAL: VISUAL NOVEL STYLE DOCENT
   ============================================================ */
.docent-vn-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(8, 9, 13, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.docent-vn-backdrop.active {
  opacity: 1;
  pointer-events: auto;
}

.docent-vn-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 90vh;
  max-height: 900px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
}

.btn-close-vn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-close-vn:hover {
  background: var(--accent-gold);
  color: #000;
}

/* Character Portrait */
.docent-vn-character {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 80%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
}

.docent-avatar-art {
  font-size: 15rem;
  line-height: 1;
  filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.2));
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0); }
}

/* UI Layer */
.docent-vn-ui {
  position: relative;
  z-index: 20;
  width: 100%;
  max-width: 900px;
  padding: 0 1rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vn-progress-wrap {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid var(--border-color-subtle);
  align-self: flex-start;
  margin-left: 1rem;
}

.vn-progress-wrap span {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-gold);
}

.vn-gauge-track {
  width: 100px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.vn-gauge-fill {
  height: 100%;
  width: 0%;
  background: var(--accent-gold);
  transition: width 0.5s ease;
}

/* Dialogue Box */
.vn-dialogue-box {
  position: relative;
  background: linear-gradient(135deg, rgba(22, 27, 39, 0.95), rgba(13, 17, 26, 0.95));
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2.5rem 3rem 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  min-height: 160px;
}

.vn-speaker-name {
  position: absolute;
  top: -16px;
  left: 2rem;
  background: var(--accent-gold);
  color: #000;
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.3rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
}

.vn-text-content {
  font-size: 1.2rem;
  line-height: 1.7;
  color: #fff;
  min-height: 80px;
}

/* Options */
.vn-options-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
  margin-top: -0.5rem;
  z-index: 25;
}

.btn-docent-choice {
  background: rgba(30, 37, 54, 0.95);
  border: 1px solid var(--border-color-subtle);
  color: var(--text-primary);
  font-size: 1.05rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  min-width: 300px;
  text-align: left;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.btn-docent-choice:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: var(--accent-gold);
  color: var(--accent-gold-light);
  transform: translateX(-5px);
}
"""

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css + vn_css)
print('Updated css/style.css for VN style')
