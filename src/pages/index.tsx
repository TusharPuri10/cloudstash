import Head from "next/head";
import * as THREE from "three";
import * as React from "react";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function Cloud(
  props: JSX.IntrinsicElements["mesh"] & { target: THREE.Vector3 }
) {
  const ref = useRef<THREE.Mesh>(null!);
  const gltf = useLoader(GLTFLoader, "/cloud_test/scene.gltf");
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const radius = 3.5;
    const angle = t * 0.5; // Adjust the rotation speed here

    const x = props.target.x + radius * Math.cos(angle);
    const z = props.target.z + radius * Math.sin(angle);
    ref.current.position.set(x, 0, z);
    const rotationAngle =
      Math.atan2(z - props.target.z, x - props.target.x) + Math.PI / 2;
    ref.current.rotation.y = -rotationAngle;
  });

  return (
    <mesh {...props} ref={ref} scale={1}>
      <primitive object={gltf.scene} />
    </mesh>
  );
}

function Box(props: JSX.IntrinsicElements["mesh"]) {
  // This reference will give us direct access to the THREE.Mesh object
  const ref = useRef<THREE.Mesh>(null!);
  // Hold state for hovered and clicked events
  const [clicked, click] = useState(false);
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame((state, delta) => (ref.current.rotation.y += 0.01));
  const gltf = useLoader(GLTFLoader, "/cardboard_box/scene.gltf");

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.2 : 1}
      onClick={() => click(!clicked)}
    >
      <primitive object={gltf.scene} />
    </mesh>
  );
}

export default function App() {
  return (
    <div className="relative z-0 w-full h-screen">
      <Head>
        <title>Cloud Stash</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Canvas
        style={{ height: "100vh", backgroundColor: "#80B3FF" }}
        camera={{ position: [0, 3, 7] }}
      >
        <ambientLight intensity={3} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[0.4, 1, -2]} intensity={4} />
        <Box position={[0, 0, 0]} />
        <Cloud position={[0, 0, 0]} target={new THREE.Vector3(0, 0, -2)} />
      </Canvas>
      <div className=" inset-y-0 left-0 absolute z-50">
        This is an overlay element
      </div>
    </div>
  );
}
