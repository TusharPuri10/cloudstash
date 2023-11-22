import Head from "next/head";
import * as THREE from "three";
import * as React from "react";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useSpring, a } from "@react-spring/three";
import { useGesture } from "react-use-gesture";

function Object() {
  const ref = useRef<THREE.Mesh>(null!);
  const gltf = useLoader(GLTFLoader, "/bin.gltf");
  const [spring, set] = useSpring(() => ({
    scale: [8, 8, 8],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { friction: 10 },
  }));
  const bind = useGesture({
    onHover: ({ hovering }) => {
      const targetScale = hovering ? [9, 9, 9] : [8, 8, 8];
      const targetRotation = hovering ? [0.7, 0, 0] : [0, 0, 0];
      set({ scale: targetScale, rotation: targetRotation });
    },
  });
  return (
    <a.mesh ref={ref} {...spring} {...bind()}>
      <primitive object={gltf.scene} />
    </a.mesh>
  );
}

export default function Bin(){
    return (
        
        <div className="absolute top-0 right-0 z-0 w-full h-screen" style={{width: "120px", height: "120px"}}>
            <Canvas
            camera={{ position: [1.5, 3, 7.5] }}
            >
                <ambientLight intensity={3} />
                <directionalLight castShadow position={[0.4, 1, 2]} shadow-mapSize={[1024, 1024]}>
                    <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
                </directionalLight>
                <Object/>
            </Canvas>
        </div>
    )
}
