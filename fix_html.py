import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_modal = r'<!-- ============================================================\s*5\. MODAL: DOCENT \(SCIENCE EDUCATOR\) CHAT\s*============================================================ -->.*?</div>\s*</div>'

new_modal = """<!-- ============================================================
       5. MODAL: DOCENT (VISUAL NOVEL STYLE)
       ============================================================ -->
  <div id="docent-modal" class="docent-vn-backdrop">
    <div class="docent-vn-container">
      
      <!-- Close Button -->
      <button id="btn-close-docent" class="btn-close-vn">✕ 전시로 돌아가기</button>

      <!-- Character Portrait Layer -->
      <div class="docent-vn-character">
        <div class="docent-avatar-art">👨‍🏫</div>
      </div>

      <!-- Dialogue UI Layer -->
      <div class="docent-vn-ui">
        
        <!-- Progress Gauge -->
        <div class="vn-progress-wrap">
          <span id="docent-step-label">탐구 단계 1 / 3</span>
          <div class="vn-gauge-track">
            <div id="docent-gauge-fill" class="vn-gauge-fill"></div>
          </div>
        </div>

        <!-- Dialogue Box -->
        <div class="vn-dialogue-box">
          <div class="vn-speaker-name" id="docent-sub-title">국립박물관 과학해설사</div>
          <div class="vn-text-content" id="docent-chat-body">
            <!-- Text injected via JS with typewriter effect -->
          </div>
        </div>

        <!-- Choices -->
        <div class="vn-options-container" id="docent-options-footer">
          <!-- Buttons generated dynamically -->
        </div>

      </div>
    </div>
  </div>"""

html = re.sub(old_modal, new_modal, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Updated index.html for VN style')
