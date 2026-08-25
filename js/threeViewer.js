/**
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
    this.isPaused = false;
    this.animId = null;
    
    // [intro.jpg]: 거대하게 카메라 앞 좌측을 가득 채우는 Cinematic Close-up Hero Object (모바일은 중앙 핏)
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    this.introCameraPos = isMobile ? new THREE.Vector3(0, 0.15, 2.8) : new THREE.Vector3(-0.95, 0.45, 0.88);
    this.introTarget = isMobile ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(0.35, 0.1, 0);
    
    this.targetCameraPos = this.introCameraPos.clone();
    this.targetLookAt = this.introTarget.clone();
    this.currentLookAt = this.introTarget.clone();
    
    this.init();
  }

  getStepCamera(stepId) {
    const isMobile = window.innerWidth <= 768;
    // 데스크톱: 카드가 왼쪽(align-left)이면 향로는 우측(-0.55), 카드가 오른쪽(align-right)이면 향로는 좌측(+0.55)으로 100% 분리!
    const desktopMap = {
      'intro': { pos: new THREE.Vector3(-0.55, 0.05, 2.3), target: new THREE.Vector3(0, 0, 0) },
      'celestial': { pos: new THREE.Vector3(-0.55, 0.55, 1.8), target: new THREE.Vector3(0, 0.45, 0) }, // 카드 왼쪽 -> 향로 오른쪽
      'sky': { pos: new THREE.Vector3(0.55, 0.35, 1.8), target: new THREE.Vector3(0, 0.25, 0) },       // 카드 오른쪽 -> 향로 왼쪽
      'land': { pos: new THREE.Vector3(-0.55, 0.15, 1.8), target: new THREE.Vector3(0, 0.08, 0) },     // 카드 왼쪽 -> 향로 오른쪽
      'water': { pos: new THREE.Vector3(0.55, -0.12, 1.8), target: new THREE.Vector3(0, -0.15, 0) },   // 카드 오른쪽 -> 향로 왼쪽
      'sea': { pos: new THREE.Vector3(-0.55, -0.40, 1.9), target: new THREE.Vector3(0, -0.35, 0) }     // 카드 왼쪽 -> 향로 오른쪽
    };
    const mobileMap = {
      'intro': { pos: new THREE.Vector3(0, 0.15, 2.8), target: new THREE.Vector3(0, 0, 0) },
      'celestial': { pos: new THREE.Vector3(0, 0.65, 2.4), target: new THREE.Vector3(0, 0.45, 0) },
      'sky': { pos: new THREE.Vector3(0, 0.40, 2.4), target: new THREE.Vector3(0, 0.25, 0) },
      'land': { pos: new THREE.Vector3(0, 0.15, 2.4), target: new THREE.Vector3(0, 0.08, 0) },
      'water': { pos: new THREE.Vector3(0, -0.12, 2.4), target: new THREE.Vector3(0, -0.15, 0) },
      'sea': { pos: new THREE.Vector3(0, -0.42, 2.5), target: new THREE.Vector3(0, -0.35, 0) }
    };
    const map = isMobile ? mobileMap : desktopMap;
    return map[stepId] || map['intro'];
  }

  init() {
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x08090d); // 100% 완전 불투명 심연 배경

    const width = window.innerWidth || 800;
    const height = window.innerHeight || 600;
    // near 클리핑 플레인을 0.005로 극도로 낮추어 초근접 시 메쉬 잘림/뚫림(투명화) 원천 차단!
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.005, 100);
    this.camera.position.copy(this.introCameraPos);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      precision: (window.innerWidth <= 768) ? "mediump" : "highp"
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x08090d, 1.0);
    
    // 실시간 그림자(Shadow Map) 활성화
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const isMobile = (window.innerWidth <= 768);
    this.renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
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
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        const mainView = document.getElementById('view-main');
        if (mainView && mainView.classList.contains('active')) {
          this.resume();
        }
      }
    });
    this.lastFrameTime = 0;
    this.animate();
  }

  setupLighting() {
    // [intro.jpg 완벽 일치]: 전면 90%는 칠흑 같은 어둠(실루엣 그림자)에 가리워지고, 좌측 에지만 푸른 일식 광선으로 베어냄!
    
    // 1. 앰비언트 = 완전한 제로(0x000000) -> 그림자 영역은 100% 칠흑의 어둠으로 완벽히 가리워짐!
    const ambientLight = new THREE.AmbientLight(0x000000, 0);
    this.scene.add(ambientLight);

    // 2. [intro.jpg의 핵심] 좌측 후면 초강력 푸른 일식 림라이트 (날카로운 에지 라인만 칼날처럼 빛남)
    this.eclipseRimLight = new THREE.DirectionalLight(0x38bdf8, 12.0);
    this.eclipseRimLight.position.set(-4.5, 1.8, -2.5);
    this.eclipseRimLight.target.position.set(0, 0, 0);
    this.scene.add(this.eclipseRimLight);
    this.scene.add(this.eclipseRimLight.target);

    // 3. 우측 전면 극미세 앰버 림라이트 (어둠 속에서 황금 조각 굴곡만 아주 희미하게 10% 스침)
    this.goldKeyLight = new THREE.DirectionalLight(0xd4af37, 0.45);
    this.goldKeyLight.position.set(4.0, 2.0, 2.0);
    this.goldKeyLight.target.position.set(0, 0, 0);
    this.scene.add(this.goldKeyLight);
    this.scene.add(this.goldKeyLight.target);

    // 4. 상단 봉황 벼슬 에지 라이트
    this.topRimLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    this.topRimLight.position.set(0, 5.0, -1.5);
    this.topRimLight.target.position.set(0, 0, 0);
    this.scene.add(this.topRimLight);
    this.scene.add(this.topRimLight.target);
  }

  createEclipseAtmosphere() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      gradient.addColorStop(0.2, 'rgba(20, 80, 200, 0.15)');
      gradient.addColorStop(0.5, 'rgba(5, 15, 60, 0.03)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        color: 0x38bdf8,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.eclipseGlow = new THREE.Sprite(spriteMat);
      this.eclipseGlow.position.set(-0.85, 0.45, -4.5);
      this.eclipseGlow.scale.set(5.5, 5.5, 1);
      this.scene.add(this.eclipseGlow);
    } catch (e) {
      console.warn('Atmosphere glow skipped:', e);
    }
  }

  loadModel() {
    const loader = new THREE.GLTFLoader();
    const isMobile = (window.innerWidth <= 768);

    const onModelSuccess = (gltf) => {
      const rawModel = gltf.scene;

      // 100% 완전 불투명 솔리드 고대 다크 브론즈 (묵직하고 깊은 질감)
      const darkBronze = new THREE.Color(0x3a2c0c);
      const goldSpecular = new THREE.Color(0xffe58f);

      rawModel.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhongMaterial({
            color: darkBronze,
            specular: goldSpecular,
            shininess: 60,
            emissive: new THREE.Color(0x000000), // 자체발광 0 -> 완전한 칠흑 그림자!
            transparent: false,
            opacity: 1.0,
            depthWrite: true,
            depthTest: true,
            side: THREE.FrontSide
          });
        }
      });

      // 회전 후의 바운딩 박스를 기준으로 크기 스케일링 및 원점 센터링
      const box = new THREE.Box3().setFromObject(rawModel);
      if (!box.isEmpty()) {
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? (1.55 / maxDim) : 1;
        rawModel.scale.set(scale, scale, scale);

        const scaledBox = new THREE.Box3().setFromObject(rawModel);
        const center = scaledBox.getCenter(new THREE.Vector3());
        rawModel.position.x -= center.x;
        rawModel.position.y -= center.y;
        rawModel.position.z -= center.z;
      }

      // 제자리에서 Y축 중심으로 자연스럽게 회전할 수 있도록 피벗 RootGroup 구성
      const rootGroup = new THREE.Group();
      rootGroup.add(rawModel);

      this.model = rootGroup;
      this.scene.add(this.model);
      this.needsRender = true;
      this.requestRender();

      console.log('[ThreeViewer] 백제금동대향로 3D 모델 렌더링 성공!');

      if (this.loadingCallback) {
        this.loadingCallback(100, true, false);
      }
    };

    // 1순위: modelData.js의 Base64 내장 데이터가 있으면 CORS 차단/네트워크 딜레이 없이 즉시 100% 로드!
    if (typeof GD_MODEL_BASE64 !== 'undefined' && GD_MODEL_BASE64) {
      try {
        loader.load(
          GD_MODEL_BASE64,
          onModelSuccess,
          undefined,
          (err) => {
            console.warn('[ThreeViewer] Base64 load fallback to file:', err);
            loader.load('GD_lowpoly.glb', onModelSuccess, undefined, (fileErr) => {
              console.error('[ThreeViewer] All GLB loading failed:', fileErr);
              if (this.loadingCallback) this.loadingCallback(100, true, true);
            });
          }
        );
        return;
      } catch (e) {
        console.warn('[ThreeViewer] Base64 exception, trying file:', e);
      }
    }

    // 2순위: 외부 파일 GD_lowpoly.glb 로드
    loader.load(
      'GD_lowpoly.glb',
      onModelSuccess,
      (xhr) => {
        if (xhr.lengthComputable && this.loadingCallback) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          this.loadingCallback(percent, false, false);
        }
      },
      (error) => {
        console.error('[ThreeViewer] GLB Model file load error:', error);
        if (this.loadingCallback) {
          this.loadingCallback(100, true, true);
        }
      }
    );
  }

  setCinematicIntro(enabled) {
    this.isCinematicIntro = enabled;
    if (this.eclipseGlow) this.eclipseGlow.visible = true; // 모든 층위에서 신비로운 일식 분위기 100% 유지!
    if (this.renderer) this.renderer.toneMappingExposure = 1.05;

    if (enabled) {
      this.controls.enabled = false;
      this.targetCameraPos.copy(this.introCameraPos);
      this.targetLookAt.copy(this.introTarget);
    }
    this.requestRender();
  }

  setIntroMode(enabled) {
    this.setCinematicIntro(enabled);
  }

  focusStep(stepId) {
    this.isCinematicIntro = false;
    if (this.eclipseGlow) this.eclipseGlow.visible = true; // 스크롤을 내려도 마음에 든 그 모습 그대로 유지!
    if (this.renderer) this.renderer.toneMappingExposure = 1.05;

    const step = this.getStepCamera(stepId);
    if (step) {
      this.targetCameraPos.copy(step.pos);
      this.targetLookAt.copy(step.target);
      this.requestRender();
    }
  }

  setLayerCamera(cameraPos, targetPos) {
    this.isCinematicIntro = false;
    if (this.eclipseGlow) this.eclipseGlow.visible = true;
    if (cameraPos) this.targetCameraPos.set(cameraPos.x, cameraPos.y, cameraPos.z);
    if (targetPos) this.targetLookAt.set(targetPos.x, targetPos.y, targetPos.z);
    this.requestRender();
  }

  setDetailInteractive(enabled, part) {
    this.isCinematicIntro = false;
    this.controls.enabled = enabled;
    if (this.eclipseGlow) this.eclipseGlow.visible = true;

    if (enabled && part) {
      if (part.includes('정상') || part.includes('봉황')) {
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
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.round(rect.width) || window.innerWidth || 800;
    const height = Math.round(rect.height) || window.innerHeight || 600;

    this.lastWidth = width;
    this.lastHeight = height;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.requestRender();
  }

  requestRender() {
    this.needsRender = true;
    if (!this.isPaused && !this.animId) {
      this.animate();
    }
  }

  pause() {
    this.isPaused = true;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  resume() {
    this.isPaused = false;
    this.lastFrameTime = 0;
    this.onResize();
    if (!this.animId) {
      this.animate();
    }
  }

  animate(timestamp = 0) {
    if (this.isPaused) {
      this.animId = null;
      return;
    }

    this.animId = requestAnimationFrame((t) => this.animate(t));

    // 초당 60fps 타깃 페이싱
    if (this.lastFrameTime && (timestamp - this.lastFrameTime < 14)) {
      return;
    }
    this.lastFrameTime = timestamp;

    if (this.model) {
      if (this.isCinematicIntro) {
        this.model.rotation.y += this.autoRotateSpeed;
      } else {
        this.model.rotation.y += this.autoRotateSpeed * 0.4;
      }
    }

    if (!this.controls.enabled) {
      const posDist = this.camera.position.distanceTo(this.targetCameraPos);
      const lookDist = this.currentLookAt.distanceTo(this.targetLookAt);

      if (posDist > 0.001 || lookDist > 0.001) {
        this.camera.position.lerp(this.targetCameraPos, 0.05);
        this.currentLookAt.lerp(this.targetLookAt, 0.05);
        this.camera.lookAt(this.currentLookAt);
      }
    } else {
      this.controls.update();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

window.IncenseBurner3DViewer = IncenseBurner3DViewer;
