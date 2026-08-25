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
    try { this.initViewer(); } catch (e) { console.error('Viewer init error:', e); }
    try { this.bindEvents(); } catch (e) { console.error('BindEvents error:', e); }
    try { this.renderCatalog('all'); } catch (e) { console.error('RenderCatalog error:', e); }
    try { this.renderUnwrappedLayers(); } catch (e) { console.error('RenderUnwrapped error:', e); }
    try { this.updateProgress(); } catch (e) { console.error('UpdateProgress error:', e); }
    try { this.initIntroSequence(); } catch (e) { console.error('IntroSequence error:', e); }
    try { this.initScrollyObserver(); } catch (e) { console.error('ScrollyObserver error:', e); }
    try { this.initWheelSnapController(); } catch (e) { console.error('WheelSnap error:', e); }

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
          }, 300);
        }
      });
    } else {
      const loader = document.getElementById('global-loader');
      if (loader) loader.style.display = 'none';
    }

    // 로더 강제 닫힘 안전장치 (2.5초 후 무조건 해제)
    setTimeout(() => {
      const loader = document.getElementById('global-loader');
      if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        setTimeout(() => { if (loader) loader.style.display = 'none'; }, 500);
      }
    }, 2500);
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
          this.catalogMode = 'unwrapped';
          this.switchView('catalog');
        } else if (targetView === 'catalog') {
          this.catalogMode = 'cards';
          this.switchView('catalog');
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

    // 헤더 과학해설사 버튼 (동물 상세 화면에서만 활성화)
    const btnDocentCall = document.getElementById('btn-docent-call');
    if (btnDocentCall) {
      btnDocentCall.addEventListener('click', () => {
        if (this.currentView !== 'detail') return;
        const animal = EXHIBITION_DATA.animals[this.currentAnimalIndex] || EXHIBITION_DATA.animals[0];
        this.openDocent(animal.code);
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
      btnCloseDocent.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeDocent();
      });
    }

    // 도슨트 모달 화면 전체 클릭 시 다음 대화로 진행 (PC 환경 어디를 클릭해도 부드럽게 진행!)
    const docentModal = document.getElementById('docent-modal');
    if (docentModal) {
      docentModal.addEventListener('click', (e) => {
        // 닫기 버튼이나 선택지 버튼 클릭은 제외
        if (e.target.closest('#btn-close-docent') || e.target.closest('#docent-options-footer')) {
          return;
        }
        this.handleDocentClick();
      });
    }

    // 옵션 컨테이너 내부 클릭 시 상위 화면 클릭 전파 차단
    const optionsFooter = document.getElementById('docent-options-footer');
    if (optionsFooter) {
      optionsFooter.addEventListener('click', (e) => {
        e.stopPropagation();
      });
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

    // 모든 view-section 비활성화
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // 인트로 비디오 정지 제어
    const video = document.getElementById('intro-video');
    const blackout = document.getElementById('intro-blackout');
    const skipBtn = document.getElementById('btn-intro-skip');
    if (viewName !== 'intro') {
      if (video) {
        video.pause();
        video.style.opacity = '0';
      }
      if (blackout) blackout.style.opacity = '0';
      if (skipBtn) skipBtn.style.display = 'none';
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
      const nav = btn.getAttribute('data-nav');
      if (viewName === 'catalog') {
        if (this.catalogMode === 'unwrapped') {
          btn.classList.toggle('active', nav === 'unwrapped');
        } else {
          btn.classList.toggle('active', nav === 'catalog');
        }
      } else {
        btn.classList.toggle('active', nav === viewName);
      }
    });

    const targetSection = document.getElementById('view-' + viewName);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.scrollTop = 0;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const canvasContainer = document.getElementById('scrolly-canvas-container');
    const btnDocentHeader = document.getElementById('btn-docent-call');

    // 과학해설사 버튼 활성화 제어 (항상 노출되되, 동물 상세 화면에서만 활성화)
    if (btnDocentHeader) {
      if (viewName === 'detail') {
        btnDocentHeader.disabled = false;
        btnDocentHeader.classList.add('is-active-docent');
        btnDocentHeader.title = '클릭하여 현재 동물의 래피드왜건 과학해설을 듣습니다';
      } else {
        btnDocentHeader.disabled = true;
        btnDocentHeader.classList.remove('is-active-docent');
        btnDocentHeader.title = '개별 동물 상세 화면에서 활성화됩니다';
      }
    }

    if (viewName === 'intro') {
      if (canvasContainer) {
        canvasContainer.style.display = 'block';
        canvasContainer.style.opacity = '1';
      }
      this.disposeGLBViewer();
      if (this.viewer) {
        this.viewer.resume();
        this.viewer.setCinematicIntro(true);
      }
      this.playIntroVideo();
      
    } else if (viewName === 'main') {
      if (canvasContainer) {
        canvasContainer.style.display = 'block';
        canvasContainer.style.opacity = '1';
      }
      this.disposeGLBViewer();
      if (this.viewer) {
        this.viewer.resume();
        this.viewer.setCinematicIntro(false);
        this.viewer.focusStep('intro');
      }
    } else if (viewName === 'catalog') {
      if (canvasContainer) {
        canvasContainer.style.opacity = '0';
        canvasContainer.style.display = 'none';
      }
      if (this.viewer) this.viewer.pause();
      this.disposeGLBViewer();
      if (this.catalogMode === 'unwrapped') {
        this.setCatalogMode('unwrapped');
      } else {
        this.setCatalogMode('cards');
      }
    } else if (viewName === 'detail') {
      if (canvasContainer) {
        canvasContainer.style.opacity = '0';
        canvasContainer.style.display = 'none';
      }
      if (this.viewer) this.viewer.pause();
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

    // 헤더 내비게이션 버튼 active 클래스 동기화
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const nav = btn.getAttribute('data-nav');
      if (mode === 'unwrapped') {
        btn.classList.toggle('active', nav === 'unwrapped');
      } else if (mode === 'cards') {
        btn.classList.toggle('active', nav === 'catalog');
      }
    });

    if (mode === 'cards') {
      if (btnCards) btnCards.classList.add('active');
      if (btnUnwrapped) btnUnwrapped.classList.remove('active');
      if (grid) grid.style.display = 'grid';
      if (unwrappedContainer) unwrappedContainer.style.display = 'none';
      if (catTabs) catTabs.style.display = 'flex';
      if (title) title.innerText = '향로의 그림자: 19종 상징 도감';
      if (desc) desc.innerText = '검은 실루엣 속 동물을 탐색하면 본래의 생동감 넘치는 색을 되찾습니다. 19개 백제의 상징을 모두 발견해 보세요.';
      this.renderCatalog(this.currentCategory);
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
     5-1. 한 번에 훅훅 넘어가는 스크롤 스냅 휠 컨트롤러 (메인 & 전개도 공통)
     ============================================================ */
  initWheelSnapController() {
    this.isSnapping = false;
    this.currentStepIdx = 0;
    this.currentUnwrappedIdx = 0;

    window.addEventListener('wheel', (e) => {
      // 모바일 기기에서는 네이티브 터치 스크롤과의 충돌 및 화면 튕김 방지를 위해 휠 스냅 비활성화
      if (window.innerWidth <= 768 || ('ontouchstart' in window)) return;

      // 1. 메인 3D 전시관람 스냅
      if (this.currentView === 'main') {
        const steps = Array.from(document.querySelectorAll('.scrolly-step'));
        if (!steps.length) return;

        if (this.isSnapping) {
          e.preventDefault();
          return;
        }

        if (Math.abs(e.deltaY) > 15) {
          e.preventDefault();
          this.isSnapping = true;

          if (e.deltaY > 0) {
            if (this.currentStepIdx < steps.length - 1) this.currentStepIdx++;
          } else {
            if (this.currentStepIdx > 0) this.currentStepIdx--;
          }

          const targetStep = steps[this.currentStepIdx];
          if (targetStep) {
            targetStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          setTimeout(() => { this.isSnapping = false; }, 550);
        }
      }

      // 2. 전개도 탐색 모드 층위별 1-화면 훅훅 스냅
      else if (this.currentView === 'catalog' && this.catalogMode === 'unwrapped') {
        const layerCards = Array.from(document.querySelectorAll('.unwrapped-layer-card'));
        if (!layerCards.length) return;

        if (this.isSnapping) {
          e.preventDefault();
          return;
        }

        if (Math.abs(e.deltaY) > 20) {
          e.preventDefault();
          this.isSnapping = true;

          if (e.deltaY > 0) {
            if (this.currentUnwrappedIdx < layerCards.length - 1) this.currentUnwrappedIdx++;
          } else {
            if (this.currentUnwrappedIdx > 0) this.currentUnwrappedIdx--;
          }

          const targetLayer = layerCards[this.currentUnwrappedIdx];
          if (targetLayer) {
            targetLayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          setTimeout(() => { this.isSnapping = false; }, 550);
        }
      }
    }, { passive: false });

    // 키보드 방향키 이동 지원
    window.addEventListener('keydown', (e) => {
      if (this.currentView === 'main') {
        const steps = Array.from(document.querySelectorAll('.scrolly-step'));
        if (!steps.length) return;

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
      } else if (this.currentView === 'catalog' && this.catalogMode === 'unwrapped') {
        const layerCards = Array.from(document.querySelectorAll('.unwrapped-layer-card'));
        if (!layerCards.length) return;

        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
          if (this.currentUnwrappedIdx < layerCards.length - 1) {
            e.preventDefault();
            this.currentUnwrappedIdx++;
            layerCards[this.currentUnwrappedIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          if (this.currentUnwrappedIdx > 0) {
            e.preventDefault();
            this.currentUnwrappedIdx--;
            layerCards[this.currentUnwrappedIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
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

    if (typeof EXHIBITION_DATA === 'undefined' || !EXHIBITION_DATA.animals) {
      console.warn('EXHIBITION_DATA is not ready yet');
      return;
    }

    const filtered = category === 'all'
      ? EXHIBITION_DATA.animals
      : EXHIBITION_DATA.animals.filter(a => a.layer === category);

    const fragment = document.createDocumentFragment();

    filtered.forEach(animal => {
      const isDiscovered = this.discoveredAnimals && this.discoveredAnimals.has(animal.code);
      const card = document.createElement('div');
      card.className = `animal-card ${isDiscovered ? 'is-discovered' : 'is-silhouette'}`;
      card.setAttribute('data-code', animal.code);

      const iconSrc = isDiscovered ? animal.icon : (animal.iconDark || animal.icon);

      card.innerHTML = `
        <div class="card-thumb-wrap">
          <img class="card-icon-img" src="${iconSrc}" alt="${animal.name}" loading="lazy" decoding="async" onerror="this.src='${animal.icon}'">
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

      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
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

    if (typeof EXHIBITION_DATA === 'undefined' || !EXHIBITION_DATA.layers) {
      console.warn('EXHIBITION_DATA.layers is not ready yet');
      return;
    }

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
            <span class="btn-text-desktop">🔍 3D 메인화면에서 이 층위 보기</span>
            <span class="btn-text-mobile">3D 보기</span>
            <span>→</span>
          </button>
        </div>
      `;

      // 층위 뷰포트 (bg_XXXX.webp 배경 + 상징 마커)
      let markersHtml = '';
      layerAnimals.forEach(animal => {
        const isDiscovered = this.discoveredAnimals && this.discoveredAnimals.has(animal.code);
        const coords = animal.layerCoords || { x: 50, y: 50 };
        const iconSrc = isDiscovered ? animal.icon : (animal.iconDark || animal.icon);

        markersHtml += `
          <div class="layer-symbol-marker ${isDiscovered ? 'is-discovered' : 'is-undiscovered'}" 
               style="left: ${coords.x}%; top: ${coords.y}%;" 
               data-animal-code="${animal.code}">
            <div class="marker-pin-wrap">
              <img class="marker-pin-img" src="${iconSrc}" alt="${animal.name}" onerror="this.src='${animal.icon}'">
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

    // 우측 과학 패널 (N_Panel 이미지 동적 세로 스택)
    const panelWrap = document.getElementById('detail-science-panel-wrap');
    if (panelWrap) {
      const panelList = [];
      if (animal.panelImg) panelList.push(animal.panelImg);
      if (animal.panelImg2) panelList.push(animal.panelImg2);
      if (animal.panelImg3) panelList.push(animal.panelImg3);

      if (panelList.length === 0) {
        panelList.push('Asset/Final.webp');
      }

      let panelsHtml = `<div class="science-panel-label">🔬 연구 조사 과학 패널 (${panelList.length}부)</div><div class="science-panels-stack" style="display: flex; flex-direction: column; gap: 1.5rem;">`;
      panelList.forEach((pUrl, pIdx) => {
        panelsHtml += `<img class="science-panel-img" src="${pUrl}" alt="${animal.name} 과학 조사 패널 ${pIdx + 1}" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">`;
      });
      panelsHtml += `</div>`;
      panelWrap.innerHTML = panelsHtml;
    }

    // 관련 유물 및 학술 근거 (R/A 출처 코드 뱃지 및 서지정보)
    const relicText = document.getElementById('detail-relic-text');
    const sourceCredit = document.getElementById('detail-source-credit');
    
    if (relicText) {
      let relicHtml = `
        <div style="margin-bottom: 0.85rem;">
          <strong style="color: #fff; display: block; margin-bottom: 0.25rem;">🏛️ 출토 유물 도판</strong>
          <span>백제 부여 능산리 절터 출토 백제금동대향로(국보) 본체에 조각된 ${animal.name} 도상</span>
        </div>
      `;
      if (animal.culturalData) {
        relicHtml += `
          <div style="margin-top: 0.8rem; background: rgba(212,175,55,0.1); border: 1px solid var(--accent-gold); border-radius: 8px; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.2rem;">🏺</span>
              <span style="font-size: 0.85rem; color: #fff; font-weight: 600;">연결 유산 실물 도판 및 3D 데이터가 준비되어 있습니다!</span>
            </div>
            <button id="btn-goto-culture-tab" class="btn-artifact-link" style="padding: 0.4rem 0.9rem; font-size: 0.82rem; cursor: pointer;">
              <span>유물 보러가기 →</span>
            </button>
          </div>
        `;
      }
      relicText.innerHTML = relicHtml;

      const btnGotoCulture = document.getElementById('btn-goto-culture-tab');
      if (btnGotoCulture) {
        btnGotoCulture.addEventListener('click', () => {
          const cultureTabBtn = document.getElementById('tab-btn-culture');
          if (cultureTabBtn) cultureTabBtn.click();
        });
      }
    }

    if (sourceCredit) {
      let rHtml = '';
      if (animal.referenceList && animal.referenceList.length > 0) {
        rHtml += `<div class="credit-group" style="margin-bottom: 0.8rem;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-gold); margin-bottom: 0.4rem;">🔬 과학 학술 참고문헌 (References)</div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">`;
        animal.referenceList.forEach(ref => {
          rHtml += `<li style="font-size: 0.8rem; color: #cbd5e1; line-height: 1.5; background: rgba(255,255,255,0.03); padding: 0.4rem 0.6rem; border-radius: 6px; border-left: 3px solid var(--accent-gold);">
            <span style="color: var(--accent-gold-light); font-weight: 700; margin-right: 0.4rem;">[${ref.code}]</span>${ref.text}
          </li>`;
        });
        rHtml += `</ul></div>`;
      }

      if (animal.assetList && animal.assetList.length > 0) {
        rHtml += `<div class="credit-group">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.4rem;">🎨 전시 에셋 및 3D 모델 출처 (Assets)</div>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">`;
        animal.assetList.forEach(ast => {
          rHtml += `<li style="font-size: 0.8rem; color: #cbd5e1; line-height: 1.5; background: rgba(255,255,255,0.03); padding: 0.4rem 0.6rem; border-radius: 6px; border-left: 3px solid var(--accent-cyan);">
            <span style="color: var(--accent-cyan); font-weight: 700; margin-right: 0.4rem;">[${ast.code}]</span>${ast.text}
          </li>`;
        });
        rHtml += `</ul></div>`;
      }

      sourceCredit.innerHTML = rHtml;
    }

    // OX 퀴즈 렌더링
    this.renderQuiz(animal.code);

    // [신규 탭 1] 백제금동대향로 속 도상 실물 탭 렌더링 (real_img.md 19종 연동)
    this.renderIconographyTab(animal);

    // [탭 3] 사회문화 유물 탭 & 뷰포트 렌더링 (culture.md 13종 연동)
    this.renderCulturalTab(animal);

    // [4대 탭] 상세 정보 탭 전환 컨트롤러 (도상 / 과학패널 / 사회문화유물 / OX퀴즈)
    this.initDetailTabs(animal);

    // [신규] 관람객의 한마디 (동물별 댓글 및 무제한 대댓글 시스템)
    this.renderComments(animal.code);
  }

  /* ============================================================
     8-0. 백제금동대향로 속 도상 실물 탭 렌더링 (real_img.md)
     ============================================================ */
  renderIconographyTab(animal) {
    const imgElem = document.getElementById('detail-iconography-img');
    const placeholder = document.getElementById('detail-iconography-placeholder');
    const locElem = document.getElementById('detail-iconography-location');
    const appElem = document.getElementById('detail-iconography-appearance');

    const iconData = animal.iconography || {};

    if (locElem) {
      locElem.innerText = iconData.location || '백제금동대향로 본체에 정교하게 조각되어 있습니다.';
    }
    if (appElem) {
      appElem.innerText = iconData.appearance || `${animal.name}의 생생한 특징과 동작이 백제 금속공예의 정수로 표현되어 있습니다.`;
    }

    if (imgElem && placeholder) {
      if (iconData.img) {
        imgElem.style.display = 'block';
        placeholder.style.display = 'none';
        imgElem.src = iconData.img;
        imgElem.onerror = () => {
          imgElem.style.display = 'none';
          placeholder.style.display = 'flex';
        };
      } else {
        imgElem.style.display = 'none';
        placeholder.style.display = 'flex';
      }
    }
  }

  /* ============================================================
     8-1. 상세 탭 전환 컨트롤러 (4-Tab / 3-Tab System)
     ============================================================ */
  initDetailTabs(animal) {
    const tabBtns = document.querySelectorAll('.detail-tab-btn');
    const tabPanels = document.querySelectorAll('.detail-tab-panel');
    const cultureBtn = document.getElementById('tab-btn-culture');

    // 사회문화 데이터 유무에 따른 탭 표시/숨김 (13종 4개 탭, 6종 3개 탭)
    if (cultureBtn) {
      cultureBtn.style.display = (animal.culturalData) ? 'inline-flex' : 'none';
    }

    // 기본 탭: 1순위 과학 탭(science)으로 초기화
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    const defaultBtn = document.querySelector('.detail-tab-btn[data-detail-tab="science"]');
    const defaultPanel = document.getElementById('detail-tab-content-science');
    if (defaultBtn) defaultBtn.classList.add('active');
    if (defaultPanel) defaultPanel.classList.add('active');

    // 탭 클릭 이벤트 바인딩
    tabBtns.forEach(btn => {
      btn.onclick = (e) => {
        const tabKey = e.currentTarget.getAttribute('data-detail-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        e.currentTarget.classList.add('active');
        const targetPanel = document.getElementById(`detail-tab-content-${tabKey}`);
        if (targetPanel) targetPanel.classList.add('active');
      };
    });
  }

  /* ============================================================
     8-2. 사회문화 유물 탭 & 뷰포트 렌더링 (culture.md)
     - 유물 3D/임베드/에셋 배치 공간 마련
     - 사회문화적 관점 해설 텍스트 및 박물관 연계 데이터 리스트
     ============================================================ */
  renderCulturalTab(animal) {
    const wrapper = document.getElementById('detail-cultural-wrapper');
    if (!wrapper) return;

    if (!animal.culturalData) {
      return;
    }

    const cdata = animal.culturalData;
    const guideTag = document.getElementById('cultural-artifact-guide-tag');
    const embedWrap = document.getElementById('cultural-artifact-embed-wrap');
    const storyText = document.getElementById('detail-culture-story-text');
    const artifactsList = document.getElementById('detail-cultural-artifacts-list');

    // 유물 가이드 태그
    if (guideTag) guideTag.innerText = cdata.visualGuide || '유물 시각자료';

    // 사회문화적 관점 해설 텍스트
    if (storyText) storyText.innerText = cdata.story;

    // 유물 뷰포트 공간 (3D 임베드 / 경량화 WebP 유물 이미지 / 플레이스홀더)
    if (embedWrap) {
      const primaryArtifact = (cdata.artifacts && cdata.artifacts.length > 0) ? cdata.artifacts[0] : null;
      if (cdata.embedHtml) {
        embedWrap.innerHTML = `
          <div class="artifact-3d-embed-box" style="width: 100%; height: 380px; position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.8);">
            ${cdata.embedHtml}
          </div>
        `;
      } else if (cdata.image) {
        embedWrap.innerHTML = `
          <div class="artifact-image-container" style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <div style="width: 100%; max-height: 420px; display: flex; align-items: center; justify-content: center; background: #000; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.8);">
              <img src="${cdata.image}" alt="${primaryArtifact ? primaryArtifact.title : cdata.visualGuide}" style="max-width: 100%; max-height: 420px; object-fit: contain;">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 0.5rem;">
              <span style="font-size: 0.88rem; color: #cbd5e1; font-weight: 600;">🏺 ${primaryArtifact ? primaryArtifact.title : cdata.visualGuide}</span>
              ${primaryArtifact ? `
                <a href="${primaryArtifact.url}" target="_blank" rel="noopener" class="btn-artifact-link" style="padding: 0.45rem 1rem; font-size: 0.82rem;">
                  <span>🏛️ ${primaryArtifact.museum} 소장 정보</span>
                  <span>↗</span>
                </a>
              ` : ''}
            </div>
          </div>
        `;
      } else {
        embedWrap.innerHTML = `
          <div class="artifact-placeholder-card">
            <div class="artifact-placeholder-icon">🏺</div>
            <h3 class="artifact-placeholder-title">${primaryArtifact ? primaryArtifact.title : cdata.visualGuide}</h3>
            <p class="artifact-placeholder-desc">
              🏛️ <strong>[백제 및 세계 연결 유산 3D / 미디어 에셋 공간]</strong><br>
              현재 박물관 공식 소장 데이터가 연계되어 있으며, 추후 3D 모델 및 인터랙티브 미디어가 이 공간에 바로 임베드됩니다.
            </p>
            ${primaryArtifact ? `
              <a href="${primaryArtifact.url}" target="_blank" rel="noopener" class="btn-artifact-link" style="padding: 0.6rem 1.4rem; font-size: 0.88rem; margin-top: 0.5rem;">
                <span>🔍 ${primaryArtifact.museum} 소장 데이터 바로가기</span>
                <span>↗</span>
              </a>
            ` : ''}
          </div>
        `;
      }
    }

    // 연결 유산 및 소장 박물관 링크 리스트
    if (artifactsList && cdata.artifacts) {
      let aHtml = '';
      cdata.artifacts.forEach(item => {
        aHtml += `
          <div class="cultural-artifact-item">
            <div class="artifact-item-info">
              <span class="artifact-item-title">${item.title}</span>
              <span class="artifact-item-museum">🏛️ ${item.museum}</span>
            </div>
            <a href="${item.url}" target="_blank" rel="noopener" class="btn-artifact-link">
              <span>공식 소장처 보기</span>
              <span>↗</span>
            </a>
          </div>
        `;
      });
      artifactsList.innerHTML = aHtml;
    }
  }

  /* ============================================================
     8-B. 관람객 댓글 및 무제한 대댓글 시스템 (Source of Truth: reply.md)
     ============================================================ */
  renderComments(animalCode) {
    const code = String(animalCode || '01').padStart(2, '0');
    if (!window.commentManager) return;

    // 1. 인기 댓글 TOP 3
    const popSection = document.getElementById('comments-popular-section');
    const popList = document.getElementById('comments-popular-list');
    const popularComments = window.commentManager.getTop3Popular(code);

    if (popSection && popList) {
      if (popularComments.length > 0) {
        popSection.style.display = 'block';
        const medals = ['🥇', '🥈', '🥉'];
        popList.innerHTML = '';
        popularComments.forEach((cmt, idx) => {
          const card = document.createElement('div');
          card.className = 'popular-card';
          const isLiked = window.commentManager.isLiked(cmt.id);
          card.innerHTML = `
            <div class="popular-rank-badge">${medals[idx] || '⭐'}</div>
            <div class="popular-content-wrap">
              <div class="popular-meta">
                <span class="popular-author">${cmt.name}</span>
                <span style="font-size:0.75rem;color:var(--accent-gold);font-weight:700;">인기 ${idx + 1}위</span>
              </div>
              <div class="popular-text">${cmt.text}</div>
              <div class="popular-actions">
                <button class="btn-like-comment ${isLiked ? 'liked' : ''}" data-id="${cmt.id}">
                  <span>👍</span>
                  <span class="like-count">${cmt.likes}</span>
                </button>
              </div>
            </div>
          `;
          const likeBtn = card.querySelector('.btn-like-comment');
          likeBtn.addEventListener('click', () => {
            window.commentManager.toggleLike(cmt.id);
            this.renderComments(code);
          });
          popList.appendChild(card);
        });
      } else {
        popSection.style.display = 'none';
      }
    }

    // 2. 전체 댓글 트리 렌더링 (재귀적 렌더링)
    const treeList = document.getElementById('comments-tree-list');
    const emptyNotice = document.getElementById('comments-empty-notice');
    const comments = window.commentManager.getComments(code);

    if (treeList) {
      treeList.innerHTML = '';
      if (!comments || comments.length === 0) {
        if (emptyNotice) emptyNotice.style.display = 'block';
      } else {
        if (emptyNotice) emptyNotice.style.display = 'none';
        comments.forEach(cmt => {
          treeList.appendChild(this.createCommentNode(cmt, code, 0));
        });
      }
    }

    // 3. 최상위 댓글 등록 이벤트 바인딩
    this.bindCommentForm(code);
  }

  createCommentNode(comment, animalCode, depth = 0) {
    const node = document.createElement('div');
    node.className = 'comment-node';
    const isLiked = window.commentManager.isLiked(comment.id);

    const card = document.createElement('div');
    card.className = 'comment-card';
    card.innerHTML = `
      <div class="comment-header">
        <span class="comment-author">${comment.name}</span>
        <span class="comment-date">${new Date(comment.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="comment-body">${comment.text}</div>
      <div class="comment-actions">
        <button class="btn-like-comment ${isLiked ? 'liked' : ''}" data-id="${comment.id}">
          <span>👍</span>
          <span class="like-count">${comment.likes}</span>
        </button>
        <button class="btn-reply-toggle" data-id="${comment.id}">답글</button>
      </div>
      <div class="reply-inline-form-container" style="display:none;"></div>
    `;

    // 추천 버튼 이벤트
    const likeBtn = card.querySelector('.btn-like-comment');
    likeBtn.addEventListener('click', () => {
      window.commentManager.toggleLike(comment.id);
      this.renderComments(animalCode);
    });

    // 답글 버튼 이벤트 (인라인 답글 작성창 토글)
    const replyToggleBtn = card.querySelector('.btn-reply-toggle');
    const replyContainer = card.querySelector('.reply-inline-form-container');

    replyToggleBtn.addEventListener('click', () => {
      if (replyContainer.style.display === 'none') {
        replyContainer.style.display = 'block';
        replyContainer.innerHTML = `
          <div class="reply-inline-form">
            <input type="text" class="comment-author-input reply-name-input" placeholder="이름 (익명 가능)" maxlength="12" style="width:160px;margin-bottom:0.4rem;">
            <textarea class="reply-inline-textarea" placeholder="이 댓글에 답글을 남겨보세요."></textarea>
            <div class="reply-inline-actions">
              <button class="btn-reply-cancel">취소</button>
              <button class="btn-reply-submit">등록</button>
            </div>
          </div>
        `;

        const submitBtn = replyContainer.querySelector('.btn-reply-submit');
        const cancelBtn = replyContainer.querySelector('.btn-reply-cancel');
        const textarea = replyContainer.querySelector('.reply-inline-textarea');
        const nameInput = replyContainer.querySelector('.reply-name-input');

        textarea.focus();

        cancelBtn.addEventListener('click', () => {
          replyContainer.style.display = 'none';
          replyContainer.innerHTML = '';
        });

        submitBtn.addEventListener('click', () => {
          const text = textarea.value.trim();
          if (!text) {
            textarea.focus();
            return;
          }
          window.commentManager.addReply(animalCode, comment.id, text, nameInput.value);
          this.renderComments(animalCode);
        });
      } else {
        replyContainer.style.display = 'none';
        replyContainer.innerHTML = '';
      }
    });

    node.appendChild(card);

    // 자식 답글들 재귀적 렌더링 (depth 무제한)
    if (comment.replies && comment.replies.length > 0) {
      const repliesList = document.createElement('div');
      repliesList.className = 'comment-replies-list';
      comment.replies.forEach(reply => {
        repliesList.appendChild(this.createCommentNode(reply, animalCode, depth + 1));
      });
      node.appendChild(repliesList);
    }

    return node;
  }

  bindCommentForm(animalCode) {
    const submitBtn = document.getElementById('btn-submit-comment');
    const textInput = document.getElementById('comment-text-input');
    const authorInput = document.getElementById('comment-author-input');

    if (!submitBtn || !textInput) return;

    // Remove old listeners by cloning
    const newBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newBtn, submitBtn);

    newBtn.addEventListener('click', () => {
      const text = textInput.value.trim();
      if (!text) {
        textInput.focus();
        return;
      }
      const author = authorInput ? authorInput.value : '';
      window.commentManager.addComment(animalCode, text, author);
      textInput.value = '';
      if (authorInput) authorInput.value = '';
      this.renderComments(animalCode);
    });
  }

  /* ============================================================
     8-1. GLB 3D 모델 전용 Three.js 뷰어 렌더링 & 메모리 누수 방지
     ============================================================ */
  disposeGLBViewer() {
    if (this.currentGLBViewer) {
      if (this.currentGLBViewer.animId) {
        cancelAnimationFrame(this.currentGLBViewer.animId);
      }
      if (this.currentGLBViewer.controls) {
        this.currentGLBViewer.controls.dispose();
      }
      if (this.currentGLBViewer.renderer) {
        this.currentGLBViewer.renderer.dispose();
        this.currentGLBViewer.renderer.forceContextLoss();
      }
      if (this.currentGLBViewer.onResize) {
        window.removeEventListener('resize', this.currentGLBViewer.onResize);
      }
      this.currentGLBViewer = null;
    }
  }

  renderGLBViewer(container, glbUrl, animalName) {
    this.disposeGLBViewer();
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
    loadingTip.style.fontSize = '0.82rem';
    loadingTip.style.background = 'rgba(8,9,13,0.85)';
    loadingTip.style.padding = '0.35rem 0.9rem';
    loadingTip.style.borderRadius = '14px';
    loadingTip.style.border = '1px solid var(--border-color)';
    loadingTip.innerText = `3D 모델 로딩 중: ${animalName}...`;
    container.appendChild(loadingTip);

    const isMobile = (window.innerWidth <= 768);
    const width = container.clientWidth || (isMobile ? window.innerWidth : 600);
    const height = container.clientHeight || (isMobile ? 310 : 520);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 2.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile, // 모바일에서는 안티앨리어싱 꺼서 GPU 부하 절반 절감
      alpha: true,
      powerPreference: "high-performance",
      precision: isMobile ? "mediump" : "highp"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.enableZoom = false; // 모바일 터치 스크롤 간섭 방지

    // 조명 세팅 (가볍게 2개로 최적화)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfffaed, 2.5);
    dirLight1.position.set(3, 5, 3);
    scene.add(dirLight1);

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
      loadingTip.innerText = `💡 드래그하여 ${animalName} 3D 모델을 회전하세요`;
    }, undefined, (err) => {
      console.warn('GLB load error:', err);
      loadingTip.innerText = `${animalName} 3D 모델 (기본 로드)`;
    });

    const viewerState = {
      renderer,
      scene,
      camera,
      controls,
      animId: null,
      onResize: null
    };

    const animate = () => {
      viewerState.animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || (isMobile ? 310 : 520);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    viewerState.onResize = onResize;
    window.addEventListener('resize', onResize);

    this.currentGLBViewer = viewerState;
  }

  /* ============================================================
     9. OX 퀴즈 & 알고 계셨나요? 모듈 (Source of Truth: OX_quiz.md)
     ============================================================ */
  renderQuiz(animalCode) {
    const quizBox = document.getElementById('detail-quiz-box');
    const quizTabBtn = document.getElementById('tab-btn-quiz');
    if (!quizBox) return;

    const animal = (typeof EXHIBITION_DATA !== 'undefined' && EXHIBITION_DATA.animals) 
      ? EXHIBITION_DATA.animals.find(a => a.code === animalCode) 
      : null;

    const quiz = (animal && animal.quizData) 
      ? animal.quizData 
      : ((typeof DOCENT_DIALOGUES !== 'undefined' && DOCENT_DIALOGUES[animalCode]) ? DOCENT_DIALOGUES[animalCode].quiz : null);

    if (!quiz) {
      if (quizTabBtn) quizTabBtn.style.display = 'none';
      quizBox.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <p>해당 상징에 대한 OX 퀴즈가 준비 중입니다.</p>
        </div>
      `;
      return;
    }

    if (quizTabBtn) quizTabBtn.style.display = 'inline-flex';

    quizBox.style.display = 'block';
    quizBox.innerHTML = `
      <!-- 1. 알고 계셨나요? 배경 지식 카드 -->
      <div class="did-you-know-card" style="background: rgba(15, 23, 42, 0.85); border: 1px solid var(--accent-gold); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem;">
          <span style="font-size: 1.3rem;">💡</span>
          <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--accent-gold); margin: 0;">알고 계셨나요?</h4>
        </div>
        <h5 style="font-size: 1.05rem; color: #fff; margin-bottom: 0.5rem;">${quiz.didYouKnowTitle || '흥미로운 자연사 이야기'}</h5>
        <p style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.7; margin: 0;">${quiz.didYouKnowDesc || ''}</p>
      </div>

      <!-- 2. OX 퀴즈 질문 카드 -->
      <div class="quiz-question-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.75rem;">
        <div class="quiz-header" style="margin-bottom: 1.25rem;">
          <span class="quiz-badge" style="background: linear-gradient(135deg, var(--accent-gold), #b89728); color: #000; font-weight: 700; font-size: 0.8rem; padding: 0.25rem 0.75rem; border-radius: 12px; display: inline-block; margin-bottom: 0.5rem;">🧠 탐구력 쑥쑥! OX 퀴즈</span>
          <h3 class="quiz-question" style="font-family: var(--font-serif); font-size: 1.35rem; color: #fff; line-height: 1.5;">${quiz.question}</h3>
        </div>

        <!-- O / X 선택 버튼 -->
        <div class="quiz-options-row" style="display: flex; gap: 1.5rem; margin-bottom: 1.25rem;">
          <button class="btn-quiz-opt" data-answer="O" style="flex: 1; padding: 1.1rem; font-size: 1.3rem; font-weight: 800; border-radius: 16px; background: rgba(34, 197, 94, 0.15); border: 2px solid #22c55e; color: #4ade80; cursor: pointer; transition: all 0.2s ease;">
            O (그렇다)
          </button>
          <button class="btn-quiz-opt" data-answer="X" style="flex: 1; padding: 1.1rem; font-size: 1.3rem; font-weight: 800; border-radius: 16px; background: rgba(239, 68, 68, 0.15); border: 2px solid #ef4444; color: #f87171; cursor: pointer; transition: all 0.2s ease;">
            X (아니다)
          </button>
        </div>

        <!-- 정답 피드백 및 학술 근거 -->
        <div class="quiz-result-feedback" id="quiz-feedback" style="display: none; padding: 1.5rem; border-radius: 12px; margin-top: 1rem;"></div>
      </div>
    `;

    quizBox.querySelectorAll('.btn-quiz-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const choice = e.currentTarget.getAttribute('data-answer');
        const feedback = document.getElementById('quiz-feedback');
        if (!feedback) return;

        const isCorrect = (choice === quiz.answer);
        feedback.style.display = 'block';
        feedback.style.background = isCorrect ? 'rgba(34, 197, 94, 0.18)' : 'rgba(239, 68, 68, 0.18)';
        feedback.style.border = isCorrect ? '1.5px solid #22c55e' : '1.5px solid #ef4444';
        
        feedback.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span style="font-size: 1.4rem;">${isCorrect ? '🎉' : '💡'}</span>
            <strong style="font-size: 1.15rem; color: ${isCorrect ? '#4ade80' : '#f87171'};">
              ${isCorrect ? '정답입니다!' : `아쉽습니다! 정답은 [ ${quiz.answer} ] 입니다.`}
            </strong>
          </div>
          <p style="font-size: 0.95rem; color: #fff; line-height: 1.7; margin-bottom: 1rem;">${quiz.explanation}</p>
          
          ${quiz.reference ? `
            <div style="background: rgba(0,0,0,0.4); border-left: 3px solid var(--accent-gold); padding: 0.6rem 0.9rem; border-radius: 6px; font-size: 0.82rem;">
              <span style="color: var(--accent-gold); font-weight: 700; display: block; margin-bottom: 0.2rem;">📜 학술 논문 및 출처 근거:</span>
              <span style="color: #cbd5e1;">${quiz.reference}</span>
              ${quiz.refRange ? `<span style="color: var(--text-muted); display: block; margin-top: 0.2rem;">(${quiz.refRange})</span>` : ''}
            </div>
          ` : ''}
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
    if (!this.docentState.exploredQuestions) {
      this.docentState.exploredQuestions = new Set();
    }
    this.docentState.exploredQuestions.clear();

    const animal = EXHIBITION_DATA.animals.find(a => a.code === normalizedCode) || EXHIBITION_DATA.animals[0];
    const docentData = (typeof DOCENT_DIALOGUES !== 'undefined' && DOCENT_DIALOGUES[normalizedCode]) 
      ? DOCENT_DIALOGUES[normalizedCode] 
      : null;

    const animalTag = document.getElementById('docent-animal-tag');
    const themeText = document.getElementById('docent-theme-text');
    if (animalTag) animalTag.innerText = `${animal.code} ${animal.name}`;
    if (themeText) themeText.innerText = (docentData && docentData.theme) ? docentData.theme : animal.panelTheme;

    modal.classList.add('active');
    modal.classList.add('is-open');
    modal.style.display = 'flex';
    modal.style.zIndex = '99999';

    if (docentData && docentData.start && docentData.start.lines && docentData.start.lines.length > 0) {
      this.startDocent(docentData);
    } else {
      this.startDocentFallback(animal);
    }
  }

  closeDocent() {
    const modal = document.getElementById('docent-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.classList.remove('is-open');
      modal.style.display = 'none';
    }
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
      if (clickHint) {
        clickHint.style.display = 'inline';
        clickHint.textContent = '▶ 화면을 클릭하여 계속 진행';
      }

      this.typewriteDocentText(line.text, line.speaker || '래피드왜건', line.emotion || 'neutral');
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
        this.showDocentChoices(docentData.start.choices, false);
        if (clickHint) clickHint.style.display = 'none';
      }
    } else if (this.docentState.currentMode === 'QUESTION') {
      if (this.docentState.currentQuestionId) {
        this.docentState.exploredQuestions.add(this.docentState.currentQuestionId);
      }
      
      const animal = EXHIBITION_DATA.animals.find(a => a.code === this.docentState.animalCode);
      const animalName = animal ? animal.name : '이 상징';
      
      this.docentState.currentMode = 'RETURN';
      this.docentState.dialogueQueue = [
        {
          speaker: '래피드왜건',
          emotion: 'explaining',
          text: `${animalName}에 대해 또 다른 궁금한 점이 있으신가요? 아래 질문을 선택하여 탐구를 이어가시거나, 대화를 종료하고 전시품을 계속 감상하실 수 있습니다.`
        }
      ];
      this.docentState.queueIdx = 0;
      this.displayNextDocentLine();
    } else if (this.docentState.currentMode === 'RETURN') {
      this.showDocentChoices(docentData.start.choices, true);
      if (clickHint) clickHint.style.display = 'none';
    }
  }

  handleDocentClick() {
    if (this.docentState.isTyping) {
      if (this.docentState.typeTimer) {
        clearTimeout(this.docentState.typeTimer);
        this.docentState.typeTimer = null;
      }
      this.docentState.isTyping = false;
      const chatBody = document.getElementById('docent-chat-body');
      if (chatBody) chatBody.textContent = this.docentState.fullText;
      return;
    }

    const optionsFooter = document.getElementById('docent-options-footer');
    if (optionsFooter && optionsFooter.style.display === 'block') {
      return;
    }

    this.displayNextDocentLine();
  }

  typewriteDocentText(text, speaker, emotion, callback) {
    const speakerElem = document.getElementById('docent-speaker-name');
    const chatBody = document.getElementById('docent-chat-body');
    const portrait = document.getElementById('docent-character-portrait');

    if (speakerElem) {
      speakerElem.innerText = speaker || '래피드왜건';
      if (speaker === '나 (관람객)') {
        speakerElem.style.color = '#38bdf8';
        speakerElem.style.background = 'rgba(56, 189, 248, 0.15)';
        speakerElem.style.borderColor = 'rgba(56, 189, 248, 0.4)';
      } else {
        speakerElem.style.color = 'var(--accent-gold-light)';
        speakerElem.style.background = 'rgba(212, 175, 55, 0.15)';
        speakerElem.style.borderColor = 'rgba(212, 175, 55, 0.3)';
      }
    }

    if (portrait) {
      const emoMap = {
        'happy': 'Asset/4. Docent/excited.webp',
        'excited': 'Asset/4. Docent/excited.webp',
        'explaining': 'Asset/4. Docent/explaining.webp',
        'thinking': 'Asset/4. Docent/thinking.webp',
        'surprised': 'Asset/4. Docent/surprised.webp',
        'enlightened': 'Asset/4. Docent/enlightened.webp',
        'neutral': 'Asset/4. Docent/neutral.webp',
        'curious': 'Asset/4. Docent/thinking.webp'
      };
      portrait.src = emoMap[emotion] || 'Asset/4. Docent/neutral.webp';
      portrait.style.opacity = (speaker === '나 (관람객)') ? '0.7' : '1';
    }

    this.docentState.fullText = text;
    this.docentState.isTyping = true;
    if (this.docentState.typeTimer) {
      clearTimeout(this.docentState.typeTimer);
      this.docentState.typeTimer = null;
    }
    if (chatBody) chatBody.textContent = '';

    let i = 0;
    const speed = 20;

    const typeNextChar = () => {
      if (!this.docentState.isTyping) return;
      if (i < text.length) {
        if (chatBody) chatBody.textContent = text.slice(0, i + 1);
        i++;
        this.docentState.typeTimer = setTimeout(typeNextChar, speed);
      } else {
        this.docentState.isTyping = false;
        this.docentState.typeTimer = null;
        if (chatBody) chatBody.textContent = text;
        if (callback) callback();
      }
    };

    typeNextChar();
  }

  showDocentChoices(choices, isReturn = false) {
    const footer = document.getElementById('docent-options-footer');
    const list = document.getElementById('docent-options-list');
    const optTitle = footer ? footer.querySelector('.vn-options-title') : null;
    if (!footer || !list) return;

    list.innerHTML = '';
    if (optTitle) {
      optTitle.innerText = isReturn 
        ? '💬 다른 질문을 선택하여 탐구를 이어가거나 대화를 종료하세요:' 
        : '💬 질문을 선택하여 과학적 탐구를 확장하세요:';
    }
    footer.style.display = 'block';

    const docentData = (typeof DOCENT_DIALOGUES !== 'undefined') ? DOCENT_DIALOGUES[this.docentState.animalCode] : null;

    choices.forEach(ch => {
      const isExplored = this.docentState.exploredQuestions && this.docentState.exploredQuestions.has(ch.id);
      const btn = document.createElement('button');
      btn.className = `btn-docent-option ${isExplored ? 'is-explored' : ''}`;
      btn.innerHTML = `
        <span>${isExplored ? '✓ ' : '💬 '}"${ch.text}"</span>
        ${isExplored ? '<span style="font-size:0.75rem; color:#4ade80; font-weight:600;">탐구완료</span>' : '<span style="font-size:0.8rem; color:var(--accent-gold);">질문하기 →</span>'}
      `;
      btn.addEventListener('click', () => {
        if (docentData && docentData.questions && docentData.questions[ch.id]) {
          footer.style.display = 'none';
          this.docentState.currentMode = 'QUESTION';
          this.docentState.currentQuestionId = ch.id;

          // 관람객(나)의 질문 발화를 큐의 첫 번째로 추가하여 실제 묻고 답하는 대화로 연출!
          const userSpeech = {
            speaker: '나 (관람객)',
            emotion: 'curious',
            text: `${ch.text}`
          };

          this.docentState.dialogueQueue = [
            userSpeech,
            ...docentData.questions[ch.id].lines
          ];
          this.docentState.queueIdx = 0;
          this.displayNextDocentLine();
        }
      });
      list.appendChild(btn);
    });

    // 뚜렷한 대화 종료 버튼 추가
    const endBtn = document.createElement('button');
    endBtn.className = 'btn-docent-option btn-docent-end-option';
    endBtn.innerHTML = '<span>✕ 대화 종료하고 전시품 계속 감상하기</span>';
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
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    window.app = new ExhibitionApp();
  });
} else {
  window.app = new ExhibitionApp();
}
