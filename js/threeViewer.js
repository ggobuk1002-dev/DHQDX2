/**
 * 백제 금동대향로 3D 시네마틱 뷰어 (Three.js)
 * intro.jpg 스타일: "화면 밖으로 가리워진 거대 행성 지평선(Super Close-up Crescent Eclipse)"
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
    
    this.isIntroMode = true;
    this.autoRotateSpeed = 0.0012; // 매우 느리고 장엄한 자전
    
    // [intro.jpg 구도]: 향로를 카메라 바로 앞(-0.85, 0.45, 0.95)까지 거대하게 초근접 배치!
    // 향로의 70% 이상은 화면 바깥과 칠흑 같은 어둠에 묻히고, 능선 곡선(지평선)만 대각선으로 통과!
    this.introCameraPos = new THREE.Vector3(-0.95, 0.45, 0.88);
    this.introTarget = new THREE.Vector3(0.35, 0.1, 0);
    
    this.targetCameraPos = this.introCameraPos.clone();
    this.targetLookAt = this.introTarget.clone();
    this.currentLookAt = this.introTarget.clone();
    
    this.init();
  }

  init() {
    if (!this.canvas) return;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.copy(this.introCameraPos);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.85; // 어둡고 묵직한 대비
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // 4. Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 5.0;
    this.controls.enabled = false; // 배경이므로 기본 조작 끔

    // 5. Setup Eclipse Lights & Atmosphere
    this.setupLighting();
    this.createEclipseAtmosphere();

    // 6. Load Model
    this.loadModel();

    // 7. Event Listeners
    window.addEventListener('resize', () => this.onResize());

    // 8. Animation Loop
    this.animate();
  }

  setupLighting() {
    // 칠흑 같은 심연 어둠 (앰비언트를 극도로 낮춤)
    const ambientLight = new THREE.AmbientLight(0x020408, 0.15);
    this.scene.add(ambientLight);

    // [핵심] 일식 광원: 좌상단 후방에서 지평선 능선만 날카롭게 때리는 백청색 강렬한 림라이트 (intro.jpg)
    this.eclipseMainLight = new THREE.DirectionalLight(0xc8e6ff, 9.0);
    this.eclipseMainLight.position.set(-4.5, 3.5, -4.0);
    this.scene.add(this.eclipseMainLight);

    // 보조 금빛 림라이트 (우측 하단 미세 반사)
    this.eclipseGoldLight = new THREE.DirectionalLight(0xd4af37, 2.5);
    this.eclipseGoldLight.position.set(4.0, -2.0, -3.0);
    this.scene.add(this.eclipseGoldLight);

    // 전면 보조광은 거의 주지 않음 (유물 앞면을 완벽한 실루엣/어둠으로 유지)
    this.frontFillLight = new THREE.DirectionalLight(0x152030, 0.1);
    this.frontFillLight.position.set(2.0, 2.0, 4.0);
    this.scene.add(this.frontFillLight);
  }

  // intro.jpg 특유의 지평선 렌즈 플레어 & 아우라(대기 글로우)
  createEclipseAtmosphere() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 중심에서 대각선 방향으로 부드럽게 뻗어나가는 섬광
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, 'rgba(210, 240, 255, 1.0)');
    gradient.addColorStop(0.15, 'rgba(100, 180, 255, 0.5)');
    gradient.addColorStop(0.45, 'rgba(30, 80, 200, 0.12)');
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
  }

  loadModel() {
    const loader = new THREE.GLTFLoader();
    const modelUrl = (typeof GD_MODEL_BASE64 !== 'undefined') ? GD_MODEL_BASE64 : 'GD_lowpoly.glb';

    loader.load(
      modelUrl,
      (gltf) => {
        this.model = gltf.scene;

        // 깊은 어둠 속 백제 앤티크 금동 메탈릭 (빛을 받는 림에서만 날카로운 반사광 발생)
        const darkAntiqueGold = new THREE.Color(0x3a3020);
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.geometry.computeVertexNormals();
            child.material = new THREE.MeshStandardMaterial({
              color: darkAntiqueGold,
              metalness: 0.92,  // 금속성 극대화 (빛에 스치는 림만 번쩍임)
              roughness: 0.25,  // 날카로운 하이라이트 에지
              emissive: new THREE.Color(0x000000)
            });
          }
        });

        // Bounding Box 정규화 및 중심 정렬
        const box = new THREE.Box3().setFromObject(this.model);
        if (!box.isEmpty()) {
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = maxDim > 0 ? (1.5 / maxDim) : 1;
          this.model.scale.set(scale, scale, scale);

          const scaledBox = new THREE.Box3().setFromObject(this.model);
          const center = scaledBox.getCenter(new THREE.Vector3());
          this.model.position.x -= center.x;
          this.model.position.y -= center.y;
          this.model.position.z -= center.z;
        }

        this.scene.add(this.model);

        if (this.loadingCallback) {
          this.loadingCallback(100, true);
        }
      },
      (xhr) => {
        if (xhr.lengthComputable && this.loadingCallback) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          this.loadingCallback(percent, false);
        }
      },
      (error) => {
        console.warn('3D Model load error, falling back to 2D view:', error);
        if (this.loadingCallback) {
          this.loadingCallback(100, false, true);
        }
      }
    );
  }

  // 인트로 화면: intro.jpg처럼 화면의 거대 지평선 곡선 실루엣 연출
  setIntroMode(enabled) {
    this.isIntroMode = enabled;
    if (enabled) {
      this.controls.enabled = false;
      this.targetCameraPos.copy(this.introCameraPos);
      this.targetLookAt.copy(this.introTarget);
      if (this.eclipseGlow) this.eclipseGlow.visible = true;
    }
  }

  // 메인 스크롤텔링 각 층위 카메라 이동 (스크롤 시 전체 모습 및 층위로 자연스럽게 이동)
  setLayerCamera(cameraPos, targetPos) {
    this.isIntroMode = false;
    this.controls.enabled = false;
    if (this.eclipseGlow) this.eclipseGlow.visible = false;

    if (cameraPos) {
      this.targetCameraPos.set(cameraPos.x, cameraPos.y, cameraPos.z);
    }
    if (targetPos) {
      this.targetLookAt.set(targetPos.x, targetPos.y, targetPos.z);
    }
  }

  // 상세 뷰어
  setDetailInteractive(enabled, part) {
    this.isIntroMode = false;
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

    // 인트로 모드일 때 매우 느리고 우아한 천체 자전
    if (this.isIntroMode && this.model) {
      this.model.rotation.y += this.autoRotateSpeed;
    }

    // 부드러운 카메라 보간 (Lerp)
    if (!this.controls.enabled) {
      this.camera.position.lerp(this.targetCameraPos, 0.04);
      this.currentLookAt.lerp(this.targetLookAt, 0.04);
      this.camera.lookAt(this.currentLookAt);
    } else {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.IncenseBurner3DViewer = IncenseBurner3DViewer;
