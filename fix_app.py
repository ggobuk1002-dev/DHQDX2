# -*- coding: utf-8 -*-
import os, sys

print("Running clean synchronization...")
# Exit early so stale appended code won't run!
os._exit(0)



complete_app_js = r'''/**
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
        canvasContainer.style.display = 'block';
        canvasContainer.style.opacity = '1';
      }
      if (this.viewer) this.viewer.setCinematicIntro(true);
      
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
        console.warn('Video autoplay prevented:', err);
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
  openDocent(animalCode) {
    const modal = document.getElementById('docent-modal');
    if (!modal) return;

    this.docentState.animalCode = animalCode;
    const animal = EXHIBITION_DATA.animals.find(a => a.code === animalCode) || EXHIBITION_DATA.animals[0];
    const docentData = (typeof DOCENT_DIALOGUES !== 'undefined') ? DOCENT_DIALOGUES[animalCode] : null;

    const animalTag = document.getElementById('docent-animal-tag');
    const themeText = document.getElementById('docent-theme-text');
    if (animalTag) animalTag.innerText = `${animal.code} ${animal.name}`;
    if (themeText) themeText.innerText = (docentData && docentData.theme) ? docentData.theme : animal.panelTheme;

    modal.style.display = 'flex';

    if (docentData && docentData.start) {
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
'''

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(complete_app_js)
print("Complete js/app.js written successfully.")


# 1. Update js/data.js
with open('js/data.js', 'r', encoding='utf-8') as f:
    data_js = f.read()

# Fix 01 말: remove lion embed, keep glb
old_horse = r'''      id: 1,
      code: '01',
      name: '말',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 18, y: 45 },
      panelTheme: '말의 이동과 발가락의 진화',
      simpleDesc: '단단한 땅을 빠르게 달리는 인간의 오랜 동반자이자 기마문화의 상징.',
      assetType: 'glb',
      glb: 'Asset/3. Exhibition/glb/01.glb',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Horse" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/b279685790ac4194b51707df5cd245d4/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>','''

new_horse = r'''      id: 1,
      code: '01',
      name: '말',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 18, y: 45 },
      panelTheme: '말의 이동과 발가락의 진화',
      simpleDesc: '단단한 땅을 빠르게 달리는 인간의 오랜 동반자이자 기마문화의 상징.',
      assetType: 'glb',
      glb: 'Asset/3. Exhibition/glb/01.glb','''

old_tiger = r'''      id: 2,
      code: '02',
      name: '호랑이',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 26, y: 35 },
      panelTheme: '최상위 포식자의 위용과 단독 사냥 전략',
      simpleDesc: '산중을 지배하는 맹수이자 한반도 생태계의 정점에 선 최상위 포식자.',
      assetType: 'glb',
      glb: 'Asset/3. Exhibition/glb/02.glb',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Tiger" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/b279685790ac4194b51707df5cd245d4/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>','''

new_tiger = r'''      id: 2,
      code: '02',
      name: '호랑이',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 26, y: 35 },
      panelTheme: '최상위 포식자의 위용과 단독 사냥 전략',
      simpleDesc: '산중을 지배하는 맹수이자 한반도 생태계의 정점에 선 최상위 포식자.',
      assetType: 'glb',
      glb: 'Asset/3. Exhibition/glb/02.glb','''

if old_horse in data_js:
    data_js = data_js.replace(old_horse, new_horse)
if old_tiger in data_js:
    data_js = data_js.replace(old_tiger, new_tiger)

with open('js/data.js', 'w', encoding='utf-8') as f:
    f.write(data_js)
print("js/data.js fixed.")

# 2. Update js/app.js to support dedicated Three.js GLB viewer for 01.glb and 02.glb
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

glb_viewer_code = r'''
  /* GLB 모델 전용 3D 뷰어 렌더링 */
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
    loadingTip.style.background = 'rgba(8,9,13,0.8)';
    loadingTip.style.padding = '0.3rem 0.8rem';
    loadingTip.style.borderRadius = '12px';
    loadingTip.innerText = `3D 모델 로딩 중: ${animalName}...`;
    container.appendChild(loadingTip);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.0, 2.8);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfffaed, 2.5);
    dirLight1.position.set(3, 5, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd4af37, 1.8);
    dirLight2.position.set(-3, -2, -3);
    scene.add(dirLight2);

    // GLB 로더
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
      loadingTip.innerText = `${animalName} 3D 모델`;
    });

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
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
'''

# Update renderDetail in app.js
old_render_embed = r'''    // [핵심] 좌측 무대: con_Mapping.md의 3D 에셋 Embed (Sketchfab iframe or GLB)
    const embedWrap = document.getElementById('detail-3d-embed-wrap');
    if (embedWrap) {
      if (animal.embedHtml) {
        embedWrap.innerHTML = animal.embedHtml;
      } else if (animal.glb) {
        embedWrap.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--accent-gold);"><p>3D 모델: ${animal.name}</p></div>`;
      }
    }'''

new_render_embed = r'''    // [핵심] 좌측 무대: con_Mapping.md의 3D 에셋 Embed (Sketchfab iframe or GLB 뷰어)
    const embedWrap = document.getElementById('detail-3d-embed-wrap');
    if (embedWrap) {
      if (animal.glb) {
        this.renderGLBViewer(embedWrap, animal.glb, animal.name);
      } else if (animal.embedHtml) {
        embedWrap.innerHTML = animal.embedHtml;
      }
    }'''

if old_render_embed in app_js:
    app_js = app_js.replace(old_render_embed, new_render_embed)

if 'renderGLBViewer(' not in app_js:
    last_brace = app_js.rfind('}')
    app_js = app_js[:last_brace] + glb_viewer_code + "\n}\n"

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("js/app.js fixed.")

print("01.glb and 02.glb 3D loader completely fixed!")
exit(0)


# 1. Update css/style.css
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

snap_css = """
/* ============================================================
   SNAP SCROLL ENHANCEMENTS (1-Wheel-Tick Fast Navigation)
   ============================================================ */
#view-main {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  height: 100vh;
  padding-top: 0 !important;
  scroll-behavior: smooth;
}

.scrolly-content-container {
  padding: 0 1.5rem !important;
  max-width: 1200px;
  margin: 0 auto;
}

.scrolly-step {
  height: 100vh !important;
  min-height: 100vh !important;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  margin-bottom: 0 !important;
  opacity: 0.2;
  transform: translateY(20px);
  transition: all 0.5s ease-out;
}

.scrolly-step.is-active {
  opacity: 1;
  transform: translateY(0);
}

.scrolly-card {
  animation: cardFadeIn 0.5s ease-out;
}

@keyframes cardFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Floating Layer Quick Navigation Dots */
.layer-quick-nav {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: rgba(8, 9, 13, 0.7);
  padding: 0.8rem 0.6rem;
  border-radius: 30px;
  border: 1px solid var(--border-color-subtle);
  backdrop-filter: blur(10px);
}

.layer-nav-dot {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.layer-nav-dot:hover, .layer-nav-dot.active {
  background: var(--accent-gold);
  border-color: #fff;
  transform: scale(1.4);
  box-shadow: 0 0 12px var(--accent-gold-glow);
}

.layer-nav-dot::after {
  content: attr(data-label);
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid var(--accent-gold);
  color: #fff;
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.layer-nav-dot:hover::after {
  opacity: 1;
}
"""

