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
      currentBranch: 'ROOT',
      dialogueQueue: [],
      queueIdx: 0,
      isTyping: false,
      typeTimer: null,
      fullText: ''
    };
    
    this.viewer = null;
    this.introVideoEnded = false;
    
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
    this.renderUnwrappedLayers();
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
            loadingText.innerText = '전시 준비 완료 (2D 모드)';
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
    // 헤더 네비게이션 버튼
    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        let targetView = e.currentTarget.getAttribute('data-nav');
        if (!targetView) {
          targetView = e.target.closest('[data-nav]')?.getAttribute('data-nav');
        }
        if (targetView === 'unwrapped') {
          this.switchView('catalog');
          this.setCatalogMode('unwrapped');
        } else if (targetView === 'catalog') {
          this.switchView('catalog');
          this.setCatalogMode('cards');
        } else if (targetView) {
          this.switchView(targetView);
        }
      });
    });

    // 메인 스크롤 단계 내 전개도 층위 딥링크 버튼
    document.querySelectorAll('[data-goto-unwrapped]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const layerId = e.currentTarget.getAttribute('data-goto-unwrapped');
        this.goToUnwrappedLayer(layerId);
      });
    });

    // 인트로 시작 버튼
    const btnStart = document.getElementById('btn-start-exhibition');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        this.switchView('main');
      });
    }

    // 인트로 비디오 다시보기 버튼
    const btnReplay = document.getElementById('btn-replay-intro');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        this.playIntroVideo();
      });
    }

    // 인트로 스킵 버튼
    const btnSkip = document.getElementById('btn-intro-skip');
    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        this.finishIntroVideo();
      });
    }

    // 도감 모드 전환 탭 (카드형 vs 전개도 5층위형)
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
    this.initWheelSnapController();

    // 헤더 과학해설사 버튼 (상세화면에서는 즉시 실행, 타 화면에서는 안내 또는 상세화면 이동)
    const btnDocentCall = document.getElementById('btn-docent-call');
    if (btnDocentCall) {
      btnDocentCall.addEventListener('click', () => {
        if (this.currentView === 'detail') {
          const animal = EXHIBITION_DATA.animals[this.currentAnimalIndex] || EXHIBITION_DATA.animals[0];
          this.openDocent(animal.code);
        } else {
          // 상세 화면이 아닐 때 안내 및 첫 번째 동물 상세로 진입
          const animal = EXHIBITION_DATA.animals[this.currentAnimalIndex] || EXHIBITION_DATA.animals[0];
          this.switchView('detail', animal.code);
          setTimeout(() => {
            this.openDocent(animal.code);
          }, 300);
        }
      });
    }

    // 상세 화면 좌측 3D 영역 아래 도슨트 호출 버튼
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

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

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
    const btnDocentHeader = document.getElementById('btn-docent-call');

    // 과학해설사 버튼 활성화 제어 (상세 화면에서만 강조 활성화)
    if (btnDocentHeader) {
      if (viewName === 'detail') {
        btnDocentHeader.classList.add('is-active-docent');
        btnDocentHeader.title = '클릭하여 현재 동물의 래피드왜건 과학해설을 듣습니다';
      } else {
        btnDocentHeader.classList.remove('is-active-docent');
        btnDocentHeader.title = '개별 동물 상세 화면에서 활성화됩니다';
      }
    }

    if (viewName === 'intro') {
      if (canvasContainer) {
        canvasContainer.style.display = 'block';
        canvasContainer.style.opacity = '1';
      }
      if (this.viewer) this.viewer.setCinematicIntro(true);
      
      // 인트로로 되돌아왔을 때 오버레이를 즉시 표시
      const overlay = document.getElementById('intro-ui-overlay');
      const blackout = document.getElementById('intro-blackout');
      const skipBtn = document.getElementById('btn-intro-skip');
      if (overlay) overlay.classList.add('visible');
      if (blackout) blackout.style.opacity = '0';
      if (skipBtn) skipBtn.style.display = 'none';
      
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
      this.renderUnwrappedLayers();
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
      if (title) title.innerText = '향로의 세계: 5대 층위 전개도 상징 탐색';
      if (desc) desc.innerText = '천상·하늘·육지·물가·바다의 각 층위 배경 위 마커를 클릭하여 유물 속 생태계를 탐구하세요. 3D 메인화면과 상호 이동할 수 있습니다.';
      this.renderUnwrappedLayers();
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
      playPromise.catch((err) => {
        console.warn('Video autoplay prevented by browser:', err);
        // 비디오 자동재생 실패 시 즉시 UI 노출
        const overlay = document.getElementById('intro-ui-overlay');
        if (overlay) overlay.classList.add('visible');
      });
    }
  }

  playIntroVideo() {
    const video = document.getElementById('intro-video');
    const blackout = document.getElementById('intro-blackout');
    const overlay = document.getElementById('intro-ui-overlay');
    const skipBtn = document.getElementById('btn-intro-skip');

    if (overlay) overlay.classList.remove('visible');
    if (blackout) blackout.style.opacity = '0';
    if (skipBtn) skipBtn.style.display = 'block';

    if (video) {
      video.currentTime = 0;
      video.style.opacity = '1';
      video.play().catch(e => console.warn(e));
    }
  }

  finishIntroVideo() {
    const video = document.getElementById('intro-video');
    const blackout = document.getElementById('intro-blackout');
    const overlay = document.getElementById('intro-ui-overlay');
    const skipBtn = document.getElementById('btn-intro-skip');

    if (video) {
      video.pause();
      video.style.opacity = '0';
    }
    if (skipBtn) skipBtn.style.display = 'none';

    if (blackout) {
      blackout.style.opacity = '1';
      setTimeout(() => {
        if (overlay) overlay.classList.add('visible');
        if (this.viewer) {
          this.viewer.setCinematicIntro(true);
        }
        setTimeout(() => {
          blackout.style.opacity = '0';
        }, 600);
      }, 500);
    } else {
      if (overlay) overlay.classList.add('visible');
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
          const allSteps = Array.from(document.querySelectorAll('.scrolly-step'));
          const targetIdx = allSteps.indexOf(entry.target);
          if (targetIdx !== -1) this.currentStepIdx = targetIdx;

          // 도트 인디케이터 활성화
          document.querySelectorAll('.layer-nav-dot').forEach(dot => {
            dot.classList.toggle('active', dot.getAttribute('data-step-target') === stepId);
          });

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
    }, { threshold: 0.5 });

    steps.forEach(step => observer.observe(step));
  }

  // 메인 스크롤 단계로 바로 이동 (전개도에서 메인으로 상호 이동)
  goToMainLayer(layerId) {
    this.switchView('main');
    setTimeout(() => {
      const stepElem = document.querySelector(`.scrolly-step[data-step-id="${layerId}"]`);
      if (stepElem) {
        stepElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }

  // 전개도 특정 층위로 바로 이동 (메인에서 전개도로 상호 이동)
  goToUnwrappedLayer(layerId) {
    this.switchView('catalog');
    this.setCatalogMode('unwrapped');
    setTimeout(() => {
      const layerCard = document.getElementById('unwrapped-layer-' + layerId);
      if (layerCard) {
        layerCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  }

  /* ============================================================
     6. 상징 도감 (카드 모드) 렌더링
     ============================================================ */
  renderCatalog(category = 'all') {
    this.currentCategory = category;
    const grid = document.getElementById('animal-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = category === 'all'
      ? EXHIBITION_DATA.animals
      : EXHIBITION_DATA.animals.filter(a => a.layer === category || (category === 'sky' && a.layer === 'celestial'));

    filtered.forEach(animal => {
      const isDiscovered = this.discoveredAnimals.has(animal.code);
      const card = document.createElement('div');
      card.className = `animal-card ${isDiscovered ? 'is-discovered' : 'is-silhouette'}`;
      card.setAttribute('data-code', animal.code);

      const iconSrc = isDiscovered ? animal.icon : animal.iconDark;

      card.innerHTML = `
        <div class="card-thumb-wrap">
          <img class="card-icon-img" src="${iconSrc}" alt="${animal.name}" loading="lazy">
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
     7. 전개도 5대 층위 공간 렌더링 (구현 규칙 7-1)
     - 각 층위별 bg_XXXX.webp 배경 적용
     - 5의 메인화면과 상호 이동 버튼
     - 해당 층위 상징 마커 레이어
     ============================================================ */
  renderUnwrappedLayers() {
    const container = document.getElementById('unwrapped-layers-list');
    if (!container) return;

    container.innerHTML = '';

    EXHIBITION_DATA.layers.forEach(layer => {
      const layerAnimals = EXHIBITION_DATA.animals.filter(a => {
        if (layer.id === 'celestial') return a.layer === 'celestial';
        if (layer.id === 'sky') return false;
        if (layer.id === 'land') return a.layer === 'land';
        if (layer.id === 'water') return a.layer === 'water';
        if (layer.id === 'sea') return a.layer === 'sea';
        return false;
      });

      const layerCard = document.createElement('div');
      layerCard.className = 'unwrapped-layer-card';
      layerCard.id = 'unwrapped-layer-' + layer.id;

      // 층위 헤더 + 메인 스크롤 화면 상호 이동 버튼
      const headerHtml = `
        <div class="layer-card-header">
          <div class="layer-header-left">
            <span class="layer-badge">${layer.shortName}</span>
            <h4 class="layer-card-title">${layer.name}</h4>
          </div>
          <button class="btn-layer-goto-main" data-goto-main="${layer.id}">
            <span>🔍 3D 메인화면에서 이 층위 보기</span>
            <span>→</span>
          </button>
        </div>
      `;

      // 층위 뷰포트 (bg_XXXX.webp 배경 + 상징 마커)
      let markersHtml = '';
      layerAnimals.forEach(animal => {
        const isDiscovered = this.discoveredAnimals.has(animal.code);
        const coords = animal.layerCoords || { x: 50, y: 50 };
        const iconSrc = isDiscovered ? animal.icon : animal.iconDark;

        markersHtml += `
          <div class="layer-symbol-marker ${isDiscovered ? 'is-discovered' : 'is-undiscovered'}" 
               style="left: ${coords.x}%; top: ${coords.y}%;" 
               data-animal-code="${animal.code}">
            <div class="marker-pin-wrap">
              <img class="marker-pin-img" src="${iconSrc}" alt="${animal.name}">
            </div>
            <div class="marker-hover-tooltip">${animal.code} ${animal.name} ${isDiscovered ? '★' : ''}</div>
          </div>
        `;
      });

      const stageHtml = `
        <div class="layer-stage-viewport">
          <img class="layer-bg-img" src="${layer.bg}" alt="${layer.name} 배경">
          <div class="layer-markers-overlay">
            ${markersHtml}
          </div>
        </div>
      `;

      layerCard.innerHTML = headerHtml + stageHtml;

      // 메인 층위 이동 이벤트
      const btnGotoMain = layerCard.querySelector('[data-goto-main]');
      if (btnGotoMain) {
        btnGotoMain.addEventListener('click', () => {
          this.goToMainLayer(layer.id);
        });
      }

      // 동물 마커 클릭 이벤트
      layerCard.querySelectorAll('.layer-symbol-marker').forEach(marker => {
        marker.addEventListener('click', (e) => {
          const code = e.currentTarget.getAttribute('data-animal-code');
          if (code) this.switchView('detail', code);
        });
      });

      container.appendChild(layerCard);
    });
  }

  /* ============================================================
     8. 상세 전시 화면 렌더링 (3D 에셋 Embed + N_Panel 패널)
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

    // [핵심] 좌측 무대: con_Mapping.md의 3D 에셋 Embed (Sketchfab iframe or GLB 뷰어)
    const embedWrap = document.getElementById('detail-3d-embed-wrap');
    if (embedWrap) {
      if (animal.glb) {
        this.renderGLBViewer(embedWrap, animal.glb, animal.name);
      } else if (animal.embedHtml) {
        embedWrap.innerHTML = animal.embedHtml;
      }
    }

    // 3가지 핵심 관찰 포인트
    const featuresList = document.getElementById('detail-features-list');
    if (featuresList && animal.features) {
      featuresList.innerHTML = animal.features.map(f => `<li>${f}</li>`).join('');
    }

    // 사회·문화적 관점 (dialogueData or references)
    const cultureText = document.getElementById('detail-culture-text');
    if (cultureText) {
      const vnData = (typeof DIALOGUE_DATA !== 'undefined' && DIALOGUE_DATA[animal.code]) ? DIALOGUE_DATA[animal.code] : null;
      cultureText.innerText = vnData ? vnData.cultureStory : `${animal.name}은 백제 금동대향로에 정교하게 새겨져 당시 사람들의 이상세계와 자연관을 대변합니다.`;
    }

    // 자연과학·진화적 관점
    const scienceText = document.getElementById('detail-science-text');
    if (scienceText) {
      scienceText.innerText = animal.scienceStory;
    }

    // 우측 과학 패널 (N_Panel 이미지)
    const sciencePanelImg = document.getElementById('detail-science-panel-img');
    if (sciencePanelImg) {
      sciencePanelImg.src = animal.panelImg || 'Asset/Final.webp';
      sciencePanelImg.alt = `${animal.name} 과학 조사 패널`;
    }

    // 관련 유물 및 출처
    const relicText = document.getElementById('detail-relic-text');
    const sourceCredit = document.getElementById('detail-source-credit');
    if (relicText) {
      relicText.innerText = `백제 부여 능산리사지 출토 백제금동대향로(국보) 본체 조각에 표현된 도상 도판`;
    }
    if (sourceCredit) {
      sourceCredit.innerText = animal.sourceText || '출처: 국립부여박물관';
    }

    // OX 퀴즈 렌더링
    this.renderQuiz(animal.code);
  }

  /* ============================================================
     9. OX 퀴즈 모듈
     ============================================================ */
  renderQuiz(animalCode) {
    const quizBox = document.getElementById('detail-quiz-box');
    if (!quizBox) return;

    const vnData = (typeof DIALOGUE_DATA !== 'undefined') ? DIALOGUE_DATA[animalCode] : null;
    const quiz = vnData ? vnData.quiz : null;

    if (!quiz) {
      quizBox.style.display = 'none';
      return;
    }

    quizBox.style.display = 'block';
    quizBox.innerHTML = `
      <div class="quiz-header">
        <span class="quiz-badge">💡 자연사 탐구 OX 퀴즈</span>
        <h4 class="quiz-question">${quiz.question}</h4>
      </div>
      <div class="quiz-options-row">
        <button class="btn-quiz-opt" data-answer="O">O (그렇다)</button>
        <button class="btn-quiz-opt" data-answer="X">X (아니다)</button>
      </div>
      <div class="quiz-result-feedback" id="quiz-feedback" style="display: none;"></div>
    `;

    quizBox.querySelectorAll('.btn-quiz-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const choice = e.currentTarget.getAttribute('data-answer');
        const feedback = document.getElementById('quiz-feedback');
        if (!feedback) return;

        const isCorrect = (choice === quiz.answer);
        feedback.style.display = 'block';
        feedback.className = `quiz-result-feedback ${isCorrect ? 'correct' : 'wrong'}`;
        feedback.innerHTML = `
          <strong>${isCorrect ? '🎉 정답입니다!' : '🤔 아쉽습니다!'}</strong>
          <p>${quiz.explanation}</p>
        `;
      });
    });
  }

  /* ============================================================
     10. 상세 화면 탐색 네비게이션
     ============================================================ */
  navigateDetail(direction) {
    const total = EXHIBITION_DATA.animals.length;
    let nextIndex = this.currentAnimalIndex + direction;
    if (nextIndex < 0) nextIndex = total - 1;
    if (nextIndex >= total) nextIndex = 0;

    const nextAnimal = EXHIBITION_DATA.animals[nextIndex];
    this.renderDetail(nextAnimal.code);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ============================================================
     11. 발견 상태 저장 & 진척도
     ============================================================ */
  markAnimalDiscovered(code) {
    if (!this.discoveredAnimals.has(code)) {
      this.discoveredAnimals.add(code);
      try {
        localStorage.setItem('discovered_animals_v2', JSON.stringify(Array.from(this.discoveredAnimals)));
      } catch (e) {}
      this.updateProgress();
    }
  }

  updateProgress() {
    const count = this.discoveredAnimals.size;
    const total = EXHIBITION_DATA.animals.length || 19;
    const percent = Math.round((count / total) * 100);

    const label = document.getElementById('discovery-progress-label');
    const bar = document.getElementById('discovery-progress-bar');
    const banner = document.getElementById('final-completion-banner');

    if (label) label.innerText = `${count} / ${total} 개 발견 (${percent}%)`;
    if (bar) bar.style.width = percent + '%';

    if (banner) {
      banner.style.display = (count >= total) ? 'block' : 'none';
    }
  }

  /* ============================================================
     12. 과학해설사 (Docent) 비주얼 노벨 실행기
     ============================================================ */
  openDocent(animalCode) {
    const modal = document.getElementById('docent-modal');
    if (!modal) return;

    this.docentState.animalCode = animalCode;
    const animal = EXHIBITION_DATA.animals.find(a => a.code === animalCode) || EXHIBITION_DATA.animals[0];
    const vnData = (typeof DIALOGUE_DATA !== 'undefined') ? DIALOGUE_DATA[animalCode] : null;

    const animalTag = document.getElementById('docent-animal-tag');
    const themeText = document.getElementById('docent-theme-text');
    if (animalTag) animalTag.innerText = `${animal.code} ${animal.name}`;
    if (themeText) themeText.innerText = animal.panelTheme;

    modal.style.display = 'flex';

    if (vnData && vnData.dialogueTree) {
      this.startDocentBranch('ROOT', vnData.dialogueTree);
    } else {
      this.startDocentFallback(animal);
    }
  }

  closeDocent() {
    const modal = document.getElementById('docent-modal');
    if (modal) modal.style.display = 'none';
    if (this.docentState.typeTimer) clearTimeout(this.docentState.typeTimer);
    this.docentState.isTyping = false;
  }

  startDocentBranch(branchKey, dialogueTree) {
    this.docentState.currentBranch = branchKey;
    const branch = dialogueTree[branchKey] || dialogueTree['ROOT'];
    if (!branch) return;

    this.docentState.dialogueQueue = [...branch.lines];
    this.docentState.queueIdx = 0;
    this.displayNextDocentLine(branch);
  }

  displayNextDocentLine(branch) {
    const queue = this.docentState.dialogueQueue;
    const idx = this.docentState.queueIdx;
    const optionsFooter = document.getElementById('docent-options-footer');
    const clickHint = document.getElementById('docent-click-hint');

    if (optionsFooter) optionsFooter.style.display = 'none';

    if (idx < queue.length) {
      const line = queue[idx];
      this.docentState.queueIdx++;
      if (clickHint) clickHint.style.display = 'inline';

      this.typewriteDocentText(line.text, line.speaker || '래피드왜건', line.emotion || 'neutral', () => {
        if (this.docentState.queueIdx >= queue.length && branch.options && branch.options.length > 0) {
          this.showDocentOptions(branch.options);
          if (clickHint) clickHint.style.display = 'none';
        }
      });
    } else {
      if (branch.options && branch.options.length > 0) {
        this.showDocentOptions(branch.options);
        if (clickHint) clickHint.style.display = 'none';
      } else {
        this.closeDocent();
      }
    }
  }

  handleDocentClick() {
    if (this.docentState.isTyping) {
      // 타이핑 즉시 완료
      clearTimeout(this.docentState.typeTimer);
      this.docentState.isTyping = false;
      const chatBody = document.getElementById('docent-chat-body');
      if (chatBody) chatBody.innerText = this.docentState.fullText;
      return;
    }

    const vnData = (typeof DIALOGUE_DATA !== 'undefined') ? DIALOGUE_DATA[this.docentState.animalCode] : null;
    if (vnData && vnData.dialogueTree) {
      const branch = vnData.dialogueTree[this.docentState.currentBranch];
      if (branch) {
        this.displayNextDocentLine(branch);
      }
    }
  }

  typewriteDocentText(text, speaker, emotion, callback) {
    const speakerElem = document.getElementById('docent-speaker-name');
    const emotionElem = document.getElementById('docent-emotion-tag');
    const chatBody = document.getElementById('docent-chat-body');
    const portrait = document.getElementById('docent-character-portrait');

    if (speakerElem) speakerElem.innerText = speaker;
    if (emotionElem) emotionElem.innerText = emotion;
    if (portrait) {
      const emoMap = {
        'happy': 'Asset/4. Docent/explaining.webp',
        'surprised': 'Asset/4. Docent/explaining.webp',
        'neutral': 'Asset/4. Docent/neutral.webp'
      };
      portrait.src = emoMap[emotion] || 'Asset/4. Docent/neutral.webp';
    }

    this.docentState.fullText = text;
    this.docentState.isTyping = true;
    if (chatBody) chatBody.innerHTML = '';

    let i = 0;
    const speed = 20;

    const typeNextChar = () => {
      if (i < text.length) {
        if (chatBody) chatBody.innerHTML += text.charAt(i);
        i++;
        this.docentState.typeTimer = setTimeout(typeNextChar, speed);
      } else {
        this.docentState.isTyping = false;
        if (callback) callback();
      }
    };

    typeNextChar();
  }

  showDocentOptions(options) {
    const footer = document.getElementById('docent-options-footer');
    const list = document.getElementById('docent-options-list');
    if (!footer || !list) return;

    list.innerHTML = '';
    footer.style.display = 'block';

    const vnData = (typeof DIALOGUE_DATA !== 'undefined') ? DIALOGUE_DATA[this.docentState.animalCode] : null;

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'btn-docent-option';
      btn.innerText = `▶ ${opt.label}`;
      btn.addEventListener('click', () => {
        if (vnData && vnData.dialogueTree) {
          this.startDocentBranch(opt.next, vnData.dialogueTree);
        }
      });
      list.appendChild(btn);
    });
  }

  startDocentFallback(animal) {
    const chatBody = document.getElementById('docent-chat-body');
    if (chatBody) {
      chatBody.innerText = `안녕하세요! 백제금동대향로의 ${animal.name}에 대해 궁금한 점이 있으신가요? ${animal.scienceStory}`;
    }
  }
}

// 애플리케이션 시작
window.addEventListener('DOMContentLoaded', () => {
  window.app = new ExhibitionApp();
});
