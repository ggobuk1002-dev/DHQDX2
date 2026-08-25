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
      powerPreference: "high-performance",
      precision: (window.innerWidth <= 768) ? "mediump" : "highp"
    });
    this.renderer.setSize(width, height);
    
    // 모바일 DPR 과부하 방지 (모바일: 최대 1.25, 데스크톱: 최대 1.75)
    const isMobile = (window.innerWidth <= 768);
    this.renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio || 1, 1.75));
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
    const modelUrl = 'GD_lowpoly.glb';
    const isMobile = (window.innerWidth <= 768);

    loader.load(
      modelUrl,
      (gltf) => {
        this.model = gltf.scene;

        const darkAntiqueGold = new THREE.Color(0x3a3020);
        this.model.traverse((child) => {
          if (child.isMesh) {
            if (!isMobile) child.geometry.computeVertexNormals();
            child.material = new THREE.MeshStandardMaterial({
              color: darkAntiqueGold,
              metalness: isMobile ? 0.75 : 0.92,
              roughness: isMobile ? 0.45 : 0.28,
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

    // 모바일 주소창 show/hide로 인한 미세 높이 변화 시 버퍼 재성성 방지 (깜빡임/떨림 방지)
    if (this.lastWidth && Math.abs(width - this.lastWidth) < 10 && Math.abs(height - this.lastHeight) < 120) {
      return;
    }
    this.lastWidth = width;
    this.lastHeight = height;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  requestRender() {
    this.needsRender = true;
    if (this.isIdle && !this.isPaused) {
      this.isIdle = false;
      this.animate();
    }
  }

  focusStep(stepId) {
    this.isCinematicIntro = false;
    if (this.eclipseGlow) this.eclipseGlow.visible = false;
    if (this.renderer) this.renderer.toneMappingExposure = 1.05;

    const step = this.stepCameraMap[stepId] || this.stepCameraMap['intro'];
    if (step) {
      this.targetCameraPos.copy(step.pos);
      this.targetLookAt.copy(step.target);
      this.requestRender();
    }
  }

  setLayerCamera(cameraPos, targetPos) {
    this.isCinematicIntro = false;
    if (this.eclipseGlow) this.eclipseGlow.visible = false;
    if (cameraPos) this.targetCameraPos.set(cameraPos.x, cameraPos.y, cameraPos.z);
    if (targetPos) this.targetLookAt.set(targetPos.x, targetPos.y, targetPos.z);
    this.requestRender();
  }

  pause() {
    this.isPaused = true;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.requestRender();
    }
  }

  animate(timestamp = 0) {
    if (this.isPaused) return;

    this.animId = requestAnimationFrame((t) => this.animate(t));

    // 초당 60fps 타깃 페이싱 (16.6ms 간격 유지로 불필요한 고주사율 과열 방지)
    if (this.lastFrameTime && (timestamp - this.lastFrameTime < 14)) {
      return;
    }
    this.lastFrameTime = timestamp;

    let hasChanges = false;

    if (this.model) {
      if (this.isCinematicIntro) {
        this.model.rotation.y += this.autoRotateSpeed;
        hasChanges = true;
      } else {
        this.model.rotation.y += this.autoRotateSpeed * 0.4;
        hasChanges = true;
      }
    }

    if (!this.controls.enabled) {
      const posDist = this.camera.position.distanceTo(this.targetCameraPos);
      const lookDist = this.currentLookAt.distanceTo(this.targetLookAt);

      if (posDist > 0.001 || lookDist > 0.001) {
        this.camera.position.lerp(this.targetCameraPos, 0.05);
        this.currentLookAt.lerp(this.targetLookAt, 0.05);
        this.camera.lookAt(this.currentLookAt);
        hasChanges = true;
      }
    } else {
      this.controls.update();
      hasChanges = true;
    }

    if (hasChanges || this.needsRender) {
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
      this.needsRender = false;
    }
  }
}

window.IncenseBurner3DViewer = IncenseBurner3DViewer;
