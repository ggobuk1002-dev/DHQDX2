/**
 * 금동대향로 가상웹전시 메인 애플리케이션 로직 (app.js)
 */

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
            loadingText.innerText = '전시 준비 완료 (2D 패널 모드)';
          } else {
            loadingText.innerText = isLoaded ? '전시 준비 완료' : '금동대향로 유물 로딩 중... ' + percent + '%';
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
      const loader = document.getElementById('global-loader');
      if (loader) loader.style.display = 'none';
    }
  }

  bindEvents() {
    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
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

    const btnAddComment = document.getElementById('btn-submit-comment');
    if (btnAddComment) {
      btnAddComment.addEventListener('click', () => this.addComment());
    }
  }

  /* ============================================================
     뷰 전환 시스템 (3D 캔버스 표시 영역 제어 포함)
     ============================================================ */
  switchView(viewName, animalCode = null) {
    this.currentView = viewName;

    // 모든 뷰 숨기기
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // 헤더 네비게이션 활성화
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-nav') === viewName);
    });

    const targetSection = document.getElementById('view-' + viewName);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.scrollTop = 0;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const canvasContainer = document.getElementById('scrolly-canvas-container');

    // 뷰별 3D 캔버스 노출 여부 및 카메라 모드 제어
    if (viewName === 'intro') {
      if (canvasContainer) canvasContainer.classList.remove('hidden');
      if (this.viewer) this.viewer.setIntroMode(true);
    } else if (viewName === 'main') {
      if (canvasContainer) canvasContainer.classList.remove('hidden');
      if (this.viewer) {
        this.viewer.setIntroMode(false);
        const firstLayer = EXHIBITION_DATA.layers[0];
        this.viewer.setLayerCamera(firstLayer.cameraPos, firstLayer.target);
      }
    } else if (viewName === 'catalog') {
      // 상징도감 화면에서는 3D 모델이 카드를 가리지 않도록 캔버스를 숨김
      if (canvasContainer) canvasContainer.classList.add('hidden');
    } else if (viewName === 'detail') {
      // 상세 화면에서도 2D 패널 및 정보에 집중하도록 배경 캔버스 숨김
      if (canvasContainer) canvasContainer.classList.add('hidden');
      if (animalCode) {
        this.renderDetail(animalCode);
      }
    }
  }

  /* ============================================================
     1. 인트로 시퀀스 (영상 -> 수렴 -> 암전 -> 3D 림라이트 자전)
     ============================================================ */
  initIntroSequence() {
    const video = document.getElementById('intro-video');
    if (!video) return;

    video.muted = true;
    
    video.addEventListener('error', () => {
       console.warn('Video load error or missing, fallback to 3D intro.');
       setTimeout(() => this.finishIntroVideo(), 1000);
    });

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.log('Video autoplay blocked:', e);
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

  /* ============================================================
     2. 메인 스크롤텔링 관찰자
     ============================================================ */
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

  /* ============================================================
     3. 상징 도감 목록 렌더링
     ============================================================ */
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

  /* ============================================================
     4. 상세 화면 렌더링 & OX 퀴즈 / 댓글
     ============================================================ */
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

  /* ============================================================
     5. 비주얼 노벨 과학해설사 모달 인터랙션
     ============================================================ */
  openDocent(animalCode) {
    const animal = EXHIBITION_DATA.animals.find(a => a.code === animalCode) || EXHIBITION_DATA.animals[0];
    this.currentDocentAnimal = animal;

    const modal = document.getElementById('docent-modal');
    if (modal) modal.classList.add('active');

    document.getElementById('docent-sub-title').innerText = `국립박물관 과학해설사 · [${animal.name}]`;
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

    chatBody.innerHTML = '';
    optionsFooter.innerHTML = '';
    optionsFooter.style.display = 'none';

    let i = 0;
    const text = branch.text;
    const speed = 20;

    const typeWriter = () => {
      if (i < text.length) {
        chatBody.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
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

    typeWriter();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new ExhibitionApp();
});
