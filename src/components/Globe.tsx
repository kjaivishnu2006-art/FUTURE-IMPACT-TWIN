import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface GlobeProps {
  sustainabilityScore: number;
}

const Globe: React.FC<GlobeProps> = ({ sustainabilityScore }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2.5;

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Earth Geometry
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Textures (using colors for demo)
    const material = new THREE.MeshPhongMaterial({
      color: sustainabilityScore > 70 ? 0x00ff9c : sustainabilityScore > 40 ? 0x00d9ff : 0x7b61ff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });

    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Atmosphere glow
    const glowGeometry = new THREE.SphereGeometry(1.1, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: sustainabilityScore > 70 ? 0x00ff9c : 0x00d9ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      earth.rotation.y += 0.005;
      earth.rotation.x += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      renderer.dispose();
    };
  }, [sustainabilityScore]);

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <div className={`w-48 h-48 rounded-full blur-3xl opacity-20 absolute animate-pulse ${
          sustainabilityScore > 70 ? 'bg-emerald-500' : sustainabilityScore > 40 ? 'bg-blue-500' : 'bg-purple-500'
        }`} />
        <div className={`w-40 h-40 rounded-full border-2 border-dashed animate-[spin_10s_linear_infinite] ${
          sustainabilityScore > 70 ? 'border-emerald-500/50' : sustainabilityScore > 40 ? 'border-blue-500/50' : 'border-purple-500/50'
        }`} />
        <div className={`w-32 h-32 rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-sm absolute`}>
          <div className={`w-24 h-24 rounded-full border border-white/20 flex items-center justify-center`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Gaia Twin</span>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className="w-full h-full" />;
};

export default Globe;
