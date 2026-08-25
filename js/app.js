/**
 * 금동대향로 가상웹전시 메인 애플리케이션 로직 (app.js)
 * Source of Truth: MD문서 (main.md, con_Mapping.md, docent.md, dialogue.md, references.md)
 */

class ExhibitionApp {
  constructor() {
    this.currentView = 'intro';
    this.currentAnimalIndex = 0;
    this.currentCategory = 'all';
    this.catalogMode = 'cards'; // 'cards' | 'unwrapped'
    
    // 과학해설사 (Docent) 엔진 상태
    this.docentState = {
      animalCode: '01',
      currentQueue: [],
      queueIndex: 0,
      isTyping: false,
      typewriterTimer: null,
      fullText: '',
      mode: 'INTRO' // 'INTRO' | 'CHOICE' | 'QUESTION' | 'RETURN'
    };
    
    this.viewer = null;
    
    // 로컬 스토리지에서 발견된 상징 복원 (공통 상태 관리)
    this.discoveredAnimals = new Set();
    try {
      const saved = localStorage.getItem('discovered_animals_v2');
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
    this.renderUnwrappedMap();
    this.updateProgress();
    this.initIntroSequence();
  }

  /* ============================================================
     1. 3D 메인 뷰어 초기화
     ============================================================ */
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

  /* ============================================================
     2. 이벤트 바인딩
     ============================================================ */
  bindEvents() {
    // 네비게이션 버튼
    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        let targetView = e.currentTarget.getAttribute('data-nav');
        if (!targetView) {
           targetView = e.target.closest('[data-nav]')?.getAttribute('data-nav');
        }
        if (targetView === 'unwrapped') {
          this.switchView('catalog');
          this.setCatalogMode('unwrapped');
        } else {
          if (targetView === 'catalog') {
            this.setCatalogMode('cards');
          }
          if (targetView) this.switchView(targetView);
        }
      });
    });

    // 인트로 시작 버튼
    const btnStart = document.getElementById('btn-start-exhibition');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        this.switchView('main');
      });
    }

    // 인트로 스킵 버튼
    const btnSkip = document.getElementById('btn-intro-skip');
    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        this.finishIntroVideo();
      });
    }

    // 도감 모드 전환 탭 (카드형 vs 전개도형)
    const btnModeCards = document.getElementById('tab-mode-cards');
    const btnModeUnwrapped = document.getElementById('tab-mode-unwrapped');
    if (btnModeCards) {
      btnModeCards.addEventListener('click', () => this.setCatalogMode('cards'));
    }
    if (btnModeUnwrapped) {
      btnModeUnwrapped.addEventListener('click', () => this.setCatalogMode('unwrapped'));
    }

    // 카테고리 필터 탭
    document.querySelectorAll('.catalog-tabs .tab-btn').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.catalog-tabs .tab-btn').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const cat = e.currentTarget.getAttribute('data-category');
        this.renderCatalog(cat);
      });
    });

    // 스크롤리텔링 옵저버
    this.initScrollyObserver();

    // 도슨트 호출 버튼
    const btnDocentCall = document.getElementById('btn-docent-call');
    if (btnDocentCall) {
      btnDocentCall.addEventListener('click', () => {
        const animal = EXHIBITION_DATA.animals[this.currentAnimalIndex] || EXHIBITION_DATA.animals[0];
        this.openDocent(animal.code);
      });
    }

    // 상세 화면 내 도슨트 호출 버튼
    const btnDetailDocent = document.getElementById('btn-detail-docent-direct');
    if (btnDetailDocent) {
      btnDetailDocent.addEventListener('click', () => {
        const animal = EXHIBITION_DATA.animals[this.currentAnimalIndex] || EXHIBITION_DATA.animals[0];
        this.openDocent(animal.code);
      });
    }

    // 도슨트 닫기 버튼
    const btnCloseDocent = document.getElementById('btn-close-docent');
    if (btnCloseDocent) {
      btnCloseDocent.addEventListener('click', () => this.closeDocent());
    }

    // 도슨트 대화창 클릭 진행
    const dialogueBox = document.getElementById('docent-dialogue-box');
    if (dialogueBox) {
      dialogueBox.addEventListener('click', () => this.handleDocentClick());
    }

    // 상세 화면 이전/다음 네비게이션
    const btnPrev = document.getElementById('btn-detail-prev');
    const btnNext = document.getElementById('btn-detail-next');
    if (btnPrev) btnPrev.addEventListener('click', () => this.navigateDetail(-1));
    if (btnNext) btnNext.addEventListener('click', () => this.navigateDetail(1));

    // 최종 헌정 엠블럼 모달
    const btnViewFinal = document.getElementById('btn-view-final-emblem');
    const btnCloseFinal = document.getElementById('btn-close-final-modal');
    const finalModal = document.getElementById('final-modal');
    if (btnViewFinal && finalModal) {
      btnViewFinal.addEventListener('click', () => {
        finalModal.style.display = 'flex';
      });
    }
    if (btnCloseFinal && finalModal) {
      btnCloseFinal.addEventListener('click', () => {
        finalModal.style.display = 'none';
      });
    }
  }

  /* ============================================================
     3. 뷰 전환 시스템
     ============================================================ */
  switchView(viewName, animalCode = null) {
    this.currentView = viewName;

    // 모든 뷰 숨기기
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // 헤더 네비게이션 상태
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const nav = btn.getAttribute('data-nav');
      btn.classList.toggle('active', nav === viewName || (viewName === 'catalog' && nav === this.catalogMode));
    });

    const targetSection = document.getElementById('view-' + viewName);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.scrollTop = 0;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const canvasContainer = document.getElementById('scrolly-canvas-container');

    if (viewName === 'intro') {
      if (canvasContainer) {
        canvasContainer.style.display = 'block';
        canvasContainer.style.opacity = '1';
      }
      if (this.viewer) this.viewer.setCinematicIntro(true);
    } else if (viewName === 'main') {
      if (canvasContainer) {
        canvasContainer.style.display = 'block';
        canvasContainer.style.opacity = '1';
      }
      if (this.viewer) {
        this.viewer.setCinematicIntro(false);
        this.viewer.focusStep('intro');
      }
    } else if (viewName === 'catalog') {
      if (canvasContainer) canvasContainer.style.opacity = '0';
      this.renderCatalog(this.currentCategory);
      this.renderUnwrappedMap();
    } else if (viewName === 'detail') {
      if (canvasContainer) canvasContainer.style.opacity = '0';
      if (animalCode) {
        this.renderDetail(animalCode);
      }
    }
  }

  setCatalogMode(mode) {
    this.catalogMode = mode;
    const btnCards = document.getElementById('tab-mode-cards');
    const btnUnwrapped = document.getElementById('tab-mode-unwrapped');
    const grid = document.getElementById('animal-grid');
    const unwrappedContainer = document.getElementById('unwrapped-map-container');
    const catTabs = document.getElementById('catalog-category-tabs');
    const title = document.getElementById('discovery-title');
    const desc = document.getElementById('discovery-desc');

    if (mode === 'cards') {
      if (btnCards) btnCards.classList.add('active');
      if (btnUnwrapped) btnUnwrapped.classList.remove('active');
      if (grid) grid.style.display = 'grid';
      if (unwrappedContainer) unwrappedContainer.style.display = 'none';
      if (catTabs) catTabs.style.display = 'flex';
      if (title) title.innerText = '향로의 그림자: 19종 상징 도감';
      if (desc) desc.innerText = '검은 실루엣 속 동물을 탐색하면 본래의 생동감 넘치는 색을 되찾습니다. 19개 백제의 상징을 모두 발견해 보세요.';
    } else {
      if (btnCards) btnCards.classList.remove('active');
      if (btnUnwrapped) btnUnwrapped.classList.add('active');
      if (grid) grid.style.display = 'none';
      if (unwrappedContainer) unwrappedContainer.style.display = 'block';
      if (catTabs) catTabs.style.display = 'none';
      if (title) title.innerText = '향로의 세계: 전개도 상징 탐색';
      if (desc) desc.innerText = '금동대향로 전개도 위에 은은하게 표현된 상징들을 클릭하여 백제 유물 속 생태 세계로 진입하세요.';
      this.renderUnwrappedMap();
    }
  }

  /* ============================================================
     4. 인트로 비디오 및 3D 시네마틱 전환
     ============================================================ */
  initIntroSequence() {
    const video = document.getElementById('intro-video');
    if (!video) return;

    video.addEventListener('ended', () => {
      this.finishIntroVideo();
    });

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.log('Video autoplay prevented');
      });
    }
  }

  finishIntroVideo() {
    const video = document.getElementById('intro-video');
    const blackout = document.getElementById('intro-blackout');
    const overlay = document.getElementById('intro-ui-overlay');
    const skipBtn = document.getElementById('btn-intro-skip');

    if (video) video.pause();
    if (skipBtn) skipBtn.style.display = 'none';

    if (blackout) {
      blackout.style.opacity = '1';
      setTimeout(() => {
        if (overlay) overlay.classList.add('active');
        if (this.viewer) {
          this.viewer.setCinematicIntro(true);
        }
        setTimeout(() => {
          blackout.style.opacity = '0';
        }, 600);
      }, 500);
    } else {
      if (overlay) overlay.classList.add('active');
    }
  }

  /* ============================================================
     5. 스크롤리텔링 옵저버 (5대 층위 Scrollytelling + 배경 전환)
     ============================================================ */
  initScrollyObserver() {
    const steps = document.querySelectorAll('.scrolly-step');
    if (!steps.length) return;

    const bgLayer = document.getElementById('scrolly-layer-bg');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          steps.forEach(s => s.classList.remove('is-active'));
          entry.target.classList.add('is-active');

          const stepId = entry.target.getAttribute('data-step-id');
          if (this.viewer) {
            this.viewer.focusStep(stepId);
          }

          // 층위별 배경 이미지 연동
          const layerObj = EXHIBITION_DATA.layers.find(l => l.id === stepId);
          if (bgLayer) {
            if (layerObj && layerObj.bg) {
              bgLayer.style.backgroundImage = `url("${layerObj.bg}")`;
              bgLayer.style.opacity = '0.35';
            } else {
              bgLayer.style.opacity = '0';
            }
          }
        }
      });
    }, {
      root: null,
      threshold: 0.6
    });

    steps.forEach(step => observer.observe(step));
  }

  /* ============================================================
     6. 상징 도감 렌더링 (카드형 19종)
     ============================================================ */
  renderCatalog(category = 'all') {
    this.currentCategory = category;
    const grid = document.getElementById('animal-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = EXHIBITION_DATA.animals.filter(item => {
      if (category === 'all') return true;
      return item.layer === category;
    });

    filtered.forEach(animal => {
      const isDiscovered = this.discoveredAnimals.has(animal.code);
      const card = document.createElement('div');
      card.className = `animal-card ${isDiscovered ? 'is-discovered' : 'is-silhouette'}`;
      card.setAttribute('data-code', animal.code);

      const iconSrc = isDiscovered ? animal.icon : animal.iconDark;

      card.innerHTML = `
        <div class="card-thumb-wrap">
          <div class="card-icon-container">
            <img class="card-icon-img" src="${iconSrc}" alt="${animal.name}" loading="lazy">
          </div>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span>NO. ${animal.code}</span>
            <span>${animal.layerName}</span>
          </div>
          <h3 class="card-title">${animal.name}</h3>
          <p class="card-desc">${animal.simpleDesc}</p>
          <div class="card-footer">
            <span>${animal.panelTheme}</span>
            <span>${isDiscovered ? '자세히 보기 →' : '탐색 시작 →'}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        this.switchView('detail', animal.code);
      });

      grid.appendChild(card);
    });

    this.updateProgress();
  }

  /* ============================================================
     7. 전개도 상징 탐색 렌더링 (19개 은은한 마커 레이어)
     ============================================================ */
  renderUnwrappedMap() {
    const layer = document.getElementById('unwrapped-markers-layer');
    if (!layer) return;

    layer.innerHTML = '';

    EXHIBITION_DATA.animals.forEach(animal => {
      const isDiscovered = this.discoveredAnimals.has(animal.code);
      const coords = animal.mapCoords || { x: 50, y: 50 };

      const marker = document.createElement('div');
      marker.className = `unwrapped-marker ${isDiscovered ? 'is-discovered' : 'is-undiscovered'}`;
      marker.style.left = `${coords.x}%`;
      marker.style.top = `${coords.y}%`;

      const iconSrc = isDiscovered ? animal.icon : animal.iconDark;

      marker.innerHTML = `
        <img class="unwrapped-marker-icon" src="${iconSrc}" alt="${animal.name}">
        <div class="marker-tooltip">${animal.code} ${animal.name} ${isDiscovered ? '★' : ''}</div>
      `;

      marker.addEventListener('click', () => {
        this.switchView('detail', animal.code);
      });

      layer.appendChild(marker);
    });
  }

  /* ============================================================
     8. 상세 전시 화면 렌더링
     ============================================================ */
  renderDetail(animalCode) {
    const animalIndex = EXHIBITION_DATA.animals.findIndex(a => a.code === animalCode);
    if (animalIndex === -1) return;

    this.currentAnimalIndex = animalIndex;
    const animal = EXHIBITION_DATA.animals[animalIndex];

    // 발견 상태 기록 (공통 상태)
    this.markAnimalDiscovered(animal.code);

    // 상단 네비 인디케이터
    const indicator = document.getElementById('detail-indicator');
    if (indicator) indicator.innerText = `${animal.code} / 19`;

    // 헤더 정보
    const codeTag = document.getElementById('detail-code-tag');
    const title = document.getElementById('detail-title');
    const simpleDesc = document.getElementById('detail-simple-desc');
    if (codeTag) codeTag.innerText = `NO. ${animal.code} · ${animal.layerName}`;
    if (title) title.innerText = animal.name;
    if (simpleDesc) simpleDesc.innerText = animal.simpleDesc;

    // 좌측 무대 이미지 / 3D 패널
    const panelImg = document.getElementById('detail-panel-image');
    if (panelImg) {
      panelImg.src = animal.panelImg || 'Asset/Final.webp';
      panelImg.alt = animal.name;
    }

    // 3 관찰 포인트
    const featList = document.getElementById('detail-features-list');
    if (featList && animal.features) {
      featList.innerHTML = animal.features.map(f => `<li>${f}</li>`).join('');
    }

    // 자연과학 관점
    const sciSec = document.getElementById('detail-science-section');
    const sciText = document.getElementById('detail-science-text');
    if (sciText && animal.scienceStory) {
      sciText.innerText = animal.scienceStory;
      if (sciSec) sciSec.style.display = 'block';
    }

    // 사회·문화 관점 (데이터 존재 시 표시, 미완성 시 안내)
    const cultSec = document.getElementById('detail-culture-section');
    const cultText = document.getElementById('detail-culture-text');
    if (animal.cultureStory) {
      if (cultText) cultText.innerText = animal.cultureStory;
      if (cultSec) cultSec.style.display = 'block';
    } else {
      if (cultSec) cultSec.style.display = 'none';
    }

    // 관련 유물 및 출처
    const relicSec = document.getElementById('detail-relic-section');
    const relicText = document.getElementById('detail-relic-text');
    const srcCredit = document.getElementById('detail-source-credit');
    if (animal.relicStory) {
      if (relicText) relicText.innerText = animal.relicStory;
    } else {
      if (relicText) relicText.innerText = '금동대향로 능산리사지 출토 원본 유물 도판과 연계되어 있습니다.';
    }
    if (srcCredit) {
      srcCredit.innerText = animal.sourceText || '출처: 국립부여박물관 소장 백제금동대향로 학술조사자료';
    }
    if (relicSec) relicSec.style.display = 'block';

    // OX 퀴즈 (데이터가 있는 경우에만 표시)
    const quizBox = document.getElementById('detail-quiz-box');
    if (quizBox) {
      if (animal.quiz) {
        quizBox.style.display = 'block';
        quizBox.innerHTML = `
          <span class="quiz-badge">참여형 퀴즈</span>
          <div class="quiz-question">${animal.quiz.question}</div>
          <div class="quiz-actions">
            <button class="btn-quiz-opt" onclick="window.app.checkQuiz(true)">O (그렇다)</button>
            <button class="btn-quiz-opt" onclick="window.app.checkQuiz(false)">X (아니다)</button>
          </div>
          <div id="quiz-result-panel" class="quiz-result-panel">
            <div id="quiz-result-title" class="quiz-result-title"></div>
            <div id="quiz-result-exp" class="quiz-result-exp"></div>
          </div>
        `;
      } else {
        quizBox.style.display = 'none';
      }
    }

    this.updateProgress();
  }

  navigateDetail(direction) {
    let nextIndex = this.currentAnimalIndex + direction;
    if (nextIndex < 0) nextIndex = EXHIBITION_DATA.animals.length - 1;
    if (nextIndex >= EXHIBITION_DATA.animals.length) nextIndex = 0;

    const nextAnimal = EXHIBITION_DATA.animals[nextIndex];
    this.renderDetail(nextAnimal.code);
  }

  markAnimalDiscovered(animalCode) {
    if (!this.discoveredAnimals.has(animalCode)) {
      this.discoveredAnimals.add(animalCode);
      try {
        localStorage.setItem('discovered_animals_v2', JSON.stringify(Array.from(this.discoveredAnimals)));
      } catch (e) {
        console.warn('Cannot save to localStorage:', e);
      }
      this.updateProgress();
    }
  }

  updateProgress() {
    const total = EXHIBITION_DATA.animals.length || 19;
    const discovered = this.discoveredAnimals.size;
    const percent = Math.round((discovered / total) * 100);

    const label = document.getElementById('discovery-progress-label');
    const bar = document.getElementById('discovery-progress-bar');
    if (label) label.innerText = `${discovered} / ${total} 개 발견 (${percent}%)`;
    if (bar) bar.style.width = `${percent}%`;

    // 19개 모두 발견 시 최종 완료 배너 노출
    const completionBanner = document.getElementById('final-completion-banner');
    if (completionBanner) {
      completionBanner.style.display = discovered >= total ? 'block' : 'none';
    }
  }

  /* ============================================================
     9. 과학해설사 (Docent 래피드왜건) 비주얼 노벨 엔진
     ============================================================ */
  openDocent(animalCode) {
    const dialogueData = (typeof DOCENT_DIALOGUES !== 'undefined') ? DOCENT_DIALOGUES[animalCode] : null;
    if (!dialogueData) {
      console.warn('No dialogue data for:', animalCode);
      return;
    }

    this.docentState.animalCode = animalCode;
    const modal = document.getElementById('docent-modal');
    if (modal) modal.classList.add('active');

    // 상단 뱃지
    const animalTag = document.getElementById('docent-animal-tag');
    const themeText = document.getElementById('docent-theme-text');
    if (animalTag) animalTag.innerText = `${dialogueData.code} ${dialogueData.name}`;
    if (themeText) themeText.innerText = dialogueData.theme || '과학적 탐구와 해설';

    // [START] 도입 대사 시작
    this.startDocentIntro(dialogueData);
  }

  startDocentIntro(dialogueData) {
    this.docentState.mode = 'INTRO';
    this.docentState.currentQueue = [...dialogueData.start.lines];
    this.docentState.queueIndex = 0;

    const optFooter = document.getElementById('docent-options-footer');
    if (optFooter) optFooter.style.display = 'none';

    this.playNextDocentLine();
  }

  playNextDocentLine() {
    const queue = this.docentState.currentQueue;
    const index = this.docentState.queueIndex;

    if (index >= queue.length) {
      // 대사 큐 종료 시
      if (this.docentState.mode === 'INTRO' || this.docentState.mode === 'QUESTION') {
        this.showDocentChoices();
      }
      return;
    }

    const currentItem = queue[index];
    this.docentState.queueIndex++;

    // 캐릭터 표정 및 초상화 교체
    this.updateDocentEmotion(currentItem.emotion);

    // 화자 이름
    const speakerEl = document.getElementById('docent-speaker-name');
    const emotionEl = document.getElementById('docent-emotion-tag');
    if (speakerEl) speakerEl.innerText = currentItem.speaker || '래피드왜건';
    if (emotionEl) emotionEl.innerText = currentItem.emotion || 'neutral';

    // 타이프라이터 효과로 대사 출력
    this.typewriterText(currentItem.text);
  }

  updateDocentEmotion(emotion = 'neutral') {
    const portrait = document.getElementById('docent-character-portrait');
    if (!portrait) return;

    const emotionMap = {
      neutral: 'Asset/4. Docent/neutral.webp',
      explaining: 'Asset/4. Docent/explaining.webp',
      thinking: 'Asset/4. Docent/thinking.webp',
      surprised: 'Asset/4. Docent/surprised.webp',
      excited: 'Asset/4. Docent/excited.webp',
      enlightened: 'Asset/4. Docent/enlightened.webp'
    };

    const targetSrc = emotionMap[emotion.toLowerCase()] || emotionMap.neutral;
    portrait.style.opacity = '0.7';
    setTimeout(() => {
      portrait.src = targetSrc;
      portrait.style.opacity = '1';
    }, 100);
  }

  typewriterText(text) {
    const chatBody = document.getElementById('docent-chat-body');
    if (!chatBody) return;

    if (this.docentState.typewriterTimer) {
      clearInterval(this.docentState.typewriterTimer);
    }

    this.docentState.isTyping = true;
    this.docentState.fullText = text;
    chatBody.innerHTML = '';

    let charIndex = 0;
    this.docentState.typewriterTimer = setInterval(() => {
      if (charIndex < text.length) {
        chatBody.innerHTML += text.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(this.docentState.typewriterTimer);
        this.docentState.isTyping = false;
      }
    }, 25);
  }

  handleDocentClick() {
    if (this.docentState.isTyping) {
      // 타이핑 중 클릭 시 전체 문장 즉시 출력
      clearInterval(this.docentState.typewriterTimer);
      const chatBody = document.getElementById('docent-chat-body');
      if (chatBody) chatBody.innerHTML = this.docentState.fullText;
      this.docentState.isTyping = false;
    } else {
      // 다음 대사 재생
      if (this.docentState.mode === 'INTRO' || this.docentState.mode === 'QUESTION') {
        this.playNextDocentLine();
      }
    }
  }

  showDocentChoices() {
    this.docentState.mode = 'CHOICE';
    const optFooter = document.getElementById('docent-options-footer');
    const optList = document.getElementById('docent-options-list');
    const dialogueData = DOCENT_DIALOGUES[this.docentState.animalCode];

    if (!optFooter || !optList || !dialogueData) return;

    optList.innerHTML = '';
    const choices = dialogueData.start.choices || [];

    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'btn-docent-choice';
      btn.innerHTML = `<span>💬 ${ch.text}</span><span>→</span>`;
      btn.addEventListener('click', () => {
        this.selectDocentQuestion(ch.id);
      });
      optList.appendChild(btn);
    });

    optFooter.style.display = 'block';
  }

  selectDocentQuestion(qId) {
    const dialogueData = DOCENT_DIALOGUES[this.docentState.animalCode];
    if (!dialogueData || !dialogueData.questions[qId]) return;

    const qData = dialogueData.questions[qId];
    this.docentState.mode = 'QUESTION';
    this.docentState.currentQueue = [...qData.lines];
    this.docentState.queueIndex = 0;

    const optFooter = document.getElementById('docent-options-footer');
    if (optFooter) optFooter.style.display = 'none';

    this.playNextDocentLine();
  }

  closeDocent() {
    const modal = document.getElementById('docent-modal');
    if (modal) modal.classList.remove('active');
    if (this.docentState.typewriterTimer) {
      clearInterval(this.docentState.typewriterTimer);
    }
  }
}

// Global App Instance
window.addEventListener('DOMContentLoaded', () => {
  window.app = new ExhibitionApp();
});
