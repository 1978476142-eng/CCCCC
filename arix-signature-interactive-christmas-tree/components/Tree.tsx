
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Sparkles } from '@react-three/drei';
import { TreeMorphState } from '../types';

const NEEDLE_COUNT = 800;
const GEM_COUNT = 600;

export const ChristmasTree: React.FC<{ morphState: TreeMorphState }> = ({ morphState }) => {
  const needlesRef = useRef<THREE.InstancedMesh>(null);
  const gemsRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // State for interpolation (0 = SCATTERED, 1 = TREE_SHAPE)
  const morphFactor = useRef(1);
  const targetFactor = morphState === TreeMorphState.TREE_SHAPE ? 1 : 0;

  // Pre-calculate positions for needles and gemstones
  const data = useMemo(() => {
    const needleData = { tree: [] as THREE.Vector3[], scat: [] as THREE.Vector3[], rot: [] as THREE.Euler[] };
    const gemData = { 
      tree: [] as THREE.Vector3[], 
      scat: [] as THREE.Vector3[], 
      rot: [] as THREE.Euler[], 
      colors: [] as THREE.Color[],
      scales: [] as number[],
      types: [] as number[] // 0: Pearl, 1: Diamond/Jewel
    };
    
    const jewelColors = [
      new THREE.Color('#ffffff').multiplyScalar(1.5), // Pearl / Bright Silver
      new THREE.Color('#ffd700').multiplyScalar(1.2), // Classic Gold
      new THREE.Color('#fde68a').multiplyScalar(2),   // High Gold Sparkle
      new THREE.Color('#e5e7eb').multiplyScalar(1.5), // Platinum
    ];

    // 1. Needles
    for (let i = 0; i < NEEDLE_COUNT; i++) {
      const h = Math.random() * 5.2;
      const r = (1 - h / 5.5) * 1.9;
      const a = Math.random() * Math.PI * 2;
      needleData.tree.push(new THREE.Vector3(Math.cos(a) * r, h - 2.2, Math.sin(a) * r));

      const phi = Math.acos(-1 + (2 * i) / NEEDLE_COUNT);
      const theta = Math.sqrt(NEEDLE_COUNT * Math.PI) * phi;
      const sR = 6 + Math.random() * 3;
      needleData.scat.push(new THREE.Vector3(sR * Math.cos(theta) * Math.sin(phi), sR * Math.sin(theta) * Math.sin(phi), sR * Math.cos(phi)));
      needleData.rot.push(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI));
    }

    // 2. High-Brilliance Gems
    for (let i = 0; i < GEM_COUNT; i++) {
      const h = Math.random() * 5.0;
      const r = (1 - h / 5.5) * 2.0; // Slightly outside needles for visibility
      const a = (h * 6) + (Math.random() * 0.8); // Spiral pattern
      gemData.tree.push(new THREE.Vector3(Math.cos(a) * r, h - 2.2, Math.sin(a) * r));

      const phi = Math.acos(-1 + (2 * i) / GEM_COUNT);
      const theta = Math.sqrt(GEM_COUNT * Math.PI) * phi;
      const sR = 4 + Math.random() * 4;
      gemData.scat.push(new THREE.Vector3(sR * Math.cos(theta) * Math.sin(phi), sR * Math.sin(theta) * Math.sin(phi), sR * Math.cos(phi)));
      gemData.rot.push(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI));
      gemData.colors.push(jewelColors[Math.floor(Math.random() * jewelColors.length)]);
      gemData.scales.push(0.5 + Math.random() * 1.2);
      gemData.types.push(Math.random() > 0.5 ? 1 : 0);
    }

    return { needles: needleData, gems: gemData };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    // Smoother, slightly more elastic transition
    morphFactor.current = THREE.MathUtils.lerp(morphFactor.current, targetFactor, delta * 2.2);
    const time = state.clock.elapsedTime;

    // Update Needles (Emerald Shards)
    if (needlesRef.current) {
      for (let i = 0; i < NEEDLE_COUNT; i++) {
        const { tree, scat, rot } = data.needles;
        dummy.position.lerpVectors(scat[i], tree[i], morphFactor.current);
        
        // Add subtle floating motion when deconstructed
        if (morphFactor.current < 0.99) {
          const wave = Math.sin(time * 0.4 + i) * 0.05;
          dummy.position.x += wave * (1 - morphFactor.current);
          dummy.position.y += Math.cos(time * 0.3 + i) * 0.05 * (1 - morphFactor.current);
        }

        dummy.rotation.set(rot[i].x, rot[i].y + time * 0.1, rot[i].z);
        const s = morphFactor.current * 1.0 + (1 - morphFactor.current) * 0.5;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        needlesRef.current.setMatrixAt(i, dummy.matrix);
      }
      needlesRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update Gems (Pearls/Jewels) - Adding "Sparkle" logic via scale/color intensity
    if (gemsRef.current) {
      for (let i = 0; i < GEM_COUNT; i++) {
        const { tree, scat, rot, colors, scales } = data.gems;
        dummy.position.lerpVectors(scat[i], tree[i], morphFactor.current);
        
        if (morphFactor.current < 0.99) {
          dummy.position.z += Math.sin(time * 0.5 + i * 0.5) * 0.08 * (1 - morphFactor.current);
        }

        dummy.rotation.set(rot[i].x, rot[i].y + time * 0.5, rot[i].z);
        
        // Dazzle effect: animate scale based on time to simulate glinting
        const glint = 1.0 + Math.sin(time * 3 + i) * 0.2;
        const s = scales[i] * glint * (0.8 + morphFactor.current * 0.4);
        dummy.scale.set(s, s, s);
        
        dummy.updateMatrix();
        gemsRef.current.setMatrixAt(i, dummy.matrix);
        
        // Pulse brightness of colors
        const intensity = 1.0 + Math.max(0, Math.sin(time * 4 + i) * 0.5);
        const tempColor = colors[i].clone().multiplyScalar(intensity);
        gemsRef.current.setColorAt(i, tempColor);
      }
      gemsRef.current.instanceMatrix.needsUpdate = true;
      if (gemsRef.current.instanceColor) gemsRef.current.instanceColor.needsUpdate = true;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Emerald Structure */}
      <instancedMesh ref={needlesRef} args={[undefined, undefined, NEEDLE_COUNT]}>
        <coneGeometry args={[0.07, 0.22, 4]} />
        <meshStandardMaterial 
          color="#064e3b" 
          metalness={0.9} 
          roughness={0.1} 
          emissive="#022c22" 
          emissiveIntensity={0.8} 
        />
      </instancedMesh>

      {/* Dazzling Jewels - Using Icosahedron for better light reflection */}
      <instancedMesh ref={gemsRef} args={[undefined, undefined, GEM_COUNT]}>
        <icosahedronGeometry args={[0.04, 1]} />
        <meshStandardMaterial 
          metalness={1} 
          roughness={0.0} 
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </instancedMesh>

      {/* Signature Arix Star */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[0, 3.2, 0]} scale={morphFactor.current * 1.0 + 0.3}>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#fde68a" 
            emissiveIntensity={morphState === TreeMorphState.TREE_SHAPE ? 12 : 3} 
            metalness={1} 
            roughness={0} 
          />
        </mesh>
      </Float>

      {/* Environmental Sparkle Layer */}
      <Sparkles 
        count={morphState === TreeMorphState.TREE_SHAPE ? 120 : 400} 
        scale={morphState === TreeMorphState.TREE_SHAPE ? 6 : 14} 
        size={3} 
        speed={0.4} 
        color="#fde68a" 
      />

      {/* Decorative Base Disk */}
      <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={morphFactor.current}>
        <cylinderGeometry args={[2.8, 2.8, 0.15, 64]} />
        <meshStandardMaterial 
          color="#012d23" 
          roughness={0.0} 
          metalness={1.0} 
          emissive="#064e3b" 
          emissiveIntensity={0.4} 
        />
      </mesh>
    </group>
  );
};
