import { Canvas, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import exp from "constants";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import * as React from "react";
import { useRef, useEffect, useState } from "react";

function Object(props: { target: THREE.Vector3 }) {
    const ref = useRef<THREE.Mesh>(null!);
    const gltf = useLoader(GLTFLoader, "/models/book_spirit/scene.gltf");

    const rotationFlag = useRef(true);
  const rotationTarget = useRef(0);
  const rotationSpeed = useRef(0.08);

  useEffect(() => {
    // Set the rotation target to 1/4th of a full rotation
    rotationTarget.current = Math.PI / 2;
  }, []);

  useFrame(() => {
    const remainingRotation = rotationTarget.current - ref.current.parent!.rotation.y;

    if (rotationFlag.current && remainingRotation > 0.01) {
      // Gradually slow down the rotation
      rotationSpeed.current *= 0.95;

      // Perform the rotation animation until the target is reached
      ref.current.parent!.rotation.y -= rotationSpeed.current;

      if (remainingRotation <= 0.01) {
        // Animation completed, disable further rotation
        rotationFlag.current = false;
      }
    }

    // Add a floating animation along the y-axis
    const t = performance.now() / 650;
    const floatingHeight = Math.sin(t) * 0.3; // Adjust the floating intensity and speed here
    const y = props.target.y + floatingHeight + 1; // 1 is the base height

    ref.current.position.set(props.target.x, y, props.target.z);
  });
  
    return (
      <mesh position={[0, 0, -1]} ref={ref} scale={1.4}>
        <primitive object={gltf.scene} />
      </mesh>
    );
  }

  export default function Character(){
    const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Update isMobile based on window width
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the threshold as needed
    };

    // Initial check
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
    return (
        <Canvas
          style={{ height: "100vh", backgroundColor: "#0D1F23" }}
          camera={{ position: isMobile? [-4, 2, 6.5] : [-6, 2, 6.5] }}
        >
            <ambientLight intensity={1.3} />
            <directionalLight castShadow position={[0.4, 1, 2]} shadow-mapSize={[1024, 1024]}>
                <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
            </directionalLight>
            <Object target={ isMobile ? new THREE.Vector3(2.3, -0.3, 0) : new THREE.Vector3(5.3, -0.5, 1.8)} />
        </Canvas>
    )
  }