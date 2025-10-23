import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';

const Scene: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default Scene;