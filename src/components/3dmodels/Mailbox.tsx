import Head from "next/head";
import * as THREE from "three";
import * as React from "react";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useSpring, a } from "@react-spring/three";
import { useGesture } from "react-use-gesture";
import { mainFolderState } from "@/atoms/state";
import { useSetRecoilState } from "recoil";

function Object() {
  const setMainFolder = useSetRecoilState(mainFolderState);
  const ref = useRef<THREE.Mesh>(null!);
  const gltf = useLoader(GLTFLoader, "/models/mailbox/scene.gltf");
  const [spring, set] = useSpring(() => ({
    scale: [1.25, 1.1, 1.25],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { friction: 10 },
  }));
  const bind = useGesture({
    onHover: ({ hovering }) => {
      const targetRotation = hovering ? [0.5, 0, 0] : [0, 0, 0];
      set.start({ rotation: targetRotation });
    },
  });
  return (
    <a.mesh ref={ref} {...spring} {...bind()} onClick={()=>{
      setMainFolder("shared");
      }}>
      <primitive object={gltf.scene}/>
    </a.mesh>
  );
}

export default function Mailbox(){
    return (
        
        <div className="absolute top-64 right-10 z-0 w-full h-screen" style={{width: "120px", height: "120px"}}>
            <Canvas
            camera={{ position: [1 ,2, 2] }}
            >
                <ambientLight intensity={1.2} />
                <directionalLight castShadow position={[1, -2, 1]} shadow-mapSize={[1024, 1024]}>
                    <orthographicCamera attach="shadow-camera" args={[-1, 1, 1, -1]} />
                </directionalLight>
                <Object/>
            </Canvas>
        </div>
    )
}
