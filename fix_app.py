import re
with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_render = r'  renderDocentBranch\(branchKey, docentTree\) \{.*?  \}\n\}'

new_render = """  renderDocentBranch(branchKey, docentTree) {
    const branch = docentTree.branches[branchKey] || docentTree.branches['root'];
    const chatBody = document.getElementById('docent-chat-body');
    const optionsFooter = document.getElementById('docent-options-footer');
    const stepLabel = document.getElementById('docent-step-label');
    const gaugeFill = document.getElementById('docent-gauge-fill');

    const step = branch.step || 1;
    const maxSteps = 3;
    const percent = Math.round((step / maxSteps) * 100);
    if (stepLabel) stepLabel.innerText = `탐구 단계 ${step} / ${maxSteps}`;
    if (gaugeFill) gaugeFill.style.width = percent + '%';

    // Clear previous text and options
    chatBody.innerHTML = '';
    optionsFooter.innerHTML = '';
    optionsFooter.style.display = 'none'; // Hide options while typing

    let i = 0;
    const text = branch.text;
    const speed = 25; // Typewriter speed (ms)

    const typeWriter = () => {
      if (i < text.length) {
        chatBody.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
        // Show options after typing finishes
        renderOptions();
      }
    };

    const renderOptions = () => {
      optionsFooter.style.display = 'flex';
      const opts = branch.options && branch.options.length ? branch.options : docentTree.options;
      opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-docent-choice';
        btn.innerHTML = `<span>▶ ${opt.label}</span>`;
        btn.addEventListener('click', () => {
          this.renderDocentBranch(opt.next, docentTree);
        });
        optionsFooter.appendChild(btn);
      });
    };

    // Start typing effect
    typeWriter();
  }
}"""

js = re.sub(old_render, new_render, js, flags=re.DOTALL)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Updated js/app.js for VN style')
