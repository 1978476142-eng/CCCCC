
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
// Import THREE to use Vector2 on line 164
import * as THREE from 'three';
import { ChristmasTree } from './components/Tree';
import { SceneEnvironment } from './components/Environment';
import { generateHolidayBlessing } from './services/geminiService';
import { AppStatus, TreeMorphState } from './types';

const LuxuryOverlay: React.FC<{ 
  status: AppStatus, 
  setStatus: (s: AppStatus) => void,
  morphState: TreeMorphState,
  setMorphState: (m: TreeMorphState) => void,
  blessing: string,
  setBlessing: (b: string) => void
}> = ({ status, setStatus, morphState, setMorphState, blessing, setBlessing }) => {
  const [wish, setWish] = useState('');

  const handleWish = async () => {
    if (!wish) return;
    setStatus(AppStatus.LOADING);
    // Transition to scattered during invocation for a "magical casting" look
    setMorphState(TreeMorphState.SCATTERED);
    
    const result = await generateHolidayBlessing(wish);
    
    setBlessing(result);
    setStatus(AppStatus.CELEBRATING);
    // Return to tree shape to present the blessing
    setMorphState(TreeMorphState.TREE_SHAPE);
  };

  const toggleMorph = () => {
    setMorphState(morphState === TreeMorphState.TREE_SHAPE ? TreeMorphState.SCATTERED : TreeMorphState.TREE_SHAPE);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-8 md:p-12 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="border-l-2 border-amber-600 pl-4">
          <h1 className="text-3xl md:text-5xl font-cinzel font-bold gold-gradient">ARIX</h1>
          <p className="text-xs uppercase tracking-[0.4em] text-amber-500/80 mt-1">Signature Interactive Experience</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-xs font-playfair italic text-amber-200/50">"Where opulence meets the festive spirit"</p>
          <button 
            onClick={toggleMorph}
            className="mt-2 px-4 py-1 text-[10px] border border-amber-600/30 text-amber-500/60 uppercase tracking-[0.2em] hover:border-amber-500 hover:text-amber-400 transition-all bg-black/20 backdrop-blur-sm"
          >
            {morphState === TreeMorphState.TREE_SHAPE ? 'Deconstruct Form' : 'Restore Signature'}
          </button>
        </div>
      </div>

      {/* Middle Content (Blessing) */}
      <div className={`transition-all duration-1000 transform ${status === AppStatus.CELEBRATING ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'}`}>
        <div className="max-w-2xl mx-auto text-center pointer-events-auto bg-black/60 backdrop-blur-xl p-10 rounded-sm border border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <p className="text-amber-500 text-[10px] uppercase tracking-[0.5em] mb-6">The Oracle Speaks</p>
          <p className="text-xl md:text-4xl font-playfair italic text-white leading-relaxed drop-shadow-lg">
            {blessing}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button 
              onClick={() => {
                setStatus(AppStatus.IDLE);
                setBlessing('');
              }}
              className="px-8 py-3 border border-amber-600 text-amber-500 text-xs uppercase tracking-widest hover:bg-amber-600 hover:text-black transition-all font-cinzel font-bold"
            >
              New Covenant
            </button>
          </div>
        </div>
      </div>

      {/* Footer Interface */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pointer-events-auto">
        <div className="w-full md:w-[450px] group">
          <label className="text-[10px] uppercase tracking-[0.3em] text-amber-500/60 mb-2 block">Imprint Your Festive Desire</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="What do you seek this season? ..."
              className="w-full bg-transparent border-b border-amber-600/50 py-3 text-amber-100 focus:outline-none focus:border-amber-400 transition-all placeholder:text-emerald-900/60 font-light tracking-wide"
            />
            <button 
              disabled={status === AppStatus.LOADING}
              onClick={handleWish}
              className="px-8 py-3 bg-gradient-to-br from-amber-600 to-amber-800 text-black font-cinzel text-xs font-bold hover:from-amber-400 hover:to-amber-600 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(217,119,6,0.2)]"
            >
              {status === AppStatus.LOADING ? 'INVOKING...' : 'SUMMON'}
            </button>
          </div>
        </div>

        <div className="text-[9px] tracking-[0.4em] text-amber-500/30 uppercase font-cinzel">
          Design Concept &bull; Arix Signature Studio &bull; MMXIV
        </div>
      </div>

      {/* Cinematic Golden Borders */}
      <div className="fixed inset-0 border-[30px] border-emerald-950 pointer-events-none opacity-20"></div>
      <div className="fixed inset-6 border border-amber-600/10 pointer-events-none"></div>
    </div>
  );
};

export default function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [morphState, setMorphState] = useState<TreeMorphState>(TreeMorphState.TREE_SHAPE);
  const [blessing, setBlessing] = useState('');

  return (
    <div className="w-full h-screen bg-[#010a08] relative">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-[#010a08] z-50">
          <div className="text-center">
            <h2 className="text-amber-500 font-cinzel text-3xl animate-pulse tracking-[0.5em]">ARIX</h2>
            <div className="w-48 h-[1px] bg-amber-900 mx-auto mt-4 overflow-hidden">
               <div className="w-full h-full bg-amber-400 animate-[shimmer_2s_infinite]"></div>
            </div>
            <p className="text-amber-800 text-[10px] tracking-[0.6em] mt-4 uppercase">Initializing Signature Space</p>
          </div>
        </div>
      }>
        <Canvas shadows gl={{ antialias: true, alpha: false, stencil: false, depth: true, toneMappingExposure: 1.2 }}>
          <PerspectiveCamera makeDefault position={[0, 1.5, 9]} fov={35} />
          <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 6} 
            maxPolarAngle={Math.PI / 1.6} 
            minDistance={5} 
            maxDistance={15}
            autoRotate={status === AppStatus.IDLE && morphState === TreeMorphState.TREE_SHAPE}
            autoRotateSpeed={0.4}
          />
          
          <SceneEnvironment />
          
          <group position={[0, -0.6, 0]}>
            <ChristmasTree morphState={morphState} />
            <ContactShadows 
              opacity={0.35} 
              scale={14} 
              blur={2.5} 
              far={6} 
              resolution={512} 
              color="#000000" 
            />
          </group>

          <EffectComposer multisampling={4}>
            <Bloom 
              luminanceThreshold={0.7} 
              mipmapBlur 
              intensity={2.2} 
              radius={0.4} 
            />
            <ChromaticAberration offset={new THREE.Vector2(0.0012, 0.0012)} />
            <Noise opacity={0.04} />
            <Vignette darkness={0.75} offset={0.25} />
          </EffectComposer>
        </Canvas>
      </Suspense>

      <LuxuryOverlay 
        status={status} 
        setStatus={setStatus} 
        morphState={morphState}
        setMorphState={setMorphState}
        blessing={blessing} 
        setBlessing={setBlessing} 
      />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
