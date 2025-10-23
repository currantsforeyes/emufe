import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SettingsOption {
  id: string;
  name: string;
  description?: string;
}

interface SettingsMenuProps {
  onBack: () => void;
}

// Batocera-inspired settings structure (without Kodi)
const settingsCategories: SettingsOption[] = [
  { id: 'system', name: 'SYSTEM SETTINGS', description: 'Language, updates, storage' },
  { id: 'games', name: 'GAME SETTINGS', description: 'Collection, updates, screenshots' },
  { id: 'controllers', name: 'CONTROLLERS SETTINGS', description: 'Configure input devices' },
  { id: 'ui', name: 'UI SETTINGS', description: 'Themes, screensaver, transitions' },
  { id: 'sound', name: 'SOUND SETTINGS', description: 'Volume, music, frontend sounds' },
  { id: 'network', name: 'NETWORK SETTINGS', description: 'WiFi, hostname, services' },
  { id: 'scraper', name: 'SCRAPER', description: 'Download game information' },
  { id: 'updates', name: 'UPDATES & DOWNLOADS', description: 'System and content updates' },
  { id: 'information', name: 'INFORMATION', description: 'System information' },
  { id: 'quit', name: 'QUIT', description: 'Exit, restart, shutdown' },
];

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const itemMeshesRef = useRef<THREE.Mesh[]>([]);
  const animationIdRef = useRef<number | null>(null);
  
  const [activeIndex, setActiveIndex] = React.useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const verticalSpacing = 1.25;
    const arcRadius = 1.0;
    const arcDepth = 0.3;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 6);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear any existing canvas
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const spotLight1 = new THREE.SpotLight(0xc084fc, 2);
    spotLight1.position.set(-5, 3, 8);
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0x9333ea, 1.5);
    spotLight2.position.set(3, -3, 8);
    scene.add(spotLight2);

    // Create settings items (create 3 copies for infinite loop)
    const itemMeshes: THREE.Mesh[] = [];
    const numCopies = 3;

    for (let copy = 0; copy < numCopies; copy++) {
      settingsCategories.forEach((setting, index) => {
        // Create text canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = 512;
        canvas.height = 256;
        
        // Background
        context.fillStyle = 'rgba(147, 51, 234, 0.4)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Border
        context.strokeStyle = '#c084fc';
        context.lineWidth = 6;
        context.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
        
        // Setting name
        context.fillStyle = '#ffffff';
        context.font = 'bold 36px Bungee, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Word wrap for setting name
        const maxWidth = 480;
        const words = setting.name.split(' ');
        let lines: string[] = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i];
          const metrics = context.measureText(testLine);
          if (metrics.width > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);
        
        // Draw setting name
        const lineHeight = 50;
        const totalHeight = lines.length * lineHeight;
        const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2 - 20;
        lines.forEach((line, i) => {
          context.fillText(line, canvas.width / 2, startY + i * lineHeight);
        });
        
        // Description
        if (setting.description) {
          context.font = '20px Poppins, sans-serif';
          context.fillStyle = '#c084fc';
          context.fillText(setting.description, canvas.width / 2, canvas.height - 40);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Create plane for text
        const geometry = new THREE.PlaneGeometry(2.25, 1.125);
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide,
          emissive: new THREE.Color(0x000000),
          emissiveIntensity: 0
        });
        
        const mesh = new THREE.Mesh(geometry, material);

        // Position with looping offset
        const offsetFromMiddle = (copy - 1) * settingsCategories.length;
        const totalIndex = index + offsetFromMiddle;
        const baseY = -totalIndex * verticalSpacing;
        
        mesh.position.x = 0;
        mesh.position.y = baseY;
        mesh.position.z = 0;

        mesh.userData.originalIndex = index;
        mesh.userData.copyIndex = copy;
        mesh.userData.baseY = baseY;
        mesh.userData.setting = setting;

        scene.add(mesh);
        itemMeshes.push(mesh);
      });
    }

    itemMeshesRef.current = itemMeshes;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Set camera position instantly - no interpolation
      camera.position.y = -activeIndex * verticalSpacing;

      // Update all items
      itemMeshes.forEach((mesh) => {
        const originalIndex = mesh.userData.originalIndex;
        const copyIndex = mesh.userData.copyIndex;
        
        // Calculate effective offset from active item
        let effectiveOffset = originalIndex - activeIndex;
        if (copyIndex === 0) effectiveOffset -= settingsCategories.length;
        if (copyIndex === 2) effectiveOffset += settingsCategories.length;
        
        const distanceFromSelected = Math.abs(effectiveOffset);
        const isActive = (copyIndex === 1 && originalIndex === activeIndex);
        
        // Calculate arc based on distance from center
        const arcAmount = Math.abs(effectiveOffset) / 3;
        const arcMultiplier = Math.min(arcAmount, 1.0);
        
        // Set X position instantly
        mesh.position.x = -arcRadius * arcMultiplier;
        mesh.position.z = arcDepth * arcMultiplier;
        
        // Scale and opacity
        let scale = 1.0;
        let opacity = 1.0;
        
        if (isActive) {
          scale = 1.2;
          const pulse = Math.sin(Date.now() * 0.003) * 0.05 + 1;
          scale *= pulse;
          (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x9333ea);
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
        } else {
          scale = Math.max(0.6, 1.0 - distanceFromSelected * 0.12);
          opacity = Math.max(0.3, 1.0 - distanceFromSelected * 0.15);
          (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
        }
        
        mesh.scale.set(scale, scale, scale);
        (mesh.material as THREE.MeshStandardMaterial).opacity = opacity;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      
      itemMeshes.forEach(mesh => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
        if ((mesh.material as THREE.MeshStandardMaterial).map) {
          (mesh.material as THREE.MeshStandardMaterial).map!.dispose();
        }
      });
      
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      onBack();
      return;
    }
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const selectedSetting = settingsCategories[activeIndex];
      // TODO: Navigate to selected setting submenu
      console.log('Selected setting:', selectedSetting.id);
      alert(`Opening ${selectedSetting.name} (not yet implemented)`);
      return;
    }

    let nextIndex = activeIndex;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = activeIndex === 0 ? settingsCategories.length - 1 : activeIndex - 1;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = activeIndex === settingsCategories.length - 1 ? 0 : activeIndex + 1;
    }

    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  };

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const currentSetting = settingsCategories[activeIndex];

  // Icon mapping for settings
  const getSettingIcon = (id: string): string => {
    const icons: Record<string, string> = {
      system: '⚙️',
      games: '🎮',
      controllers: '🎮',
      ui: '🎨',
      sound: '🔊',
      network: '🌐',
      scraper: '🔍',
      updates: '⬇️',
      information: 'ℹ️',
      quit: '🚪'
    };
    return icons[id] || '⚙️';
  };

  return (
    <>
      <aside
        ref={containerRef}
        className="flex-shrink-0 focus:outline-none"
        style={{ width: '400px', height: '100vh' }}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        aria-label="Settings Menu"
        role="region"
      >
        {/* Empty - 3D menu is rendered in canvas */}
      </aside>

      {/* Center Display Panel - 4x3 aspect ratio */}
      {currentSetting && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '600px',
            background: 'rgba(20, 10, 30, 0.95)',
            border: '4px solid #9333ea',
            borderRadius: '16px',
            boxShadow: '0 0 40px rgba(147, 51, 234, 0.5)',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            fontFamily: 'Poppins, sans-serif',
            color: 'white',
            pointerEvents: 'none'
          }}
        >
          <div style={{
            fontSize: '48px',
            fontFamily: 'Bungee, cursive',
            color: '#c084fc',
            marginBottom: '20px',
            textAlign: 'center',
            textShadow: '0 0 20px rgba(192, 132, 252, 0.5)'
          }}>
            {currentSetting.name}
          </div>

          <div style={{
            fontSize: '22px',
            color: '#9333ea',
            marginBottom: '40px',
            textAlign: 'center',
            maxWidth: '600px',
            fontWeight: '500'
          }}>
            {currentSetting.description}
          </div>

          <div style={{
            width: '300px',
            height: '300px',
            background: 'rgba(147, 51, 234, 0.2)',
            border: '2px solid #9333ea',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '140px',
            marginBottom: '30px'
          }}>
            {getSettingIcon(currentSetting.id)}
          </div>

          <div style={{
            fontSize: '18px',
            color: '#c084fc',
            textAlign: 'center',
            opacity: 0.8
          }}>
            Press ENTER to configure
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsMenu;