if '.layer-quick-nav' not in css:
    css += "\n" + snap_css
    with open('css/style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("css/style.css updated.")

# 2. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

dot_nav_html = """
    <!-- Floating Layer Quick Navigation Dots -->
    <div class="layer-quick-nav" id="layer-quick-nav">
      <div class="layer-nav-dot active" data-step-target="intro" data-label="전체 유물"></div>
      <div class="layer-nav-dot" data-step-target="celestial" data-label="1층위 · 천상 (봉황)"></div>
      <div class="layer-nav-dot" data-step-target="sky" data-label="2층위 · 하늘 (신선)"></div>
      <div class="layer-nav-dot" data-step-target="land" data-label="3층위 · 육지 (산악)"></div>
      <div class="layer-nav-dot" data-step-target="water" data-label="4층위 · 물가 (연꽃)"></div>
      <div class="layer-nav-dot" data-step-target="sea" data-label="5층위 · 바다 (용)"></div>
    </div>
"""

if 'id="layer-quick-nav"' not in html:
    html = html.replace('<div class="scrolly-content-container">', dot_nav_html + '\n    <div class="scrolly-content-container">')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("index.html updated.")

# 3. Update js/app.js
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

if 'this.initWheelSnapController();' not in app_js:
    app_js = app_js.replace("this.initScrollyObserver();", "this.initScrollyObserver();\n    this.initWheelSnapController();")

old_obs = "const stepId = entry.target.getAttribute('data-step-id');\n          if (this.viewer) {\n            this.viewer.focusStep(stepId);\n          }"
new_obs = """const stepId = entry.target.getAttribute('data-step-id');
          const allSteps = Array.from(document.querySelectorAll('.scrolly-step'));
          const targetIdx = allSteps.indexOf(entry.target);
          if (targetIdx !== -1) this.currentStepIdx = targetIdx;

          // 도트 인디케이터 활성화
          document.querySelectorAll('.layer-nav-dot').forEach(dot => {
            dot.classList.toggle('active', dot.getAttribute('data-step-target') === stepId);
          });

          if (this.viewer) {
            this.viewer.focusStep(stepId);
          }"""

if old_obs in app_js:
    app_js = app_js.replace(old_obs, new_obs)

wheel_method = """
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

      // 휠 델타 감지 (살짝만 굴려도 훅 이동)
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

    // 방향키로도 훅훅 이동
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
"""

if 'initWheelSnapController()' not in app_js:
    # Insert right before the last closing brace
    last_brace_idx = app_js.rfind('}')
    app_js = app_js[:last_brace_idx] + wheel_method + "\n}\n"

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("js/app.js updated.")

print("All snap modifications successfully finished!")
exit(0)


with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Add wheel snap controller to ExhibitionApp
wheel_snap_code = r'''
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

      // 휠 델타 감지 (임계값 15 이상이면 즉시 다음/이전 단계로 훅 이동)
      if (Math.abs(e.deltaY) > 15) {
        e.preventDefault();
        this.isSnapping = true;

        if (e.deltaY > 0) {
          // 아래로 이동
          if (this.currentStepIdx < steps.length - 1) {
            this.currentStepIdx++;
          }
        } else {
          // 위로 이동
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
        }, 550); // 휠 연타 방지 쿨다운
      }
    }, { passive: false });

    // 키보드 방향키(위/아래)로도 훅훅 이동 지원
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
'''

# Inject initWheelSnapController into init() and observer
if 'this.initWheelSnapController();' not in app_js:
    app_js = app_js.replace("this.initScrollyObserver();", "this.initScrollyObserver();\n    this.initWheelSnapController();")

# Update observer to sync currentStepIdx and dot nav
old_observer = r'''          const stepId = entry.target.getAttribute('data-step-id');
          if (this.viewer) {
            this.viewer.focusStep(stepId);
          }'''

new_observer = r'''          const stepId = entry.target.getAttribute('data-step-id');
          const allSteps = Array.from(document.querySelectorAll('.scrolly-step'));
          const targetIdx = allSteps.indexOf(entry.target);
          if (targetIdx !== -1) this.currentStepIdx = targetIdx;

          // 도트 인디케이터 활성화
          document.querySelectorAll('.layer-nav-dot').forEach(dot => {
            dot.classList.toggle('active', dot.getAttribute('data-step-target') === stepId);
          });

          if (this.viewer) {
            this.viewer.focusStep(stepId);
          }'''

if old_observer in app_js:
    app_js = app_js.replace(old_observer, new_observer)

# Add method at the end of class if not present
if 'initWheelSnapController()' not in app_js:
    app_js = app_js[:-2] + "\n" + wheel_snap_code + "\n}\n"

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("js/app.js updated with wheel snap!")

# -------------------------------------------------------------
# Update css/style.css for smooth full-page snap
# -------------------------------------------------------------
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

snap_css = r'''
/* ============================================================
   SNAP SCROLL ENHANCEMENTS
   ============================================================ */
#view-main {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  height: 100vh;
  padding-top: 0 !important;
}

.scrolly-content-container {
  padding: 0 1.5rem !important;
  max-width: 1200px;
  margin: 0 auto;
}

.scrolly-step {
  height: 100vh !important;
  min-height: 100vh !important;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  margin-bottom: 0 !important;
  opacity: 0.2;
  transform: translateY(20px);
  transition: all 0.5s ease-out;
}

.scrolly-step.is-active {
  opacity: 1;
  transform: translateY(0);
}

.scrolly-card {
  animation: cardFadeIn 0.5s ease-out;
}

@keyframes cardFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Floating Layer Quick Navigation Dots */
.layer-quick-nav {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: rgba(8, 9, 13, 0.7);
  padding: 0.8rem 0.6rem;
  border-radius: 30px;
  border: 1px solid var(--border-color-subtle);
  backdrop-filter: blur(10px);
}

.layer-nav-dot {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.layer-nav-dot:hover, .layer-nav-dot.active {
  background: var(--accent-gold);
  border-color: #fff;
  transform: scale(1.4);
  box-shadow: 0 0 12px var(--accent-gold-glow);
}

.layer-nav-dot::after {
  content: attr(data-label);
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid var(--accent-gold);
  color: #fff;
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.layer-nav-dot:hover::after {
  opacity: 1;
}
'''

if '.layer-quick-nav' not in css:
    css += "\n" + snap_css

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("css/style.css updated with snap CSS!")

# -------------------------------------------------------------
# Update index.html to include floating layer nav dots
# -------------------------------------------------------------
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

dot_nav_html = r'''
    <!-- Floating Layer Quick Navigation Dots -->
    <div class="layer-quick-nav" id="layer-quick-nav">
      <div class="layer-nav-dot active" data-step-target="intro" data-label="전체 유물"></div>
      <div class="layer-nav-dot" data-step-target="celestial" data-label="1층위 · 천상 (봉황)"></div>
      <div class="layer-nav-dot" data-step-target="sky" data-label="2층위 · 하늘 (신선)"></div>
      <div class="layer-nav-dot" data-step-target="land" data-label="3층위 · 육지 (산악)"></div>
      <div class="layer-nav-dot" data-step-target="water" data-label="4층위 · 물가 (연꽃)"></div>
      <div class="layer-nav-dot" data-step-target="sea" data-label="5층위 · 바다 (용)"></div>
    </div>
'''

if 'id="layer-quick-nav"' not in html:
    html = html.replace('<div class="scrolly-content-container">', dot_nav_html + '\n    <div class="scrolly-content-container">')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html updated with layer dots!")

print("SNAPPY 1-TICK SCROLL INTEGRATION COMPLETE!")


# -------------------------------------------------------------
# 1. js/threeViewer.js
# -------------------------------------------------------------
threeViewer_code = r'''/**
 * 백제 금동대향로 3D 시네마틱 뷰어 (Three.js)
 * main.md 기준: 인트로 거대 초근접 실루엣 -> 5대 층위 스크롤텔링 카메라 전환
 */

class IncenseBurner3DViewer {
  constructor(canvasId, loadingCallback) {
    this.canvas = document.getElementById(canvasId);
    this.loadingCallback = loadingCallback;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.model = null;
    this.eclipseGlow = null;
    
    this.isCinematicIntro = true;
    this.autoRotateSpeed = 0.0015;
    
    // [intro.jpg]: 거대하게 카메라 앞 좌측을 가득 채우는 Cinematic Close-up Hero Object
    this.introCameraPos = new THREE.Vector3(-0.95, 0.45, 0.88);
    this.introTarget = new THREE.Vector3(0.35, 0.1, 0);
    
    // 층위별 카메라 위치
    this.stepCameraMap = {
      'intro': {
        pos: new THREE.Vector3(0, 0.05, 2.3),
        target: new THREE.Vector3(0, 0, 0)
      },
      'celestial': {
        pos: new THREE.Vector3(-0.35, 0.75, 1.1),
        target: new THREE.Vector3(0, 0.55, 0)
      },
      'sky': {
        pos: new THREE.Vector3(0.4, 0.45, 1.0),
        target: new THREE.Vector3(0, 0.35, 0)
      },
      'land': {
        pos: new THREE.Vector3(-0.45, 0.2, 1.2),
        target: new THREE.Vector3(0, 0.15, 0)
      },
      'water': {
        pos: new THREE.Vector3(0.45, -0.15, 1.1),
        target: new THREE.Vector3(0, -0.15, 0)
      },
      'sea': {
        pos: new THREE.Vector3(0, -0.45, 1.2),
        target: new THREE.Vector3(0, -0.4, 0)
      }
    };

    this.targetCameraPos = this.introCameraPos.clone();
    this.targetLookAt = this.introTarget.clone();
    this.currentLookAt = this.introTarget.clone();
    
    this.init();
  }

  init() {
    if (!this.canvas) return;

    this.scene = new THREE.Scene();

    const width = window.innerWidth || 800;
    const height = window.innerHeight || 600;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.copy(this.introCameraPos);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.85;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = false;
    this.controls.enabled = false;

    this.setupLighting();
    this.createEclipseAtmosphere();
    this.loadModel();

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x0a0e17, 0.4);
    this.scene.add(ambientLight);

    this.eclipseMainLight = new THREE.DirectionalLight(0xc8e6ff, 8.0);
    this.eclipseMainLight.position.set(-4.5, 3.5, -4.0);
    this.scene.add(this.eclipseMainLight);

    this.eclipseGoldLight = new THREE.DirectionalLight(0xd4af37, 3.0);
    this.eclipseGoldLight.position.set(4.0, -2.0, -3.0);
    this.scene.add(this.eclipseGoldLight);

    this.frontFillLight = new THREE.DirectionalLight(0xffeedd, 0.5);
    this.frontFillLight.position.set(0, 1.0, 4.0);
    this.scene.add(this.frontFillLight);
  }

  createEclipseAtmosphere() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, 'rgba(210, 240, 255, 0.9)');
      gradient.addColorStop(0.2, 'rgba(100, 180, 255, 0.4)');
      gradient.addColorStop(0.5, 'rgba(30, 80, 200, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        color: 0x99ccff,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.eclipseGlow = new THREE.Sprite(spriteMat);
      this.eclipseGlow.position.set(-0.55, 0.45, -0.6);
      this.eclipseGlow.scale.set(4.0, 4.0, 1);
      this.scene.add(this.eclipseGlow);
    } catch (e) {
      console.warn('Atmosphere glow skipped:', e);
    }
  }

  loadModel() {
    const loader = new THREE.GLTFLoader();
    const modelUrl = (typeof GD_MODEL_BASE64 !== 'undefined' && GD_MODEL_BASE64) ? GD_MODEL_BASE64 : 'GD_lowpoly.glb';

    loader.load(
      modelUrl,
      (gltf) => {
        this.model = gltf.scene;

        const darkAntiqueGold = new THREE.Color(0x3a3020);
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.geometry.computeVertexNormals();
            child.material = new THREE.MeshStandardMaterial({
              color: darkAntiqueGold,
              metalness: 0.92,
              roughness: 0.28,
              emissive: new THREE.Color(0x050402)
            });
          }
        });

        const box = new THREE.Box3().setFromObject(this.model);
        if (!box.isEmpty()) {
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = maxDim > 0 ? (1.6 / maxDim) : 1;
          this.model.scale.set(scale, scale, scale);

          const scaledBox = new THREE.Box3().setFromObject(this.model);
          const center = scaledBox.getCenter(new THREE.Vector3());
          this.model.position.x -= center.x;
          this.model.position.y -= center.y;
          this.model.position.z -= center.z;
        }

        this.scene.add(this.model);

        if (this.loadingCallback) {
          this.loadingCallback(100, true, false);
        }
      },
      (xhr) => {
        if (xhr.lengthComputable && this.loadingCallback) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          this.loadingCallback(percent, false, false);
        }
      },
      (error) => {
        console.warn('GLB Model load error, fallback:', error);
        if (this.loadingCallback) {
          this.loadingCallback(100, true, true);
        }
      }
    );
  }

  setCinematicIntro(enabled) {
    this.isCinematicIntro = enabled;
    if (enabled) {
      this.controls.enabled = false;
      this.targetCameraPos.copy(this.introCameraPos);
      this.targetLookAt.copy(this.introTarget);
      if (this.eclipseGlow) this.eclipseGlow.visible = true;
      if (this.renderer) this.renderer.toneMappingExposure = 0.85;
    } else {
      if (this.eclipseGlow) this.eclipseGlow.visible = false;
      if (this.renderer) this.renderer.toneMappingExposure = 1.05;
    }
  }

  setIntroMode(enabled) {
    this.setCinematicIntro(enabled);
  }

  focusStep(stepId) {
    this.isCinematicIntro = false;
    if (this.eclipseGlow) this.eclipseGlow.visible = false;
    if (this.renderer) this.renderer.toneMappingExposure = 1.05;

    const step = this.stepCameraMap[stepId] || this.stepCameraMap['intro'];
    if (step) {
      this.targetCameraPos.copy(step.pos);
      this.targetLookAt.copy(step.target);
    }
  }

  setLayerCamera(cameraPos, targetPos) {
    this.isCinematicIntro = false;
    if (this.eclipseGlow) this.eclipseGlow.visible = false;
    if (cameraPos) this.targetCameraPos.set(cameraPos.x, cameraPos.y, cameraPos.z);
    if (targetPos) this.targetLookAt.set(targetPos.x, targetPos.y, targetPos.z);
  }

  setDetailInteractive(enabled, part) {
    this.isCinematicIntro = false;
    this.controls.enabled = enabled;
    if (this.eclipseGlow) this.eclipseGlow.visible = false;

    if (enabled && part) {
      if (part.includes('정상') || part.includes('봉황')) {
        this.targetCameraPos.set(0, 0.8, 1.15);
        this.targetLookAt.set(0, 0.55, 0);
      } else if (part.includes('산악') || part.includes('뚜껑')) {
        this.targetCameraPos.set(0, 0.2, 1.05);
        this.targetLookAt.set(0, 0.1, 0);
      } else if (part.includes('연꽃') || part.includes('몸체')) {
        this.targetCameraPos.set(0, -0.2, 1.05);
        this.targetLookAt.set(0, -0.2, 0);
      } else if (part.includes('받침') || part.includes('용')) {
        this.targetCameraPos.set(0, -0.58, 1.15);
        this.targetLookAt.set(0, -0.45, 0);
      }
    }
  }

  onResize() {
    if (!this.canvas || !this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.model) {
      if (this.isCinematicIntro) {
        this.model.rotation.y += this.autoRotateSpeed;
      } else {
        this.model.rotation.y += this.autoRotateSpeed * 0.4;
      }
    }

    if (!this.controls.enabled) {
      this.camera.position.lerp(this.targetCameraPos, 0.05);
      this.currentLookAt.lerp(this.targetLookAt, 0.05);
      this.camera.lookAt(this.currentLookAt);
    } else {
      this.controls.update();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

window.IncenseBurner3DViewer = IncenseBurner3DViewer;
'''

with open('js/threeViewer.js', 'w', encoding='utf-8') as f:
    f.write(threeViewer_code)
print('js/threeViewer.js written.')

# -------------------------------------------------------------
# 2. js/data.js
# -------------------------------------------------------------
data_code = r'''/**
 * 금동대향로 가상웹전시 종합 데이터셋 (19종 표준화)
 * Source of Truth: MD문서/con_Mapping.md, main.md, references.md
 */
const EXHIBITION_DATA = {
  metadata: {
    title: '금동대향로 자연사박물관',
    subtitle: '자세히 보아야 예쁘다. 너도 그렇다.',
    team: '향로 없는 향로팀',
    theme: '금동대향로로 본 인류사',
    sourceInfo: '소장처: 국립부여박물관 | 국가유산포털 | 한국학중앙연구원',
    description: '백제금동대향로는 1993년 부여 능산리 절터에서 기적처럼 온전한 모습으로 출토되었습니다. 뚜껑에는 첩첩산중과 악사·동물들이, 몸체에는 연꽃과 수중 생물들이, 받침에는 용이 용틀임하고 있습니다. 본 전시는 문화유산 속에 담긴 생명과 자연을 매개로 인류와 생태계의 역사를 함께 탐색합니다.'
  },
  layers: [
    {
      id: 'celestial',
      layerIndex: 1,
      name: '1층위 · 천상 (봉황)',
      shortName: '천상',
      category: 'sky',
      title: '하늘을 품은 날갯짓, 봉황',
      desc: '향로 정상에서 목과 부리로 여의주를 품고 날개를 활짝 편 봉황. 백제인이 꿈꾸었던 가장 높은 이상세계의 시작입니다.',
      bg: 'Asset/2. Main/bg/bg_celestial.webp',
      animalCodes: ['18']
    },
    {
      id: 'sky',
      layerIndex: 2,
      name: '2층위 · 하늘 (신선 세계)',
      shortName: '하늘',
      category: 'sky',
      title: '음악이 흐르는 신선의 산',
      desc: '피리, 소비파, 현금, 북을 연주하는 5인의 악사와 하늘을 노니는 선인들. 자연과 인간이 조화를 이루는 영적 공간입니다.',
      bg: 'Asset/2. Main/bg/bg_sky.webp',
      animalCodes: []
    },
    {
      id: 'land',
      layerIndex: 3,
      name: '3층위 · 육지 (산악 세계)',
      shortName: '육지',
      category: 'land',
      title: '첩첩산중 생명의 터전',
      desc: '23개의 겹겹이 솟은 산봉우리 사이에 호랑이, 사슴, 멧돼지, 말 등 11종의 동물들과 기마수렵상이 살아 숨 쉽니다.',
      bg: 'Asset/2. Main/bg/bg_land.webp',
      animalCodes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
    },
    {
      id: 'water',
      layerIndex: 4,
      name: '4층위 · 물가 (연꽃 몸체)',
      shortName: '물가',
      category: 'water',
      title: '피어나는 연꽃과 수중 생태',
      desc: '활짝 피어난 3단의 연꽃잎 사이로 악어, 물고기, 수달, 물범, 백로 등 6종의 동물들이 노니는 생명의 물가가 펼쳐집니다.',
      bg: 'Asset/2. Main/bg/bg_waterside.webp',
      animalCodes: ['12', '13', '14', '15', '16', '17']
    },
    {
      id: 'sea',
      layerIndex: 5,
      name: '5층위 · 바다 (용 받침)',
      shortName: '바다',
      category: 'sea',
      title: '기운을 뿜어 올리는 용',
      desc: '한 다리를 치켜들고 물을 박차며 하늘로 솟구치듯 연꽃 몸체를 입으로 떠받치고 있는 용. 바다를 다스리는 신이자 백제의 역동적 기운을 상징합니다.',
      bg: 'Asset/2. Main/bg/bg_sea.webp',
      animalCodes: ['19']
    }
  ],
  animals: [
    {
      id: 1,
      code: '01',
      name: '말',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 18, y: 45 },
      panelTheme: '말의 이동과 발가락의 진화',
      simpleDesc: '단단한 땅을 빠르게 달리는 인간의 오랜 동반자이자 기마문화의 상징.',
      assetType: 'glb',
      glb: 'Asset/3. Exhibition/glb/01.glb',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Horse" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/b279685790ac4194b51707df5cd245d4/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel01-1.webp',
      panelImg2: 'Asset/3. Exhibition/N_Panel/webp/N_Panel01-2.webp',
      icon: 'Asset/2. Main/icon/01.webp',
      iconDark: 'Asset/2. Main/icon_dark/01_dark.webp',
      features: [
        '세 굽에서 하나의 외발굽으로 진화한 발가락',
        '초원 환경에 적응한 길고 강력한 다리 구조',
        '등자와 편자의 발명을 통해 확장된 인류 이동의 역사'
      ],
      scienceStory: '말의 조상인 에오히푸스는 네 개에서 세 개의 발가락을 가졌으나, 초원 환경이 확장되면서 단단한 지면을 빠르게 달리기 위해 가운뎃발가락 하나만 남은 외발굽(Ungula)으로 진화했습니다. 이는 기회주의적 영양 섭취 및 인류의 기마 수렵 문화와 깊게 연계됩니다.',
      sourceCode: 'REF_01_HORSE',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 한국자연사학회 포유류 진화 계통 연구'
    },
    {
      id: 2,
      code: '02',
      name: '호랑이',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 26, y: 35 },
      panelTheme: '최상위 포식자의 위용과 단독 사냥 전략',
      simpleDesc: '산중을 지배하는 맹수이자 한반도 생태계의 정점에 선 최상위 포식자.',
      assetType: 'glb',
      glb: 'Asset/3. Exhibition/glb/02.glb',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Tiger" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/b279685790ac4194b51707df5cd245d4/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel02.webp',
      icon: 'Asset/2. Main/icon/02.webp',
      iconDark: 'Asset/2. Main/icon_dark/02_dark.webp',
      features: [
        '울창한 산림에 완벽히 은폐되는 줄무늬 위장색',
        '숨죽여 다가가 단숨에 제압하는 발톱과 송곳니',
        '단독 생활에 최적화된 넓은 행동권과 영역 표시'
      ],
      scienceStory: '호랑이는 산악 지형의 수풀 속에서 몸을 숨기기 위해 세로 줄무늬를 발달시켰습니다. 사자와 달리 단독 사냥을 하므로 폭발적인 단거리 질주 근력과 척추의 유연성을 갖추고 있습니다.',
      sourceCode: 'REF_02_TIGER',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 국립생물자원관 포유류 생태 연구'
    },
    {
      id: 3,
      code: '03',
      name: '사자',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 34, y: 55 },
      panelTheme: '무리 사냥과 갈기의 사회적 신호',
      simpleDesc: '개방된 초원에서 무리를 지어 협력하는 백수의 왕이자 불교의 수호자.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Lion" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/b279685790ac4194b51707df5cd245d4/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel03.webp',
      icon: 'Asset/2. Main/icon/03.webp',
      iconDark: 'Asset/2. Main/icon_dark/03_dark.webp',
      features: [
        '우두머리 수컷의 체급과 건강을 과시하는 풍성한 갈기',
        '암수 간의 뚜렷한 성적이형성(Sexual Dimorphism)',
        '사바나 개활지에서 프라이드(무리)를 이뤄 조직적으로 사냥'
      ],
      scienceStory: '사자는 개활지 초원에서 시야가 트인 환경 때문에 단독 은폐가 어려워 무리(Pride)를 형성했습니다. 수컷의 어두운 갈기는 테스토스테론 수치와 영양 상태를 암컷과 경쟁자에게 전달하는 시각적 신호입니다.',
      sourceCode: 'REF_03_LION',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 스미스소니언 자연사박물관 생물학 총서'
    },
    {
      id: 4,
      code: '04',
      name: '족제비',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 42, y: 40 },
      panelTheme: '원통형 체형과 기동성 높은 사냥',
      simpleDesc: '좁은 굴과 덤불 속을 자유자재로 누비는 민첩한 소형 육식동물.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Mink (Lowpoly)" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/18b390f0dcc943288cc0971e5328159f/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel04.webp',
      icon: 'Asset/2. Main/icon/04.webp',
      iconDark: 'Asset/2. Main/icon_dark/04_dark.webp',
      features: [
        '설치류의 굴속으로 침투하기 유리한 길고 유연한 체형',
        '짧은 다리와 높은 기초대사율에 맞춘 잦은 사냥 습성',
        '위기 상황에서 분비하는 항문선의 강력한 화학 방어 물질'
      ],
      scienceStory: '족제비과 동물은 원통형의 길쭉한 신체 구조를 통해 지중 터널이나 바위틈에 서식하는 먹이를 효과적으로 추적합니다. 표면적 대비 부피가 커 체온 손실이 빠르므로 지속적인 에너지 섭취가 필요합니다.',
      sourceCode: 'REF_04_WEASEL',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 한국자연사학회 식육목 생태'
    },
    {
      id: 5,
      code: '05',
      name: '원숭이',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 50, y: 60 },
      panelTheme: '마주보는 엄지손가락과 수상 생활 적응',
      simpleDesc: '입체적 시야와 정교한 손놀림으로 수관층을 자유롭게 이동하는 영장류.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Monkey 3D animal" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/90df1c6b146749f1ba1f3346831a2f57/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel05.webp',
      icon: 'Asset/2. Main/icon/05.webp',
      iconDark: 'Asset/2. Main/icon_dark/05_dark.webp',
      features: [
        '나뭇가지를 쥐는 마주보는 엄지(Opposable Thumb)',
        '양안시를 통한 정밀한 3차원 거리 측정 능력',
        '복잡한 사회적 상호작용과 도구 활용 지능'
      ],
      scienceStory: '원숭이를 비롯한 영장류는 숲의 수관층에서 입체적으로 나뭇가지를 잡고 건너뛰기 위해 엄지손가락의 대립성과 안면 전면 배치 안구를 진화시켰습니다. 이는 도구 사용과 대뇌 피질 발달의 시초가 되었습니다.',
      sourceCode: 'REF_05_MONKEY',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 진화인류학 및 영장류학 연구'
    },
    {
      id: 6,
      code: '06',
      name: '사슴',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 58, y: 35 },
      panelTheme: '매년 재생되는 골질 뿔과 초식 반추 시스템',
      simpleDesc: '맑은 눈망울과 우아한 뿔을 지닌 숲의 전령이자 장수를 상징하는 길조.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Deer Family" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/00dd0126dcc0483392afa0a396d05f92/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel06.webp',
      icon: 'Asset/2. Main/icon/06.webp',
      iconDark: 'Asset/2. Main/icon_dark/06_dark.webp',
      features: [
        '피부(녹용)에서 완전한 뼈로 매년 탈락 및 재생되는 뿔(Antler)',
        '섬유질 식물을 분해하는 4개의 방으로 나뉜 반추위',
        '포식자를 감시하기 위해 좌우로 넓게 배치된 수평 타원형 동공'
      ],
      scienceStory: '사슴의 뿔은 소의 영구적인 뿔(Horn)과 달리 매년 자라고 떨어지는 골질 조직으로, 포유류 중 가장 빠른 줄기세포 기반 조직 재생 능력을 보여줍니다. 또한 넓은 시야각의 동공은 수풀 속 포식자를 조기에 발견합니다.',
      sourceCode: 'REF_06_DEER',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 국립생물자원관 척추동물 도감'
    },
    {
      id: 7,
      code: '07',
      name: '멧돼지',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 66, y: 55 },
      panelTheme: '굴토 습성과 숲의 토양 생태계 교란자',
      simpleDesc: '강인한 주둥이와 엄니로 흙을 파헤치는 산림 생태계의 엔지니어.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Boar Realistic" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/e2761cb2839447b6beb0b4ed132b0895/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel07.webp',
      icon: 'Asset/2. Main/icon/07.webp',
      iconDark: 'Asset/2. Main/icon_dark/07_dark.webp',
      features: [
        '단단한 토양과 바위를 뒤집는 연골성 주둥이 디스크',
        '위아래가 맞물리며 지속적으로 날카로워지는 자가 연마 엄니',
        '진흙 목욕을 통한 체온 조절 및 외부 기생충 방제'
      ],
      scienceStory: '멧돼지는 후각이 극도로 발달하여 땅속 20cm 깊이의 뿌리와 구근을 찾아냅니다. 멧돼지가 땅을 갈아엎는 행위(Rooting)는 산림 토양에 산소를 공급하고 식물 종자의 발아를 돕는 핵심 생태계 서비스 역할을 합니다.',
      sourceCode: 'REF_07_BOAR',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 산림청 국립산림과학원 생태 연구'
    },
    {
      id: 8,
      code: '08',
      name: '코끼리',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 74, y: 40 },
      panelTheme: '수만 개 근육의 코와 골격 생체역학',
      simpleDesc: '거대한 몸체와 정교한 코를 지닌 지혜로운 거인.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="African Elephant, skeleton" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/0a7cb290616442c88f89107d9a11f8f0/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel08.webp',
      icon: 'Asset/2. Main/icon/08.webp',
      iconDark: 'Asset/2. Main/icon_dark/08_dark.webp',
      features: [
        '뼈 없이 4만 개 이상의 근육 다발로 구성된 코(Proboscis)',
        '수 톤의 하중을 분산하는 발바닥의 두터운 쿠션 패드',
        '초저주파를 이용해 수 킬로미터 밖과 소통하는 청각 체계'
      ],
      scienceStory: '코끼리의 코는 코와 윗입술이 융합 진화한 기관으로, 무거운 통나무를 들면서도 바닥의 쌀알을 집을 수 있을 만큼 섬세합니다. 직립 기둥 형태의 다리 뼈 구조는 최소한의 근육 에너지로 거대한 체중을 지탱합니다.',
      sourceCode: 'REF_08_ELEPHANT',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 런던 자연사박물관 고생물 골격학'
    },
    {
      id: 9,
      code: '09',
      name: '이상한 부리를 가진 새',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 82, y: 58 },
      panelTheme: '먹이 자원에 따른 부리의 형태적 방산적응',
      simpleDesc: '특이한 곡선 부리를 지녀 자연의 다양한 먹이에 적응한 조류.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Finches Birds (Lowpoly)" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/1c27c1bec5f6440981a2673db56d0c11/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel09.webp',
      icon: 'Asset/2. Main/icon/09.webp',
      iconDark: 'Asset/2. Main/icon_dark/09_dark.webp',
      features: [
        '특정 식물의 꿀, 씨앗, 곤충을 채취하기 위해 특화된 부리 곡률',
        '비행 에너지를 줄이기 위한 경량화된 두개골과 케라틴 부리 표면',
        '다윈의 핀치새로 대표되는 진화론적 적응방산(Adaptive Radiation)'
      ],
      scienceStory: '새의 부리는 손이 없는 조류에게 만능 도구입니다. 서식지의 먹이 종류에 따라 부리의 길이, 두께, 곡률이 극적으로 분화하여 생태적 지위를 분할합니다.',
      sourceCode: 'REF_09_STRANGE_BIRD',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 조류 계통분류학 및 진화생물학 저널'
    },
    {
      id: 10,
      code: '10',
      name: '뱀을 물고 있는 야수',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 89, y: 38 },
      panelTheme: '독성 파충류에 대한 면역성과 포식자-피식자 공진화',
      simpleDesc: '맹독의 뱀을 제압하여 물고 있는 백제의 신비로운 맹수.',
      assetType: 'gif',
      embedHtml: '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#05070a;"><img src="Asset/3. Exhibition/Asset/cramorant-gorging.gif" style="max-width:90%;max-height:85%;object-fit:contain;border-radius:12px;box-shadow:0 0 30px rgba(0,0,0,0.8);" alt="뱀을 물고 있는 야수"></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel10.webp',
      icon: 'Asset/2. Main/icon/10.webp',
      iconDark: 'Asset/2. Main/icon_dark/10_dark.webp',
      features: [
        '신경독에 저항성을 갖는 니코틴성 아세틸콜린 수용체 변이',
        '뱀의 공격 속도를 능가하는 반사신경과 두터운 털가죽',
        '뱀의 머리를 정확히 타격하여 무력화시키는 사냥 기술'
      ],
      scienceStory: '라텔이나 몽구스 같은 동물들은 맹독성 뱀을 사냥하기 위해 아세틸콜린 수용체 구조를 변형시켜 독소가 결합하지 못하도록 진화시켰습니다.',
      sourceCode: 'REF_10_BEAST_SNAKE',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 진화면역학 및 동물생태학 연구'
    },
    {
      id: 11,
      code: '11',
      name: '볏을 가진 새',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 95, y: 55 },
      panelTheme: '성선택(Sexual Selection)과 화려한 장식 깃의 진화',
      simpleDesc: '머리 위에 화려한 볏을 세우고 구애하는 우아한 조류.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Great Argus (NHMW-ZOO-VS-70946 &amp; 70947)" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/e3827c13a3364e8084797531b58c6ed6/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel11.webp',
      icon: 'Asset/2. Main/icon/11.webp',
      iconDark: 'Asset/2. Main/icon_dark/11_dark.webp',
      features: [
        '포식자에게 눈에 띄는 위험을 감수하고 번식 경쟁을 위해 발달한 머리 볏',
        '구애 의식 시 펼쳐지는 부채꼴 형태의 시각 디스플레이',
        '자비의 원리(Handicap Principle)에 기반한 우수한 유전자 증명'
      ],
      scienceStory: '화려한 볏과 꼬리 깃털은 생존에는 불리하지만, 짝짓기 선택에서 건강함과 면역력을 증명하는 핸디캡 이론의 대표적 산물입니다.',
      sourceCode: 'REF_11_CRESTED_BIRD',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 동물행동학 및 조류 진화학'
    },
    {
      id: 12,
      code: '12',
      name: '악어',
      layer: 'water',
      layerName: '물가 (연꽃 몸체)',
      layerCoords: { x: 20, y: 50 },
      panelTheme: '반수생 잠복 사냥과 원시 파충류 골판 방어갑',
      simpleDesc: '수면 아래 숨어 눈과 콧구멍만 내놓고 사냥하는 수중의 절대 강자.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Australian Freshwater Crocodile ( underwater )" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/d87d75c454554ca78ac582c6a130e7cb/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Pane12.webp',
      icon: 'Asset/2. Main/icon/12.webp',
      iconDark: 'Asset/2. Main/icon_dark/12_dark.webp',
      features: [
        '머리 상단에 일직선으로 배치되어 잠수 중에도 호흡과 감시가 가능한 감각기관',
        '피부 아래에 골화된 판(Osteoderms)으로 이루어진 천연 방탄 갑옷',
        '물속에서 먹이를 찢어 삼키는 데스 롤(Death Roll) 회전력'
      ],
      scienceStory: '악어는 중생대부터 신체 설계를 거의 바꾸지 않은 살아있는 화석입니다. 눈, 귀, 콧구멍이 두개골 최상단에 수평으로 배치되어 몸 전체를 수중에 숨긴 채 완벽한 기습을 감행합니다.',
      sourceCode: 'REF_12_CROCODILE',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 고생물학 및 척추동물 진화사'
    },
    {
      id: 13,
      code: '13',
      name: '물고기 (실러캔스/육기어류)',
      layer: 'water',
      layerName: '물가 (연꽃 몸체)',
      layerCoords: { x: 35, y: 40 },
      panelTheme: '지느러미에서 사지동물의 다리로의 진화적 가교',
      simpleDesc: '수중에서 육지로 진출한 척추동물의 위대한 도약을 품은 존재.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="coelacanth (genus Latimeria)" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/162ba6f0282c453789c77a4fa2f84e6e/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel13.webp',
      icon: 'Asset/2. Main/icon/13.webp',
      iconDark: 'Asset/2. Main/icon_dark/13_dark.webp',
      features: [
        '근육질 줄기와 뼈대가 내장되어 다리처럼 작동하는 육질 지느러미(Lobe-fin)',
        '물속 흐름과 전기장을 감지하는 측선(Lateral Line) 감각계',
        '데본기 육상 척추동물(사지류)의 직접적 조상 형태 보존'
      ],
      scienceStory: '실러캔스와 같은 육기어류의 지느러미 내부에는 인간의 팔다리와 상동 구조인 상완골, 요골, 척골의 원형 뼈대가 존재합니다.',
      sourceCode: 'REF_13_FISH_COELACANTH',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 고생물학 및 비교해부학 총서'
    },
    {
      id: 14,
      code: '14',
      name: '물범',
      layer: 'water',
      layerName: '물가 (연꽃 몸체)',
      layerCoords: { x: 50, y: 58 },
      panelTheme: '육상 식육류의 해양 복귀와 유선형 지느러미발 진화',
      simpleDesc: '두터운 지방층과 지느러미발로 차가운 물살을 가르는 해양 포유류.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="seal" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/38dc4e92f17e444597274bff6be913c2/embed?autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/jpg/N_Panel14.jpg',
      icon: 'Asset/2. Main/icon/14.webp',
      iconDark: 'Asset/2. Main/icon_dark/14_dark.webp',
      features: [
        '발가락 사이에 물갈퀴가 발달하여 변형된 지느러미발(Flipper)',
        '극저온의 물속에서도 체온을 유지하는 두꺼운 피하지방층(Blubber)',
        '잠수 중 산소를 효율적으로 저장하는 미오글로빈 농식 근육'
      ],
      scienceStory: '물범과 물개 등의 기각류는 곰이나 족제비와 공통 조상을 공유하는 육상 포유류였으나 바다로 복귀하여 사지가 지느러미발로 진화했습니다.',
      sourceCode: 'REF_14_SEAL',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 해양포유류 진화생물학 연구'
    },
    {
      id: 15,
      code: '15',
      name: '수달',
      layer: 'water',
      layerName: '물가 (연꽃 몸체)',
      layerCoords: { x: 65, y: 38 },
      panelTheme: '방수 털 구조와 수중 진동 감지 수염(Vibrissae)',
      simpleDesc: '물과 육지를 오가며 하천 생태계의 건강성을 대변하는 지표종.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Sea Otter Mammal (Endangered)" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/188d7264dc354c7195cf47f4540bf252/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel15.webp',
      icon: 'Asset/2. Main/icon/15.webp',
      iconDark: 'Asset/2. Main/icon_dark/15_dark.webp',
      features: [
        '공기층을 가두어 물이 피부에 닿지 않게 하는 이중 구조 방수 모피',
        '탁한 물속에서도 먹이 물고기의 미세 진동을 포착하는 입가의 감각수염',
        '수중에서 방향을 전환하는 노 역할을 하는 유연한 근육질 꼬리'
      ],
      scienceStory: '수달의 털은 제곱센티미터당 수만 가닥의 치밀한 솜털로 이루어져 공기 방울을 포획합니다. 이를 통해 수중 저체온증을 방지합니다.',
      sourceCode: 'REF_15_OTTER',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 국립생태원 수생태계 연구'
    },
    {
      id: 16,
      code: '16',
      name: '백로',
      layer: 'water',
      layerName: '물가 (연꽃 몸체)',
      layerCoords: { x: 80, y: 52 },
      panelTheme: '물 굴절 보정과 경추 굽힘을 통한 정밀 작살 사냥',
      simpleDesc: '물가에 고요히 서서 날렵하게 물고기를 낚아채는 청결의 상징.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Realistic Heron 3D Model" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/95a74fb41f1a46f0acec81a2d6c85093/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel16-1.webp',
      panelImg2: 'Asset/3. Exhibition/N_Panel/webp/N_Panel16-2.webp',
      icon: 'Asset/2. Main/icon/16.webp',
      iconDark: 'Asset/2. Main/icon_dark/16_dark.webp',
      features: [
        'S자로 접혔다 탄성으로 튀어나가는 특수 변형 경추(목뼈) 구조',
        '빛의 굴절각을 시각 신경망에서 실시간 보정하는 시각 연산',
        '펄이나 얕은 여울에 발이 빠지지 않도록 넓게 벌어지는 긴 발가락'
      ],
      scienceStory: '백로는 물 표면에서 발생하는 빛의 굴절을 뇌 시각 피질에서 계산하여, 실제 위치보다 떠 보이는 물고기를 정확하게 작살처럼 내리꽂아 포획합니다.',
      sourceCode: 'REF_16_HERON',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 조류 생체역학 및 생태학 저널'
    },
    {
      id: 17,
      code: '17',
      name: '달리는 새 (주조류)',
      layer: 'water',
      layerName: '물가 (연꽃 몸체)',
      layerCoords: { x: 92, y: 44 },
      panelTheme: '비행 포기와 지상 질주 골격으로의 역행 진화',
      simpleDesc: '날개를 접고 대지를 힘차게 질주하는 지상 적응 조류.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Little Spotted Kiwi" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/b61466de53d24988835bb755dc2f73da/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel18.webp',
      panelImg2: 'Asset/3. Exhibition/N_Panel/webp/N_Panel19.webp',
      icon: 'Asset/2. Main/icon/17.webp',
      iconDark: 'Asset/2. Main/icon_dark/17_dark.webp',
      features: [
        '비행 근육이 부착되던 용골봉(Keel)의 소실 및 편평한 흉골',
        '강력한 추진력을 제공하는 발달된 대퇴골과 두툼한 건(Tendon)',
        '단단한 땅과의 마찰을 줄이기 위해 감소된 발가락 수'
      ],
      scienceStory: '타조, 키위 같은 주조류는 날기 위해 드는 막대한 에너지 대사 대신 지상 질주력을 극대화하는 방향으로 진화했습니다.',
      sourceCode: 'REF_17_RUNNING_BIRD',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 척추동물 고생물학 및 조류 진화'
    },
    {
      id: 18,
      code: '18',
      name: '봉황 (금시조)',
      layer: 'celestial',
      layerName: '천상 (정상)',
      layerCoords: { x: 50, y: 45 },
      panelTheme: '태양 숭배와 조류의 궁극적 이상화 형태',
      simpleDesc: '향로 정상에서 여의주를 품고 날개를 펴 태평성대를 알리는 신조.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="food (pes) rooster" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/778006bf99114fde8898b61104bc43d4/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel20.webp',
      icon: 'Asset/2. Main/icon/18.webp',
      iconDark: 'Asset/2. Main/icon_dark/18_dark.webp',
      features: [
        '닭의 머리, 뱀의 목, 제비의 턱, 공작의 꼬리가 융합된 복합 상징',
        '목과 부리 사이에 둥근 여의주를 품은 백제 특유의 조형미',
        '가슴과 날개깃에 설계된 향 연기 분출 통로'
      ],
      scienceStory: '봉황은 꿩, 공작, 맹금류의 가장 강력하고 화려한 해부학적 형질들이 결합된 상징적 생명체입니다.',
      sourceCode: 'REF_18_PHOENIX',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 한국미술사학회 고대 금속공예 연구'
    },
    {
      id: 19,
      code: '19',
      name: '용',
      layer: 'sea',
      layerName: '바다 (받침)',
      layerCoords: { x: 50, y: 50 },
      panelTheme: '수생 파충류의 역동성과 유체역학적 투조 기법',
      simpleDesc: '용틀임하며 물을 박차고 솟아올라 향로 전체를 떠받치는 신성한 용.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Animated Realistic Lowpoly Chinese Dragon" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/d942a0d167594169b3f037f562458d38/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/unwrapped_map.webp',
      icon: 'Asset/2. Main/icon/19.webp',
      iconDark: 'Asset/2. Main/icon_dark/19_dark.webp',
      features: [
        '한 다리를 치켜들고 용틀임하는 역동적 3차원 입체 투조 주조',
        '뱀의 몸체, 물고기 비늘, 사슴 뿔, 독수리 발톱이 결합된 수신(水神)',
        '하부의 하중을 분산하면서도 부유감을 극대화한 구조역학적 설계'
      ],
      scienceStory: '용의 도상은 고대인들이 거대 악어, 비단뱀 등을 관찰하며 물을 다스리는 궁극의 생명체로 승화시킨 것입니다.',
      sourceCode: 'REF_19_DRAGON',
      sourceText: '출처: 국립부여박물관 소장 백제금동대향로 도판 | 국립문화재연구원 고대 주조공학 분석'
    }
  ]
};

window.EXHIBITION_DATA = EXHIBITION_DATA;
'''

with open('js/data.js', 'w', encoding='utf-8') as f:
    f.write(data_code)
print('js/data.js written.')

# -------------------------------------------------------------
# 3. index.html
# -------------------------------------------------------------
html_code = r'''<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>금동대향로 자연사박물관 | 가상 웹전시</title>
  
  <!-- Web Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;600;700;900&display=swap" rel="stylesheet">
  
  <!-- Main Stylesheet -->
  <link rel="stylesheet" href="css/style.css?v=20260825_2">
  
  <!-- Three.js & Loaders (CDN) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
</head>
<body>

  <!-- Global Loading Screen -->
  <div id="global-loader" style="position: fixed; inset: 0; background: #08090d; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.5s ease;">
    <div style="width: 50px; height: 50px; border: 3px solid rgba(212,175,55,0.2); border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1.5rem;"></div>
    <div id="global-loader-text" style="color: #d4af37; font-family: 'Noto Serif KR', serif; font-size: 1.1rem; letter-spacing: 0.05em; margin-bottom: 1rem;">금동대향로 유물 데이터를 불러오는 중...</div>
    <div style="width: 260px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
      <div id="global-loader-bar" style="width: 0%; height: 100%; background: #d4af37; transition: width 0.3s ease;"></div>
    </div>
  </div>
  <style>
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>

  <!-- App Header -->
  <header class="app-header">
    <div class="brand-title" data-nav="main">
      <div class="brand-icon">향</div>
      <div>
        <span class="brand-name">금동대향로 자연사박물관</span>
        <span class="brand-sub">가상웹전시</span>
      </div>
    </div>

    <nav class="header-nav">
      <button class="nav-btn" data-nav="intro">인트로</button>
      <button class="nav-btn active" data-nav="main">전시관람(메인)</button>
      <button class="nav-btn" data-nav="catalog">상징도감</button>
      <button class="nav-btn" data-nav="unwrapped">전개도 탐색</button>
      <button class="btn-docent-call" id="btn-docent-call" title="개별 동물 상세 화면에서 활성화됩니다">
        <img src="Asset/4. Docent/neutral.webp" alt="해설사" class="header-docent-thumb">
        <span id="header-docent-label">과학해설사 래피드왜건</span>
        <span class="docent-status-dot"></span>
      </button>
    </nav>
  </header>

  <!-- 3D Background Canvas (Shared across Intro/Main) -->
  <div id="scrolly-canvas-container" class="scrolly-canvas-container">
    <div id="scrolly-layer-bg" class="scrolly-layer-bg"></div>
    <canvas id="scrolly-canvas" class="scrolly-3d-canvas"></canvas>
  </div>

  <!-- ============================================================
       1. VIEW: INTRO
       ============================================================ -->
  <section id="view-intro" class="view-section active">
    <div class="intro-media-wrapper">
      <video id="intro-video" class="intro-video" autoplay muted playsinline preload="auto">
        <source src="Asset/1. Intro/opening.mp4" type="video/mp4">
      </video>
      <div id="intro-blackout" class="intro-blackout-overlay"></div>
    </div>

    <div id="intro-ui-overlay" class="intro-ui-overlay">
      <span class="intro-badge">BAEKJE GREAT GILT-BRONZE INCENSE BURNER</span>
      <h1 class="intro-title">금동대향로 자연사박물관</h1>
      <p class="intro-subtitle">"자세히 보아야 예쁘다. 너도 그렇다."<br>하나의 유물 속에서 피어나는 천상·하늘·육지·물가·바다의 생명과 인류사</p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button id="btn-start-exhibition" class="btn-start-exhibition">
          <span>전시 관람 시작하기</span>
          <span>→</span>
        </button>
        <button id="btn-replay-intro" class="btn-replay-intro">
          <span>🎬 오프닝 영상 다시보기</span>
        </button>
      </div>
    </div>

    <button id="btn-intro-skip" class="intro-skip-btn">오프닝 건너뛰기 ✕</button>
  </section>

  <!-- ============================================================
       2. VIEW: MAIN (SCROLLYTELLING 5 LAYERS)
       ============================================================ -->
  <section id="view-main" class="view-section">
    <div class="scrolly-content-container">
      
      <!-- Step 0: Whole Relic -->
      <div class="scrolly-step align-center is-active" data-step-id="intro">
        <div class="scrolly-card">
          <span class="scrolly-tag">전시 개요</span>
          <h2 class="scrolly-title">하나의 유물을 마주하다</h2>
          <p class="scrolly-desc">백제금동대향로는 1993년 부여 능산리 절터에서 온전한 모습으로 출토되었습니다. 높이 61.8cm, 무게 11.8kg의 대형 향로로 백제 금속공예와 이상세계의 정점을 보여줍니다.</p>
          <span class="btn-step-action">↓ 아래로 스크롤하여 5대 층위 탐색</span>
        </div>
      </div>

      <!-- Step 1: Celestial (Phoenix) -->
      <div class="scrolly-step align-left" data-step-id="celestial">
        <div class="scrolly-card">
          <span class="scrolly-tag">1층위 · 천상</span>
          <h2 class="scrolly-title">하늘을 품은 날갯짓, 봉황</h2>
          <p class="scrolly-desc">향로 정상에서 목과 부리로 여의주를 품고 날개를 활짝 펴고 서 있는 봉황. 천하가 태평할 때 나타난다는 성스러운 새로 백제인이 꿈꾸었던 가장 높은 이상세계의 시작입니다.</p>
          <div class="scrolly-link-row">
            <button class="btn-link-layer" data-goto-unwrapped="celestial">🗺️ 천상 층위 전개도 탐색 →</button>
          </div>
          <span class="btn-step-action">↓ 신선 세계가 펼쳐지는 하늘로</span>
        </div>
      </div>

      <!-- Step 2: Sky (Musicians & Immortals) -->
      <div class="scrolly-step align-right" data-step-id="sky">
        <div class="scrolly-card">
          <span class="scrolly-tag">2층위 · 하늘</span>
          <h2 class="scrolly-title">음악이 흐르는 신선의 산</h2>
          <p class="scrolly-desc">피리, 소비파, 현금, 북을 연주하는 5인의 악사와 하늘을 날아다니는 신선들. 뚜껑 곳곳에 뚫린 구멍으로 향 연기가 피어오르면 산과 구름이 살아 움직입니다.</p>
          <div class="scrolly-link-row">
            <button class="btn-link-layer" data-goto-unwrapped="sky">🗺️ 하늘 층위 전개도 탐색 →</button>
          </div>
          <span class="btn-step-action">↓ 생명의 터전 육지(산악)로</span>
        </div>
      </div>

      <!-- Step 3: Land (Mountain Animals) -->
      <div class="scrolly-step align-left" data-step-id="land">
        <div class="scrolly-card">
          <span class="scrolly-tag">3층위 · 육지</span>
          <h2 class="scrolly-title">첩첩산중 생명의 터전</h2>
          <p class="scrolly-desc">23개의 겹겹이 솟은 산봉우리 사이에 호랑이, 사슴, 멧돼지, 말, 코끼리 등 11종의 동물들과 기마수렵상이 생생하게 살아 숨 쉬고 있습니다.</p>
          <div class="scrolly-link-row">
            <button class="btn-link-layer" data-goto-unwrapped="land">🗺️ 육지 층위 전개도 탐색 (11종) →</button>
          </div>
          <span class="btn-step-action">↓ 피어나는 연꽃과 물가로</span>
        </div>
      </div>

      <!-- Step 4: Water (Lotus & Aquatic Life) -->
      <div class="scrolly-step align-right" data-step-id="water">
        <div class="scrolly-card">
          <span class="scrolly-tag">4층위 · 물가</span>
          <h2 class="scrolly-title">피어나는 연꽃과 수중 생태</h2>
          <p class="scrolly-desc">활짝 피어난 3단의 연꽃잎 사이로 악어, 물고기, 수달, 물범, 백로 등 6종의 동물들이 노니는 생명의 물가가 펼쳐집니다.</p>
          <div class="scrolly-link-row">
            <button class="btn-link-layer" data-goto-unwrapped="water">🗺️ 물가 층위 전개도 탐색 (6종) →</button>
          </div>
          <span class="btn-step-action">↓ 바다를 떠받치는 용으로</span>
        </div>
      </div>

      <!-- Step 5: Sea (Dragon Base) -->
      <div class="scrolly-step align-center" data-step-id="sea">
        <div class="scrolly-card">
          <span class="scrolly-tag">5층위 · 바다</span>
          <h2 class="scrolly-title">기운을 뿜어 올리는 용</h2>
          <p class="scrolly-desc">한 다리를 치켜들고 물을 박차며 하늘로 솟구치듯 연꽃 몸체를 입으로 떠받치고 있는 용. 바다를 다스리는 신이자 백제의 역동적 기운을 상징합니다.</p>
          <div class="scrolly-link-row">
            <button class="btn-link-layer" data-goto-unwrapped="sea">🗺️ 바다 층위 전개도 탐색 →</button>
          </div>
        </div>
      </div>

      <!-- Bottom CTA Section -->
      <div class="scrolly-footer-cta">
        <h2 style="font-family: var(--font-serif); font-size: 2.2rem; color: #fff; margin-bottom: 1rem;">향로 속 19개 상징을 발견하셨나요?</h2>
        <p style="color: var(--text-secondary); max-width: 600px; margin-bottom: 2.5rem;">이제 개별 동물들의 숨겨진 문화적 상징과 자연과학적 비밀을 직접 탐색해 보세요.</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn-explore-catalog" data-nav="catalog">
            <span>상징 도감 탐색</span>
            <span>🏛️</span>
          </button>
          <button class="btn-explore-catalog" data-nav="unwrapped" style="background: rgba(212,175,55,0.15); border: 1px solid var(--accent-gold);">
            <span>전개도 5층위 공간 탐색</span>
            <span>🗺️</span>
          </button>
        </div>
      </div>

    </div>
  </section>

  <!-- ============================================================
       3. VIEW: CATALOG / SYMBOL DISCOVERY & UNWRAPPED 5-LAYER MAP
       ============================================================ -->
  <section id="view-catalog" class="view-section">
    <div class="catalog-header">
      
      <!-- Sub View Mode Switcher -->
      <div class="view-mode-tabs">
        <button class="view-mode-btn active" id="tab-mode-cards">
          <span>📋 상징 도감 (카드형)</span>
        </button>
        <button class="view-mode-btn" id="tab-mode-unwrapped">
          <span>🗺️ 전개도 상징 탐색 (5대 층위 공간형)</span>
        </button>
      </div>

      <h2 class="catalog-title" id="discovery-title">향로의 그림자: 19종 상징 도감</h2>
      <p class="catalog-desc" id="discovery-desc">검은 실루엣 속 동물을 탐색하면 본래의 생동감 넘치는 색을 되찾습니다. 19개 백제의 상징을 모두 발견해 보세요.</p>

      <!-- Discovery Progress -->
      <div class="discovery-progress-wrap">
        <div class="progress-header">
          <span style="color: var(--accent-gold); font-weight: 700;">상징 탐구 완성도</span>
          <span id="discovery-progress-label" style="color: var(--text-secondary);">0 / 19 개 발견 (0%)</span>
        </div>
        <div class="progress-track">
          <div id="discovery-progress-bar" class="progress-bar-fill"></div>
        </div>
      </div>

      <!-- Filter Tabs (Cards Mode) -->
      <div class="catalog-tabs" id="catalog-category-tabs">
        <button class="tab-btn active" data-category="all">전체 상징 (19)</button>
        <button class="tab-btn" data-category="sky">천상 · 하늘 (1)</button>
        <button class="tab-btn" data-category="land">육지 · 산악 (11)</button>
        <button class="tab-btn" data-category="water">물가 · 연꽃 (6)</button>
        <button class="tab-btn" data-category="sea">바다 · 용 (1)</button>
      </div>
    </div>

    <!-- Container 1: Cards Grid -->
    <div class="animal-grid" id="animal-grid">
      <!-- Dynamically generated by app.js -->
    </div>

    <!-- Container 2: Unwrapped 5-Layers Space (Implementation Rule 7-1) -->
    <div class="unwrapped-layers-wrapper" id="unwrapped-map-container" style="display: none;">
      <div class="unwrapped-intro-guide">
        <h3>🗺️ 금동대향로 5대 층위 전개도 공간 탐색</h3>
        <p>전개도는 천상·하늘·육지·물가·바다의 다섯 세계로 나누어 펼쳐집니다. 각 층위의 배경 위 마커를 클릭하여 상세 콘텐츠로 진입하거나, 3D 메인화면과 상호 이동할 수 있습니다.</p>
      </div>

      <div class="unwrapped-layers-list" id="unwrapped-layers-list">
        <!-- 5 Layer blocks generated dynamically by app.js -->
      </div>
    </div>

    <!-- Final Discovery Completion Banner -->
    <div id="final-completion-banner" class="final-completion-banner" style="display: none;">
      <div class="banner-content">
        <div class="banner-badge">✨ 19종 상징 탐구 완료</div>
        <h3>금동대향로의 모든 생명과 세계를 마주하셨습니다!</h3>
        <p>전체 상징을 발견한 기념으로 특별한 최종 헌정 엠블럼을 감상하세요.</p>
        <button id="btn-view-final-emblem" class="btn-view-final">
          <span>🏆 최종 완성본(Final) 감상하기</span>
        </button>
      </div>
    </div>
  </section>

  <!-- ============================================================
       4. VIEW: DETAIL (3D ASSET EMBED + MULTI-PERSPECTIVE)
       ============================================================ -->
  <section id="view-detail" class="view-section">
    
    <!-- Navigation Top Bar -->
    <div class="detail-nav-top">
      <button class="btn-back-to-catalog" data-nav="catalog">
        <span>←</span>
        <span>상징 목록으로 돌아가기</span>
      </button>
      <div class="detail-step-indicator" id="detail-indicator">01 / 19</div>
    </div>

    <div class="detail-main-layout">
      
      <!-- Left Column: 3D Asset Embed Stage -->
      <div class="detail-stage-column">
        <div class="stage-viewer-wrap" id="detail-stage-wrap">
          <!-- 3D Embed Container (Sketchfab iframe or Three.js GLB) -->
          <div id="detail-3d-embed-wrap" class="detail-3d-embed-wrap">
            <!-- Injected dynamically by app.js -->
          </div>
        </div>
        
        <!-- Controls & Docent Call under 3D Asset -->
        <div class="stage-controls">
          <span class="stage-hint" id="detail-stage-hint">💡 마우스로 3D 모델을 회전/확대하여 관찰하세요</span>
          <button id="btn-detail-docent-direct" class="btn-detail-docent-call">
            <img src="Asset/4. Docent/explaining.webp" alt="해설사">
            <span>🎙️ 래피드왜건 과학해설 듣기</span>
          </button>
        </div>
      </div>

      <!-- Right Column: Multi-Perspective Info Panel -->
      <div class="detail-info-column">
        
        <!-- Header Info -->
        <div class="detail-header-info">
          <span class="detail-code-tag" id="detail-code-tag">NO. 01 · 육지 (산악)</span>
          <h1 class="detail-title" id="detail-title">말</h1>
          <p class="detail-simple-desc" id="detail-simple-desc">단단한 땅을 빠르게 달리는 인간의 오랜 동반자이자 기마문화의 상징.</p>
        </div>

        <!-- 3 Key Features Box -->
        <div class="feature-box" id="detail-features-box">
          <h4>눈여겨볼 핵심 관찰 포인트 3가지</h4>
          <ul class="feature-list" id="detail-features-list">
            <!-- Dynamically populated -->
          </ul>
        </div>

        <!-- Perspective 1: Social & Cultural Story -->
        <div class="perspective-section" id="detail-culture-section">
          <div class="perspective-header">
            <div class="perspective-icon icon-culture">🏛️</div>
            <h3 class="perspective-title">사회 · 문화적 관점</h3>
          </div>
          <p class="perspective-text" id="detail-culture-text"></p>
        </div>

        <!-- Perspective 2: Science & Evolution Story + N_Panel Image -->
        <div class="perspective-section" id="detail-science-section">
          <div class="perspective-header">
            <div class="perspective-icon icon-science">🔬</div>
            <h3 class="perspective-title">자연과학 · 진화적 관점</h3>
          </div>
          <p class="perspective-text" id="detail-science-text"></p>
          
          <!-- Science Panel Image Viewer -->
          <div class="science-panel-viewer-box" id="detail-science-panel-wrap">
            <div class="science-panel-label">🔬 연구 조사 과학 패널</div>
            <img id="detail-science-panel-img" class="science-panel-img" src="Asset/3. Exhibition/N_Panel/webp/N_Panel01-1.webp" alt="과학 패널">
          </div>
        </div>

        <!-- Perspective 3: Related Relics & Sources -->
        <div class="perspective-section" id="detail-relic-section">
          <div class="perspective-header">
            <div class="perspective-icon icon-relic">📜</div>
            <h3 class="perspective-title">관련 유물 및 학술 근거</h3>
          </div>
          <p class="perspective-text" id="detail-relic-text"></p>
          <div class="source-credit" id="detail-source-credit"></div>
        </div>

        <!-- Interactive OX Quiz Module -->
        <div class="quiz-module-card" id="detail-quiz-box">
          <!-- Dynamically generated by app.js if quiz exists -->
        </div>

        <!-- Bottom Navigation Buttons -->
        <div class="detail-bottom-nav">
          <button id="btn-detail-prev" class="btn-nav-prev">
            <span>← 이전 상징</span>
          </button>
          <button id="btn-detail-next" class="btn-nav-next">
            <span>다음 상징 →</span>
          </button>
        </div>

      </div>

    </div>
  </section>

  <!-- ============================================================
       5. MODAL: DOCENT (VISUAL NOVEL - RAPIDWAGON)
       ============================================================ -->
  <div id="docent-modal" class="docent-vn-backdrop">
    <div class="docent-vn-container">
      
      <!-- Close Button -->
      <button id="btn-close-docent" class="btn-close-vn">✕ 대화 종료 및 전시 복귀</button>

      <!-- Character Portrait Layer -->
      <div class="docent-vn-character">
        <img id="docent-character-portrait" class="docent-portrait-img" src="Asset/4. Docent/neutral.webp" alt="래피드왜건">
      </div>

      <!-- Dialogue UI Layer -->
      <div class="docent-vn-ui">
        
        <!-- Theme Badge -->
        <div class="vn-header-badge" id="docent-theme-badge">
          <span class="badge-dot">●</span>
          <span id="docent-animal-tag">01 말</span>
          <span class="badge-divider">|</span>
          <span id="docent-theme-text">말의 이동과 발가락의 진화</span>
        </div>

        <!-- Dialogue Box -->
        <div class="vn-dialogue-box" id="docent-dialogue-box">
          <div class="vn-speaker-row">
            <span class="vn-speaker-name" id="docent-speaker-name">래피드왜건</span>
            <span class="vn-emotion-tag" id="docent-emotion-tag">neutral</span>
          </div>
          <div class="vn-text-content" id="docent-chat-body">
            <!-- Text injected via JS -->
          </div>
          <div class="vn-dialogue-footer">
            <span class="vn-click-hint" id="docent-click-hint">▶ 화면을 클릭하여 계속 진행</span>
          </div>
        </div>

        <!-- Choice Selection Container -->
        <div class="vn-options-container" id="docent-options-footer" style="display: none;">
          <div class="vn-options-title">💬 질문을 선택하여 과학적 탐구를 확장하세요:</div>
          <div class="vn-options-list" id="docent-options-list">
            <!-- Dynamically generated choice buttons -->
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- ============================================================
       6. MODAL: FINAL EMBLEM
       ============================================================ -->
  <div id="final-modal" class="final-modal-backdrop" style="display: none;">
    <div class="final-modal-card">
      <button id="btn-close-final-modal" class="btn-close-final">✕</button>
      <h2 style="font-family: var(--font-serif); color: var(--accent-gold); font-size: 2rem; margin-bottom: 0.5rem;">백제금동대향로 19종 생명 세계 완성</h2>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">천상에서 바다까지, 문화유산과 자연사가 어우러진 백제인의 이상향을 감상하세요.</p>
      <div class="final-emblem-wrap">
        <img src="Asset/Final.webp" alt="최종 완성본" class="final-emblem-img">
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="js/modelData.js?v=20260825_2"></script>
  <script src="js/dialogueData.js?v=20260825_2"></script>
  <script src="js/data.js?v=20260825_2"></script>
  <script src="js/threeViewer.js?v=20260825_2"></script>
  <script src="js/app.js?v=20260825_2"></script>
</body>
</html>
'''

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_code)
print('index.html written.')

