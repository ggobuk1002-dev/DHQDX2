class ExhibitionApp {
  constructor() {
    this.currentView = 'intro';
    this.currentAnimalIndex = 0;
    this.currentDocentAnimal = null;
    this.viewer = null;
    
    // 안전한 로컬 스토리지 초기화
    this.discoveredAnimals = new Set();
    try {
      const saved = localStorage.getItem('discovered_animals');
      if (saved) {
        this.discoveredAnimals = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('LocalStorage is not available:', e);
    }
    
    this.init();
  }

  init() {
    this.initViewer();
    this.bindEvents();
    this.renderCatalog('all');
    this.updateProgress();
    this.initIntroSequence();
  }

  initViewer() {
    const canvas = document.getElementById('scrolly-canvas');
    if (canvas && typeof IncenseBurner3DViewer !== 'undefined') {
      this.viewer = new IncenseBurner3DViewer('scrolly-canvas', (percent, isLoaded, isError) => {
        const loadingBar = document.getElementById('global-loader-bar');
        const loadingText = document.getElementById('global-loader-text');
        if (loadingBar) loadingBar.style.width = percent + '%';
        
        if (loadingText) {
          if (isError) {
            loadingText.innerText = '3D 렌더링 준비 완료 (대체 모드)';
          } else {
            loadingText.innerText = isLoaded ? '전시 준비 완료' : '3D 유물 데이터 로딩 중... ' + percent + '%';
          }
        }
        
        if (isLoaded || isError) {
          setTimeout(() => {
            const loader = document.getElementById('global-loader');
            if (loader) loader.style.opacity = '0';
            setTimeout(() => { if (loader) loader.style.display = 'none'; }, 500);
          }, 400);
        }
      });
    } else {
      // 뷰어가 없는 경우 (에러 폴백) 로더 즉시 제거
      const loader = document.getElementById('global-loader');
      if (loader) loader.style.display = 'none';
    }
  }

  bindEvents() {
    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // 중복 클릭 시 부모 요소로의 이벤트 전파 등 해결을 위해 currentTarget 사용
        let targetView = e.currentTarget.getAttribute('data-nav');
        if (!targetView) {
           targetView = e.target.closest('[data-nav]')?.getAttribute('data-nav');
        }
        if (targetView) this.switchView(targetView);
      });
    });

    const btnStart = document.getElementById('btn-start-exhibition');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        this.switchView('main');
      });
    }

    const btnSkip = document.getElementById('btn-intro-skip');
    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        this.finishIntroVideo();
      });
    }

    document.querySelectorAll('.tab-btn').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const cat = e.currentTarget.getAttribute('data-category');
        this.renderCatalog(cat);
      });
    });

    this.initScrollyObserver();

    const btnCloseDocent = document.getElementById('btn-close-docent');
    if (btnCloseDocent) {
      btnCloseDocent.addEventListener('click', () => this.closeDocent());
    }

    const btnDocentCall = document.getElementById('btn-docent-call');
    if (btnDocentCall) {
      btnDocentCall.addEventListener('click', () => {
        const animal = EXHIBITION_DATA.animals[this.currentAnimalIndex] || EXHIBITION_DATA.animals[0];
        this.openDocent(animal.code);
      });
    }

    const btnPrev = document.getElementById('btn-detail-prev');
    const btnNext = document.getElementById('btn-detail-next');
    if (btnPrev) btnPrev.addEventListener('click', () => this.navigateDetail(-1));
    if (btnNext) btnNext.addEventListener('click', () => this.navigateDetail(1));

    const btnToggleView = document.getElementById('btn-toggle-stage-view');
    if (btnToggleView) {
      btnToggleView.addEventListener('click', () => this.toggleDetailStageView());
    }

    const btnAddComment = document.getElementById('btn-submit-comment');
    if (btnAddComment) {
      btnAddComment.addEventListener('click', () => this.addComment());
    }
  }

  switchView(viewName, animalCode = null) {
    this.currentView = viewName;

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-nav') === viewName);
    });

    const targetSection = document.getElementById('view-' + viewName);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (targetSection) targetSection.scrollTop = 0;

    if (this.viewer) {
      if (viewName === 'intro') {
        this.viewer.setIntroMode(true);
      } else if (viewName === 'main') {
        this.viewer.setIntroMode(false);
        const firstLayer = EXHIBITION_DATA.layers[0];
        this.viewer.setLayerCamera(firstLayer.cameraPos, firstLayer.target);
      } else if (viewName === 'catalog') {
        this.viewer.setIntroMode(true);
      } else if (viewName === 'detail') {
        const animal = animalCode ? EXHIBITION_DATA.animals.find(a => a.code === animalCode) : EXHIBITION_DATA.animals[this.currentAnimalIndex];
        if (animal) {
          this.viewer.setDetailInteractive(true, animal.part);
        }
      }
    }

    if (viewName === 'detail' && animalCode) {
      this.renderDetail(animalCode);
    }
  }

  initIntroSequence() {
    const video = document.getElementById('intro-video');
    if (!video) return;

    video.muted = true;
    
    // 비디오 소스가 깨졌거나 없을 때 대비
    video.addEventListener('error', () => {
       console.warn('Video failed to load.');
       // 즉시 오프닝 종료 효과 적용
       setTimeout(() => this.finishIntroVideo(), 1000);
    });

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.log('Video autoplay blocked or failed:', e);
        // 에러나면 오프닝 건너뛰기가 가능하도록 대기
      });
    }

    video.addEventListener('ended', () => {
      this.finishIntroVideo();
    });
  }

  finishIntroVideo() {
    const video = document.getElementById('intro-video');
    const blackout = document.getElementById('intro-blackout');
    const stage3d = document.getElementById('intro-3d-stage');
    const uiOverlay = document.getElementById('intro-ui-overlay');

    if (video) video.classList.add('converging');

    setTimeout(() => {
      if (blackout) blackout.classList.add('active');
    }, 800);

    setTimeout(() => {
      if (stage3d) stage3d.classList.add('visible');
      if (uiOverlay) uiOverlay.classList.add('visible');
      if (this.viewer) this.viewer.setIntroMode(true);
    }, 1800);
  }

  initScrollyObserver() {
    const steps = document.querySelectorAll('.scrolly-step');
    if (!steps.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          steps.forEach(s => s.classList.remove('is-active'));
          entry.target.classList.add('is-active');

          const stepId = entry.target.getAttribute('data-step-id');
          const layerData = EXHIBITION_DATA.layers.find(l => l.id === stepId);
          if (layerData && this.viewer && this.currentView === 'main') {
            this.viewer.setLayerCamera(layerData.cameraPos, layerData.target);
          }
        }
      });
    }, {
      threshold: 0.55
    });

    steps.forEach(step => observer.observe(step));
  }

  renderCatalog(category = 'all') {
    const grid = document.getElementById('animal-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = category === 'all' 
      ? EXHIBITION_DATA.animals 
      : EXHIBITION_DATA.animals.filter(a => a.category === category);

    filtered.forEach(animal => {
      const isDiscovered = this.discoveredAnimals.has(animal.code);
      const card = document.createElement('div');
      card.className = 'animal-card ' + (isDiscovered ? 'is-discovered' : 'is-silhouette');
      card.setAttribute('data-code', animal.code);

      card.innerHTML = `
        <div class="card-thumb-wrap">
          <img src="${animal.panelImg}" alt="${animal.name}" class="card-thumb" onerror="this.src='Asset/Final.png'">
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span>${animal.code} · ${animal.part}</span>
            <span>${isDiscovered ? '발견 완료 ★' : '미확인'}</span>
          </div>
          <h3 class="card-title">${animal.name}</h3>
          <p class="card-desc">${isDiscovered ? animal.descSimple : '실루엣을 터치하여 숨겨진 백제의 상징과 자연사를 발견하세요.'}</p>
          <div class="card-footer">
            <span>상세 탐색하기</span>
            <span>→</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        this.switchView('detail', animal.code);
      });

      grid.appendChild(card);
    });
  }

  updateProgress() {
    const total = EXHIBITION_DATA.animals.length;
    const count = this.discoveredAnimals.size;
    const percent = Math.round((count / total) * 100);

    const bar = document.getElementById('discovery-progress-bar');
    const label = document.getElementById('discovery-progress-label');
    if (bar) bar.style.width = percent + '%';
    if (label) label.innerText = `${count} / ${total} 개 상징 발견 (${percent}%)`;
  }

  markDiscovered(animalCode) {
    this.discoveredAnimals.add(animalCode);
    try {
      localStorage.setItem('discovered_animals', JSON.stringify([...this.discoveredAnimals]));
    } catch(e) {}
    this.updateProgress();
    const activeTab = document.querySelector('.tab-btn.active');
    this.renderCatalog(activeTab ? activeTab.getAttribute('data-category') : 'all');
  }

  renderDetail(animalCode) {
    const index = EXHIBITION_DATA.animals.findIndex(a => a.code === animalCode);
    if (index === -1) return;

    this.currentAnimalIndex = index;
    const animal = EXHIBITION_DATA.animals[index];

    document.getElementById('detail-code-tag').innerText = `NO. ${animal.code} · ${animal.part}`;
    document.getElementById('detail-indicator').innerText = `${String(index + 1).padStart(2, '0')} / ${String(EXHIBITION_DATA.animals.length).padStart(2, '0')}`;
    document.getElementById('detail-title').innerText = animal.name;
    document.getElementById('detail-simple-desc').innerText = animal.descSimple;

    const featList = document.getElementById('detail-features-list');
    if (featList) {
      featList.innerHTML = animal.features.map(f => `<li>${f}</li>`).join('');
    }

    document.getElementById('detail-culture-text').innerText = animal.cultureStory;
    document.getElementById('detail-science-text').innerText = animal.scienceStory;
    document.getElementById('detail-relic-text').innerText = animal.relicStory;
    document.getElementById('detail-source-credit').innerText = `출처 및 참고: ${animal.source}`;

    const imgFallback = document.getElementById('detail-panel-image');
    if (imgFallback) {
      imgFallback.src = animal.panelImg;
      imgFallback.onerror = () => { imgFallback.src = 'Asset/Final.png'; };
    }

    this.renderQuiz(animal);
    this.renderComments(animal.code);

    const btnPrev = document.getElementById('btn-detail-prev');
    const btnNext = document.getElementById('btn-detail-next');
    if (btnPrev) btnPrev.style.visibility = index === 0 ? 'hidden' : 'visible';
    if (btnNext) btnNext.style.visibility = index === EXHIBITION_DATA.animals.length - 1 ? 'hidden' : 'visible';
  }

  toggleDetailStageView() {
    const canvas = document.getElementById('scrolly-canvas');
    const img = document.getElementById('detail-panel-image');
    const btn = document.getElementById('btn-toggle-stage-view');

    if (img.style.display === 'block') {
      img.style.display = 'none';
      if (btn) btn.innerText = '🖼️ 2D 패널 보기';
    } else {
      img.style.display = 'block';
      if (btn) btn.innerText = '🏛️ 3D 향로 보기';
    }
  }

  navigateDetail(direction) {
    const nextIndex = this.currentAnimalIndex + direction;
    if (nextIndex >= 0 && nextIndex < EXHIBITION_DATA.animals.length) {
      const nextAnimal = EXHIBITION_DATA.animals[nextIndex];
      this.switchView('detail', nextAnimal.code);
    }
  }

  renderQuiz(animal) {
    const quiz = animal.quiz;
    const qBox = document.getElementById('detail-quiz-box');
    if (!qBox) return;

    qBox.innerHTML = `
      <span class="quiz-badge">참여형 OX 탐구 퀴즈</span>
      <h3 class="quiz-question">Q. ${quiz.question}</h3>
      <div class="quiz-actions">
        <button class="btn-quiz-opt" data-choice="O">O (그렇다)</button>
        <button class="btn-quiz-opt" data-choice="X">X (아니다)</button>
      </div>
      <div class="quiz-result-panel" id="quiz-result-panel">
        <h4 class="quiz-result-title" id="quiz-result-title"></h4>
        <p class="quiz-result-exp" id="quiz-result-exp"></p>
      </div>
    `;

    qBox.querySelectorAll('.btn-quiz-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const choice = e.currentTarget.getAttribute('data-choice');
        const isCorrect = choice === quiz.answer;
        const resultPanel = document.getElementById('quiz-result-panel');
        const resultTitle = document.getElementById('quiz-result-title');
        const resultExp = document.getElementById('quiz-result-exp');

        resultPanel.style.display = 'block';
        if (isCorrect) {
          resultTitle.innerHTML = '🎉 향로 속 동물을 완벽히 발견했어요!';
          resultTitle.style.color = 'var(--accent-gold-light)';
          this.markDiscovered(animal.code);
        } else {
          resultTitle.innerHTML = '💡 다시 관찰해 볼까요? 단서를 확인하세요!';
          resultTitle.style.color = '#ef4444';
        }
        resultExp.innerHTML = `<strong>정답: ${quiz.answer}</strong><br>${quiz.explanation}`;
      });
    });
  }

  renderComments(animalCode) {
    const list = document.getElementById('comment-list');
    if (!list) return;

    let allComments = {};
    try {
      allComments = JSON.parse(localStorage.getItem('exhibition_comments') || '{}');
    } catch(e) {}
    
    const comments = allComments[animalCode] || [
      { text: '백제 장인의 정교한 표현력에 감탄했습니다!', time: '2026.08.20' },
      { text: '자연과학적인 관점에서 동물 진화를 함께 보니 정말 새롭네요.', time: '2026.08.20' }
    ];

    list.innerHTML = comments.map(c => `
      <div class="comment-item">
        <span>${c.text}</span>
        <small style="color: #64748b;">${c.time}</small>
      </div>
    `).join('');
  }

  addComment() {
    const input = document.getElementById('comment-input');
    if (!input || !input.value.trim()) return;

    const animal = EXHIBITION_DATA.animals[this.currentAnimalIndex];
    
    let allComments = {};
    try {
      allComments = JSON.parse(localStorage.getItem('exhibition_comments') || '{}');
    } catch(e) {}
    
    if (!allComments[animal.code]) allComments[animal.code] = [];

    const now = new Date();
    const timeStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
    
    allComments[animal.code].unshift({ text: input.value.trim(), time: timeStr });
    try {
      localStorage.setItem('exhibition_comments', JSON.stringify(allComments));
    } catch(e) {}

    input.value = '';
    this.renderComments(animal.code);
  }

  openDocent(animalCode) {
    const animal = EXHIBITION_DATA.animals.find(a => a.code === animalCode) || EXHIBITION_DATA.animals[0];
    this.currentDocentAnimal = animal;

    const modal = document.getElementById('docent-modal');
    if (modal) modal.classList.add('active');

    document.getElementById('docent-sub-title').innerText = `${animal.name} 심층 1:1 해설`;
    const chatBody = document.getElementById('docent-chat-body');
    if (chatBody) chatBody.innerHTML = '';

    this.renderDocentBranch('root', animal.docentTree);
  }

  closeDocent() {
    const modal = document.getElementById('docent-modal');
    if (modal) modal.classList.remove('active');
  }

  renderDocentBranch(branchKey, docentTree) {
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
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new ExhibitionApp();
});
