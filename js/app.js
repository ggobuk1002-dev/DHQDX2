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
      currentMode: 'START', // 'START' | 'QUESTION' | 'RETURN'
      currentQuestionId: null,
      dialogueQueue: [],
      queueIdx: 0,
      isTyping: false,
      typeTimer: null,
      fullText: ''
    };
    
    this.viewer = null;
    this.isSnapping = false;
    this.currentStepIdx = 0;
    
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
    this.initScrollyObserver();
    this.initWheelSnapController();

    // 항상 인트로 화면에서 첫 시작!
    this.switchView('intro');
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
    // 헤더 로고 및 브랜드 타이틀 클릭 시 인트로로 이동
    const brandTitle = document.querySelector('.brand-title');
    if (brandTitle) {
      brandTitle.addEventListener('click', () => {
        this.switchView('intro');
      });
    }

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

    // 인트로 시작 버튼 -> 메인 뷰로 이동
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

    // 헤더 과학해설사 버튼 (상세화면에서는 즉시 실행, 타 화면에서는 안내 또는 상세화면 이동)
    const btnDocentCall = document.getElementById('btn-docent-call');
    if (btnDocentCall) {
      btnDocentCall.addEventListener('click', () => {
        const animal = EXHIBITION_DATA.animals[this.currentAnimalIndex] || EXHIBITION_DATA.animals[0];
        if (this.currentView === 'detail') {
          this.openDocent(animal.code);
        } else {
          this.switchView('detail', animal.code);
          setTimeout(() => {
            this.openDocent(animal.code);
          }, 350);
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

    // 과학해설사 버튼 활성화 제어 (상세 화면에서만 골드 펄스로 강조 활성화)
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
        canvasContainer.style.display = 'none';
      }
      this.playIntroVideo();
      
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
     4. 인트로 비디오 및 메인 전시 자동 전환
     - 영상 재생부터 끝날 때까지가 온전한 인트로!
     - 영상 종료 / 건너뛰기 시 3D 메인 전시관람으로 자동 전환
     ============================================================ */
  initIntroSequence() {
    const video = document.getElementById('intro-video');
    if (!video) return;

    video.addEventListener('ended', () => {
      this.finishIntroVideo();
    });

    const skipBtn = document.getElementById('btn-intro-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.finishIntroVideo();
      });
    }
  }

  playIntroVideo() {
    const video = document.getElementById('intro-video');
    const blackout = document.getElementById('intro-blackout');
    const overlay = document.getElementById('intro-ui-overlay');
    const skipBtn = document.getElementById('btn-intro-skip');

    if (overlay) overlay.style.display = 'none';
    if (blackout) blackout.style.opacity = '0';
    if (skipBtn) skipBtn.style.display = 'inline-flex';

    if (video) {
      video.currentTime = 0;
      video.style.opacity = '1';
      video.muted = true;
      video.playsInline = true;
      video.play().catch(e => {
        console.warn('Video autoplay prevented:', e);
        // 브라우저 차단 시 건너뛰기 버튼 강조
      });
    }
  }

  finishIntroVideo() {
    const video = document.getElementById('intro-video');
    const blackout = document.getElementById('intro-blackout');
    const skipBtn = document.getElementById('btn-intro-skip');

    if (video) {
      video.pause();
      video.style.opacity = '0';
    }
    if (skipBtn) skipBtn.style.display = 'none';

    // 영상 종료 시 암전 페이드아웃 후 곧바로 메인 전시로 전환!
    if (blackout) {
      blackout.style.opacity = '1';
      setTimeout(() => {
        this.switchView('main');
        setTimeout(() => {
          blackout.style.opacity = '0';
        }, 500);
      }, 400);
    } else {
      this.switchView('main');
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

  /* ============================================================
     5-1. 한 번에 훅훅 넘어가는 스크롤 스냅 휠 컨트롤러
     ============================================================ */
  initWheelSnapController() {
    this.isSnapping = false;
    this.currentStepIdx = 0;
    const steps = Array.from(document.querySelectorAll('.scrolly-step'));
    if (!steps.length) return;

    window.addEventListener('wheel', (e) => {
      if (this.currentView !== 'main') return;
      if (this.isSnapping) {
        e.preventDefault();
        return;
      }

      // 휠 델타 감지 (살짝만 굴려도 1스텝씩 훅훅 이동)
      if (Math.abs(e.deltaY) > 15) {
        e.preventDefault();
        this.isSnapping = true;

        if (e.deltaY > 0) {
          if (this.currentStepIdx < steps.length - 1) {
            this.currentStepIdx++;
          }
        } else {
          if (this.currentStepIdx > 0) {
            this.currentStepIdx--;
          }
        }

        const targetStep = steps[this.currentStepIdx];
        if (targetStep) {
          targetStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => {
          this.isSnapping = false;
        }, 550);
      }
    }, { passive: false });

    // 키보드 방향키 이동 지원
    window.addEventListener('keydown', (e) => {
      if (this.currentView !== 'main') return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        if (this.currentStepIdx < steps.length - 1) {
          e.preventDefault();
          this.currentStepIdx++;
          steps[this.currentStepIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (this.currentStepIdx > 0) {
          e.preventDefault();
          this.currentStepIdx--;
          steps[this.currentStepIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // 층위 도트 네비게이션 클릭 이벤트
    document.querySelectorAll('.layer-nav-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const stepId = e.currentTarget.getAttribute('data-step-target');
        const targetStep = document.querySelector(`.scrolly-step[data-step-id="${stepId}"]`);
        if (targetStep) {
          const idx = steps.indexOf(targetStep);
          if (idx !== -1) this.currentStepIdx = idx;
          targetStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
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
     8. 상세 전시 화면 렌더링 (3D 에셋 Embed / Three.js GLB)
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

    // [핵심] 좌측 무대: con_Mapping.md의 3D 에셋 (GLB 전용 뷰어 또는 Sketchfab Embed iframe)
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

    // 사회·문화적 관점 (DOCENT_DIALOGUES 연동)
    const cultureText = document.getElementById('detail-culture-text');
    if (cultureText) {
      const vnData = (typeof DOCENT_DIALOGUES !== 'undefined' && DOCENT_DIALOGUES[animal.code]) ? DOCENT_DIALOGUES[animal.code] : null;
      cultureText.innerText = vnData && vnData.cultureStory 
        ? vnData.cultureStory 
        : `${animal.name}은 백제 금동대향로에 정교하게 조각되어 당시 백제인의 이상향과 생태관을 대변합니다.`;
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
      relicText.innerText = `백제 부여 능산리 절터 출토 금동대향로(국보) 본체 조각에 표현된 도상 도판`;
    }
    if (sourceCredit) {
      sourceCredit.innerText = animal.sourceText || '출처: 국립부여박물관 소장 백제금동대향로 도판';
    }

    // OX 퀴즈 렌더링
    this.renderQuiz(animal.code);
  }

  /* ============================================================
     8-1. GLB 3D 모델 전용 Three.js 뷰어 렌더링 (01.glb, 02.glb)
     ============================================================ */
  renderGLBViewer(container, glbUrl, animalName) {
    container.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const loadingTip = document.createElement('div');
    loadingTip.style.position = 'absolute';
    loadingTip.style.bottom = '1rem';
    loadingTip.style.left = '50%';
    loadingTip.style.transform = 'translateX(-50%)';
    loadingTip.style.color = 'var(--accent-gold)';
    loadingTip.style.fontSize = '0.85rem';
    loadingTip.style.background = 'rgba(8,9,13,0.85)';
    loadingTip.style.padding = '0.35rem 0.9rem';
    loadingTip.style.borderRadius = '14px';
    loadingTip.style.border = '1px solid var(--border-color)';
    loadingTip.innerText = `3D 모델 로딩 중: ${animalName}...`;
    container.appendChild(loadingTip);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 2.5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;

    // 조명 세팅
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfffaed, 2.8);
    dirLight1.position.set(3, 5, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd4af37, 2.0);
    dirLight2.position.set(-3, -2, -3);
    scene.add(dirLight2);

    // GLB 로더 실행
    const loader = new THREE.GLTFLoader();
    loader.load(glbUrl, (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      if (!box.isEmpty()) {
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? (1.8 / maxDim) : 1;
        model.scale.set(scale, scale, scale);

        const scaledBox = new THREE.Box3().setFromObject(model);
        const center = scaledBox.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;
      }
      scene.add(model);
      loadingTip.innerText = `💡 마우스로 드래그하여 ${animalName} 3D 모델을 회전하세요`;
    }, undefined, (err) => {
      console.warn('GLB load error:', err);
      loadingTip.innerText = `${animalName} 3D 모델 (로컬 파일 로드)`;
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);
  }

  /* ============================================================
     9. OX 퀴즈 모듈
     ============================================================ */
  renderQuiz(animalCode) {
    const quizBox = document.getElementById('detail-quiz-box');
    if (!quizBox) return;

    const vnData = (typeof DOCENT_DIALOGUES !== 'undefined') ? DOCENT_DIALOGUES[animalCode] : null;
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
     12. 과학해설사 (Docent) 비주얼 노벨 실행기 (DOCENT_DIALOGUES 연동)
     ============================================================ */
  /* ============================================================
     12. 과학해설사 (Docent) 비주얼 노벨 실행기 (DOCENT_DIALOGUES 연동)
     ============================================================ */
  openDocent(animalCode) {
    const modal = document.getElementById('docent-modal');
    if (!modal) return;

    // 코드 정규화 (1 -> '01')
    const normalizedCode = String(animalCode || '01').padStart(2, '0');
    this.docentState.animalCode = normalizedCode;

    const animal = EXHIBITION_DATA.animals.find(a => a.code === normalizedCode) || EXHIBITION_DATA.animals[0];
    const docentData = (typeof DOCENT_DIALOGUES !== 'undefined' && DOCENT_DIALOGUES[normalizedCode]) 
      ? DOCENT_DIALOGUES[normalizedCode] 
      : null;

    const animalTag = document.getElementById('docent-animal-tag');
    const themeText = document.getElementById('docent-theme-text');
    if (animalTag) animalTag.innerText = `${animal.code} ${animal.name}`;
    if (themeText) themeText.innerText = (docentData && docentData.theme) ? docentData.theme : animal.panelTheme;

    modal.style.display = 'flex';
    modal.style.zIndex = '9999';

    if (docentData && docentData.start && docentData.start.lines && docentData.start.lines.length > 0) {
      this.startDocent(docentData);
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

  startDocent(docentData) {
    this.docentState.currentMode = 'START';
    this.docentState.dialogueQueue = [...docentData.start.lines];
    this.docentState.queueIdx = 0;
    this.displayNextDocentLine();
  }

  displayNextDocentLine() {
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
        if (this.docentState.queueIdx >= queue.length) {
          this.handleQueueEnd();
        }
      });
    } else {
      this.handleQueueEnd();
    }
  }

  handleQueueEnd() {
    const clickHint = document.getElementById('docent-click-hint');
    const docentData = (typeof DOCENT_DIALOGUES !== 'undefined') ? DOCENT_DIALOGUES[this.docentState.animalCode] : null;
    if (!docentData) return;

    if (this.docentState.currentMode === 'START') {
      if (docentData.start.choices && docentData.start.choices.length > 0) {
        this.showDocentChoices(docentData.start.choices);
        if (clickHint) clickHint.style.display = 'none';
      }
    } else if (this.docentState.currentMode === 'QUESTION') {
      const qObj = docentData.questions ? docentData.questions[this.docentState.currentQuestionId] : null;
      if (qObj && qObj.return) {
        this.docentState.currentMode = 'RETURN';
        this.docentState.dialogueQueue = [{ speaker: '래피드왜건', emotion: 'explaining', text: qObj.return.text || '다른 궁금한 점이 있으신가요?' }];
        this.docentState.queueIdx = 0;
        this.displayNextDocentLine();
      } else {
        this.showDocentChoices(docentData.start.choices);
        if (clickHint) clickHint.style.display = 'none';
      }
    } else if (this.docentState.currentMode === 'RETURN') {
      this.showDocentChoices(docentData.start.choices);
      if (clickHint) clickHint.style.display = 'none';
    }
  }

  handleDocentClick() {
    if (this.docentState.isTyping) {
      clearTimeout(this.docentState.typeTimer);
      this.docentState.isTyping = false;
      const chatBody = document.getElementById('docent-chat-body');
      if (chatBody) chatBody.innerText = this.docentState.fullText;
      return;
    }

    this.displayNextDocentLine();
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
        'explaining': 'Asset/4. Docent/explaining.webp',
        'thinking': 'Asset/4. Docent/neutral.webp',
        'excited': 'Asset/4. Docent/explaining.webp',
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

  showDocentChoices(choices) {
    const footer = document.getElementById('docent-options-footer');
    const list = document.getElementById('docent-options-list');
    if (!footer || !list) return;

    list.innerHTML = '';
    footer.style.display = 'block';

    const docentData = (typeof DOCENT_DIALOGUES !== 'undefined') ? DOCENT_DIALOGUES[this.docentState.animalCode] : null;

    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'btn-docent-option';
      btn.innerText = `💬 ${ch.text}`;
      btn.addEventListener('click', () => {
        if (docentData && docentData.questions && docentData.questions[ch.id]) {
          this.docentState.currentMode = 'QUESTION';
          this.docentState.currentQuestionId = ch.id;
          this.docentState.dialogueQueue = [...docentData.questions[ch.id].lines];
          this.docentState.queueIdx = 0;
          this.displayNextDocentLine();
        }
      });
      list.appendChild(btn);
    });

    // 대화 종료 버튼 추가
    const endBtn = document.createElement('button');
    endBtn.className = 'btn-docent-option';
    endBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    endBtn.style.color = 'var(--text-muted)';
    endBtn.innerText = '✕ 대화 종료하고 전시품 계속 감상하기';
    endBtn.addEventListener('click', () => {
      this.closeDocent();
    });
    list.appendChild(endBtn);
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
