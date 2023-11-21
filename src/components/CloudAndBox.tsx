import * as THREE from "three";
import * as React from "react";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useRouter } from "next/router";
import { useSpring, a } from "@react-spring/three";
import { useGesture } from "react-use-gesture";
import {useSetRecoilState} from "recoil";
import { pageState } from "@/atoms/state";

function Cloud(
    props:{ target: THREE.Vector3 }
  ) {
    const ref = useRef<THREE.Mesh>(null!);
    const gltf = useLoader(GLTFLoader, "/cloud_test/scene.gltf");
    
    
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      const radius = 3.8;
      const angle = t * 0.7; // Adjust the rotation speed here
  
      const x = props.target.x + radius * Math.cos(angle);
      const z = props.target.z + radius * Math.sin(angle);
      ref.current.position.set(x, 0, z);
      const rotationAngle =
        Math.atan2(z - props.target.z, x - props.target.x) + Math.PI / 2;
      ref.current.rotation.y = -rotationAngle;
    });
  
    return (
      <mesh ref={ref} scale={1}>
        <primitive object={gltf.scene} />
      </mesh>
    );
  }
  
  function Box() {
    const setPage = useSetRecoilState(pageState);
    const router = useRouter();
    // This reference will give us direct access to the THREE.Mesh object
    const ref = useRef<THREE.Mesh>(null!);
    // Hold state for hovered and clicked events
    // Rotate mesh every frame, this is outside of React without overhead
    useFrame((state, delta) => (ref.current.rotation.y += 0.01));
    const gltf = useLoader(GLTFLoader, "/cardboard_box/scene.gltf");
    const [spring, set] = useSpring(() => ({ scale: [1, 1, 1], position: [0, 0, 0], rotation: [0, 0, 0], config: { friction: 10 } }))
    const bind = useGesture({
      onHover: ({ hovering }) => {
        const targetScale = hovering ? [1.5, 1.5, 1.5] : [1, 1, 1];
        const targetRotation = hovering ? [0, 2, 0] : [0, 0, 0];
        set({ scale: targetScale, rotation: targetRotation });
      },
      onClick: () => {
        router.push("/root");
        setPage("");
      }
    })
    return (
      <a.mesh
        ref={ref}
        {...spring}
        {...bind()}
      >
        <primitive object={gltf.scene} />
      </a.mesh>
    );
  }

  export default function CloudAndBox(){
    return (
        <Canvas
        style={{ height: "100vh", backgroundColor: "#0D1F23" }}
        camera={{ position: [0, 3, 7] }}
      >
          <ambientLight intensity={1.5} />
          <directionalLight castShadow position={[0.2, 2, 1]} shadow-mapSize={[1024, 1024]}>
              <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
          </directionalLight>
          <Box/>
          <Cloud target={new THREE.Vector3(0, 0, -2)} />
      </Canvas>
    )
  }