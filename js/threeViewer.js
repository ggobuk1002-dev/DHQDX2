/**
 * 금동대향로 3D 뷰어 및 카메라 인터랙션 컨트롤러 (Three.js)
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
    this.autoRotateSpeed = 0.003;
    this.targetCameraPos = new THREE.Vector3(0, 0.1, 2.3);
    this.targetLookAt = new THREE.Vector3(0, 0, 0);
    this.currentLookAt = new THREE.Vector3(0, 0, 0);
    
    this.init();
  }

  init() {
    if (!this.canvas) return;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0.1, 2.3);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 5.0;
    this.controls.enabled = false; // 기본적으로 스크롤 중에는 비활성화

    // Lighting
    this.setupLighting();
    


    // Load 3D Model
    this.loadModel();

    // Resize Event
    window.addEventListener('resize', () => this.onResize());

    // Animation Loop
    this.animate();
  }

  setupLighting() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    this.scene.add(ambientLight);

    // Key Light (Main Gold Front Light)
    const keyLight = new THREE.DirectionalLight(0xffe8b3, 2.5);
    keyLight.position.set(2, 3, 3);
    this.scene.add(keyLight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0x8bc34a, 0.4);
    fillLight.position.set(-3, -1, 2);
    this.scene.add(fillLight);

    // Back / Rim Light (Cinematic Silhouette Effect)
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.0);
    rimLight.position.set(0, 2, -3);
    this.scene.add(rimLight);

    // Top Light for Phoenix
    const topLight = new THREE.PointLight(0xfff0b3, 1.5, 5);
    topLight.position.set(0, 2.0, 0.5);
    this.scene.add(topLight);
  }

  loadModel() {
    const loader = new THREE.GLTFLoader();
    const modelUrl = 'GD_lowpoly.glb';

    loader.load(
      modelUrl,
      (gltf) => {
        this.model = gltf.scene;
        
        // Ensure materials are visible
        this.model.traverse((child) => {
          if (child.isMesh) {
            // Recompute normals just in case
            child.geometry.computeVertexNormals();
            if (child.material) {
              child.material.metalness = 0.1;
              child.material.roughness = 0.7;
              child.material.color = new THREE.Color(0xd4af37); // Base gold color
              child.material.emissive = new THREE.Color(0x110d00); // Slight glow
              child.material.needsUpdate = true;
            }
          }
        });

        // Robust sizing
        const box = new THREE.Box3().setFromObject(this.model);
        if (box.isEmpty()) {
            // Fallback scale if empty
            this.model.scale.set(1, 1, 1);
        } else {
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = maxDim > 0 ? (1.5 / maxDim) : 1;
            this.model.scale.set(scale, scale, scale);
        }
        
        // Robust centering
        const scaledBox = new THREE.Box3().setFromObject(this.model);
        if (!scaledBox.isEmpty()) {
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

  setIntroMode(enabled) {
    this.isIntroMode = enabled;
    if (enabled) {
      this.controls.enabled = false;
      this.targetCameraPos.set(0, 0.1, 2.3);
      this.targetLookAt.set(0, 0, 0);
    }
  }

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

  setDetailInteractive(enabled, part) {
    this.isIntroMode = false;
    this.controls.enabled = enabled;

    if (enabled && part) {
      // 해당 부위로 카메라 기본 포지셔닝
      if (part.includes('정상') || part.includes('봉황')) {
        this.targetCameraPos.set(0, 0.8, 1.2);
        this.targetLookAt.set(0, 0.55, 0);
      } else if (part.includes('산악') || part.includes('뚜껑')) {
        this.targetCameraPos.set(0, 0.2, 1.1);
        this.targetLookAt.set(0, 0.1, 0);
      } else if (part.includes('연꽃') || part.includes('몸체')) {
        this.targetCameraPos.set(0, -0.2, 1.1);
        this.targetLookAt.set(0, -0.2, 0);
      } else if (part.includes('받침') || part.includes('용')) {
        this.targetCameraPos.set(0, -0.6, 1.2);
        this.targetLookAt.set(0, -0.45, 0);
      }
    }
  }

  onResize() {
    if (!this.canvas || !this.camera || !this.renderer) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Slow auto rotation in intro or idle mode
    if (this.isIntroMode && this.model) {
      this.model.rotation.y += this.autoRotateSpeed;
    }

    // Smooth Camera Interpolation (Lerp)
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