import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import * as three from "three";
import { DragControls } from 'three/addons/controls/DragControls.js';

const Cube = () => {
    const ref = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    ref.current!.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FFA41B" />
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
        <directionalLight castShadow position={[0.4, 1, 2]} shadow-mapSize={[1024, 1024]}>
            <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
        </directionalLight>
        <Cube />
    </>
  );
};

const App = () => {
  return (
    <div className="relative z-0 w-full h-screen">
      <Canvas
        style={{ height: "100vh", backgroundColor: "#80B3FF" }}
        camera={{ position: [0, 3, 7] }}
      >
        {/* <OrbitControls /> */}
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
