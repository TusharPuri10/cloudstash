import * as THREE from "three";
import * as React from "react";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useSpring, a } from "@react-spring/three";
import { useGesture } from "react-use-gesture";
import { useSetRecoilState } from "recoil";
import { cardState, mainFolderState } from "@/atoms/state";
import { useDrop } from "react-dnd";

function Object() {
  const setMainFolder = useSetRecoilState(mainFolderState);
  const ref = useRef<THREE.Mesh>(null!);
  const gltf = useLoader(GLTFLoader, "/models/mailbox/scene.gltf");
  const [spring, set] = useSpring(() => ({
    scale: [1, 1., 1],
    position: [0, -0.4, 0],
    rotation: [0, 0, 0],
    config: { friction: 10 },
  }));
  useFrame((state, delta) =>{ 
    const t = performance.now() / 900;
      const targetRotation = (Math.sin(t)<0) ? [0.4, 0, 0] : [0, 0, 0];
      set.start({ rotation: targetRotation });
    ref.current.position.x=0.8;
  });
  // const bind = useGesture({
  //   onHover: ({ hovering }) => {
  //     const targetRotation = hovering ? [-0.4, 0, 0] : [0.1, 0, 0];
  //     set.start({ rotation: targetRotation });
  //   },
  // });
  return (
    <a.mesh
      ref={ref}
      {...spring as any}
      onClick={() => {
        setMainFolder("shared");
      }}
    >
      <primitive object={gltf.scene} />
    </a.mesh>
  );
}

export default function Mailbox() {
  const setCard = useSetRecoilState(cardState);
  const [{ isOver }, drop] = useDrop({
    accept: "object",
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover: (item, monitor) => {
      const object: {
        id: number | null | undefined;
        key: string | null | undefined;
        name: string | null | undefined;
        type: string | null | undefined;
      } = item as {
        id: number | null | undefined;
        key: string | null | undefined;
        name: string | null | undefined;
        type: string | null | undefined;
      };
      // console.log(object);
      if (!object.id) {
        setCard({
            name: "Share",
            shown: true,
            folderId: null,
            filekey: object.key,
            newName: object.name,
            fileType: object.type,
            sharedfiledelete: false,
          })
      }
    },
  });
  return (
    <div ref={drop} className="md:h-36 h-28">
      <Canvas camera={{ position: [2, 0.9, 2.3] }}>
        <ambientLight intensity={1} />
        <directionalLight
          castShadow
          position={[1, -2, 1]}
          shadow-mapSize={[1024, 1024]}
        >
          <orthographicCamera attach="shadow-camera" args={[-1, 1, 1, -1]} />
        </directionalLight>
        <Object />
      </Canvas>
    </div>
  );
}
