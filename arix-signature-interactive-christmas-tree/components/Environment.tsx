
import React from 'react';
import { Environment, Stars } from '@react-three/drei';

export const SceneEnvironment: React.FC = () => {
  return (
    <>
      <color attach="background" args={['#020617']} />
      <Environment preset="night" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.2} />
      
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#fbbf24" />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#064e3b" />
      
      {/* Cinematic rim lights */}
      <spotLight 
        position={[0, 10, 0]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        color="#fbbf24"
      />
    </>
  );
};
