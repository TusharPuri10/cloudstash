import * as THREE from "three";
import * as React from "react";
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useSpring, a } from "@react-spring/three";
import { useGesture } from "react-use-gesture";
import { useSetRecoilState } from "recoil";
import { cardState } from "@/atoms/state";
import { useDrop } from "react-dnd";

function Object() {
  const ref = useRef<THREE.Mesh>(null!);
  const gltf = useLoader(GLTFLoader, "/models/bin.gltf");
  const [spring, set] = useSpring(() => ({
    scale: [7.5, 7.5, 7.5],
    position: [0, 1, 0],
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
    <a.mesh ref={ref} {...spring} {...bind()}>
      <primitive object={gltf.scene} />
    </a.mesh>
  );
}

export default function Bin() {
  const setCardState = useSetRecoilState(cardState);
  const [{ isOver }, drop] = useDrop({
    accept: "object",
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover: (item, monitor) => {
      const object: {
        id: number | null | undefined;
        key: string | null | undefined;
        url: string | null | undefined;
      } = item as {
        id: number | null | undefined;
        key: string | null | undefined;
        url: string | null | undefined;
      };
      if (!object.id) {
        setCardState({
          name: "Delete",
          shown: true,
          folderId: null,
          filekey: object.key,
          newName: null,
          url: null,
          sharedfiledelete: false,
        });
      } else {
        setCardState({
          name: "Delete",
          shown: true,
          folderId: object.id,
          filekey: null,
          newName: null,
          url: null,
          sharedfiledelete: false,
        });
      }
    },
  });
  return (
    <div ref={drop} className="md:h-32 h-24">
      <Canvas camera={{ position: [1.5, 3, 7.5] }}>
        <ambientLight intensity={4} />
        <directionalLight
          castShadow
          position={[0.4, 1, 2]}
          shadow-mapSize={[1024, 1024]}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-10, 10, 10, -10]}
          />
        </directionalLight>
        <Object />
      </Canvas>
    </div>
  );
}