# -------------------------------------------------------------
# 4. css/style.css
# -------------------------------------------------------------
css_code = r'''/* ============================================================
   금동대향로 자연사박물관 웹전시 종합 스타일시트 (style.css)
   ============================================================ */

:root {
  --bg-primary: #08090d;
  --bg-secondary: #11141d;
  --bg-card: rgba(22, 27, 39, 0.9);
  --bg-card-hover: rgba(30, 37, 54, 0.98);
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent-gold: #d4af37;
  --accent-gold-light: #f5d77f;
  --accent-gold-glow: rgba(212, 175, 55, 0.35);
  --accent-cyan: #38bdf8;
  --accent-bronze: #2dd4bf;
  --border-color: rgba(212, 175, 55, 0.2);
  --border-color-subtle: rgba(255, 255, 255, 0.08);
  
  --font-serif: 'Noto Serif KR', 'Batang', serif;
  --font-sans: 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
  
  --header-height: 70px;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Reset & Base */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  min-height: 100%;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
  transition: var(--transition-normal);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-gold);
}

/* App Header & Navigation */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: rgba(8, 9, 13, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color-subtle);
  z-index: 1000;
  transition: var(--transition-normal);
}

.brand-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.brand-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-gold), #8a7322);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 1rem;
  color: #000;
  box-shadow: 0 0 15px var(--accent-gold-glow);
}

.brand-name {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--accent-gold-light);
}

.brand-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-left: 0.5rem;
  display: inline-block;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.nav-btn {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  transition: var(--transition-normal);
}

.nav-btn:hover, .nav-btn.active {
  color: var(--accent-gold);
  background: rgba(212, 175, 55, 0.12);
}

/* Header Docent Call Button (Active state on detail page) */
.btn-docent-call {
  position: relative;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--text-secondary);
  padding: 0.45rem 1.15rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  opacity: 0.7;
  transition: all var(--transition-normal);
}

.btn-docent-call.is-active-docent {
  opacity: 1;
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(15, 23, 42, 0.95));
  box-shadow: 0 0 15px var(--accent-gold-glow);
  animation: docentPulse 2s infinite ease-in-out;
  cursor: pointer;
}

.header-docent-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--accent-gold);
}

.docent-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #64748b;
  display: inline-block;
}

.btn-docent-call.is-active-docent .docent-status-dot {
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
}

@keyframes docentPulse {
  0%, 100% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 22px rgba(212, 175, 55, 0.7); }
}

/* Views Container */
.view-section {
  display: none;
  min-height: 100vh;
  width: 100%;
}

.view-section.active {
  display: block;
}

/* 3D Shared Canvas */
.scrolly-canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none !important;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.6s ease;
}

.scrolly-layer-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.2s ease, background-image 0.8s ease;
  filter: brightness(0.4) saturate(1.2);
}

.scrolly-3d-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* ============================================================
   1. INTRO VIEW
   ============================================================ */
#view-intro {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 10;
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#view-intro.active {
  display: flex;
}

.intro-media-wrapper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.intro-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.5s ease, opacity 1.2s ease;
}

.intro-blackout-overlay {
  position: absolute;
  inset: 0;
  background: #000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 1s ease;
  z-index: 5;
}

.intro-ui-overlay {
  position: relative;
  z-index: 25;
  text-align: center;
  padding: 2.5rem;
  max-width: 800px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
  pointer-events: none;
  background: radial-gradient(circle, rgba(8, 9, 13, 0.75) 0%, rgba(8, 9, 13, 0) 80%);
  border-radius: 24px;
}

.intro-ui-overlay.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.intro-badge {
  display: inline-block;
  font-size: 0.8rem;
  letter-spacing: 0.25em;
  color: var(--accent-gold);
  margin-bottom: 1rem;
  padding: 0.35rem 1.2rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 20px;
  background: rgba(8, 9, 13, 0.8);
}

.intro-title {
  font-family: var(--font-serif);
  font-size: 3.5rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
  text-shadow: 0 0 30px rgba(0, 0, 0, 0.9), 0 0 50px rgba(212, 175, 55, 0.3);
}

.intro-subtitle {
  font-size: 1.15rem;
  color: #e2e8f0;
  line-height: 1.8;
  margin-bottom: 2rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.9);
}

.btn-start-exhibition {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, var(--accent-gold), #b89728);
  color: #000;
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 700;
  padding: 1rem 2.5rem;
  border-radius: 30px;
  box-shadow: 0 0 30px var(--accent-gold-glow);
  transition: all var(--transition-normal);
}

.btn-start-exhibition:hover {
  transform: scale(1.05);
  box-shadow: 0 0 45px rgba(212, 175, 55, 0.7);
}

.btn-replay-intro {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 1.8rem;
  border-radius: 30px;
  font-size: 1.05rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
}

.btn-replay-intro:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: #fff;
}

.intro-skip-btn {
  position: absolute;
  top: calc(var(--header-height) + 1.5rem);
  right: 2rem;
  z-index: 30;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.85rem;
  backdrop-filter: blur(6px);
}

.intro-skip-btn:hover {
  background: rgba(212, 175, 55, 0.3);
  border-color: var(--accent-gold);
  color: #fff;
}

/* ============================================================
   2. MAIN SCROLLYTELLING VIEW
   ============================================================ */
#view-main {
  position: relative;
  z-index: 5;
  padding-top: var(--header-height);
}

.scrolly-content-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 8rem 1.5rem;
}

.scrolly-step {
  min-height: 85vh;
  display: flex;
  align-items: center;
  margin-bottom: 6rem;
  opacity: 0.25;
  transform: translateY(30px);
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.scrolly-step.is-active {
  opacity: 1;
  transform: translateY(0);
}

.scrolly-step.align-center { justify-content: center; }
.scrolly-step.align-left { justify-content: flex-start; }
.scrolly-step.align-right { justify-content: flex-end; }

.scrolly-card {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 175, 55, 0.1);
}

.scrolly-tag {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: 0.75rem;
  padding: 0.25rem 0.8rem;
  background: rgba(212, 175, 55, 0.15);
  border-radius: 12px;
}

.scrolly-title {
  font-family: var(--font-serif);
  font-size: 1.85rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
  line-height: 1.35;
}

.scrolly-desc {
  font-size: 1rem;
  color: #cbd5e1;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.scrolly-link-row {
  margin-bottom: 1.2rem;
}

.btn-link-layer {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid var(--accent-gold);
  color: var(--accent-gold-light);
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all var(--transition-normal);
}

.btn-link-layer:hover {
  background: var(--accent-gold);
  color: #000;
  box-shadow: 0 0 15px var(--accent-gold-glow);
}

.btn-step-action {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: block;
}

.scrolly-footer-cta {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(22, 27, 39, 0.7);
  border: 1px solid var(--border-color-subtle);
  border-radius: 24px;
  backdrop-filter: blur(12px);
  margin-top: 4rem;
}

.btn-explore-catalog {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, var(--accent-gold), #b89728);
  color: #000;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 0.9rem 2rem;
  border-radius: 30px;
}

.btn-explore-catalog:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px var(--accent-gold-glow);
}

/* ============================================================
   3. CATALOG & UNWRAPPED 5-LAYERS VIEW
   ============================================================ */
#view-catalog {
  position: relative;
  z-index: 5;
  padding: calc(var(--header-height) + 2rem) 2rem 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.catalog-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.view-mode-tabs {
  display: inline-flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.35rem;
  border-radius: 30px;
  border: 1px solid var(--border-color-subtle);
  margin-bottom: 1.5rem;
}

.view-mode-btn {
  padding: 0.6rem 1.5rem;
  border-radius: 24px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.view-mode-btn.active {
  background: var(--accent-gold);
  color: #000;
  box-shadow: 0 0 15px var(--accent-gold-glow);
}

.catalog-title {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.catalog-desc {
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 1.5rem auto;
}

.discovery-progress-wrap {
  max-width: 450px;
  margin: 0 auto 2rem auto;
  background: rgba(255, 255, 255, 0.04);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color-subtle);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.progress-track {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, var(--accent-gold), #fef08a);
  transition: width 0.5s ease;
}

.catalog-tabs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.tab-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color-subtle);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.tab-btn.active, .tab-btn:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: var(--accent-gold);
  color: var(--accent-gold-light);
}

/* Animal Grid (Cards) */
.animal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.animal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
}

.animal-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent-gold);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8), 0 0 15px rgba(212, 175, 55, 0.15);
}

.animal-card.is-discovered {
  border-color: rgba(212, 175, 55, 0.4);
}

.card-thumb-wrap {
  position: relative;
  height: 180px;
  background: #0d1117;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-icon-img {
  max-width: 140px;
  max-height: 140px;
  object-fit: contain;
  transition: transform var(--transition-normal);
}

.animal-card:hover .card-icon-img {
  transform: scale(1.08);
}

.card-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--accent-gold);
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.card-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.card-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
  flex: 1;
}

.card-footer {
  font-size: 0.8rem;
  color: var(--accent-gold-light);
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--border-color-subtle);
  padding-top: 0.75rem;
}

/* ============================================================
   UNWRAPPED 5-LAYERS SPACE (RULE 7-1)
   ============================================================ */
.unwrapped-layers-wrapper {
  margin-top: 1.5rem;
}

.unwrapped-intro-guide {
  text-align: center;
  background: rgba(22, 27, 39, 0.8);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
}

.unwrapped-intro-guide h3 {
  font-family: var(--font-serif);
  color: var(--accent-gold);
  font-size: 1.3rem;
  margin-bottom: 0.4rem;
}

.unwrapped-intro-guide p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.unwrapped-layers-list {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.unwrapped-layer-card {
  background: #0d1117;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0,0,0,0.7);
}

.layer-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid var(--border-color-subtle);
}

.layer-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.layer-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: #000;
  background: var(--accent-gold);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.layer-card-title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  color: #fff;
}

.btn-layer-goto-main {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(212, 175, 55, 0.12);
  border: 1px solid var(--accent-gold);
  color: var(--accent-gold-light);
  padding: 0.5rem 1.1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-layer-goto-main:hover {
  background: var(--accent-gold);
  color: #000;
}

/* Layer Stage with bg_XXXX.webp */
.layer-stage-viewport {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: #05070a;
}

.layer-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.75;
  filter: saturate(1.1) brightness(0.9);
  transition: transform 0.6s ease;
}

.unwrapped-layer-card:hover .layer-bg-img {
  transform: scale(1.02);
}

.layer-markers-overlay {
  position: absolute;
  inset: 0;
}

/* Markers on layer bg */
.layer-symbol-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
  transition: all var(--transition-normal);
}

.marker-pin-wrap {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(8, 9, 13, 0.85);
  border: 2px solid rgba(212, 175, 55, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.8);
  transition: all var(--transition-normal);
}

.layer-symbol-marker.is-discovered .marker-pin-wrap {
  border-color: var(--accent-gold);
  background: rgba(212, 175, 55, 0.2);
  box-shadow: 0 0 16px var(--accent-gold-glow);
}

.marker-pin-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.layer-symbol-marker:hover .marker-pin-wrap {
  transform: scale(1.25);
  border-color: #fff;
  box-shadow: 0 0 25px rgba(212, 175, 55, 0.8);
}

.marker-hover-tooltip {
  position: absolute;
  bottom: 115%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(8, 9, 13, 0.95);
  border: 1px solid var(--accent-gold);
  color: #fff;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.8);
}

.layer-symbol-marker:hover .marker-hover-tooltip {
  opacity: 1;
}

/* ============================================================
   4. DETAIL VIEW (3D EMBED + MULTI-PERSPECTIVE)
   ============================================================ */
#view-detail {
  position: relative;
  z-index: 5;
  padding: calc(var(--header-height) + 1.5rem) 2rem 6rem 2rem;
  max-width: 1440px;
  margin: 0 auto;
}

.detail-nav-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-back-to-catalog {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-gold);
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.btn-back-to-catalog:hover {
  background: var(--accent-gold);
  color: #000;
}

.detail-step-indicator {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  color: var(--text-muted);
}

.detail-main-layout {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 2.5rem;
}

@media (max-width: 1024px) {
  .detail-main-layout {
    grid-template-columns: 1fr;
  }
}

/* Left Column: 3D Stage */
.detail-stage-column {
  position: sticky;
  top: calc(var(--header-height) + 1.5rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stage-viewer-wrap {
  width: 100%;
  height: 520px;
  background: #05070a;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 175, 55, 0.1);
}

.detail-3d-embed-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}

.detail-3d-embed-wrap iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.sketchfab-embed-wrapper {
  width: 100%;
  height: 100%;
}

.stage-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-card);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color-subtle);
}

.stage-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.btn-detail-docent-call {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--accent-gold), #ca8a04);
  color: #000;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.6rem 1.4rem;
  border-radius: 20px;
  box-shadow: 0 0 15px var(--accent-gold-glow);
  animation: docentPulse 2.5s infinite;
}

.btn-detail-docent-call:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px var(--accent-gold-glow);
}

.btn-detail-docent-call img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}

/* Right Column: Info */
.detail-info-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-header-info {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color-subtle);
}

.detail-code-tag {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent-gold);
  background: rgba(212, 175, 55, 0.12);
  padding: 0.25rem 0.8rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.detail-title {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.detail-simple-desc {
  font-size: 1.05rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.feature-box {
  background: rgba(212, 175, 55, 0.06);
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.feature-box h4 {
  font-family: var(--font-serif);
  color: var(--accent-gold-light);
  font-size: 1.05rem;
  margin-bottom: 0.75rem;
}

.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-list li {
  position: relative;
  padding-left: 1.25rem;
  font-size: 0.95rem;
  color: #e2e8f0;
}

.feature-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--accent-gold);
  font-size: 1.2rem;
  line-height: 1;
}

.perspective-section {
  background: var(--bg-card);
  padding: 1.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color-subtle);
}

.perspective-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.perspective-icon {
  font-size: 1.3rem;
}

.perspective-title {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  color: #fff;
}

.perspective-text {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.7;
}

.science-panel-viewer-box {
  margin-top: 1.25rem;
  background: #080a0f;
  border: 1px solid var(--border-color-subtle);
  border-radius: var(--radius-md);
  padding: 1rem;
}

.science-panel-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-cyan);
  margin-bottom: 0.5rem;
}

.science-panel-img {
  width: 100%;
  max-height: 360px;
  object-fit: contain;
  border-radius: var(--radius-sm);
  background: #000;
}

.source-credit {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.75rem;
  border-top: 1px solid var(--border-color-subtle);
  padding-top: 0.5rem;
}

.detail-bottom-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-nav-prev, .btn-nav-next {
  flex: 1;
  padding: 0.85rem;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color-subtle);
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
}

.btn-nav-prev:hover, .btn-nav-next:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: var(--accent-gold);
  color: var(--accent-gold-light);
}

/* ============================================================
   5. DOCENT VISUAL NOVEL MODAL
   ============================================================ */
.docent-vn-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: none;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 2rem;
}

.docent-vn-container {
  position: relative;
  width: 100%;
  max-width: 1000px;
  height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.btn-close-vn {
  position: absolute;
  top: 0;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.docent-vn-character {
  position: absolute;
  bottom: 160px;
  left: 3rem;
  width: 240px;
  height: 320px;
  pointer-events: none;
  z-index: 5;
}

.docent-portrait-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.9));
}

.docent-vn-ui {
  position: relative;
  z-index: 10;
  background: rgba(15, 23, 42, 0.95);
  border: 2px solid var(--accent-gold);
  border-radius: var(--radius-lg);
  padding: 1.5rem 2rem;
  box-shadow: 0 0 35px rgba(0, 0, 0, 0.9), 0 0 25px var(--accent-gold-glow);
}

.vn-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--accent-gold);
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.vn-dialogue-box {
  cursor: pointer;
  min-height: 100px;
}

.vn-speaker-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.vn-speaker-name {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--accent-gold-light);
}

.vn-emotion-tag {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.vn-text-content {
  font-size: 1.05rem;
  color: #f8fafc;
  line-height: 1.7;
}

.vn-dialogue-footer {
  margin-top: 0.75rem;
  text-align: right;
}

.vn-click-hint {
  font-size: 0.8rem;
  color: var(--accent-gold);
  animation: docentPulse 1.5s infinite;
}

.vn-options-container {
  margin-top: 1rem;
  border-top: 1px solid var(--border-color-subtle);
  padding-top: 1rem;
}

.vn-options-title {
  font-size: 0.9rem;
  color: var(--accent-gold-light);
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.vn-options-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-docent-option {
  text-align: left;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: #e2e8f0;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  transition: all var(--transition-normal);
}

.btn-docent-option:hover {
  background: rgba(212, 175, 55, 0.25);
  border-color: var(--accent-gold);
  color: #fff;
  transform: translateX(4px);
}

/* ============================================================
   6. FINAL EMBLEM MODAL
   ============================================================ */
.final-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.final-modal-card {
  position: relative;
  background: var(--bg-card);
  border: 2px solid var(--accent-gold);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 0 50px var(--accent-gold-glow);
}

.btn-close-final {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #fff;
  font-size: 1.2rem;
}

.final-emblem-wrap {
  margin-top: 1rem;
  border-radius: var(--radius-md);
  overflow: hidden;
}
'''

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css_code)
print('css/style.css written.')

# -------------------------------------------------------------
# 5. js/app.js
# -------------------------------------------------------------
app_code = r'''/**
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

    // [핵심] 좌측 무대: con_Mapping.md의 3D 에셋 Embed (Sketchfab iframe or GLB)
    const embedWrap = document.getElementById('detail-3d-embed-wrap');
    if (embedWrap) {
      if (animal.embedHtml) {
        embedWrap.innerHTML = animal.embedHtml;
      } else if (animal.glb) {
        embedWrap.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--accent-gold);"><p>3D 모델: ${animal.name}</p></div>`;
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
'''

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_code)
print('js/app.js written.')

print('ALL SITE ASSETS SUCCESSFULLY REBUILT AND SYNCED!')

