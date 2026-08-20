/**
 * 백제 금동대향로 3D 시네마틱 뷰어 (Three.js)
 * intro.jpg 스타일의 장엄한 림라이트(Edge Glow / Rim Light) 및 고품질 금동 PBR 질감 구현
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
    
    this.isIntroMode = true;
    this.autoRotateSpeed = 0.0025; // 우아하고 느린 자전 속도
    this.targetCameraPos = new THREE.Vector3(-0.35, 0.15, 1.8);
    this.targetLookAt = new THREE.Vector3(0.1, 0.05, 0);
    this.currentLookAt = new THREE.Vector3(0.1, 0.05, 0);
    
    this.init();
  }

  init() {
    if (!this.canvas) return;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(-0.35, 0.15, 1.8);

    // Renderer with ACES Filmic Tone Mapping
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // Controls (수동 조작용)
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.minDistance = 0.6;
    this.controls.maxDistance = 4.0;
    this.controls.enabled = false;

    // Setup Cinematic Lighting (intro.jpg 스타일)
    this.setupLighting();

    // Load Model
    this.loadModel();

    // Resize Event
    window.addEventListener('resize', () => this.onResize());

    // Animation Loop
    this.animate();
  }

  setupLighting() {
    // 1. Ambient Light (깊은 어둠 속 은은한 베이스광)
    const ambientLight = new THREE.AmbientLight(0x181c28, 0.6);
    this.scene.add(ambientLight);

    // 2. Main Rim / Backlight 1 (좌측 후방 강한 하이라이트 에지광 - intro.jpg 핵심)
    const mainRimLight = new THREE.DirectionalLight(0xe8f0ff, 4.2);
    mainRimLight.position.set(-4, 2.5, -3.5);
    this.scene.add(mainRimLight);

    // 3. Gold Edge Light 2 (우측 후방 보조 림라이트)
    const goldRimLight = new THREE.DirectionalLight(0xd4af37, 3.0);
    goldRimLight.position.set(3.5, 3.0, -2.5);
    this.scene.add(goldRimLight);

    // 4. Subtle Key Light (전면에서 유물의 섬세한 조각 윤곽만 살짝 비추는 키라이트)
    const frontKeyLight = new THREE.DirectionalLight(0xffdf9e, 0.9);
    frontKeyLight.position.set(1.5, 1.8, 3.2);
    this.scene.add(frontKeyLight);

    // 5. Top Point Light (봉황 정상 디테일 강조)
    const topLight = new THREE.PointLight(0xfffae0, 1.5, 4);
    topLight.position.set(0, 1.8, 0.3);
    this.scene.add(topLight);

    // 6. Dragon Base Light (하단 용의 역동적 실루엣)
    const bottomLight = new THREE.PointLight(0x2dd4bf, 1.2, 3);
    bottomLight.position.set(0, -1.2, 0.5);
    this.scene.add(bottomLight);
  }

  loadModel() {
    const loader = new THREE.GLTFLoader();
    const modelUrl = 'GD_lowpoly.glb';

    loader.load(
      modelUrl,
      (gltf) => {
        this.model = gltf.scene;

        // 고풍스럽고 장엄한 백제 금동 PBR 재질 적용
        const antiqueGold = new THREE.Color(0xb8974a); // 고풍스러운 금동 컬러
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.geometry.computeVertexNormals();
            if (child.material) {
              child.material.metalness = 0.82; // 진짜 금속 느낌
              child.material.roughness = 0.32; // 세련된 반사광
              child.material.color = antiqueGold;
              child.material.emissive = new THREE.Color(0x000000); // 발광 제거 (노란 가로등 현상 완전 해결)
              child.material.needsUpdate = true;
            }
          }
        });

        // Bounding Box 정규화 및 정확한 중심 정렬
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

  // 인트로 화면 모드: intro.jpg처럼 좌측 바깥으로 이어지는 웅장한 클로즈업 뷰
  setIntroMode(enabled) {
    this.isIntroMode = enabled;
    if (enabled) {
      this.controls.enabled = false;
      this.targetCameraPos.set(-0.35, 0.15, 1.8);
      this.targetLookAt.set(0.1, 0.05, 0);
    }
  }

  // 메인 스크롤텔링 각 층위 카메라 이동
  setLayerCamera(cameraPos, targetPos) {
    this.isIntroMode = false;
    this.controls.enabled = false;

    if (cameraPos) {
      this.targetCameraPos.set(cameraPos.x, cameraPos.y, cameraPos.z);
    }
    if (targetPos) {
      this.targetLookAt.set(targetPos.x, targetPos.y, targetPos.z);
    }
  }

  // 상세 뷰어 조작
  setDetailInteractive(enabled, part) {
    this.isIntroMode = false;
    this.controls.enabled = enabled;

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

    // 인트로 또는 아이들 모드일 때 느리고 우아한 자전 (빛의 반사 변화)
    if (this.isIntroMode && this.model) {
      this.model.rotation.y += this.autoRotateSpeed;
    }

    // 부드러운 카메라 보간 (Lerp)
    if (!this.controls.enabled) {
      this.camera.position.lerp(this.targetCameraPos, 0.05);
      this.currentLookAt.lerp(this.targetLookAt, 0.05);
      this.camera.lookAt(this.currentLookAt);
    } else {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.IncenseBurner3DViewer = IncenseBurner3DViewer;
