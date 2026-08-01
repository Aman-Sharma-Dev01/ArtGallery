import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Compass, 
  Eye, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sun, 
  Moon, 
  Sparkles, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { Artwork, ExhibitionSettings } from '../types';

interface Virtual3DExhibitionProps {
  artworks: Artwork[];
  onInspect: (artwork: Artwork) => void;
  settings: ExhibitionSettings;
  onUpdateSettings: (s: ExhibitionSettings) => void;
  isImmersiveMode: boolean;
  onToggleImmersiveMode: () => void;
}

export const Virtual3DExhibition: React.FC<Virtual3DExhibitionProps> = ({
  artworks,
  onInspect,
  settings,
  onUpdateSettings,
  isImmersiveMode,
  onToggleImmersiveMode
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(artworks[0] || null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoTour, setIsAutoTour] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [showControlsHelp, setShowControlsHelp] = useState<boolean>(true);
  const [isSceneReady, setIsSceneReady] = useState<boolean>(false);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const paintingsMeshRef = useRef<{ mesh: THREE.Mesh; artwork: Artwork }[]>([]);
  const spotLightsRef = useRef<THREE.SpotLight[]>([]);
  const tourIndexRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);
  const yawRef = useRef<number>(0);
  const pitchRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Audio ambient ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Keys state for WASD movement
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(
      settings.lighting === 'dramatic' ? 0x080604 : settings.lighting === 'daylight' ? 0x2e2720 : 0x140e0a
    );
    scene.fog = new THREE.FogExp2(0x140e0a, 0.025);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 1.7, 8);
    camera.rotation.order = 'YXZ';
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(
      0xfff5e6, 
      settings.lighting === 'dramatic' ? 0.3 : settings.lighting === 'daylight' ? 0.9 : 0.6
    );
    scene.add(ambientLight);

    const mainChandelier = new THREE.PointLight(0xffd700, 1.2, 25);
    mainChandelier.position.set(0, 5, 0);
    scene.add(mainChandelier);

    // 5. Museum Hall Architecture (Floor, Ceiling, Walls)
    // Floor
    const floorGeo = new THREE.PlaneGeometry(16, 40);
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const ctx = floorCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#211309';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = '#382212';
      ctx.lineWidth = 4;
      for (let i = 0; i < 512; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i + 256, 256);
        ctx.moveTo(i + 256, 256); ctx.lineTo(i, 512);
        ctx.stroke();
      }
    }
    const floorTex = new THREE.CanvasTexture(floorCanvas);
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(4, 10);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.3,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(16, 40);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x1a1510, roughness: 0.8 });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.y = 6;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Walls
    const wallMatColor = settings.roomStyle === 'velvet' 
      ? 0x2b0d12 
      : settings.roomStyle === 'emerald' 
      ? 0x0a2118 
      : settings.roomStyle === 'gilded' 
      ? 0x3d2b17 
      : 0x241d17;

    const wallMat = new THREE.MeshStandardMaterial({
      color: wallMatColor,
      roughness: 0.7
    });

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(40, 6), wallMat);
    leftWall.position.set(-8, 3, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(40, 6), wallMat);
    rightWall.position.set(8, 3, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Back Wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), wallMat);
    backWall.position.set(0, 3, -20);
    scene.add(backWall);

    // 6. Mount Paintings on Left & Right Walls
    const textureLoader = new THREE.TextureLoader();
    const paintingMeshes: { mesh: THREE.Mesh; artwork: Artwork }[] = [];
    const spotLights: THREE.SpotLight[] = [];

    const displayArtworks = artworks.slice(0, 20); // First 20 items in 3D hall

    displayArtworks.forEach((art, idx) => {
      const isLeft = idx % 2 === 0;
      const row = Math.floor(idx / 2);
      const zPos = 14 - row * 3.5;
      const xPos = isLeft ? -7.85 : 7.85;
      const rotationY = isLeft ? Math.PI / 2 : -Math.PI / 2;

      // Frame Dimensions
      const width = 1.8;
      const height = 2.2;

      // Painting Texture
      const texture = textureLoader.load(art.imageUrl);
      texture.colorSpace = THREE.SRGBColorSpace;
      const paintingMat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.2
      });

      const frameMat = new THREE.MeshStandardMaterial({
        color: art.frameType === 'gold' ? 0xd4af37 : art.frameType === 'wood' ? 0x4a2e18 : 0x111111,
        metalness: art.frameType === 'gold' ? 0.8 : 0.2,
        roughness: 0.3
      });

      // Frame mesh
      const frameGroup = new THREE.Group();
      frameGroup.renderOrder = 1;
      
      // Canvas mesh
      const canvasMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), paintingMat);
      canvasMesh.position.z = 0.08;
      canvasMesh.renderOrder = 2;
      frameGroup.add(canvasMesh);

      // Frame Border Box
      const borderBox = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.24, height + 0.24, 0.08),
        frameMat
      );
      borderBox.position.z = 0.01;
      frameGroup.add(borderBox);

      // Brass Title Plaque
      const plaqueGeo = new THREE.BoxGeometry(0.8, 0.2, 0.02);
      const plaqueMat = new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 0.9, roughness: 0.2 });
      const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
      plaque.position.set(0, -(height / 2 + 0.25), 0.03);
      frameGroup.add(plaque);

      frameGroup.position.set(xPos, 2.3, zPos);
      frameGroup.rotation.y = rotationY;
      scene.add(frameGroup);

      // Spotlight over painting
      const spotLight = new THREE.SpotLight(0xfff3d1, 2.5);
      spotLight.position.set(isLeft ? -6 : 6, 5, zPos);
      const spotTarget = new THREE.Object3D();
      spotTarget.position.set(xPos, 2.3, zPos);
      scene.add(spotTarget);
      spotLight.target = spotTarget;
      spotLight.angle = Math.PI / 6;
      spotLight.penumbra = 0.5;
      scene.add(spotLight);
      spotLights.push(spotLight);

      paintingMeshes.push({ mesh: canvasMesh, artwork: art });
    });

    paintingsMeshRef.current = paintingMeshes;
    spotLightsRef.current = spotLights;
    setIsSceneReady(true);

    // 7. Raycaster for clicking paintings
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        paintingMeshes.map(p => p.mesh)
      );

      if (intersects.length > 0) {
        const hit = paintingMeshes.find(p => p.mesh === intersects[0].object);
        if (hit) {
          setSelectedArtwork(hit.artwork);
          const index = displayArtworks.findIndex(a => a.id === hit.artwork.id);
          if (index !== -1) {
              setCurrentIndex(index);
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // 8. Key Listeners for WASD
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 9. Pointer Drag to Look Around
    const handlePointerDown = (e: PointerEvent) => {
      if (isAutoTour) return;
      isDraggingRef.current = true;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || isAutoTour) return;
      const deltaX = e.clientX - lastPointerRef.current.x;
      const deltaY = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      yawRef.current -= deltaX * 0.003;
      pitchRef.current = Math.max(-1.1, Math.min(1.1, pitchRef.current - deltaY * 0.003));
    };
    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 10. Animation Loop
    let animationFrameId: number;
    const speed = 0.08;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Keyboard navigation WASD
      if (!isAutoTour && !isTransitioningRef.current) {
        camera.rotation.set(pitchRef.current, yawRef.current, 0, 'YXZ');
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.y = 0; dir.normalize();

        const side = new THREE.Vector3(-dir.z, 0, dir.x);

        if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) camera.position.addScaledVector(dir, speed);
        if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) camera.position.addScaledVector(dir, -speed);
        if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) camera.position.addScaledVector(side, -speed);
        if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) camera.position.addScaledVector(side, speed);

        // Bounds clamping inside museum hall
        camera.position.x = Math.max(-6.5, Math.min(6.5, camera.position.x));
        camera.position.z = Math.max(-18, Math.min(18, camera.position.z));
        camera.position.y = 1.7; // fixed eye level
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('click', handleClick);
        renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeChild(renderer.domElement);
    };
  }, [settings.lighting, settings.roomStyle]);

  // Focus Camera Smoothly on a specific painting
  const focusCameraOnPainting = (index: number) => {
    const camera = cameraRef.current;
    if (!camera) return;

    const isLeft = index % 2 === 0;
    const row = Math.floor(index / 2);
    const zPos = 14 - row * 3.5;
    const targetX = isLeft ? -5.2 : 5.2;
    const targetY = 2.2;
    const targetZ = zPos;

    isTransitioningRef.current = true;

    // Smooth lerp camera movement
    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(targetX, targetY, targetZ);
    const targetLookAt = new THREE.Vector3(isLeft ? -7.85 : 7.85, 2.3, zPos);

    let progress = 0;
    const duration = 40;

    const lerpStep = () => {
      progress++;
      const t = Math.min(progress / duration, 1);
      const eased = t * (2 - t); // Ease out

      camera.position.lerpVectors(startPos, endPos, eased);
      camera.lookAt(targetLookAt);

      if (progress < duration) {
        requestAnimationFrame(lerpStep);
      } else {
        const syncedEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
        pitchRef.current = syncedEuler.x;
        yawRef.current = syncedEuler.y;
        isTransitioningRef.current = false;
      }
    };

    lerpStep();
  };

  // Auto Tour Interval Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoTour) {
      interval = setInterval(() => {
        tourIndexRef.current = (tourIndexRef.current + 1) % Math.min(artworks.length, 20);
        const idx = tourIndexRef.current;
        setCurrentIndex(idx);
        setSelectedArtwork(artworks[idx]);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoTour, artworks]);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % Math.min(artworks.length, 20);
    setCurrentIndex(nextIdx);
    setSelectedArtwork(artworks[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + Math.min(artworks.length, 20)) % Math.min(artworks.length, 20);
    setCurrentIndex(prevIdx);
    setSelectedArtwork(artworks[prevIdx]);
  };

  const openInspection = (artwork: Artwork | null) => {
    if (!artwork) return;
    setSelectedArtwork(artwork);
    onInspect(artwork);
  };

  useEffect(() => {
    if (!isSceneReady || artworks.length === 0) return;

    const maxVisibleArtworks = Math.min(artworks.length, 20);
    const nextIndex = Math.max(0, Math.min(currentIndex, maxVisibleArtworks - 1));

    if (nextIndex !== currentIndex) {
      setCurrentIndex(nextIndex);
      return;
    }

    setSelectedArtwork(artworks[nextIndex]);
    focusCameraOnPainting(nextIndex);
  }, [artworks, currentIndex, isSceneReady]);

  useEffect(() => {
    if (isImmersiveMode) {
      setShowControlsHelp(false);
    }
  }, [isImmersiveMode]);

  return (
    <div className={`${isImmersiveMode ? 'fixed inset-0 z-50 h-screen' : 'relative w-full h-[calc(100vh-130px)] min-h-[550px]'} bg-[#0c0907] overflow-hidden select-none`}>
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {isImmersiveMode && (
        <div className="absolute top-4 right-4 z-30 pointer-events-none">
          <button
            onClick={onToggleImmersiveMode}
            className="pointer-events-auto px-4 py-2 rounded-xl bg-[#1a140e]/90 backdrop-blur-md border border-[#d4af37]/40 text-[#f5ebd8] font-cinzel text-xs font-bold shadow-2xl hover:bg-[#2b2117] transition-colors"
          >
            Exit Focus Mode
          </button>
        </div>
      )}

      {/* Top Exhibition Navigation & Controls Bar */}
      {!isImmersiveMode && (
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
        {/* Title Badge */}
        <div className="pointer-events-auto bg-[#1a140e]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#d4af37]/40 shadow-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#d4af37] text-[#120e0a] flex items-center justify-center font-cinzel font-bold text-sm">
            3D
          </div>
          <div>
            <h3 className="font-cinzel text-sm font-bold text-[#f5ebd8] flex items-center gap-2">
              VIRTUAL GRAND SALON
              <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full border border-rose-800 uppercase font-sans">
                LIVE
              </span>
            </h3>
            <p className="text-[11px] font-cormorant italic text-[#c5a059]">
              Use WASD / Arrow keys or Click any canvas on wall to inspect.
            </p>
          </div>
        </div>

        {/* Curator Display & Tour Controls */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#1a140e]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#d4af37]/30 shadow-2xl">
          <button
            onClick={() => setIsAutoTour(!isAutoTour)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-cinzel font-bold transition-all ${
              isAutoTour
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-[#2b2117] text-[#e6cb81] hover:bg-[#3d2f21]'
            }`}
          >
            {isAutoTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoTour ? 'Pause Auto Tour' : 'Start Virtual Tour'}</span>
          </button>

          <button
            onClick={() => {
              const newLighting = settings.lighting === 'warm' ? 'dramatic' : settings.lighting === 'dramatic' ? 'daylight' : 'warm';
              onUpdateSettings({ ...settings, lighting: newLighting });
            }}
            className="p-2 rounded-xl bg-[#2b2117] text-[#e6cb81] hover:bg-[#3d2f21] text-xs font-cinzel flex items-center gap-1.5"
            title="Toggle Exhibition Lighting"
          >
            <Sun className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden md:inline capitalize">{settings.lighting} Light</span>
          </button>

          <button
            onClick={() => setShowControlsHelp(!showControlsHelp)}
            className="p-2 rounded-xl bg-[#2b2117] text-[#e6cb81] hover:bg-[#3d2f21]"
            title="Help / Keyboard Controls"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleImmersiveMode}
            className="p-2 rounded-xl bg-[#2b2117] text-[#e6cb81] hover:bg-[#3d2f21]"
            title="Hide UI and view only the 3D space"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
      )}

      {/* Keyboard Controls Overlay Help Box */}
      {!isImmersiveMode && showControlsHelp && (
        <div className="absolute top-20 left-4 z-20 bg-[#140e0a]/95 backdrop-blur-md p-4 rounded-2xl border border-[#d4af37]/40 text-[#f5ebd8] max-w-xs shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-cinzel text-xs font-bold text-[#d4af37] uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Navigation Guide
            </span>
            <button onClick={() => setShowControlsHelp(false)} className="text-xs text-stone-400 hover:text-white">✕</button>
          </div>
          <ul className="text-xs font-sans space-y-1.5 text-stone-300">
            <li className="flex items-center justify-between">
              <span className="font-mono bg-[#2b2016] px-1.5 py-0.5 rounded border border-[#4d3a28]">W A S D</span>
              <span>Walk through museum</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-mono bg-[#2b2016] px-1.5 py-0.5 rounded border border-[#4d3a28]">Mouse Drag</span>
              <span>Look around hall</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-mono bg-[#2b2016] px-1.5 py-0.5 rounded border border-[#4d3a28]">Left Click Canvas</span>
              <span>Zoom & inspect artwork</span>
            </li>
          </ul>
        </div>
      )}

      {/* Bottom Exhibition Plaque & Next/Prev Controls */}
      {!isImmersiveMode && selectedArtwork && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-2xl bg-[#17110c]/95 backdrop-blur-lg p-4 rounded-2xl border border-[#d4af37] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-[#2a1f15] text-[#d4af37] hover:bg-[#3d2f21] border border-[#d4af37]/30"
              title="Previous Painting"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={selectedArtwork.imageUrl}
                alt={selectedArtwork.title}
                className="w-12 h-14 object-cover rounded border border-[#d4af37]"
              />
              <div>
                <span className="text-[10px] font-sans text-[#d4af37] font-bold uppercase tracking-wider">
                  CATALOG NO. {selectedArtwork.serialNumber}.JPG • {selectedArtwork.category}
                </span>
                <h4 className="font-cormorant font-bold text-lg text-[#f5ebd8] leading-tight line-clamp-1">
                  {selectedArtwork.title}
                </h4>
                <p className="text-xs text-stone-400 font-cormorant italic line-clamp-1">
                  {selectedArtwork.medium} ({selectedArtwork.year})
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-[#2a1f15] text-[#d4af37] hover:bg-[#3d2f21] border border-[#d4af37]/30"
              title="Next Painting"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => openInspection(selectedArtwork)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38927] text-[#120e0a] font-cinzel font-bold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Inspection</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
